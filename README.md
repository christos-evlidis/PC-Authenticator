<p align="center">
  <img width="1280" height="272" alt="image" src="https://github.com/user-attachments/assets/7bb93e06-bda6-4be8-a5b0-8ab10b7f05fd" />
</p>

---

<p align="center">
  <img src="https://lh3.googleusercontent.com/mMMvBZGGKQDmpIL6JyeXmKsdpvgL7RprS1Af4jvK0cj76P9gk1gm61kODb2jZD82cbAC8gL65lpfxhHrubhqbnC5QHU=s1280-w1280-h800" width="48%" />
  <img src="https://lh3.googleusercontent.com/0aCc3T6nP2aywqzfELHONx6BvQBoPRphub0O5ksP0clZ009T0bhDaI6_WNwkdr61FNwZcIZngNEYN6OaGIvv7gpxGGU=s1280-w1280-h800" width="48%" />
</p>

---

## TOTP-Based Desktop Authenticator (RFC 6238)

**PC Authenticator** is a powerful and user-friendly Chrome extension designed to help you securely manage your two-factor authentication (2FA) codes right from your desktop. With a modern, intuitive interface, it makes it easy to add, organize, and access your 2FA accounts for all your online services.

---

## Security Model

- TOTP secrets are encrypted locally before being saved to our servers.
- Encryption uses AES-256 with a key derived from a randomly generated, high-entropy account identifier.
- Uses a 30-second time step with HMAC-SHA1, compatible with Google Authenticator.
- Secrets are never stored or transmitted in plaintext.
- No analytics or tracking is performed.
- The server never has access to encryption keys.
- Implements TOTP according to RFC 6238.

---

## Threat Model

This project is designed to protect against:
- Unauthorized access to stored secrets without the account identifier.
- Server-side data breaches (only encrypted data is stored).
- Accidental loss of 2FA credentials.

---

## Design Decisions

- Chose a browser extension for fast desktop access during authentication flows.
- Implemented client-side encryption to minimize server trust.
- Prioritized usability to reduce common 2FA user errors.

---

## Why a Desktop Authenticator?

- Faster access during desktop workflows.
- Offline support.
- No dependency on a mobile device.
- Useful for development and power users.

---

## Tech Stack

- **Frontend:** JavaScript, HTML, CSS  
- **Backend:** Flask, Python
- **Platform:** Chrome Extension

---

## Installation

Available on the [Chrome Web Store](https://chromewebstore.google.com/detail/authenticator-for-pc/ppkkcfblhfgmdmefkmkoomenhgecbemi?authuser=0&hl=en).

1. Visit the Chrome Web Store
2. Search for **PC Authenticator**
3. Click **Add to Chrome**
4. Open the extension and start adding your 2FA accounts!

---

## Future Improvements

- Password-based key derivation (Argon2)
- Optional local-only mode without cloud backup
- Hardware-backed storage where available
- Firefox-Edge support
- Exporting codes to another app

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Contact

For bug reports, feedback, collaborations, or feature suggestions, reach out via GitHub issues or email:  
`chrisevlidis.main@gmail.com`.

---

**If you find PC Authenticator useful, give the repo a star to support the project!**
