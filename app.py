from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import secrets
import hashlib
import re
import logging
import html
import time
import textwrap

app = Flask(__name__)
# Set allowed origins for CORS
ALLOWED_ORIGINS = [
    "https://pc-authenticator-pdpy.onrender.com",  # Production API URL
    "chrome-extension://dmdmmplamjdlpcmddnblnbfcmgnlegmi"
]
CORS(app, origins=ALLOWED_ORIGINS)

DB_PATH = '/mnt/data/authenticator.db'

# Initialize database
def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS accounts
                 (account_number TEXT PRIMARY KEY,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
    c.execute('''CREATE TABLE IF NOT EXISTS backups
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  account_number TEXT,
                  backup_data TEXT,
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (account_number) REFERENCES accounts(account_number))''')
    # Add rate limit table
    c.execute('''CREATE TABLE IF NOT EXISTS rate_limits
                 (ip TEXT, endpoint TEXT, timestamp INTEGER)''')
    conn.commit()
    conn.close()

init_db()  # Ensure tables are created on every startup

# Generate a secure account number
def generate_account_number():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    while True:
        account_number = ''.join(secrets.choice('0123456789') for _ in range(24))
        hashed_number = hash_account_number(account_number)
        
        # Check if the hashed number already exists
        c.execute('SELECT 1 FROM accounts WHERE account_number = ?', (hashed_number,))
        if not c.fetchone():
            conn.close()
            return account_number
    
    conn.close()

# Hash the account number for storage
def hash_account_number(account_number):
    return hashlib.sha256(account_number.encode()).hexdigest()

def is_valid_account_number(account_number):
    # Account number must be a string of exactly 24 digits
    return isinstance(account_number, str) and re.fullmatch(r"\d{24}", account_number)

def is_valid_account_id(account_id):
    # Accepts integer or string of digits
    return isinstance(account_id, int) or (isinstance(account_id, str) and account_id.isdigit())

def sanitize_string(s, max_length=128):
    if not isinstance(s, str):
        return ''
    s = s.strip()
    s = html.escape(s)
    s = re.sub(r'[^\w\s@\.-]', '', s)  # Allow alphanum, whitespace, @, ., -
    return s[:max_length]

def sanitize_email(email, max_length=128):
    if not isinstance(email, str):
        return ''
    email = email.strip()
    email = html.escape(email)
    email = re.sub(r'[^\w\.-@]', '', email)
    return email[:max_length]

def sanitize_secret(secret, max_length=128):
    if not isinstance(secret, str):
        return ''
    secret = secret.strip().replace(' ', '')
    secret = re.sub(r'[^A-Z2-7]', '', secret.upper())
    return secret[:max_length]

def is_valid_email(email):
    if not isinstance(email, str):
        return False
    email = email.strip()
    # RFC 5322 Official Standard regex (simplified)
    return re.fullmatch(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", email) is not None

def is_valid_account_object(acc):
    # Validate the structure of each account object in the accounts array
    if not isinstance(acc, dict):
        return False
    # Sanitize and validate 'name'
    if 'name' not in acc or not isinstance(acc['name'], str) or not acc['name'].strip():
        return False
    acc['name'] = sanitize_string(acc['name'], 64)
    # Sanitize and validate 'email' (optional)
    if 'email' in acc and acc['email']:
        acc['email'] = sanitize_email(acc['email'], 128)
        if not is_valid_email(acc['email']):
            return False
    # Sanitize and validate 'secret'
    if 'secret' not in acc or not isinstance(acc['secret'], str) or not acc['secret']:
        return False
    acc['secret'] = sanitize_secret(acc['secret'], 64)
    # Optionally validate 'id' if present
    if 'id' in acc and not is_valid_account_id(acc['id']):
        return False
    return True

def is_rate_limited(ip, endpoint, max_requests=5, window_seconds=43200):  # 12 hours = 43200 seconds
    now = int(time.time())
    window_start = now - window_seconds
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    # Remove old entries
    c.execute('DELETE FROM rate_limits WHERE timestamp < ?', (window_start,))
    # Count recent requests
    c.execute('SELECT COUNT(*) FROM rate_limits WHERE ip = ? AND endpoint = ? AND timestamp >= ?', (ip, endpoint, window_start))
    count = c.fetchone()[0]
    if count >= max_requests:
        conn.close()
        return True
    # Log this request
    c.execute('INSERT INTO rate_limits (ip, endpoint, timestamp) VALUES (?, ?, ?)', (ip, endpoint, now))
    conn.commit()
    conn.close()
    return False

@app.route('/api/create-account', methods=['POST'])
def create_account():
    ip = request.remote_addr
    if is_rate_limited(ip, '/api/create-account'):
        return jsonify({'success': False, 'error': 'Rate limit exceeded. Try again later.'}), 429
    try:
        account_number = generate_account_number()
        hashed_number = hash_account_number(account_number)
        
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('INSERT INTO accounts (account_number) VALUES (?)', (hashed_number,))
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'account_number': account_number
        })
    except Exception as e:
        logging.exception("[create_account] Error:")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/verify-account', methods=['POST'])
def verify_account():
    ip = request.remote_addr
    if is_rate_limited(ip, '/api/verify-account'):
        return jsonify({'success': False, 'error': 'Rate limit exceeded. Try again later.'}), 429
    try:
        data = request.get_json()
        account_number = data.get('account_number')
        if not is_valid_account_number(account_number):
            return jsonify({
                'success': False,
                'error': 'Invalid account number format'
            }), 400
            
        hashed_number = hash_account_number(account_number)
        
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT * FROM accounts WHERE account_number = ?', (hashed_number,))
        account = c.fetchone()
        conn.close()
        
        if account:
            return jsonify({
                'success': True,
                'message': 'Account verified successfully'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Invalid account number'
            }), 401
            
    except Exception as e:
        logging.exception("[verify_account] Error:")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/backup-accounts', methods=['POST'])
def backup_accounts():
    try:
        data = request.get_json()
        account_number = data.get('account_number')
        accounts = data.get('accounts', [])
        is_encrypted = data.get('encrypted', False)
        
        if not is_valid_account_number(account_number):
            return jsonify({
                'success': False,
                'error': 'Invalid account number format'
            }), 400
            
        hashed_number = hash_account_number(account_number)
        # Verify the account exists
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT 1 FROM accounts WHERE account_number = ?', (hashed_number,))
        if not c.fetchone():
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Invalid account number'
            }), 401
        
        # Handle encrypted vs plain data
        if is_encrypted:
            # For encrypted data, accounts should be a string (encrypted JSON)
            if not isinstance(accounts, str):
                return jsonify({
                    'success': False,
                    'error': 'Invalid encrypted accounts data - expected string'
                }), 400
            # Validate that it looks like encrypted data (starts with U2FsdGVkX1)
            if not accounts.startswith('U2FsdGVkX1'):
                return jsonify({
                    'success': False,
                    'error': 'Invalid encrypted data format'
                }), 400
            backup_data = accounts  # Store encrypted string directly
        else:
            # For plain data, validate account objects
            if not isinstance(accounts, list) or not all(is_valid_account_object(acc) for acc in accounts):
                return jsonify({
                    'success': False,
                    'error': 'Invalid accounts data'
                }), 400
            import json
            backup_data = json.dumps(accounts)
        
        # Delete previous backups for this account_number
        c.execute('DELETE FROM backups WHERE account_number = ?', (hashed_number,))
        # Insert the new backup
        c.execute('INSERT INTO backups (account_number, backup_data) VALUES (?, ?)',
                 (hashed_number, backup_data))
        conn.commit()
        conn.close()
        return jsonify({
            'success': True,
            'message': 'Accounts backed up successfully'
        })
    except Exception as e:
        logging.exception("[backup_accounts] Error:")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/restore-accounts', methods=['POST'])
def restore_accounts():
    try:
        data = request.get_json()
        account_number = data.get('account_number')
        if not is_valid_account_number(account_number):
            return jsonify({
                'success': False,
                'error': 'Invalid account number format'
            }), 400
        hashed_number = hash_account_number(account_number)
        # Get the latest backup
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''SELECT backup_data FROM backups 
                    WHERE account_number = ? 
                    ORDER BY created_at DESC LIMIT 1''', (hashed_number,))
        backup = c.fetchone()
        conn.close()
        if not backup:
            return jsonify({
                'success': False,
                'error': 'No backup found'
            }), 404
        
        backup_data = backup[0]
        
        # Check if the data is encrypted (starts with U2FsdGVkX1)
        if backup_data.startswith('U2FsdGVkX1'):
            # Return encrypted data as-is for client-side decryption
            return jsonify({
                'success': True,
                'accounts': backup_data
            })
        else:
            # Handle legacy plain JSON data
            import json
            accounts = json.loads(backup_data)
            return jsonify({
                'success': True,
                'accounts': accounts
            })
    except Exception as e:
        logging.exception("[restore_accounts] Error:")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500


@app.route('/api/delete-account', methods=['POST'])
def delete_account():
    try:
        data = request.get_json()
        account_number = data.get('account_number')
        account_id = data.get('account_id')
        if not is_valid_account_number(account_number):
            return jsonify({
                'success': False,
                'error': 'Invalid account number format'
            }), 400
        if not is_valid_account_id(account_id):
            return jsonify({
                'success': False,
                'error': 'Invalid account ID format'
            }), 400
            
        hashed_number = hash_account_number(account_number)
        
        # Verify the account exists
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT 1 FROM accounts WHERE account_number = ?', (hashed_number,))
        if not c.fetchone():
            conn.close()
            return jsonify({
                'success': False,
                'error': 'Invalid account number'
            }), 401
        
        # Get the latest backup
        c.execute('''SELECT id, backup_data FROM backups 
                    WHERE account_number = ? 
                    ORDER BY created_at DESC LIMIT 1''', (hashed_number,))
        backup = c.fetchone()
        
        if not backup:
            conn.close()
            return jsonify({
                'success': False,
                'error': 'No backup found'
            }), 404
            
        backup_data = backup[1]
        
        # Handle encrypted vs plain data
        if backup_data.startswith('U2FsdGVkX1'):
            # For encrypted data, we can't decrypt on the server side
            # The client should handle account deletion locally and re-upload
            return jsonify({
                'success': False,
                'error': 'Cannot delete from encrypted backup. Please delete locally and re-sync.'
            }), 400
        else:
            # Handle legacy plain JSON data
            import json
            accounts = json.loads(backup_data)
            accounts = [acc for acc in accounts if acc['id'] != account_id]
            
            # Create a new backup with the updated accounts
            backup_data = json.dumps(accounts)
            if accounts:
                # Update the existing backup row
                c.execute('UPDATE backups SET backup_data = ? WHERE account_number = ?', (backup_data, hashed_number))
            else:
                # If no accounts left, clear the backup_data (set to empty array)
                c.execute('UPDATE backups SET backup_data = ? WHERE account_number = ?', (backup_data, hashed_number))
            conn.commit()
            conn.close()
            
            return jsonify({
                'success': True,
                'message': 'Account deleted successfully'
            })
    except Exception as e:
        logging.exception("[delete_account] Error:")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/delete-user', methods=['DELETE'])
def delete_user():
    try:
        data = request.get_json()
        account_number = data.get('account_number')
        
        if not is_valid_account_number(account_number):
            return jsonify({
                'success': False,
                'error': 'Invalid account number format'
            }), 400
            
        hashed_number = hash_account_number(account_number)
        
        # Only delete the backup data, keep the user account
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        
        # Delete only from backups table (the saved accounts data)
        c.execute('DELETE FROM backups WHERE account_number = ?', (hashed_number,))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'User backup data deleted successfully'
        })
        
    except Exception as e:
        logging.exception("[delete_user] Error:")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

@app.route('/api/privacy-policy', methods=['GET'])
def privacy_policy():
    try:
        with open('privacy_policy.txt', 'r', encoding='utf-8') as file:
            content = file.read()
            
        import textwrap
        wrapped_lines = []
        for paragraph in content.split('\n'):
            if paragraph.strip() == '':
                wrapped_lines.append('')
            elif paragraph.lstrip().startswith(('•', '-', '*')):
                # Find bullet and space
                leading = paragraph[:paragraph.find(paragraph.lstrip())]  # preserve leading spaces
                bullet = paragraph.lstrip()[0]
                after_bullet = paragraph.lstrip()[1:]
                # Find the first non-space after bullet
                after_bullet = after_bullet.lstrip()
                bullet_prefix = f"{leading}{bullet} "
                wrapped_lines.extend(textwrap.wrap(
                    after_bullet,
                    width=80,
                    initial_indent=bullet_prefix,
                    subsequent_indent=' ' * len(bullet_prefix)
                ))
            else:
                wrapped_lines.extend(textwrap.wrap(paragraph, width=80, break_long_words=False))
        wrapped_content = '\n'.join(wrapped_lines)
        
        return wrapped_content, 200, {'Content-Type': 'text/plain; charset=utf-8'}
    except Exception as e:
        logging.exception("[privacy_policy] Error:")
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500

if __name__ == '__main__':
    # Set up logging
    logging.basicConfig(level=logging.INFO)
    app.run(debug=True, port=5000) 