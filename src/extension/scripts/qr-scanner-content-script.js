/**
 * QR Scanner Content Script
 * 
 * This content script provides the QR code selection interface on web pages.
 * It creates a snipping tool overlay that allows users to select QR code areas
 * for scanning and processing.
 * 
 * Key Responsibilities:
 * - Create and manage the snipping tool overlay
 * - Handle mouse events for area selection
 * - Capture and process selected image data
 * - Communicate with the service worker for screenshot capture
 * - Send processed QR data back to the popup
 * 
 * @author PC Authenticator Extension
 * @version 1.0.0
 */

// Prevent duplicate script execution
if (!window.qrScannerContentScriptLoaded) {
    // Mark script as loaded
    window.qrScannerContentScriptLoaded = true;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Logging utility for content script
 * @param {string} level - Log level (info, error, warn, debug)
 * @param {string} message - Log message
 * @param {Object|null} data - Additional data to log
 */
function log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[QR-Scanner Content Script ${level.toUpperCase()}] ${timestamp}: ${message}`;
    
    if (data) {
        console.log(logMessage, data);
    } else {
        console.log(logMessage);
    }
    
    // Also send to service worker for centralized logging
    try {
        chrome.runtime.sendMessage({
            action: 'log',
            level: level,
            message: message,
            data: data,
            timestamp: timestamp
        });
    } catch (e) {
        // Ignore logging errors to prevent breaking the main functionality
    }
}

// ============================================================================
// SNIPPING TOOL CLASS
// ============================================================================

/**
 * SnippingTool class for QR code area selection
 * 
 * This class creates an overlay on the webpage that allows users to select
 * a rectangular area containing a QR code. The selected area is then
 * processed and sent to the popup for QR code scanning.
 */
class SnippingTool {
    /**
     * Constructor for SnippingTool
     * Initializes the tool with default state
     */
    constructor() {
        /** @type {HTMLElement|null} Overlay element covering the entire page */
        this.overlay = null;
        
        /** @type {HTMLElement|null} Selection box showing the selected area */
        this.selectionBox = null;
        
        /** @type {number} Starting X coordinate of selection */
        this.startX = 0;
        
        /** @type {number} Starting Y coordinate of selection */
        this.startY = 0;
        
        /** @type {boolean} Flag indicating if user is currently selecting */
        this.isSelecting = false;
        
        log('info', 'SnippingTool constructor called');
    }


    /**
     * Create the overlay and selection interface
     * Sets up the visual elements and event listeners for area selection
     */
    createOverlay() {
        try {
            log('info', 'Creating overlay for QR code selection');
            
            // Create the main overlay element
            this.overlay = document.createElement('div');
            this.overlay.style.position = 'fixed';
            this.overlay.style.top = '0';
            this.overlay.style.left = '0';
            this.overlay.style.width = '100%';
            this.overlay.style.height = '100%';
            this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Darker overlay
            this.overlay.style.zIndex = '2147483647'; // Maximum z-index
            
            // Set blue plus sign cursor
            this.overlay.style.cursor = 'url("data:image/svg+xml;charset=utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'><line x1=\'10\' y1=\'2\' x2=\'10\' y2=\'18\' stroke=\'%234285f4\' stroke-width=\'1\'/><line x1=\'2\' y1=\'10\' x2=\'18\' y2=\'10\' stroke=\'%234285f4\' stroke-width=\'1\'/></svg>") 10 10, crosshair';

            // Create the selection box element
            this.selectionBox = document.createElement('div');
            this.selectionBox.style.position = 'absolute';
            this.selectionBox.style.border = '2px solid #4285f4';
            this.selectionBox.style.backgroundColor = 'transparent';
            this.selectionBox.style.display = 'none';
            this.selectionBox.style.pointerEvents = 'none'; // Allow clicks to pass through

            // Create instruction text
            const instructionText = document.createElement('div');
            instructionText.style.position = 'absolute';
            instructionText.style.top = '20px';
            instructionText.style.left = '50%';
            instructionText.style.transform = 'translateX(-50%)';
            instructionText.style.color = 'white';
            instructionText.style.fontSize = '16px';
            instructionText.style.fontWeight = 'bold';
            instructionText.style.textAlign = 'center';
            instructionText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            instructionText.style.padding = '10px 20px';
            instructionText.style.borderRadius = '8px';
            instructionText.style.zIndex = '2147483648';
            instructionText.style.fontFamily = 'Arial, sans-serif';
            instructionText.textContent = 'Select the QR code area';

            // Add elements to overlay
            this.overlay.appendChild(this.selectionBox);
            this.overlay.appendChild(instructionText);
            
            // Add overlay to page
            document.body.appendChild(this.overlay);

            log('info', 'Overlay and selection box created and added to DOM');

            // Set up event listeners for mouse interactions
            this.overlay.addEventListener('mousedown', this.startSelection.bind(this));
            this.overlay.addEventListener('mousemove', this.updateSelection.bind(this));
            this.overlay.addEventListener('mouseup', this.endSelection.bind(this));
            this.overlay.addEventListener('keydown', this.handleKeyDown.bind(this));

            log('info', 'Event listeners added to overlay');

            // Notify service worker to keep popup open during scanning
            chrome.runtime.sendMessage({ action: 'keepPopupOpen' }, (response) => {
                if (chrome.runtime.lastError) {
                    log('error', 'Failed to notify service worker', chrome.runtime.lastError);
                } else {
                    log('info', 'Service worker notified to keep popup open');
                }
            });
        } catch (error) {
            log('error', 'Failed to create overlay', error);
            throw error;
        }
    }

    /**
     * Handle mouse down event - start selection
     * @param {MouseEvent} e - Mouse event
     */
    startSelection(e) {
        try {
            log('info', 'Starting selection', { x: e.clientX, y: e.clientY });
            
            // Prevent the click from propagating to the page
            e.preventDefault();
            e.stopPropagation();
            
            // Initialize selection state
            this.isSelecting = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
            
            // Show and position the selection box
            this.selectionBox.style.display = 'block';
            this.selectionBox.style.left = this.startX + 'px';
            this.selectionBox.style.top = this.startY + 'px';
            this.selectionBox.style.width = '0';
            this.selectionBox.style.height = '0';
            
            // Reset clip-path for new selection
            this.overlay.style.clipPath = 'none';
            
            // Remove any existing selection overlay
            const existingOverlay = this.overlay.querySelector('.selection-overlay');
            if (existingOverlay) {
                existingOverlay.remove();
            }
            
            log('info', 'Selection started successfully');
        } catch (error) {
            log('error', 'Failed to start selection', error);
            this.cleanup();
            return;
        }
    }

    /**
     * Handle mouse move event - update selection box
     * @param {MouseEvent} e - Mouse event
     */
    updateSelection(e) {
        if (!this.isSelecting) return;

        try {
            // Calculate selection dimensions
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            const absWidth = Math.abs(width);
            const absHeight = Math.abs(height);
            const left = width < 0 ? e.clientX : this.startX;
            const top = height < 0 ? e.clientY : this.startY;

            // Update selection box appearance
            this.selectionBox.style.width = absWidth + 'px';
            this.selectionBox.style.height = absHeight + 'px';
            this.selectionBox.style.left = left + 'px';
            this.selectionBox.style.top = top + 'px';

            // Create window effect by cutting out the selection area from the overlay
            if (absWidth > 0 && absHeight > 0) {
                const clipPath = `polygon(0% 0%, 0% 100%, ${left}px 100%, ${left}px ${top}px, ${left + absWidth}px ${top}px, ${left + absWidth}px ${top + absHeight}px, ${left}px ${top + absHeight}px, ${left}px 100%, 100% 100%, 100% 0%)`;
                this.overlay.style.clipPath = clipPath;
                
                // Create an invisible overlay over the selection area to maintain cursor and drag functionality
                const selectionOverlay = document.createElement('div');
                selectionOverlay.className = 'selection-overlay';
                selectionOverlay.style.position = 'absolute';
                selectionOverlay.style.left = left + 'px';
                selectionOverlay.style.top = top + 'px';
                selectionOverlay.style.width = absWidth + 'px';
                selectionOverlay.style.height = absHeight + 'px';
                selectionOverlay.style.backgroundColor = 'transparent';
                selectionOverlay.style.cursor = 'url("data:image/svg+xml;charset=utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'20\' height=\'20\' viewBox=\'0 0 20 20\'><line x1=\'10\' y1=\'2\' x2=\'10\' y2=\'18\' stroke=\'%234285f4\' stroke-width=\'1\'/><line x1=\'2\' y1=\'10\' x2=\'18\' y2=\'10\' stroke=\'%234285f4\' stroke-width=\'1\'/></svg>") 10 10, crosshair';
                selectionOverlay.style.pointerEvents = 'auto';
                selectionOverlay.style.zIndex = '2147483649';
                
                // Remove any existing selection overlay
                const existingOverlay = this.overlay.querySelector('.selection-overlay');
                if (existingOverlay) {
                    existingOverlay.remove();
                }
                
                this.overlay.appendChild(selectionOverlay);
            }
        } catch (error) {
            log('error', 'Failed to update selection', error);
            this.cleanup();
            return;
        }
    }

    /**
     * Handle mouse up event - complete selection and process
     * @param {MouseEvent} e - Mouse event
     */
    async endSelection(e) {
        if (!this.isSelecting) return;
        this.isSelecting = false;

        try {
            // Calculate final selection coordinates
            const selection = {
                x: Math.min(this.startX, e.clientX),
                y: Math.min(this.startY, e.clientY),
                width: Math.abs(e.clientX - this.startX),
                height: Math.abs(e.clientY - this.startY)
            };

            log('info', 'Selection completed', selection);

            // Request screenshot from service worker
            log('info', 'Requesting tab screenshot from service worker');
            const response = await chrome.runtime.sendMessage({ action: 'captureTab' });
            if (!response || !response.imageData) {
                throw new Error('Failed to capture tab');
            }
            
            log('info', 'Screenshot received, processing image');
            
            // Process the screenshot to extract selected area
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = response.imageData;
            });
            
            // Create canvas for image processing
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions to match the selection
            canvas.width = selection.width;
            canvas.height = selection.height;
            
            log('info', 'Drawing selected area to canvas', { 
                canvasWidth: canvas.width, 
                canvasHeight: canvas.height 
            });
            
            // Draw the selected portion of the screenshot
            ctx.drawImage(
                img,
                selection.x,
                selection.y,
                selection.width,
                selection.height,
                0,
                0,
                selection.width,
                selection.height
            );
            
            // Extract image data for QR code processing
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const uint8Array = new Uint8ClampedArray(imageData.data);
            
            log('info', 'Image data extracted, sending to popup', { 
                dataSize: uint8Array.length,
                width: canvas.width,
                height: canvas.height
            });
            
            // Send the processed image data to the popup for QR code scanning
            chrome.runtime.sendMessage({
                action: 'scanQRCode',
                imageData: Array.from(uint8Array), // Convert to regular array for message passing
                width: canvas.width,
                height: canvas.height
            }, (response) => {
                if (chrome.runtime.lastError) {
                    log('error', 'Failed to send QR data to popup', chrome.runtime.lastError);
                } else {
                    log('info', 'QR data sent to popup successfully');
                }
            });

            // Clean up the overlay
            this.cleanup();
        } catch (error) {
            log('error', 'Failed to process selection', error);
            
            // Send error message to popup
            chrome.runtime.sendMessage({
                action: 'qrCodeError',
                error: error.message || 'Unknown error'
            }, (response) => {
                if (chrome.runtime.lastError) {
                    log('error', 'Failed to send error message', chrome.runtime.lastError);
                }
            });
            
            this.cleanup();
        }
    }

    /**
     * Handle keyboard events
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyDown(e) {
        if (e.key === 'Escape') {
            log('info', 'Escape key pressed, cleaning up');
            this.cleanup();
        }
    }

    /**
     * Clean up the overlay and reset state
     * Removes the overlay from the page and notifies service worker
     */
    cleanup() {
        if (this.overlay) {
            log('info', 'Cleaning up snipping tool overlay');
            
            // Remove overlay from page
            this.overlay.remove();
            this.overlay = null;
            this.selectionBox = null;
            
            // Notify service worker that scanning is complete
            chrome.runtime.sendMessage({ action: 'scanningComplete' }, (response) => {
                if (chrome.runtime.lastError) {
                    log('error', 'Failed to notify scanning complete', chrome.runtime.lastError);
                } else {
                    log('info', 'Service worker notified of scanning completion');
                }
            });
        }
    }
}

// ============================================================================
// MESSAGE HANDLING
// ============================================================================

/**
 * Initialize the QR scanner content script
 * Sets up message listeners and prepares for QR scanning
 */
function initializeQRScanner() {
    console.log('[QR-Scanner Content Script] Initializing QR scanner content script');
    log('info', 'Initializing QR scanner content script');
    
    // Test communication with service worker
    console.log('[QR-Scanner Content Script] Testing message sending capability...');
    try {
        chrome.runtime.sendMessage({ action: 'test', message: 'Content script is working!' }, (response) => {
            if (chrome.runtime.lastError) {
                // Silently ignore test message errors
            } else {
                console.log('[QR-Scanner Content Script] Test message sent successfully');
            }
        });
    } catch (error) {
        // Silently ignore test message errors
    }
    
    // Set up message listener for popup communication
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('[QR-Scanner Content Script] Content script received message:', message.action);
        log('info', `Content script received message: ${message.action}`);
        
        if (message.action === 'ping') {
            // Respond to ping to indicate content script is loaded
            sendResponse({ loaded: true });
        } else if (message.action === 'startQRScan') {
            try {
                console.log('[QR-Scanner Content Script] Starting QR scan - creating snipping tool');
                log('info', 'Starting QR scan - creating snipping tool');
                
                // Create and activate the snipping tool
                const snippingTool = new SnippingTool();
                snippingTool.createOverlay();
                
                console.log('[QR-Scanner Content Script] Snipping tool created successfully');
                log('info', 'Snipping tool created successfully');
                
                // Send success response back to popup
                sendResponse({ success: true });
            } catch (error) {
                console.error('[QR-Scanner Content Script] Failed to create snipping tool:', error);
                log('error', 'Failed to create snipping tool', error);
                
                // Send error response back to popup
                sendResponse({ 
                    success: false, 
                    error: error.message || 'Unknown error'
                });
            }
        }
        return true; // Keep message channel open for async response
    });
    
    console.log('[QR-Scanner Content Script] Message listener added successfully');
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize the content script
 * Logs startup and begins QR scanner setup
 */
function initializeContentScript() {
    console.log('[QR-Scanner Content Script] Initializing content script');
    log('info', 'Content script loaded and initializing');
    
    // Initialize the QR scanner functionality
    initializeQRScanner();
    
    log('info', 'Content script initialization complete');
}

    // Start the content script
    initializeContentScript();
}
