// DOM Elements
let accountsList;
let addAccountBtn;
let addAccountForm;
let cancelAddBtn;
let saveAccountBtn;
let accountNameInput;
let accountEmailInput;
let secretKeyInput;
let errorMessage;
let scanQRBtn;
let searchInput;
let searchContainer;
let signInBtn;
let userMenuBtn;
let userDropdown;
let loginForm;
let accountNumberInput;
let loginButton;
let createAccountButton;
let cancelLoginBtn;
let downloadButton;
let cloudBackupBtn;
let inlineSignOutBtn;
let export2FABtn;
let toggleThemeBtn;
let signOutBtn;

// State
let accounts = [];
let newlyAddedAccountId = null;
let currentAccountNumber = null;
let lastBackupTime = null;
let backupCheckInterval = null;
let isSaving = false;
let unlocked = false;
let sliderJustUnlocked = false;
let accountCreatedThisSession = false;
let isDarkTheme = false;

const API_BASE_URL = 'https://pc-authenticator-pdpy.onrender.com/api';

// Generate a random account number
function generateAccountNumber() {
    const length = 24;
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Save account number to storage
async function saveAccountNumber(accountNumber) {
    try {
        await chrome.storage.local.set({ accountNumber });
        currentAccountNumber = accountNumber;
        return true;
    } catch (error) {
        return false;
    }
}

// Check if account number exists
async function checkAccountNumber(accountNumber) {
    try {
        const response = await fetch(`${API_BASE_URL}/verify-account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ account_number: accountNumber })
        });
        
        const data = await response.json();
        return data.success;
    } catch (error) {
        return false;
    }
}

// Show message in the login form
function showFormMessage(message, type = 'success') {
    const messageContainer = document.querySelector('.form-message-container');
    messageContainer.innerHTML = `<div class="form-message ${type}">${message}</div>`;
}

// Check if all accounts are backed up
async function checkBackupStatus() {
    if (!currentAccountNumber) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/get-latest-backup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ account_number: currentAccountNumber })
        });
        
        const data = await response.json();
        
        if (data.success && data.backup) {
            const backupAccounts = JSON.parse(data.backup.backup_data);
            // Check if all current accounts are in the backup
            const allBackedUp = accounts.every(account => 
                backupAccounts.some(backupAccount => 
                    backupAccount.id === account.id
                )
            );
            return allBackedUp;
        }
        return false;
    } catch (error) {
        return false;
    }
}

// Add a helper to set the cloud icon instantly from a given state
function setCloudIconState(state) {
    const cloudBackupBtn = document.getElementById('cloudBackup');
    if (!cloudBackupBtn) return;
    if (state === 'backed-up') {
        cloudBackupBtn.innerHTML = '<i class="fa fa-cloud"></i><i class="fa-solid fa-check"></i>';
        cloudBackupBtn.classList.add('backed-up');
    } else {
        cloudBackupBtn.innerHTML = '<i class="fa fa-cloud-download"></i>';
        cloudBackupBtn.classList.remove('backed-up');
    }
}

// Update backup icon based on status
async function updateBackupIcon() {
    const cloudBackupBtn = document.getElementById('cloudBackup');
    if (!cloudBackupBtn) return;

    const isBackedUp = await checkBackupStatus();
    if (isBackedUp) {
        cloudBackupBtn.innerHTML = '<i class="fa fa-cloud"></i><i class="fa-solid fa-check"></i>';
        cloudBackupBtn.classList.add('backed-up');
        await chrome.storage.local.set({ cloudIconState: 'backed-up' });
    } else {
        cloudBackupBtn.innerHTML = '<i class="fa fa-cloud-download"></i>';
        cloudBackupBtn.classList.remove('backed-up');
        await chrome.storage.local.set({ cloudIconState: 'not-backed-up' });
    }
}

// Start backup status checking
function startBackupCheck() {
    if (backupCheckInterval) {
        clearInterval(backupCheckInterval);
    }
    backupCheckInterval = setInterval(updateBackupIcon, 60000); // Check every minute
    updateBackupIcon(); // Initial check
}

// Stop backup status checking
function stopBackupCheck() {
    if (backupCheckInterval) {
        clearInterval(backupCheckInterval);
        backupCheckInterval = null;
    }
}

// Update UI based on login state
function updateLoginUI(isLoggedIn) {
    // Remove all existing placeholder-text elements
    document.querySelectorAll('.placeholder-text').forEach(el => el.remove());

    const signInBtn = document.getElementById('signIn');
    const signInContainer = signInBtn.closest('.tooltip-container');
    const userMenuBtn = document.getElementById('userMenu');
    const userDropdown = document.querySelector('.user-dropdown');
    const accountNumberInput = document.getElementById('accountNumber');
    const loginButton = document.getElementById('loginButton');
    const createAccountButton = document.getElementById('createAccountButton');
    const downloadButton = document.getElementById('downloadAccount');
    const cloudBackupBtn = document.getElementById('cloudBackup');
    const accountsList = document.getElementById('accountsList');
    const addAccountBtn = document.getElementById('addAccount');
    const scanQRBtn = document.getElementById('scanQR');
    const searchContainer = document.querySelector('.search-container');
    const loginForm = document.getElementById('loginForm');
    const blurBackground = document.querySelector('.blur-background');
    const inlineSignOutBtn = document.getElementById('inlineSignOut');

    if (isLoggedIn) {
        signInContainer.classList.add('hidden');
        userMenuBtn.classList.remove('hidden');
        accountNumberInput.value = currentAccountNumber;
        accountNumberInput.readOnly = true;
        loginButton.classList.add('hidden');
        createAccountButton.classList.add('hidden');
        // Keep blur if login form is visible
        if (!loginForm.classList.contains('hidden')) {
            blurBackground.classList.add('active');
        } else {
            blurBackground.classList.remove('active');
        }
        accountsList.classList.remove('hidden');
        addAccountBtn.classList.remove('hidden');
        scanQRBtn.classList.remove('hidden');
        searchContainer.classList.remove('hidden');
        cloudBackupBtn.classList.remove('hidden');
        // Only hide download button if we're not in the account creation flow
        if (!accountNumberInput.classList.contains('new-account')) {
            downloadButton.classList.add('hidden');
        }
        startAutoSave(); // Start auto-saving
    } else {
        // Add placeholder text when not logged in
        const placeholder = document.createElement('div');
        placeholder.className = 'placeholder-text';
        placeholder.innerHTML = `
            <div class="placeholder-content">
                <i class="fa fa-lock"></i>
                <p>Please login or create an account to use the authenticator</p>
            </div>
        `;
        document.body.appendChild(placeholder);

        signInContainer.classList.remove('hidden');
        userMenuBtn.classList.add('hidden');
        userDropdown.classList.add('hidden');
        accountNumberInput.value = '';
        accountNumberInput.readOnly = false;
        loginButton.classList.remove('hidden');
        createAccountButton.classList.remove('hidden');
        downloadButton.classList.add('hidden');
        accountsList.classList.add('hidden');
        addAccountBtn.classList.add('hidden');
        scanQRBtn.classList.add('hidden');
        searchContainer.classList.add('hidden');
        loginForm.classList.remove('hidden');
        blurBackground.classList.add('active');
        cloudBackupBtn.classList.add('hidden');
        stopAutoSave(); // Stop auto-saving
    }
}

// Helper to merge two account arrays by unique secret
function mergeAccounts(arr1, arr2) {
    const seen = new Set();
    const merged = [];
    for (const acc of [...arr1, ...arr2]) {
        if (!seen.has(acc.secret)) {
            merged.push(acc);
            seen.add(acc.secret);
        }
    }
    return merged;
}

// Update loadAccounts to merge local and backend accounts
async function loadAccounts() {
    if (!currentAccountNumber) {
        accounts = [];
        renderAccounts();
        await updateBackupIcon();
        return;
    }
    chrome.storage.local.get(['accounts'], async (result) => {
        let localAccounts = (result.accounts && Array.isArray(result.accounts)) ? result.accounts : [];
        try {
            const response = await fetch(`${API_BASE_URL}/restore-accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account_number: currentAccountNumber })
            });
            const data = await response.json();
            if (data.success && data.accounts) {
                accounts = mergeAccounts(localAccounts, data.accounts);
                await chrome.storage.local.set({ accounts });
                renderAccounts();
                await updateBackupIcon();
            } else {
                accounts = localAccounts;
                await chrome.storage.local.set({ accounts });
                renderAccounts();
                await updateBackupIcon();
            }
        } catch (error) {
            accounts = localAccounts;
            await chrome.storage.local.set({ accounts });
            renderAccounts();
            await updateBackupIcon();
        }
    });
}

// Save accounts to cloud storage
async function saveAccounts() {
    if (!currentAccountNumber) {
        return;
    }
    // Prevent saving an empty array if the previous backup was not empty
    if (accounts.length === 0) {
        try {
            const response = await fetch(`${API_BASE_URL}/get-latest-backup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account_number: currentAccountNumber })
            });
            const data = await response.json();
            if (data.success && data.backup && JSON.parse(data.backup.backup_data).length > 0) {
                return;
            }
        } catch (e) {
            // If error, proceed to save to avoid blocking legitimate clears
        }
    }
    try {
        const response = await fetch(`${API_BASE_URL}/backup-accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                account_number: currentAccountNumber,
                accounts: accounts
            })
        });
        const data = await response.json();
        if (data.success) {
        } else {
            throw new Error(data.error || 'Failed to save accounts');
        }
    } catch (error) {
        throw error;
    }
}

// Handle sign out
function handleSignOut() {
    if (isSaving) {
        showMessage('Cannot sign out while accounts are being saved. Please wait...', 'error');
        return;
    }

    currentAccountNumber = null;
    chrome.storage.local.remove(['accountNumber', 'accounts']);
    accounts = [];
    renderAccounts();
    updateLoginUI(false);
    showFormMessage('Successfully signed out!', 'success');
}

// Handle login
async function handleLogin() {
    if (!unlocked) return; // Prevent login if slider not completed
    const accountNumber = accountNumberInput.value.trim();
    if (!accountNumber) {
        showFormMessage('Please enter your account number', 'error');
        return;
    }

    const isValid = await checkAccountNumber(accountNumber);
    if (isValid) {
        currentAccountNumber = accountNumber;
        await saveAccountNumber(accountNumber);
        await loadAccounts(); // Load accounts after successful login
        updateLoginUI(true);
        showFormMessage('Successfully logged in!', 'success');
    } else {
        showFormMessage('Invalid account number', 'error');
    }
}

// Handle create account
async function handleCreateAccount() {
    if (!unlocked) return; // Prevent account creation if slider not completed
    try {
        const response = await fetch(`${API_BASE_URL}/create-account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const newAccountNumber = data.account_number;
            const success = await saveAccountNumber(newAccountNumber);
            
            if (success) {
                currentAccountNumber = newAccountNumber;
                accounts = []; // Initialize empty accounts array
                await saveAccounts(); // Save empty accounts array
                accountNumberInput.value = newAccountNumber;
                accountNumberInput.readOnly = true;
                accountNumberInput.classList.add('new-account');
                const downloadButton = document.getElementById('downloadAccount');
                downloadButton.classList.remove('hidden');
                downloadButton.classList.add('glow');
                showFormMessage('Account created. Please save this number!', 'success');
                // Automatically sign in
                await loadAccounts(); // Load accounts for the new user
                updateLoginUI(true); // Show the authenticated view
                accountCreatedThisSession = true;
            } else {
                showFormMessage('Failed to save account number locally', 'error');
            }
        } else {
            showFormMessage(data.error || 'Failed to create account', 'error');
        }
    } catch (error) {
        showFormMessage('Failed to connect to server', 'error');
    }
}

// Handle cloud backup
async function handleCloudBackup() {
    if (!currentAccountNumber) {
        showMessage('Please sign in to use cloud backup', 'error');
        return;
    }
    if (isSaving) {
        showMessage('Accounts are currently being saved. Please wait...', 'error');
        return;
    }
    try {
        isSaving = true;
        const response = await fetch(`${API_BASE_URL}/backup-accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                account_number: currentAccountNumber,
                accounts: accounts
            })
        });
        const data = await response.json();
        if (data.success) {
            lastBackupTime = Date.now();
            setCloudIconState('backed-up');
            await updateBackupIcon(); // Update icon immediately after backup
            showMessage('Accounts backed up successfully!', 'success');
        } else {
            setCloudIconState('not-backed-up');
            await chrome.storage.local.set({ cloudIconState: 'not-backed-up' });
            showMessage(data.error || 'Failed to backup accounts', 'error');
        }
    } catch (error) {
        showMessage('Failed to connect to server', 'error');
    } finally {
        isSaving = false;
    }
}

// Auto save accounts
async function autoSaveAccounts() {
    if (!currentAccountNumber || isSaving) {
        return;
    }
    // Prevent saving an empty array if the previous backup was not empty
    if (accounts.length === 0) {
        try {
            const response = await fetch(`${API_BASE_URL}/get-latest-backup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account_number: currentAccountNumber })
            });
            const data = await response.json();
            if (data.success && data.backup && JSON.parse(data.backup.backup_data).length > 0) {
                return;
            }
        } catch (e) {
            // If error, proceed to save to avoid blocking legitimate clears
        }
    }
    try {
        isSaving = true;
        const response = await fetch(`${API_BASE_URL}/backup-accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                account_number: currentAccountNumber,
                accounts: accounts
            })
        });
        const data = await response.json();
        if (data.success) {
            lastBackupTime = Date.now();
            await updateBackupIcon();
        }
    } catch (error) {
    } finally {
        isSaving = false;
    }
}

// Start auto-save interval
function startAutoSave() {
    if (backupCheckInterval) {
        clearInterval(backupCheckInterval);
    }
    backupCheckInterval = setInterval(async () => {
        await autoSaveAccounts();
        await updateBackupIcon();
    }, 60000); // Check every minute
    autoSaveAccounts(); // Initial save
}

// Stop auto-save interval
function stopAutoSave() {
    if (backupCheckInterval) {
        clearInterval(backupCheckInterval);
        backupCheckInterval = null;
    }
}

// Initialize login functionality
function initLogin() {
    signInBtn = document.getElementById('signIn');
    userMenuBtn = document.getElementById('userMenu');
    userDropdown = document.querySelector('.user-dropdown');
    loginForm = document.getElementById('loginForm');
    accountNumberInput = document.getElementById('accountNumber');
    loginButton = document.getElementById('loginButton');
    createAccountButton = document.getElementById('createAccountButton');
    cancelLoginBtn = document.getElementById('cancelLogin');
    const downloadButton = document.getElementById('downloadAccount');
    const blurBackground = document.querySelector('.blur-background');
    export2FABtn = document.getElementById('export2FA');
    toggleThemeBtn = document.getElementById('toggleTheme');
    signOutBtn = document.getElementById('signOut');

    // Toggle user dropdown
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.add('hidden');
        }
    });

    // Handle export 2FA codes
    export2FABtn.addEventListener('click', () => {
        const accountsData = accounts.map(account => ({
            name: account.name,
            email: account.email,
            secret: account.secret
        }));

        // Create the otpauth-migration URL
        const migrationData = {
            version: 1,
            batchSize: accountsData.length,
            batchIndex: 0,
            batchId: Date.now().toString(),
            otpParameters: accountsData.map(account => ({
                secret: account.secret,
                name: account.email ? `${account.name}:${account.email}` : account.name,
                issuer: account.name,
                type: 'TOTP',
                algorithm: 'SHA1',
                digits: 6,
                counter: 0
            }))
        };

        // Convert to base64
        const jsonStr = JSON.stringify(migrationData);
        const base64Data = btoa(jsonStr);
        const migrationUrl = `otpauth-migration://offline?data=${base64Data}`;

        // Create a text file with the migration URL
        const blob = new Blob([migrationUrl], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'google-authenticator-import.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        userDropdown.classList.add('hidden');
        showMessage('Export file created. You can now import it into Google Authenticator!', 'success');
    });

    // Handle theme toggle
    toggleThemeBtn.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        document.body.classList.toggle('dark-theme');
        const themeIcon = toggleThemeBtn.querySelector('i');
        themeIcon.classList.toggle('fa-moon');
        themeIcon.classList.toggle('fa-sun');
        userDropdown.classList.add('hidden');
    });

    // Handle sign out
    signOutBtn.addEventListener('click', () => {
        userDropdown.classList.add('hidden');
        handleSignOut();
    });

    let sliderBlock = document.getElementById('sliderBlock');
    let sliderTrack = sliderBlock.parentElement;
    let sliderFill = sliderTrack.querySelector('.slider-fill');
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    // Helper to set slider state
    function setSliderState(unlock) {
        unlocked = unlock;
        if (unlock) {
            sliderBlock.classList.add('unlocked');
            sliderTrack.classList.add('unlocked');
            loginButton.disabled = false;
            createAccountButton.disabled = false;
            sliderFill.style.width = '100%';
            // Change arrow to checkmark
            const arrow = sliderBlock.querySelector('.slider-arrow i');
            if (arrow) {
                arrow.classList.remove('fa-arrow-right');
                arrow.classList.add('fa-check');
                arrow.style.color = '#fff';
            }
            sliderJustUnlocked = true;
            // Remove slider from DOM after 0.3 second
            setTimeout(() => {
                const sliderContainer = sliderTrack.closest('.slider-container');
                if (sliderContainer && sliderContainer.parentNode) sliderContainer.parentNode.removeChild(sliderContainer);
            }, 300);
        } else {
            sliderBlock.classList.remove('unlocked');
            sliderTrack.classList.remove('unlocked');
            loginButton.disabled = true;
            createAccountButton.disabled = true;
            sliderFill.style.width = '0%';
            // Reset to arrow
            const arrow = sliderBlock.querySelector('.slider-arrow i');
            if (arrow) {
                arrow.classList.remove('fa-check');
                arrow.classList.add('fa-arrow-right');
                arrow.style.color = '#fff';
            }
            // Re-insert slider if needed (handled in resetSlider)
        }
    }

    // Helper to create the slider DOM
    function createSliderContainer() {
        const container = document.createElement('div');
        container.className = 'slider-container';
        container.innerHTML = `
            <div class="slider-track">
                <span class="slider-track-label">Swipe to verify</span>
                <div class="slider-fill"></div>
                <div class="slider-block" id="sliderBlock"><span class="slider-arrow"><i class="fas fa-arrow-right"></i></span></div>
            </div>
        `;
        return container;
    }

    // Reset slider position and state
    function resetSlider() {
        // If slider container is missing, re-insert it
        let sliderContainer = document.querySelector('.slider-container');
        if (!sliderContainer) {
            const loginForm = document.getElementById('loginForm');
            const buttonGroup = loginForm.querySelector('.button-group');
            sliderContainer = createSliderContainer();
            loginForm.insertBefore(sliderContainer, buttonGroup);
        }
        // Re-query elements and update references
        sliderBlock = sliderContainer.querySelector('.slider-block');
        sliderTrack = sliderContainer.querySelector('.slider-track');
        sliderFill = sliderContainer.querySelector('.slider-fill');
        // Remove unlocked state and reset arrow
        sliderBlock.classList.remove('unlocked');
        sliderTrack.classList.remove('unlocked');
        sliderBlock.style.left = '0px';
        sliderFill.style.width = '0%';
        const arrow = sliderBlock.querySelector('.slider-arrow i');
        if (arrow) {
            arrow.classList.remove('fa-check');
            arrow.classList.add('fa-arrow-right');
            arrow.style.color = '#fff';
        }
        // Re-attach drag logic
        attachSliderEvents(sliderBlock, sliderTrack, sliderFill);
        setSliderState(false);
        sliderJustUnlocked = false;
    }

    // Attach drag logic to the slider
    function attachSliderEvents(sliderBlock, sliderTrack, sliderFill) {
        sliderBlock.onmousedown = function(e) {
            if (unlocked) return;
            isDragging = true;
            startX = e.clientX - sliderBlock.offsetLeft;
            document.body.style.userSelect = 'none';
        };
        document.onmousemove = function(e) {
            if (!isDragging || unlocked) return;
            currentX = e.clientX - startX;
            const min = 0;
            const max = sliderTrack.offsetWidth - sliderBlock.offsetWidth;
            if (currentX < min) currentX = min;
            if (currentX > max) currentX = max;
            sliderBlock.style.left = currentX + 'px';
            sliderFill.style.width = (currentX + sliderBlock.offsetWidth) + 'px';
        };
        document.onmouseup = function(e) {
            if (!isDragging || unlocked) return;
            isDragging = false;
            const max = sliderTrack.offsetWidth - sliderBlock.offsetWidth;
            if (currentX >= max - 2) {
                sliderBlock.style.left = max + 'px';
                setSliderState(true);
            } else {
                sliderBlock.style.left = '0px';
                setSliderState(false);
            }
            document.body.style.userSelect = '';
        };
        // Touch events
        sliderBlock.ontouchstart = function(e) {
            if (unlocked) return;
            isDragging = true;
            startX = e.touches[0].clientX - sliderBlock.offsetLeft;
            document.body.style.userSelect = 'none';
        };
        document.ontouchmove = function(e) {
            if (!isDragging || unlocked) return;
            currentX = e.touches[0].clientX - startX;
            const min = 0;
            const max = sliderTrack.offsetWidth - sliderBlock.offsetWidth;
            if (currentX < min) currentX = min;
            if (currentX > max) currentX = max;
            sliderBlock.style.left = currentX + 'px';
            sliderFill.style.width = (currentX + sliderBlock.offsetWidth) + 'px';
        };
        document.ontouchend = function(e) {
            if (!isDragging || unlocked) return;
            isDragging = false;
            const max = sliderTrack.offsetWidth - sliderBlock.offsetWidth;
            if (currentX >= max - 2) {
                sliderBlock.style.left = max + 'px';
                setSliderState(true);
            } else {
                sliderBlock.style.left = '0px';
                setSliderState(false);
            }
            document.body.style.userSelect = '';
        };
    }

    // Initial attach for the first slider
    attachSliderEvents(sliderBlock, sliderTrack, sliderFill);

    // Reset slider when login form is shown
    signInBtn.addEventListener('click', () => {
        loginForm.classList.remove('hidden');
        blurBackground.classList.add('active');
        addAccountForm.classList.add('hidden');
        document.querySelector('.form-message-container').innerHTML = '';
        resetSlider();
    });
    cancelLoginBtn.addEventListener('click', () => {
        if (accountCreatedThisSession) {
            showAccountNumberWarning(() => {
                loginForm.classList.add('hidden');
                blurBackground.classList.remove('active');
                downloadButton.classList.add('hidden');
                downloadButton.classList.remove('glow');
                document.querySelector('.form-message-container').innerHTML = '';
                if (inlineSignOutBtn) inlineSignOutBtn.classList.add('hidden');
                resetSlider();
                accountCreatedThisSession = false;
            });
        } else {
            loginForm.classList.add('hidden');
            blurBackground.classList.remove('active');
            downloadButton.classList.add('hidden');
            downloadButton.classList.remove('glow');
            document.querySelector('.form-message-container').innerHTML = '';
            if (inlineSignOutBtn) inlineSignOutBtn.classList.add('hidden');
            resetSlider();
        }
    });
    // Also reset on page load
    resetSlider();

    // Check if user is already logged in
    chrome.storage.local.get(['accountNumber'], async (result) => {
        if (result.accountNumber) {
            currentAccountNumber = result.accountNumber;
            await loadAccounts();
            updateLoginUI(true);
        } else {
            updateLoginUI(false);
        }
    });

    // Only show warning for inline sign out and close in login form
    signOutBtn.addEventListener('click', handleSignOut);
    loginButton.addEventListener('click', handleLogin);
    createAccountButton.addEventListener('click', handleCreateAccount);
    downloadButton.addEventListener('click', () => {
        const accountNumber = accountNumberInput.value;
        if (accountNumber) {
            const blob = new Blob([accountNumber], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'pc-authenticator-account.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            downloadButton.classList.remove('glow');
            showFormMessage('Account number downloaded successfully!', 'success');
        }
    });

    inlineSignOutBtn = document.getElementById('inlineSignOut');
    if (inlineSignOutBtn) {
        inlineSignOutBtn.addEventListener('click', () => {
            showAccountNumberWarning(handleSignOut);
        });
    }
}

function checkCryptoJS() {
    if (typeof CryptoJS === 'undefined') {
        return false;
    }
    return true;
}

// Listen for QR code detection
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scanQRCode') {
        try {
            // Convert the received array back to Uint8ClampedArray
            const imageData = new Uint8ClampedArray(request.imageData);
            const code = jsQR(imageData, request.width, request.height);
            
            if (code) {
                // Parse the TOTP URI
                const uri = code.data;
                if (!uri.startsWith('otpauth://totp/')) {
                    throw new Error('Invalid TOTP URI format');
                }

                // Extract the label (issuer:email)
                const labelMatch = uri.match(/otpauth:\/\/totp\/([^?]+)/);
                if (!labelMatch) {
                    throw new Error('Could not extract label from TOTP URI');
                }

                const label = labelMatch[1];
                const [issuerRaw, labelOrEmailRaw] = label.split(':');
                const issuer = decodeURIComponent(issuerRaw || '');
                const labelOrEmail = decodeURIComponent(labelOrEmailRaw || '');
                const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
                const email = emailPattern.test(labelOrEmail) ? labelOrEmail : '';
                const username = email ? '' : labelOrEmail;
                
                // Extract the secret key
                const secretMatch = uri.match(/secret=([^&]+)/);
                if (!secretMatch) {
                    throw new Error('Could not extract secret key from TOTP URI');
                }
                const secret = secretMatch[1];

                // Fill in the form fields
                accountNameInput.value = issuer;
                accountEmailInput.value = email;
                secretKeyInput.value = secret;

                // Automatically save the account
                const extractedSecret = extractSecretFromInput(secret);
                const testOTP = generateOTP(extractedSecret);
                
                if (!testOTP) {
                    throw new Error('Invalid secret key');
                }

                // Check for duplicates
                const isDuplicate = accounts.some(account => 
                    account.secret === extractedSecret
                );

                if (isDuplicate) {
                    showMessage('This account or secret key already exists', 'error');
                    // Hide the message after 3 seconds
                    setTimeout(() => {
                        const errorMessage = document.querySelector('.success-message-container .error-message');
                        if (errorMessage) {
                            errorMessage.classList.add('hidden');
                        }
                    }, 3000);
                    return;
                }

                const newAccount = {
                    id: Date.now().toString(),
                    name: issuer,
                    email: email,
                    username: username,
                    secret: extractedSecret
                };

                // Load latest from local storage and merge
                chrome.storage.local.get(['accounts'], async (result) => {
                    let localAccounts = (result.accounts && Array.isArray(result.accounts)) ? result.accounts : [];
                    const mergedAccounts = mergeAccounts(localAccounts, [newAccount]);
                    accounts = mergedAccounts;
                    newlyAddedAccountId = newAccount.id;
                    await chrome.storage.local.set({ accounts });
                    await saveAccounts();
                    await loadAccounts();
                    renderAccounts();
                    addAccountForm.classList.add('hidden');
                    accountsList.classList.remove('hidden');
                    if (errorMessage) {
                        errorMessage.classList.add('hidden');
                    }
                    accountNameInput.value = '';
                    accountEmailInput.value = '';
                    secretKeyInput.value = '';
                    showSuccess('Account added successfully!');
                });
            } else {
                showError('No QR code found in the selected area');
            }
        } catch (error) {
            showError('Failed to scan QR code: ' + error.message);
        }
    } else if (request.action === 'qrCodeError') {
        showMessage(request.error || 'Failed to scan QR code', 'error');
        // Hide the message after 3 seconds
        setTimeout(() => {
            const errorMessage = document.querySelector('.success-message-container .error-message');
            if (errorMessage) {
                errorMessage.classList.add('hidden');
            }
        }, 3000);
    }
    return true; // Keep the message channel open
});

// Initialize the popup
document.addEventListener('DOMContentLoaded', () => {
    if (!checkCryptoJS()) {
        alert('Error: CryptoJS library not loaded. Please refresh the extension.');
        return;
    }

    // Initialize DOM elements
    accountsList = document.getElementById('accountsList');
    addAccountBtn = document.getElementById('addAccount');
    addAccountForm = document.getElementById('addAccountForm');
    cancelAddBtn = document.getElementById('cancelAdd');
    saveAccountBtn = document.getElementById('saveAccount');
    accountNameInput = document.getElementById('accountName');
    accountEmailInput = document.getElementById('accountEmail');
    secretKeyInput = document.getElementById('secretKey');
    errorMessage = document.querySelector('#addAccountForm .error-message');
    scanQRBtn = document.getElementById('scanQR');
    searchInput = document.getElementById('searchInput');
    searchContainer = document.querySelector('.search-container');

    // Initialize login functionality
    initLogin();

    // Load accounts immediately
    loadAccounts();

    // Check for stored QR data when popup opens
    chrome.runtime.sendMessage({ action: 'getQRData' }, (response) => {
        if (response) {
            processQRData(response);
        }
    });

    // Add search input event listener
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const accountBlocks = accountsList.querySelectorAll('.account-block');
        
        accountBlocks.forEach(block => {
            const accountName = block.querySelector('.account-name').textContent.toLowerCase();
            if (accountName.includes(searchTerm)) {
                block.style.display = '';
            } else {
                block.style.display = 'none';
            }
        });
    });

    // Event Listeners
    addAccountBtn.addEventListener('click', () => {
        if (addAccountBtn.disabled) return;
        addAccountForm.classList.remove('hidden');
        accountsList.classList.add('hidden');
        if (errorMessage) {
            errorMessage.classList.add('hidden');
        }
        accountNameInput.value = '';
        accountEmailInput.value = '';
        secretKeyInput.value = '';
        newlyAddedAccountId = null;
        searchContainer.classList.add('hidden');

        // Get current tab's URL and extract domain
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0] && tabs[0].url) {
                try {
                    const url = new URL(tabs[0].url);
                    let domain = url.hostname.replace('www.', '');
                    
                    // Remove common domain suffixes
                    domain = domain.replace(/\.(com|net|org|io|co|edu|gov|me|app|dev)$/i, '');
                    
                    // Split by dots and hyphens, capitalize each word
                    domain = domain.split(/[.-]/)
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');
                    
                    accountNameInput.value = domain;
                } catch (e) {
                }
            }
        });
    });

    scanQRBtn.addEventListener('click', async () => {
        if (scanQRBtn.disabled) return;
        try {
            // Get the active tab
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tabs[0]) {
                throw new Error('No active tab found');
            }

            // Inject the content script if not already injected
            await chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['scripts/content.js']
            });

            // Start the QR scanner
            const response = await chrome.tabs.sendMessage(tabs[0].id, { action: 'startQRScan' });
            if (!response || !response.success) {
                throw new Error(response?.error || 'Failed to start QR scanner');
            }
        } catch (error) {
            showError('Failed to start QR code scanner: ' + error.message);
        }
    });

    cancelAddBtn.addEventListener('click', () => {
        addAccountForm.classList.add('hidden');
        accountsList.classList.remove('hidden');
        
        accountNameInput.value = '';
        accountEmailInput.value = '';
        secretKeyInput.value = '';
        newlyAddedAccountId = null;
        searchContainer.classList.remove('hidden');
    });

    saveAccountBtn.addEventListener('click', async () => {
        const accountName = accountNameInput.value.trim();
        const accountEmail = accountEmailInput.value.trim();
        const secretKey = secretKeyInput.value.trim();

        if (!accountName || !secretKey) {
            showError('Please fill in all required fields');
            return;
        }
        // Require at least email or username
        if (!accountEmail && !accountName) {
            showError('Please provide an email or username');
            return;
        }
        // Validate email if provided
        if (accountEmail && !isValidEmail(accountEmail)) {
            showError('Please enter a valid email address');
            return;
        }

        const extractedSecret = extractSecretFromInput(secretKey);
        const testOTP = generateOTP(extractedSecret);
        if (!testOTP) {
            showError('Invalid secret key');
            return;
        }

        // Check for duplicates
        const isDuplicate = accounts.some(account => 
            account.secret === extractedSecret
        );
        if (isDuplicate) {
            addAccountForm.classList.add('hidden');
            accountsList.classList.remove('hidden');
            searchContainer.classList.remove('hidden');
            showMessage('This account or secret key already exists', 'error', accounts[0].id);
            return;
        }

        const newAccount = {
            id: Date.now().toString(),
            name: accountName,
            email: accountEmail,
            secret: extractedSecret
        };

        try {
            // 1. Save to local storage immediately
            accounts.push(newAccount);
            newlyAddedAccountId = newAccount.id;
            await chrome.storage.local.set({ accounts });
            // 2. Update UI
            renderAccounts();
            addAccountForm.classList.add('hidden');
            accountsList.classList.remove('hidden');
            searchContainer.classList.remove('hidden');
            accountNameInput.value = '';
            accountEmailInput.value = '';
            secretKeyInput.value = '';
            showSuccess('Account added successfully!');
            // 3. Trigger backup, but don't wait for it
            await saveAccounts();
            await loadAccounts();
        } catch (error) {
            // If cloud save fails, remove the account from local array
            accounts = accounts.filter(a => a.id !== newAccount.id);
            renderAccounts();
        }
    });

    // Initialize cloud backup button
    cloudBackupBtn = document.getElementById('cloudBackup');
    cloudBackupBtn.addEventListener('click', handleCloudBackup);
    cloudBackupBtn.title = 'Cloud Backup'; // Set a clear, centered tooltip

    // On DOMContentLoaded, set the icon instantly from local storage
    chrome.storage.local.get(['cloudIconState'], (result) => {
        setCloudIconState(result.cloudIconState || 'not-backed-up');
    });
});

function showError(message, type = 'error') {
    let errorMessage = document.querySelector('#addAccountForm .error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        const form = document.getElementById('addAccountForm');
        form.insertBefore(errorMessage, form.querySelector('.button-group'));
    }
    
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    errorMessage.classList.remove('success-message');
    errorMessage.classList.remove('error-message');
    errorMessage.classList.add(type + '-message');
    
    // Hide the message after 3 seconds
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 3000);
}

function showSuccess(message) {
    const successMessage = document.querySelector('.success-message');
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
    
    // Hide the message after 3 seconds
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 3000);
}

// Show message in the main view
function showMessage(message, type = 'success') {
    const messageContainer = document.querySelector('.success-message-container');
    messageContainer.innerHTML = `<div class="success-message ${type}">${message}</div>`;
    
    // Hide the message after 3 seconds
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 3000);
}

function extractSecretFromInput(input) {
    return input.replace(/[^A-Z2-7]/gi, '').toUpperCase();
}

function base32Decode(base32) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    let bytes = [];

    for (let char of base32) {
        const val = alphabet.indexOf(char.toUpperCase());
        if (val === -1) continue;
        bits += val.toString(2).padStart(5, '0');
    }

    for (let i = 0; i + 8 <= bits.length; i += 8) {
        bytes.push(parseInt(bits.substring(i, i + 8), 2));
    }

    return bytes;
}

function uint8ArrayToWordArray(u8Array) {
    const words = [];
    for (let i = 0; i < u8Array.length; i += 4) {
        words.push(
            (u8Array[i] << 24) |
            (u8Array[i + 1] << 16) |
            (u8Array[i + 2] << 8) |
            (u8Array[i + 3])
        );
    }
    return CryptoJS.lib.WordArray.create(words, u8Array.length);
}

function generateOTP(secret) {
    try {
        const keyBytes = base32Decode(secret);

        const epoch = Math.floor(Date.now() / 1000);
        let time = Math.floor(epoch / 30);

        const timeArray = new Uint8Array(8);
        for (let i = 7; i >= 0; i--) {
            timeArray[i] = time & 0xff;
            time >>= 8;
        }

        const keyWordArray = uint8ArrayToWordArray(new Uint8Array(keyBytes));
        const timeWordArray = uint8ArrayToWordArray(timeArray);

        const hmac = CryptoJS.HmacSHA1(timeWordArray, keyWordArray);

        const hmacBytes = hmac.words.reduce((acc, word) => acc.concat([
            (word >> 24) & 0xff,
            (word >> 16) & 0xff,
            (word >> 8) & 0xff,
            word & 0xff
        ]), []);

        const offset = hmacBytes[hmacBytes.length - 1] & 0x0f;
        const binary = ((hmacBytes[offset] & 0x7f) << 24) |
                       (hmacBytes[offset + 1] << 16) |
                       (hmacBytes[offset + 2] << 8) |
                       (hmacBytes[offset + 3]);

        const otp = binary % 1000000;

        return otp.toString().padStart(6, '0');
    } catch (e) {
        return null;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function renderAccounts() {
    accountsList.innerHTML = '';
    
    // Add success message if there's a newly added account
    if (newlyAddedAccountId) {
        showMessage('Account added successfully!');
        // Hide the message after 3 seconds
        setTimeout(() => {
            const successMessage = document.querySelector('.success-message');
            if (successMessage) {
            successMessage.classList.add('hidden');
            }
            // Clear the newlyAddedAccountId after showing the message
            newlyAddedAccountId = null;
        }, 3000);
    }
    
    // Ensure accounts list is visible
    accountsList.classList.remove('hidden');
    searchContainer.classList.remove('hidden');
    
    if (accounts.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'placeholder-text';
        emptyMessage.innerHTML = `
            <div class="placeholder-content">
                <i class="fa fa-user-lock"></i>
                <p>No accounts added yet</p>
            </div>
        `;
        accountsList.appendChild(emptyMessage);
        return;
    }
    
    accounts.forEach(account => {
        const accountBlock = document.createElement('div');
        accountBlock.className = 'account-block';
        accountBlock.setAttribute('data-account-id', account.id);
        
        // Only add new-account class if this is the newly added account
        if (account.id === newlyAddedAccountId) {
            accountBlock.classList.add('new-account');
            newlyAddedAccountId = null; // Reset the flag after using it
        }
        
        // Add click event to copy OTP code
        const clickHandler = () => {
            const otpCode = accountBlock.querySelector('.otp-code').textContent;
            navigator.clipboard.writeText(otpCode).then(() => {
                // Add copied message element if it doesn't exist
                let copiedMessage = accountBlock.querySelector('.copied-message');
                if (!copiedMessage) {
                    copiedMessage = document.createElement('div');
                    copiedMessage.className = 'copied-message';
                    copiedMessage.textContent = 'Copied';
                    accountBlock.appendChild(copiedMessage);
                }
                
                // Add copied class to show blur and message
                accountBlock.classList.add('copied');
                
                // Remove copied class after 1.5 seconds
                setTimeout(() => {
                    accountBlock.classList.remove('copied');
                }, 1500);
            }).catch(err => {
                showMessage('Failed to copy code', 'error');
            });
        };
        accountBlock.addEventListener('click', clickHandler);
        
        const accountInfo = document.createElement('div');
        accountInfo.className = 'account-info';
        
        const accountName = document.createElement('div');
        accountName.className = 'account-name';
        accountName.textContent = account.name;

        // Always create the username field, even if empty
        const accountUsername = document.createElement('div');
        accountUsername.className = 'account-username account-email';
        accountUsername.textContent = account.username || '';
        
        const otpCode = document.createElement('div');
        otpCode.className = 'otp-code';
        
        const accountEmail = document.createElement('div');
        accountEmail.className = 'account-email';
        accountEmail.textContent = account.email;
        
        // Placeholder logic: use a friendly tooltip
        accountBlock.title = 'Copy code';

        accountInfo.appendChild(accountName);
        if (account.email) {
            accountInfo.appendChild(accountEmail);
        } else if (account.username) {
            accountInfo.appendChild(accountUsername);
        }
        accountInfo.appendChild(otpCode);
        
        // Create edit button
        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        editButton.title = 'Edit account';
        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            editButton.classList.add('hidden');
            deleteButton.classList.add('hidden');
            qrButton.classList.add('hidden'); // Hide QR button when editing
            accountBlock.classList.add('editing');
            accountName.contentEditable = true;
            // Make email or username editable
            if (account.email) {
                accountEmail.contentEditable = true;
                accountEmail.focus();
            } else {
                accountUsername.contentEditable = true;
                accountUsername.focus();
            }
            const saveButton = document.createElement('button');
            saveButton.className = 'save-edit-button';
            saveButton.innerHTML = '<i class="fas fa-check"></i>';
            saveButton.title = 'Save changes';
            const cancelButton = document.createElement('button');
            cancelButton.className = 'cancel-edit-button';
            cancelButton.innerHTML = '<i class="fas fa-times"></i>';
            cancelButton.title = 'Cancel';
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'edit-buttons-container';
            buttonContainer.appendChild(saveButton);
            buttonContainer.appendChild(cancelButton);
            accountBlock.appendChild(buttonContainer);
            saveButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                const newName = accountName.textContent.trim();
                let newEmail = account.email ? accountEmail.textContent.trim() : '';
                let newUsername = account.username !== undefined ? accountUsername.textContent.trim() : '';
                if (!newName) {
                    showMessage('Account name cannot be empty', 'error', account.id);
                    return;
                }
                // Require at least email or username
                if (!newEmail && !newUsername) {
                    showMessage('Please provide an email or username', 'error', account.id);
                    return;
                }
                if (account.email && newEmail && !isValidEmail(newEmail)) {
                    showMessage('Please enter a valid email address', 'error', account.id);
                    return;
                }
                // Update account in the array
                account.name = newName;
                if (account.email) {
                    account.email = newEmail;
                } else {
                    account.username = newUsername;
                }
                accountName.contentEditable = false;
                if (account.email) {
                    accountEmail.contentEditable = false;
                } else {
                    accountUsername.contentEditable = false;
                }
                buttonContainer.remove();
                editButton.classList.remove('hidden');
                deleteButton.classList.remove('hidden');
                qrButton.classList.remove('hidden'); // Show QR button when editing is done
                accountBlock.classList.remove('editing');
                accountBlock.addEventListener('click', clickHandler);
                await chrome.storage.local.set({ accounts });
                await saveAccounts();
                showMessage('Account updated successfully!', 'success', account.id);
            });
            cancelButton.addEventListener('click', (e) => {
                e.stopPropagation();
                accountName.textContent = account.name;
                if (account.email) {
                    accountEmail.textContent = account.email;
                } else {
                    accountUsername.textContent = account.username;
                }
                accountName.contentEditable = false;
                if (account.email) {
                    accountEmail.contentEditable = false;
                } else {
                    accountUsername.contentEditable = false;
                }
                buttonContainer.remove();
                editButton.classList.remove('hidden');
                deleteButton.classList.remove('hidden');
                qrButton.classList.remove('hidden'); // Show QR button when editing is cancelled
                accountBlock.classList.remove('editing');
                accountBlock.addEventListener('click', clickHandler);
            });
        });
        accountBlock.appendChild(editButton);
        
        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '&times;';
        deleteButton.title = 'Delete account';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Create confirmation dialog
            const confirmationDialog = document.createElement('div');
            confirmationDialog.className = 'delete-confirmation';
            confirmationDialog.innerHTML = `
                <span class="delete-confirmation-text">Are you sure?</span>
                <button class="delete-confirmation-button confirm">Yes</button>
                <button class="delete-confirmation-button cancel">No</button>
            `;
            
            // Add blur effect to the account block
            accountBlock.classList.add('blurred');
            
            // Position the dialog
            const buttonRect = deleteButton.getBoundingClientRect();
            confirmationDialog.style.top = `${buttonRect.top + window.scrollY - 10}px`;
            confirmationDialog.style.right = `${window.innerWidth - buttonRect.right}px`;
            
            // Add event listeners to buttons
            const confirmButton = confirmationDialog.querySelector('.confirm');
            const cancelButton = confirmationDialog.querySelector('.cancel');
            
            confirmButton.addEventListener('click', async () => {
                confirmationDialog.remove();
                try {
                    // Delete from cloud first
                    const success = await deleteAccount(account.id);
                    if (!success) {
                        showMessage('Failed to delete account from cloud', 'error');
                        return;
                    }
                    // Remove from local array
                    accounts = accounts.filter(a => a.id !== account.id);
                    // Save updated accounts to local storage and cloud
                    await chrome.storage.local.set({ accounts });
                    await saveAccounts();
                    // Update UI
                    renderAccounts();
                    showMessage('Account deleted successfully!', 'success');
                } catch (error) {
                    showMessage('Failed to delete account', 'error');
                }
            });
            
            cancelButton.addEventListener('click', () => {
                confirmationDialog.remove();
                accountBlock.classList.remove('blurred');
            });
            
            // Add click outside handler to the dialog itself
            confirmationDialog.addEventListener('click', (e) => {
                if (e.target === confirmationDialog) {
                    confirmationDialog.remove();
                    accountBlock.classList.remove('blurred');
                }
            });
            
            // Add the dialog to the document
            document.body.appendChild(confirmationDialog);
        });
        accountBlock.appendChild(deleteButton);
        
        // Add QR code button
        const qrButton = document.createElement('button');
        qrButton.className = 'qr-button';
        qrButton.innerHTML = '<i class="fas fa-qrcode"></i>';
        qrButton.title = 'Show QR Code';
        qrButton.addEventListener('click', (e) => {
            e.stopPropagation();
            showQRCode(account);
        });
        accountBlock.appendChild(qrButton);
        
        // SVG Pie Timer with countdown text
        const timerWrapper = document.createElement('div');
        timerWrapper.className = 'timer-wrapper';
        timerWrapper.style.display = 'block';
        timerWrapper.style.margin = '10px auto';
        const size = 32;
        const radius = size / 2;
        timerWrapper.innerHTML = `
            <svg width="${size}" height="${size}" class="pie-timer-svg" viewBox="0 0 32 32" style="overflow: visible;">
                <circle class="pie-bg" cx="16" cy="16" r="14.5" />
                <path class="pie-fg" 
                    d=""
                />
            </svg>
        `;
        
        accountBlock.appendChild(accountInfo);
        accountBlock.appendChild(timerWrapper);
        
        accountsList.appendChild(accountBlock);
        
        let lastPath = ''; // Cache the last path
        let isInverted = false; // Track the current color state
        
        const updateOTP = () => {
            const otp = generateOTP(account.secret);
            const timeLeft = 30 - (Math.floor(Date.now() / 1000) % 30);
            const progress = (30 - timeLeft) / 30;
            const angle = progress * 360;
        
            otpCode.textContent = otp;
        
            const pieFg = timerWrapper.querySelector('.pie-fg');
            
            if (progress === 0) {
                pieFg.style.display = '';
                
                // Swap colors using CSS variables
                const bgCircle = timerWrapper.querySelector('.pie-bg');
                const currentBgColor = getComputedStyle(bgCircle).getPropertyValue('--pie-bg-color') || '#4285f4';
                const currentFgColor = getComputedStyle(pieFg).getPropertyValue('--pie-fg-color') || '#e0e0e0';
                
                bgCircle.style.setProperty('--pie-bg-color', currentFgColor);
                pieFg.style.setProperty('--pie-fg-color', currentBgColor);
                isInverted = !isInverted;
            }
        
            if (progress === 1) {
                // At completion, show the full circle
                pieFg.style.display = '';
                pieFg.setAttribute('d', `M16 16 L16 1.5 A15 15 0 1 1 16 30.5 A15 15 0 1 1 16 1.5 Z`);
                lastPath = '';
                
                // Get current colors
                const bgCircle = timerWrapper.querySelector('.pie-bg');
                const currentBgColor = getComputedStyle(bgCircle).getPropertyValue('--pie-bg-color') || '#4285f4';
                const currentFgColor = getComputedStyle(pieFg).getPropertyValue('--pie-fg-color') || '#e0e0e0';
                
                bgCircle.style.setProperty('--pie-bg-color', currentFgColor);
                pieFg.style.setProperty('--pie-fg-color', currentBgColor);
                isInverted = !isInverted;
            } else {
                pieFg.style.display = '';
             
                const startAngle = -90;
                const endAngle = startAngle + angle;
        
                const startRad = (startAngle * Math.PI) / 180;
                const endRad = (endAngle * Math.PI) / 180;
        
                const startX = 16 + Math.cos(startRad) * 15;
                const startY = 16 + Math.sin(startRad) * 15;
                const endX = 16 + Math.cos(endRad) * 15;
                const endY = 16 + Math.sin(endRad) * 15;
        
                // Create a path using two arcs for smoother transition
                let newPath;
                if (angle < 180) {
                    newPath = `M16 16 L${startX} ${startY} A15 15 0 0 1 ${endX} ${endY} Z`;
                } else if (angle === 180) {
                    // Special case for exactly 180 degrees - use the same path as < 180
                    newPath = `M16 16 L${startX} ${startY} A15 15 0 0 1 ${endX} ${endY} Z`;
                } else {
                    // For angles > 180, use two arcs to ensure smooth transition
                    const midAngle = startAngle + 180;
                    const midRad = (midAngle * Math.PI) / 180;
                    const midX = 16 + Math.cos(midRad) * 15;
                    const midY = 16 + Math.sin(midRad) * 15;
                    newPath = `M16 16 L${startX} ${startY} A15 15 0 1 1 ${midX} ${midY} A15 15 0 0 1 ${endX} ${endY} Z`;
                }
        
                if (newPath !== lastPath) {
                    pieFg.setAttribute('d', newPath);
                    lastPath = newPath;
                }
            }
        };
        

        updateOTP();
        setInterval(updateOTP, 1000);
    });
}

async function processQRData(qrData) {
    try {
        // Convert the received array back to Uint8ClampedArray
        const imageData = new Uint8ClampedArray(qrData.imageData);

        // Verify the image data length
        if (imageData.length !== qrData.width * qrData.height * 4) {
            throw new Error('Invalid image data dimensions');
        }

        const code = jsQR(imageData, qrData.width, qrData.height);
        
        if (code) {
            // Parse the TOTP URI
            const uri = code.data;
            if (!uri.startsWith('otpauth://totp/')) {
                throw new Error('Invalid TOTP URI format');
            }

            // Extract the label (issuer:email)
            const labelMatch = uri.match(/otpauth:\/\/totp\/([^?]+)/);
            if (!labelMatch) {
                throw new Error('Could not extract label from TOTP URI');
            }

            const label = labelMatch[1];
            const [issuerRaw, labelOrEmailRaw] = label.split(':');
            const issuer = decodeURIComponent(issuerRaw || '');
            const labelOrEmail = decodeURIComponent(labelOrEmailRaw || '');
            const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
            const email = emailPattern.test(labelOrEmail) ? labelOrEmail : '';
            const username = email ? '' : labelOrEmail;
            
            // Extract the secret key
            const secretMatch = uri.match(/secret=([^&]+)/);
            if (!secretMatch) {
                throw new Error('Could not extract secret key from TOTP URI');
            }
            const secret = secretMatch[1];

            // Fill in the form fields
            accountNameInput.value = issuer;
            accountEmailInput.value = email;
            secretKeyInput.value = secret;

            // Automatically save the account
            const extractedSecret = extractSecretFromInput(secret);
            const testOTP = generateOTP(extractedSecret);
            
            if (!testOTP) {
                throw new Error('Invalid secret key');
            }

            // Check for duplicates
            const isDuplicate = accounts.some(account => 
                account.secret === extractedSecret
            );

            if (isDuplicate) {
                showMessage('This account or secret key already exists', 'error');
                // Hide the message after 3 seconds
                setTimeout(() => {
                    const errorMessage = document.querySelector('.success-message-container .error-message');
                    if (errorMessage) {
                        errorMessage.classList.add('hidden');
                    }
                }, 3000);
                return;
            }

            const newAccount = {
                id: Date.now().toString(),
                name: issuer,
                email: email,
                username: username,
                secret: extractedSecret
            };

            // Load latest from local storage and merge
            chrome.storage.local.get(['accounts'], async (result) => {
                let localAccounts = (result.accounts && Array.isArray(result.accounts)) ? result.accounts : [];
                const mergedAccounts = mergeAccounts(localAccounts, [newAccount]);
                accounts = mergedAccounts;
                newlyAddedAccountId = newAccount.id;
                await chrome.storage.local.set({ accounts });
                await saveAccounts();
                await loadAccounts();
                renderAccounts();
                addAccountForm.classList.add('hidden');
                accountsList.classList.remove('hidden');
                if (errorMessage) {
                    errorMessage.classList.add('hidden');
                }
                accountNameInput.value = '';
                accountEmailInput.value = '';
                secretKeyInput.value = '';
                showSuccess('Account added successfully!');
            });
        } else {
            showError('No QR code found in the selected area');
        }
    } catch (error) {
        showError('Failed to process QR code: ' + error.message);
    }
}

// Delete account from cloud database
async function deleteAccount(accountId) {
    if (!currentAccountNumber) {
        return false;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/delete-account`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                account_number: currentAccountNumber,
                account_id: accountId
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

function showAccountNumberWarning(onConfirm) {
    const modal = document.getElementById('accountNumberWarningModal');
    const confirmBtn = document.getElementById('confirmAccountNumberWarning');
    const cancelBtn = document.getElementById('cancelAccountNumberWarning');
    const loginForm = document.getElementById('loginForm');
    const blurBackground = document.querySelector('.blur-background');

    // Show modal, hide login form
    modal.classList.remove('hidden');
    loginForm.classList.add('hidden');
    blurBackground.classList.add('active');

    // Remove any previous listeners
    confirmBtn.onclick = null;
    cancelBtn.onclick = null;

    confirmBtn.onclick = () => {
        modal.classList.add('hidden');
        onConfirm();
    };
    cancelBtn.onclick = () => {
        modal.classList.add('hidden');
        loginForm.classList.remove('hidden');
    };
}

// Generate TOTP URI for QR code
function generateTOTPUri(account) {
    const label = account.email ? 
        `${encodeURIComponent(account.name)}:${encodeURIComponent(account.email)}` : 
        encodeURIComponent(account.name);
    return `otpauth://totp/${label}?secret=${account.secret}&issuer=${encodeURIComponent(account.name)}`;
}

// Show QR code modal
function showQRCode(account) {
    const modal = document.getElementById('qrCodeModal');
    const qrcodeDiv = document.getElementById('qrcode');
    const closeBtn = modal.querySelector('.close-modal');
    
    // Clear previous QR code
    qrcodeDiv.innerHTML = '';
    
    // Generate new QR code
    const totpUri = generateTOTPUri(account);
    new QRCode(qrcodeDiv, {
        text: totpUri,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('show');
    
    // Close modal when clicking close button
    closeBtn.onclick = () => {
        modal.classList.remove('show');
        modal.classList.add('hidden');
    };
    
    // Close modal when clicking outside
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            modal.classList.add('hidden');
        }
    };
}