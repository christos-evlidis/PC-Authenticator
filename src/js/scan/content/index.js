import { scanScreenshotCapture } from "./capture/scan-screenshot-capture.js";
import { OVERLAY_HOST_CLASS } from "../scan-constants.js";
import { QR_SCAN_MESSAGES } from "../scan-constants.js";
import { scanOverlayCreate } from "./overlay/scan-overlay-create.js";
import { scanContentListenersRegister } from "./scan-listeners.js";

const SCAN_DYNAMIC_STYLE_ID = "pc-auth-qr-scan-dynamic-styles";

const activeSession = {
  teardown: null,
};

/** Tears down selection listeners and removes the overlay from the page. */
function scanOverlayRemove({ notifyCancel = false } = {}) {
  activeSession.teardown?.();
  activeSession.teardown = null;
  document.querySelector(`.${OVERLAY_HOST_CLASS}`)?.remove();

  if (notifyCancel) {
    chrome.runtime.sendMessage({ action: QR_SCAN_MESSAGES.CANCELLED_EVENT });
  }
}

/** Opens the selection overlay and begins listening for user input. */
function scanOverlayStart() {
  scanOverlayRemove();

  const { overlay, selectionBox } = scanOverlayCreate();
  const shadow = overlay.getRootNode();
  let startX = 0;
  let startY = 0;
  let isSelecting = false;

  const onCancel = () => scanOverlayRemove({ notifyCancel: true });

  const onComplete = async (selection) => {
    try {
      const cropped = await scanScreenshotCapture(selection);

      await chrome.runtime.sendMessage({
        action: QR_SCAN_MESSAGES.SCAN_QR_CODE,
        imageData: cropped.imageData,
        width: cropped.width,
        height: cropped.height,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "QR scanning cannot run on this page. Open a normal website tab and try again.";

      await chrome.runtime.sendMessage({
        action: QR_SCAN_MESSAGES.SCAN_QR_CODE,
        error: message,
      });
    }

    scanOverlayRemove();
  };

  const onPointerDown = (event) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    isSelecting = true;
    startX = event.clientX;
    startY = event.clientY;

    selectionBox.classList.add("is-selecting");
    overlay.classList.remove("is-dimmed");

    let styleEl = shadow.getElementById(SCAN_DYNAMIC_STYLE_ID);

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = SCAN_DYNAMIC_STYLE_ID;
      shadow.append(styleEl);
    }

    styleEl.textContent = `
      .pc-auth-qr-scan-selection.is-selecting {
        display: block;
        left: ${startX}px;
        top: ${startY}px;
        width: 0px;
        height: 0px;
      }
      .pc-auth-qr-scan-overlay.is-dimmed {
        clip-path: none;
      }
    `;

    overlay.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isSelecting) {
      return;
    }

    const cursorX = event.clientX;
    const cursorY = event.clientY;
    const width = cursorX - startX;
    const height = cursorY - startY;
    const absWidth = Math.abs(width);
    const absHeight = Math.abs(height);
    const left = width < 0 ? cursorX : startX;
    const top = height < 0 ? cursorY : startY;

    let styleEl = shadow.getElementById(SCAN_DYNAMIC_STYLE_ID);

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = SCAN_DYNAMIC_STYLE_ID;
      shadow.append(styleEl);
    }

    if (absWidth <= 0 || absHeight <= 0) {
      overlay.classList.remove("is-dimmed");
      styleEl.textContent = `
        .pc-auth-qr-scan-selection.is-selecting {
          display: block;
          left: ${left}px;
          top: ${top}px;
          width: ${absWidth}px;
          height: ${absHeight}px;
        }
        .pc-auth-qr-scan-overlay.is-dimmed {
          clip-path: none;
        }
      `;
      return;
    }

    const right = left + absWidth;
    const bottom = top + absHeight;
    const clipPath = `polygon(0% 0%, 0% 100%, ${left}px 100%, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px 100%, 100% 100%, 100% 0%)`;

    overlay.classList.add("is-dimmed");
    styleEl.textContent = `
      .pc-auth-qr-scan-selection.is-selecting {
        display: block;
        left: ${left}px;
        top: ${top}px;
        width: ${absWidth}px;
        height: ${absHeight}px;
      }
      .pc-auth-qr-scan-overlay.is-dimmed {
        clip-path: ${clipPath};
      }
    `;
  };

  const onPointerUp = async (event) => {
    if (!isSelecting) {
      return;
    }

    isSelecting = false;

    if (overlay.hasPointerCapture(event.pointerId)) {
      overlay.releasePointerCapture(event.pointerId);
    }

    const endX = event.clientX;
    const endY = event.clientY;
    const width = endX - startX;
    const height = endY - startY;

    await onComplete({
      x: Math.min(startX, endX),
      y: Math.min(startY, endY),
      width: Math.abs(width),
      height: Math.abs(height),
    });
  };

  const onKeyDown = (event) => {
    if (event.key !== "Escape") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    onCancel();
  };

  overlay.addEventListener("pointerdown", onPointerDown);
  overlay.addEventListener("pointermove", onPointerMove);
  overlay.addEventListener("pointerup", onPointerUp);
  overlay.addEventListener("pointercancel", onPointerUp);
  window.addEventListener("keydown", onKeyDown, true);

  activeSession.teardown = () => {
    overlay.removeEventListener("pointerdown", onPointerDown);
    overlay.removeEventListener("pointermove", onPointerMove);
    overlay.removeEventListener("pointerup", onPointerUp);
    overlay.removeEventListener("pointercancel", onPointerUp);
    window.removeEventListener("keydown", onKeyDown, true);
    selectionBox.classList.remove("is-selecting");
    overlay.classList.remove("is-dimmed");
    shadow.getElementById(SCAN_DYNAMIC_STYLE_ID)?.remove();
  };
}

/** Initializes content-script message listeners and overlay lifecycle. */
function scanContentInit() {
  scanContentListenersRegister({
    start: scanOverlayStart,
    cancel: () => scanOverlayRemove(),
  });
}

export { scanContentInit };
export { scanOverlayStart };
export { scanOverlayRemove };
