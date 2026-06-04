window.AccountsOtpauth = {
    TOTP_TYPE: 'totp',
    HOTP_TYPE: 'hotp',
    DEFAULT_ALGORITHM: 'SHA1',
    TOTP_DIGITS: 6,
    TOTP_PERIOD: 30,
    HOTP_DEFAULT_COUNTER: 0,
    MIN_DIGITS: 1,
    MAX_DIGITS: 10,
    MIN_PERIOD: 1,
    MIN_COUNTER: 0,
    SUPPORTED_ALGORITHMS: ['SHA1', 'SHA256', 'SHA512'],

    isHotpAccount(account) {
        return (account?.type ?? this.TOTP_TYPE) === this.HOTP_TYPE;
    },

    isTotpAccount(account) {
        return !this.isHotpAccount(account);
    },

    encodeCounterBytes(counter) {
        let remaining = Math.floor(Math.max(0, Number(counter)));
        const bytes = new Uint8Array(8);

        for (let i = 7; i >= 0; i--) {
            bytes[i] = remaining & 0xff;
            remaining = Math.floor(remaining / 256);
        }

        return bytes;
    },

    base32ToKeyBytes(sanitized) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        let bits = '';
        const keyBytes = [];

        for (const char of sanitized) {
            const val = alphabet.indexOf(char);
            bits += val.toString(2).padStart(5, '0');
        }

        for (let i = 0; i + 8 <= bits.length; i += 8) {
            keyBytes.push(parseInt(bits.substring(i, i + 8), 2));
        }

        return keyBytes;
    },

    toWordArray(u8Array) {
        const words = [];

        for (let i = 0; i < u8Array.length; i += 4) {
            words.push(
                (u8Array[i] << 24)
                | ((u8Array[i + 1] ?? 0) << 16)
                | ((u8Array[i + 2] ?? 0) << 8)
                | (u8Array[i + 3] ?? 0)
            );
        }

        return CryptoJS.lib.WordArray.create(words, u8Array.length);
    },

    resolveCounter(options = {}) {
        const type = options.type ?? this.TOTP_TYPE;

        if (type === this.HOTP_TYPE) {
            const counter = options.counter ?? this.HOTP_DEFAULT_COUNTER;

            if (!Number.isInteger(counter) || counter < this.MIN_COUNTER) {
                return null;
            }

            return counter;
        }

        const period = options.period ?? this.TOTP_PERIOD;

        if (!Number.isInteger(period) || period < this.MIN_PERIOD) {
            return null;
        }

        const epochSec = Math.floor(Date.now() / 1000);
        return Math.floor(epochSec / period);
    },

    generateOTP(secret, options = {}) {
        const sanitized = this.normalizeBase32Secret(secret);

        if (!sanitized || typeof CryptoJS === 'undefined') {
            return null;
        }

        const digits = options.digits ?? this.TOTP_DIGITS;
        const algorithm = options.algorithm ?? this.DEFAULT_ALGORITHM;
        const hmacFn = {
            SHA1: CryptoJS.HmacSHA1,
            SHA256: CryptoJS.HmacSHA256,
            SHA512: CryptoJS.HmacSHA512
        }[algorithm];

        if (!hmacFn) {
            return null;
        }

        const counterValue = this.resolveCounter(options);

        if (counterValue == null) {
            return null;
        }

        try {
            const keyBytes = this.base32ToKeyBytes(sanitized);

            if (!keyBytes.length) {
                return null;
            }

            const counterBytes = this.encodeCounterBytes(counterValue);
            const hmac = hmacFn(
                this.toWordArray(counterBytes),
                this.toWordArray(new Uint8Array(keyBytes))
            );
            const hmacBytes = hmac.words.reduce((acc, word) => acc.concat([
                (word >> 24) & 0xff,
                (word >> 16) & 0xff,
                (word >> 8) & 0xff,
                word & 0xff
            ]), []);

            const offset = hmacBytes[hmacBytes.length - 1] & 0x0f;
            const binary = ((hmacBytes[offset] & 0x7f) << 24)
                | (hmacBytes[offset + 1] << 16)
                | (hmacBytes[offset + 2] << 8)
                | hmacBytes[offset + 3];
            const otp = binary % (10 ** digits);

            return otp.toString().padStart(digits, '0');
        } catch {
            return null;
        }
    },

    getTotpClock(options = {}) {
        const period = options.period ?? this.TOTP_PERIOD;
        const epochSec = Math.floor(Date.now() / 1000);
        const elapsedInStep = epochSec % period;
        const stepPeriod = Math.floor(epochSec / period);
        const timeLeft = elapsedInStep === 0 ? 0 : period - elapsedInStep;

        let fillAngle = 0;

        if (elapsedInStep >= period - 1) {
            fillAngle = 360;
        } else {
            fillAngle = ((elapsedInStep + 1) / period) * 360;
        }

        return {
            period: stepPeriod,
            timeLeft,
            elapsedInStep,
            progress: (elapsedInStep + 1) / period,
            angle: fillAngle
        };
    },

    getAccountOtpOptions(account) {
        const type = account?.type ?? this.TOTP_TYPE;
        const options = {
            type,
            algorithm: account?.algorithm ?? this.DEFAULT_ALGORITHM,
            digits: account?.digits ?? this.TOTP_DIGITS
        };

        if (type === this.HOTP_TYPE) {
            options.counter = Number.isInteger(account?.counter)
                ? account.counter
                : this.HOTP_DEFAULT_COUNTER;
        } else {
            options.period = account?.period ?? this.TOTP_PERIOD;
        }

        return options;
    },

    getAccountTotpOptions(account) {
        return this.getAccountOtpOptions(account);
    },

    sanitizeAccountName(name) {
        const trimmed = String(name ?? '')
            .trim()
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

        return Array.from(trimmed).slice(0, 64).join('').trim();
    },

    formatIssuerName(issuer) {
        const sanitized = this.sanitizeAccountName(issuer);

        if (!sanitized) {
            return '';
        }

        return sanitized
            .split(/\s+/)
            .map((word) => {
                const chars = Array.from(word);

                if (!chars.length) {
                    return '';
                }

                return chars[0].toLocaleUpperCase()
                    + chars.slice(1).join('').toLocaleLowerCase();
            })
            .filter(Boolean)
            .join(' ');
    },

    buildAccountNameFromLabel(issuer, label) {
        const issuerText = this.formatIssuerName(issuer);
        const labelText = this.sanitizeAccountName(label);
        const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        let name = issuerText || 'Account';
        let email = '';

        if (labelText) {
            if (emailPattern.test(labelText)) {
                email = labelText;
                name = issuerText || labelText.split('@')[0] || labelText;
            } else if (issuerText) {
                name = `${issuerText} (${labelText})`;
            } else {
                name = labelText;
            }
        }

        name = this.sanitizeAccountName(name) || 'Account';

        return { name, email };
    },

    parseOtpauthUri(rawUri) {
        try {
            return new URL(rawUri);
        } catch {
            const match = String(rawUri).match(/^otpauth:\/\/(totp|hotp)\/([^?#]*)(\?[^#]*)?$/i);

            if (!match) {
                throw new Error('Invalid QR code format.');
            }

            const type = match[1].toLowerCase();
            const pathPart = match[2] ?? '';
            const queryPart = match[3] ?? '';
            const encodedPath = Array.from(pathPart)
                .map((char) => encodeURIComponent(char))
                .join('');
            const rebuilt = `otpauth://${type}/${encodedPath}${queryPart}`;

            return new URL(rebuilt);
        }
    },

    decodeOtpauthPath(pathname) {
        const pathRaw = pathname.replace(/^\//, '');

        try {
            return decodeURIComponent(pathRaw);
        } catch {
            return pathRaw;
        }
    },

    normalizeBase32Secret(raw) {
        const trimmed = String(raw ?? '').trim().replace(/\s+/g, '').replace(/=+$/, '');

        if (!trimmed) {
            return null;
        }

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

        for (const char of trimmed) {
            if (!alphabet.includes(char.toUpperCase())) {
                return null;
            }
        }

        return trimmed.toUpperCase();
    },

    parseOtpauthParams(url, type) {
        const secretParam = url.searchParams.get('secret');

        if (secretParam == null || secretParam === '') {
            throw new Error('QR code is missing a secret key.');
        }

        const secret = this.normalizeBase32Secret(secretParam);

        if (!secret) {
            throw new Error('Invalid secret key in QR code.');
        }

        const digitsParam = url.searchParams.get('digits');
        let digits = this.TOTP_DIGITS;

        if (digitsParam != null && digitsParam !== '') {
            digits = Number.parseInt(digitsParam, 10);

            if (!Number.isInteger(digits) || digits < this.MIN_DIGITS || digits > this.MAX_DIGITS) {
                throw new Error('Invalid digits in QR code.');
            }
        }

        const algorithmParam = url.searchParams.get('algorithm');
        let algorithm = this.DEFAULT_ALGORITHM;

        if (algorithmParam != null && algorithmParam !== '') {
            if (!this.SUPPORTED_ALGORITHMS.includes(algorithmParam)) {
                throw new Error('Unsupported algorithm in QR code.');
            }

            algorithm = algorithmParam;
        }

        const otpOptions = { type, algorithm, digits };

        if (type === this.HOTP_TYPE) {
            let counter = this.HOTP_DEFAULT_COUNTER;
            const counterParam = url.searchParams.get('counter');

            if (counterParam != null && counterParam !== '') {
                counter = Number.parseInt(counterParam, 10);

                if (!Number.isInteger(counter) || counter < this.MIN_COUNTER) {
                    throw new Error('Invalid counter in QR code.');
                }
            }

            otpOptions.counter = counter;
        } else {
            let period = this.TOTP_PERIOD;
            const periodParam = url.searchParams.get('period');

            if (periodParam != null && periodParam !== '') {
                period = Number.parseInt(periodParam, 10);

                if (!Number.isInteger(period) || period < this.MIN_PERIOD) {
                    throw new Error('Invalid period in QR code.');
                }
            }

            otpOptions.period = period;
        }

        if (!this.generateOTP(secret, otpOptions)) {
            throw new Error('Invalid secret key in QR code.');
        }

        return { secret, algorithm, digits, otpOptions };
    },

    parseQRCodeAccountInput(uri) {
        let raw = String(uri ?? '').trim();

        if (raw.toLowerCase().startsWith('apple-otpauth://')) {
            raw = `otpauth://${raw.slice('apple-otpauth://'.length)}`;
        }

        if (!raw.toLowerCase().startsWith('otpauth://')) {
            throw new Error('Not a valid authenticator QR code.');
        }

        let url;

        try {
            url = this.parseOtpauthUri(raw);
        } catch {
            throw new Error('Invalid QR code format.');
        }

        const type = url.hostname.toLowerCase();

        if (type !== this.TOTP_TYPE && type !== this.HOTP_TYPE) {
            throw new Error('Unsupported authenticator type.');
        }

        const { secret, algorithm, digits, otpOptions } = this.parseOtpauthParams(url, type);
        const pathLabel = this.decodeOtpauthPath(url.pathname);
        let pathIssuer = '';
        let label = pathLabel;
        const colonIndex = pathLabel.indexOf(':');

        if (colonIndex !== -1) {
            pathIssuer = pathLabel.slice(0, colonIndex).trim();
            label = pathLabel.slice(colonIndex + 1).trim();
        }

        const issuerParam = url.searchParams.get('issuer');
        let issuer = pathIssuer;

        if (issuerParam != null && issuerParam !== '') {
            try {
                issuer = decodeURIComponent(issuerParam).trim();
            } catch {
                issuer = String(issuerParam).trim();
            }
        }

        const { name, email } = this.buildAccountNameFromLabel(issuer, label);
        const account = {
            name,
            secret,
            type,
            algorithm,
            digits
        };

        if (type === this.HOTP_TYPE) {
            account.counter = otpOptions.counter;
        } else {
            account.period = otpOptions.period;
        }

        if (email) {
            account.email = email;
        }

        return account;
    },

    parseManualAccountInput({ name, secret, email, type }) {
        const sanitizedName = this.formatIssuerName(name);

        if (!sanitizedName) {
            throw new Error('Enter a valid account name.');
        }

        const sanitizedSecret = String(secret ?? '')
            .trim()
            .replace(/\s+/g, '')
            .replace(/[^A-Z2-7]/gi, '')
            .toUpperCase()
            .slice(0, 64);

        const otpType = String(type ?? '').toLowerCase() === this.HOTP_TYPE
            ? this.HOTP_TYPE
            : this.TOTP_TYPE;

        const otpOptions = {
            type: otpType,
            algorithm: this.DEFAULT_ALGORITHM,
            digits: this.TOTP_DIGITS
        };

        if (otpType === this.HOTP_TYPE) {
            otpOptions.counter = this.HOTP_DEFAULT_COUNTER;
        } else {
            otpOptions.period = this.TOTP_PERIOD;
        }

        if (!sanitizedSecret || !this.generateOTP(sanitizedSecret, otpOptions)) {
            throw new Error('Invalid secret key.');
        }

        const emailRaw = String(email ?? '').trim();
        const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (emailRaw && !emailPattern.test(emailRaw)) {
            throw new Error('Enter a valid email address.');
        }

        const account = {
            name: sanitizedName,
            secret: sanitizedSecret,
            type: otpType,
            algorithm: otpOptions.algorithm,
            digits: otpOptions.digits
        };

        if (otpType === this.HOTP_TYPE) {
            account.counter = otpOptions.counter;
        } else {
            account.period = otpOptions.period;
        }

        if (emailRaw) {
            account.email = emailRaw;
        }

        return account;
    }
};
