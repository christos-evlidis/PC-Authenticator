let popupWindowId = null;
let qrData = null;
let isScanning = false;

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'keepPopupOpen') {
        isScanning = true;
        // Get the popup window ID
        chrome.windows.getCurrent((window) => {
            popupWindowId = window.id;
            // Keep the popup window focused
            chrome.windows.update(popupWindowId, { focused: true });
        });
    } else if (message.action === 'scanningComplete') {
        isScanning = false;
    } else if (message.action === 'scanQRCode') {
        // Store the QR code data
        qrData = {
            imageData: message.imageData,
            width: message.width,
            height: message.height
        };
        
        // Reopen the popup
        chrome.action.openPopup(() => {
            if (chrome.runtime.lastError) {
                return;
            }
            // No need to refocus the popup, Chrome does this automatically.
        });
    } else if (message.action === 'getQRData') {
        // Send the stored QR data to the popup
        sendResponse(qrData);
        qrData = null; // Clear the data after sending
    }
    return true;
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (popupWindowId && windowId !== popupWindowId && isScanning) {
        // If focus moves away from popup during scanning, bring it back
        chrome.windows.update(popupWindowId, { focused: true });
    }
});

// Listen for messages from the popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'captureTab') {
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
            sendResponse({ imageData: dataUrl });
        });
        return true; // Keep the message channel open for the async response
    }
}); 