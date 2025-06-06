// Get the QR code button
const scanQRButton = document.getElementById('scanQR');

// Add click handler for QR code button
scanQRButton.addEventListener('click', () => {
    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            // Inject the QR scanner script
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
            }, () => {
                if (chrome.runtime.lastError) {
                    return;
                }
                
                // Start the QR scanner
                chrome.tabs.sendMessage(tabs[0].id, { action: 'startQRScan' });
            });
        }
    });
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'imageCaptured') {
        const secretKeyInput = document.getElementById('secretKey');
        if (secretKeyInput) {
            secretKeyInput.value = message.imageData;
            secretKeyInput.dispatchEvent(new Event('input'));
        }
    }
}); 