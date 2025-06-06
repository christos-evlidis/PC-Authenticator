// Initialize message listener
function initializeMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        
        if (message.action === 'startQRScan') {
            try {
                const snippingTool = new SnippingTool();
                snippingTool.createOverlay();
                sendResponse({ success: true });
            } catch (error) {
                sendResponse({ 
                    success: false, 
                    error: ''
                });
            }
        }
        return true;
    });
}

class SnippingTool {
    constructor() {
        this.overlay = null;
        this.selectionBox = null;
        this.startX = 0;
        this.startY = 0;
        this.isSelecting = false;
    }

    createOverlay() {
        try {
            // Create overlay element
            this.overlay = document.createElement('div');
            this.overlay.style.position = 'fixed';
            this.overlay.style.top = '0';
            this.overlay.style.left = '0';
            this.overlay.style.width = '100%';
            this.overlay.style.height = '100%';
            this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            this.overlay.style.zIndex = '2147483647';
            this.overlay.style.cursor = 'crosshair';

            // Create selection box
            this.selectionBox = document.createElement('div');
            this.selectionBox.style.position = 'absolute';
            this.selectionBox.style.border = '2px solid #4285f4';
            this.selectionBox.style.backgroundColor = 'rgba(66, 133, 244, 0.1)';
            this.selectionBox.style.display = 'none';

            this.overlay.appendChild(this.selectionBox);
            document.body.appendChild(this.overlay);

            // Add event listeners
            this.overlay.addEventListener('mousedown', this.startSelection.bind(this));
            this.overlay.addEventListener('mousemove', this.updateSelection.bind(this));
            this.overlay.addEventListener('mouseup', this.endSelection.bind(this));
            this.overlay.addEventListener('keydown', this.handleKeyDown.bind(this));

            // Notify background script to keep popup open
            chrome.runtime.sendMessage({ action: 'keepPopupOpen' });
        } catch (error) {
            return;
        }
    }

    startSelection(e) {
        try {
            // Prevent the click from propagating to the page
            e.preventDefault();
            e.stopPropagation();
            
            this.isSelecting = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
            this.selectionBox.style.display = 'block';
            this.selectionBox.style.left = this.startX + 'px';
            this.selectionBox.style.top = this.startY + 'px';
            this.selectionBox.style.width = '0';
            this.selectionBox.style.height = '0';
        } catch (error) {
            this.cleanup();
            return;
        }
    }

    updateSelection(e) {
        if (!this.isSelecting) return;

        try {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;

            this.selectionBox.style.width = Math.abs(width) + 'px';
            this.selectionBox.style.height = Math.abs(height) + 'px';
            this.selectionBox.style.left = (width < 0 ? e.clientX : this.startX) + 'px';
            this.selectionBox.style.top = (height < 0 ? e.clientY : this.startY) + 'px';
        } catch (error) {
            this.cleanup();
            return;
        }
    }

    async endSelection(e) {
        if (!this.isSelecting) return;
        this.isSelecting = false;

        try {
            const selection = {
                x: Math.min(this.startX, e.clientX),
                y: Math.min(this.startY, e.clientY),
                width: Math.abs(e.clientX - this.startX),
                height: Math.abs(e.clientY - this.startY)
            };

            // Get the screenshot from background script
            const response = await chrome.runtime.sendMessage({ action: 'captureTab' });
            if (!response || !response.imageData) {
                throw new Error('Failed to capture tab');
            }
            
            // Process the image
            const img = new Image();
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = response.imageData;
            });
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions to match the selection
            canvas.width = selection.width;
            canvas.height = selection.height;
            
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
            
            // Get image data and convert to Uint8ClampedArray
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const uint8Array = new Uint8ClampedArray(imageData.data);
            
            // Send the image data to the popup for QR code scanning
            chrome.runtime.sendMessage({
                action: 'scanQRCode',
                imageData: Array.from(uint8Array), // Convert to regular array for message passing
                width: canvas.width,
                height: canvas.height
            });

            // Clean up after sending the data
            this.cleanup();
        } catch (error) {
            chrome.runtime.sendMessage({
                action: 'qrCodeError',
                error: ''
            });
            this.cleanup();
        }
    }

    handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.cleanup();
        }
    }

    cleanup() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
            this.selectionBox = null;
            // Notify background script that scanning is complete
            chrome.runtime.sendMessage({ action: 'scanningComplete' });
        }
    }
}

// Initialize the content script
initializeMessageListener(); 