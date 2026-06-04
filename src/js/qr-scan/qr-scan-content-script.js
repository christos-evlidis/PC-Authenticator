(() => {
    if (window.pcAuthQrScanLoaded) {
        return;
    }

    window.pcAuthQrScanLoaded = true;

    const OVERLAY_HOST_CLASS = 'pc-auth-qr-scan-host';
    const OVERLAY_CSS_PATH = 'css/qr-scan/qr-scan-overlay.css';

    let activeSnip = null;

    function bodyHasOverlayStackingContext() {
        if (!document.body) {
            return false;
        }

        const style = getComputedStyle(document.body);

        return (
            style.transform !== 'none'
            || style.filter !== 'none'
            || style.perspective !== 'none'
            || style.isolation === 'isolate'
            || style.willChange.includes('transform')
            || style.willChange.includes('filter')
        );
    }

    function getOverlayMountParent() {
        return bodyHasOverlayStackingContext()
            ? document.documentElement
            : document.body;
    }

    function removeOverlayHostElement() {
        document.querySelector(`.${OVERLAY_HOST_CLASS}`)?.remove();
    }

    function createOverlayHost() {
        const host = document.createElement('div');
        host.className = OVERLAY_HOST_CLASS;
        host.style.cssText = [
            'position: fixed !important',
            'inset: 0 !important',
            'width: 100% !important',
            'height: 100% !important',
            'z-index: 2147483647 !important',
            'pointer-events: none !important',
            'margin: 0 !important',
            'padding: 0 !important',
            'border: none !important',
            'background: transparent !important'
        ].join(';');

        const shadow = host.attachShadow({ mode: 'closed' });
        const stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = chrome.runtime.getURL(OVERLAY_CSS_PATH);
        shadow.append(stylesheet);
        getOverlayMountParent().append(host);

        return { host, shadow };
    }

    function removeSnipOverlay({ notifyCancel = false } = {}) {
        if (activeSnip?.overlay) {
            activeSnip.overlay.removeEventListener('pointerdown', activeSnip.onPointerDown);
            activeSnip.overlay.removeEventListener('pointermove', activeSnip.onPointerMove);
            activeSnip.overlay.removeEventListener('pointerup', activeSnip.onPointerUp);
            activeSnip.overlay.removeEventListener('pointercancel', activeSnip.onPointerUp);
            window.removeEventListener('keydown', activeSnip.onKeyDown, true);
            activeSnip = null;
        }

        removeOverlayHostElement();

        if (notifyCancel) {
            chrome.runtime.sendMessage({ action: 'qrScanCancelled' }).catch(() => {});
        }
    }

    class SnippingTool {
        constructor() {
            this.host = null;
            this.overlay = null;
            this.selectionBox = null;
            this.startX = 0;
            this.startY = 0;
            this.isSelecting = false;
            this.onPointerDown = this.onPointerDown.bind(this);
            this.onPointerMove = this.onPointerMove.bind(this);
            this.onPointerUp = this.onPointerUp.bind(this);
            this.onKeyDown = this.onKeyDown.bind(this);
        }

        createOverlay() {
            const { host, shadow } = createOverlayHost();
            this.host = host;

            this.overlay = document.createElement('div');
            this.overlay.className = 'pc-auth-qr-scan-overlay';

            this.selectionBox = document.createElement('div');
            this.selectionBox.className = 'pc-auth-qr-scan-selection';

            const instruction = document.createElement('div');
            instruction.className = 'pc-auth-qr-scan-instruction';
            instruction.textContent = 'Drag your mouse over the QR code to select and scan it. Press ESC to cancel.';

            this.overlay.append(this.selectionBox, instruction);
            shadow.append(this.overlay);

            this.overlay.addEventListener('pointerdown', this.onPointerDown);
            this.overlay.addEventListener('pointermove', this.onPointerMove);
            this.overlay.addEventListener('pointerup', this.onPointerUp);
            this.overlay.addEventListener('pointercancel', this.onPointerUp);
            window.addEventListener('keydown', this.onKeyDown, true);
        }

        onPointerDown(event) {
            if (event.button !== 0) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            this.isSelecting = true;
            this.startX = event.clientX;
            this.startY = event.clientY;

            this.selectionBox.style.display = 'block';
            this.selectionBox.style.left = `${this.startX}px`;
            this.selectionBox.style.top = `${this.startY}px`;
            this.selectionBox.style.width = '0';
            this.selectionBox.style.height = '0';
            this.overlay.style.clipPath = 'none';

            try {
                this.overlay.setPointerCapture(event.pointerId);
            } catch {
                // setPointerCapture unavailable
            }
        }

        onPointerMove(event) {
            if (!this.isSelecting) {
                return;
            }

            this.updateSelection(event.clientX, event.clientY);
        }

        async onPointerUp(event) {
            if (!this.isSelecting) {
                return;
            }

            this.isSelecting = false;

            if (this.overlay?.hasPointerCapture?.(event.pointerId)) {
                this.overlay.releasePointerCapture(event.pointerId);
            }

            const selection = {
                x: Math.min(this.startX, event.clientX),
                y: Math.min(this.startY, event.clientY),
                width: Math.abs(event.clientX - this.startX),
                height: Math.abs(event.clientY - this.startY)
            };

            try {
                const response = await chrome.runtime.sendMessage({ action: 'captureTab' });

                if (!response?.imageData) {
                    throw new Error(response?.error || 'Failed to capture the page.');
                }

                const img = new Image();
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = () => reject(new Error('Failed to load screenshot.'));
                    img.src = response.imageData;
                });

                const dpr = window.devicePixelRatio || 1;
                const sx = Math.round(selection.x * dpr);
                const sy = Math.round(selection.y * dpr);
                const sw = Math.round(selection.width * dpr);
                const sh = Math.round(selection.height * dpr);

                const canvas = document.createElement('canvas');
                canvas.width = sw;
                canvas.height = sh;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

                const imageData = ctx.getImageData(0, 0, sw, sh);

                await chrome.runtime.sendMessage({
                    action: 'scanQRCode',
                    imageData: Array.from(imageData.data),
                    width: sw,
                    height: sh
                });
            } catch (error) {
                await chrome.runtime.sendMessage({
                    action: 'scanQRCode',
                    error: error?.message || 'Failed to process selection.'
                });
            } finally {
                removeSnipOverlay();
            }
        }

        onKeyDown(event) {
            if (event.key !== 'Escape') {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            removeSnipOverlay({ notifyCancel: true });
        }

        updateSelection(cursorX, cursorY) {
            const width = cursorX - this.startX;
            const height = cursorY - this.startY;
            const absWidth = Math.abs(width);
            const absHeight = Math.abs(height);
            const left = width < 0 ? cursorX : this.startX;
            const top = height < 0 ? cursorY : this.startY;

            this.selectionBox.style.width = `${absWidth}px`;
            this.selectionBox.style.height = `${absHeight}px`;
            this.selectionBox.style.left = `${left}px`;
            this.selectionBox.style.top = `${top}px`;

            if (absWidth <= 0 || absHeight <= 0) {
                this.overlay.style.clipPath = 'none';
                return;
            }

            const right = left + absWidth;
            const bottom = top + absHeight;
            this.overlay.style.clipPath = `polygon(0% 0%, 0% 100%, ${left}px 100%, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px 100%, 100% 100%, 100% 0%)`;
        }
    }

    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
        if (message.action === 'ping') {
            sendResponse({ loaded: true });
            return false;
        }

        if (message.action === 'cancelQRScan') {
            removeSnipOverlay();
            sendResponse({ success: true });
            return false;
        }

        if (message.action === 'startQRScan') {
            try {
                removeSnipOverlay();
                activeSnip = new SnippingTool();
                activeSnip.createOverlay();
                sendResponse({ success: true });
            } catch (error) {
                sendResponse({
                    success: false,
                    error: error?.message || 'Could not open QR selection.'
                });
            }

            return false;
        }

        return false;
    });
})();
