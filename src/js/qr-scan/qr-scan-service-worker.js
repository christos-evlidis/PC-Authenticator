importScripts('../../libs/jsQR.js');

self.QrScan = {
    PENDING_KEY: 'qrScanPending',

    async getPending() {
        const stored = await chrome.storage.session.get([this.PENDING_KEY]);
        return stored[this.PENDING_KEY] ?? null;
    },

    async setPending(payload) {
        await chrome.storage.session.set({ [this.PENDING_KEY]: payload });
    },

    async clearPending() {
        await chrome.storage.session.remove([this.PENDING_KEY]);
    },

    async getActiveTab() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        return tab ?? null;
    },

    isScannableTab(tab) {
        if (!tab?.id || !tab.url) {
            return false;
        }

        return !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://');
    },

    async injectSelectionOverlay(tabId) {
        await chrome.scripting.insertCSS({
            target: { tabId },
            files: ['css/qr-scan/qr-scan-overlay.css']
        }).catch(() => {});

        await chrome.scripting.executeScript({
            target: { tabId },
            files: ['js/qr-scan/qr-scan-content-script.js']
        }).catch(() => {});
    },

    messageTab(tabId, action) {
        return chrome.tabs.sendMessage(tabId, { action });
    },

    captureVisibleTab() {
        return new Promise((resolve, reject) => {
            chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                resolve(dataUrl);
            });
        });
    },

    decodeRegion(imageData, width, height) {
        if (typeof jsQR !== 'function') {
            throw new Error('QR decoder is unavailable.');
        }

        const pixels = imageData instanceof Uint8ClampedArray
            ? imageData
            : new Uint8ClampedArray(imageData);

        return jsQR(pixels, width, height);
    },

    notifyPopupCancelled() {
        chrome.runtime.sendMessage({ action: 'qrScanCancelled' }).catch(() => {});
    },

    async reopenPopup() {
        try {
            await chrome.action.openPopup();
        } catch {
            // Pending result stays until the user opens the popup.
        }
    },

    async storeScanFailure(message) {
        await this.setPending({
            status: 'error',
            message: message || 'Failed to scan QR code.'
        });
        await this.reopenPopup();
    },

    async storeScanSuccess(uri) {
        await this.setPending({
            status: 'ready',
            uri
        });
        await this.reopenPopup();
    },

    async handleStartScan() {
        const tab = await this.getActiveTab();

        if (!tab?.id) {
            throw new Error('No active tab found.');
        }

        if (!this.isScannableTab(tab)) {
            throw new Error('Open a normal website with the QR code, then try again.');
        }

        await this.injectSelectionOverlay(tab.id);

        const response = await this.messageTab(tab.id, 'startQRScan');

        if (!response?.success) {
            throw new Error(response?.error || 'Could not start QR selection.');
        }

        return { success: true };
    },

    async handleCaptureTab() {
        const imageData = await this.captureVisibleTab();
        return { imageData };
    },

    async handleScanSelection(message) {
        try {
            if (message.error) {
                throw new Error(message.error);
            }

            const width = Number(message.width);
            const height = Number(message.height);

            if (!width || !height || !Array.isArray(message.imageData)) {
                throw new Error('Invalid scan image data.');
            }

            const result = this.decodeRegion(message.imageData, width, height);

            if (!result?.data) {
                await this.storeScanFailure('No QR code found in the selected area.');
            } else {
                await this.storeScanSuccess(result.data);
            }

            return { success: true };
        } catch (error) {
            await this.storeScanFailure(error?.message);
            return { success: false, error: error?.message };
        }
    },

    async handleAbortSelection(options = {}) {
        const { removeTabOverlay = false } = options;

        if (removeTabOverlay) {
            const tab = await this.getActiveTab();

            if (tab?.id) {
                await this.messageTab(tab.id, 'cancelQRScan').catch(() => {});
            }
        }

        await this.clearPending();
        this.notifyPopupCancelled();

        return { success: true };
    }
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    const { action } = message;

    if (action === 'qrScanCancelled') {
        self.QrScan.handleAbortSelection({ removeTabOverlay: false });
        return false;
    }

    const asyncActions = {
        startQrScan: () => self.QrScan.handleStartScan(),
        captureTab: () => self.QrScan.handleCaptureTab(),
        scanQRCode: () => self.QrScan.handleScanSelection(message),
        getQrScanPending: async () => self.QrScan.getPending(),
        clearQrScanPending: async () => {
            await self.QrScan.clearPending();
            return { success: true };
        },
        cancelQrScan: () => self.QrScan.handleAbortSelection({ removeTabOverlay: true })
    };

    const run = asyncActions[action];

    if (!run) {
        return false;
    }

    run()
        .then((result) => sendResponse(result ?? { success: true }))
        .catch((error) => {
            if (action === 'captureTab') {
                sendResponse({ error: error?.message || 'Failed to capture tab.' });
                return;
            }

            sendResponse({
                success: false,
                error: error?.message || 'QR scan failed.'
            });
        });

    return true;
});
