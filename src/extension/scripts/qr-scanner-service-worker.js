/**
 * QR Scanner Service Worker
 * 
 * This service worker handles the background functionality for the QR code scanning feature.
 * It manages popup window state, captures screenshots, and routes messages between the
 * popup and content script.
 * 
 * Key Responsibilities:
 * - Popup window management (keeping it open during scanning)
 * - Screenshot capture of the current tab
 * - Message routing between popup and content script
 * - QR data storage and retrieval
 * - Window focus management
 * 
 * @author PC Authenticator Extension
 * @version 1.0.0
 */

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

/**
 * Popup window ID for tracking the extension popup
 * @type {number|null}
 */
let popupWindowId = null;

/**
 * Temporary storage for QR code image data
 * @type {Object|null}
 */
let qrData = null;

/**
 * Flag indicating if QR scanning is currently in progress
 * @type {boolean}
 */
let isScanning = false;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Logging utility for service worker
 * @param {string} level - Log level (info, error, warn, debug)
 * @param {string} message - Log message
 * @param {Object|null} data - Additional data to log
 */
function log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[QR-Scanner Service Worker ${level.toUpperCase()}] ${timestamp}: ${message}`;
    
    if (data) {
        console.log(logMessage, data);
    } else {
        console.log(logMessage);
    }
}

/**
 * Check if the popup window is currently open
 * @returns {boolean} True if popup is open, false otherwise
 */
function isPopupOpen() {
    return popupWindowId !== null;
}

// ============================================================================
// MESSAGE HANDLING
// ============================================================================

/**
 * Main message listener for the service worker
 * Handles all incoming messages from popup and content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    log('info', `Received message: ${message.action}`, { sender: sender.tab?.id });
    
    try {
        switch (message.action) {
            case 'keepPopupOpen':
                handleKeepPopupOpen();
                break;
                
            case 'scanningComplete':
                handleScanningComplete();
                break;
                
            case 'scanQRCode':
                handleScanQRCode(message);
                break;
                
            case 'getQRData':
                handleGetQRData(sendResponse);
                break;
                
            case 'captureTab':
                handleCaptureTab(sendResponse);
                return true; // Keep message channel open for async response
                
            case 'log':
                handleLogMessage(message);
                break;
                
            case 'test':
                handleTestMessage(message);
                break;
                
            default:
                log('warn', `Unknown message action: ${message.action}`);
        }
    } catch (error) {
        log('error', `Error handling message ${message.action}`, error);
    }
    return true;
});

/**
 * Handle keepPopupOpen message from content script
 * Keeps the popup window focused during QR scanning
 */
function handleKeepPopupOpen() {
    log('info', 'Keeping popup open for QR scanning');
    isScanning = true;
    
    // Get the popup window ID
    chrome.windows.getCurrent((window) => {
        popupWindowId = window.id;
        log('info', `Popup window ID: ${popupWindowId}`);
        
        // Keep the popup window focused
        chrome.windows.update(popupWindowId, { focused: true }, (result) => {
            if (chrome.runtime.lastError) {
                log('error', 'Failed to focus popup window', chrome.runtime.lastError);
            } else {
                log('info', 'Popup window focused successfully');
            }
        });
    });
}

/**
 * Handle scanningComplete message from content script
 * Marks the end of QR scanning session
 */
function handleScanningComplete() {
    log('info', 'QR scanning completed');
    isScanning = false;
}

/**
 * Handle scanQRCode message from content script
 * Stores QR code image data and reopens popup
 * @param {Object} message - Message containing QR code data
 */
function handleScanQRCode(message) {
    log('info', 'Storing QR code data', { 
        width: message.width, 
        height: message.height,
        dataSize: message.imageData?.length 
    });
    
    // Store the QR code data
    qrData = {
        imageData: message.imageData,
        width: message.width,
        height: message.height
    };
    
    // Reopen the popup to process the QR data
    chrome.action.openPopup(() => {
        if (chrome.runtime.lastError) {
            log('error', 'Failed to reopen popup', chrome.runtime.lastError);
        } else {
            log('info', 'Popup reopened successfully');
        }
    });
}

/**
 * Handle getQRData message from popup
 * Returns stored QR code data and clears it
 * @param {Function} sendResponse - Response callback
 */
function handleGetQRData(sendResponse) {
    log('info', 'Sending QR data to popup', { hasData: !!qrData });
    sendResponse(qrData);
    qrData = null; // Clear the data after sending
}

/**
 * Handle captureTab message from content script
 * Captures a screenshot of the current tab
 * @param {Function} sendResponse - Response callback
 */
function handleCaptureTab(sendResponse) {
    log('info', 'Capturing tab screenshot');
    
    chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
        if (chrome.runtime.lastError) {
            log('error', 'Failed to capture tab', chrome.runtime.lastError);
            sendResponse({ error: chrome.runtime.lastError.message });
        } else {
            log('info', 'Tab screenshot captured successfully', { dataUrlLength: dataUrl?.length });
            sendResponse({ imageData: dataUrl });
        }
    });
}

/**
 * Handle log message from content script
 * Forwards log messages to console
 * @param {Object} message - Log message from content script
 */
function handleLogMessage(message) {
    console.log(`[Content Script ${message.level.toUpperCase()}] ${message.timestamp}: ${message.message}`, message.data);
}

/**
 * Handle test message from content script
 * Confirms content script communication is working
 * @param {Object} message - Test message from content script
 */
function handleTestMessage(message) {
    log('info', `Test message from content script: ${message.message}`);
}

// ============================================================================
// WINDOW EVENT HANDLERS
// ============================================================================

/**
 * Handle window focus changes
 * Keeps popup focused during QR scanning if focus moves away
 */
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (popupWindowId && windowId !== popupWindowId && isScanning) {
        log('info', `Focus changed from popup (${popupWindowId}) to window ${windowId}, refocusing popup`);
        
        // If focus moves away from popup during scanning, bring it back
        chrome.windows.update(popupWindowId, { focused: true }, (result) => {
            if (chrome.runtime.lastError) {
                log('error', 'Failed to refocus popup window', chrome.runtime.lastError);
            } else {
                log('info', 'Popup window refocused successfully');
            }
        });
    }
});

/**
 * Handle window removal (popup closed)
 * Resets popup state when popup is closed
 */
chrome.windows.onRemoved.addListener((windowId) => {
    if (popupWindowId === windowId) {
        log('info', `Popup window ${windowId} was closed`);
        popupWindowId = null;
        isScanning = false;
    }
});

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the service worker
 * Logs startup and sets up initial state
 */
function initializeServiceWorker() {
    log('info', 'QR Scanner Service Worker initialized');
    log('info', 'Ready to handle QR scanning requests');
}

// Start the service worker
initializeServiceWorker();
