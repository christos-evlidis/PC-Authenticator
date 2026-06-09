import { contentScreenshotCapture } from "../screenshot/capture.js";
import { MESSAGES } from "../../constants.js";
import { OVERLAY_CLASS } from "../../constants.js";
import { OVERLAY_DIMMED_CLASS } from "../../constants.js";
import { OVERLAY_DYNAMIC_STYLE_ID } from "../../constants.js";
import { OVERLAY_SELECTION_CLASS } from "../../constants.js";
import { OVERLAY_SELECTING_CLASS } from "../../constants.js";
import { contentOverlayCreate } from "./create.js";
import { contentOverlayActiveSession } from "./remove.js";
import { contentOverlayRemove } from "./remove.js";

/** Opens the selection overlay and begins listening for user input. */
function contentOverlayStart() {
  contentOverlayRemove();

  const { overlay, selectionBox } = contentOverlayCreate();
  const shadow = overlay.getRootNode();
  let startX = 0;
  let startY = 0;
  let isSelecting = false;

  const onCancel = () => contentOverlayRemove({ notifyCancel: true });

  const onComplete = async (selection) => {
    try {
      const cropped = await contentScreenshotCapture(selection);

      await chrome.runtime.sendMessage({
        action: MESSAGES.SCAN_QR_CODE,
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
        action: MESSAGES.SCAN_QR_CODE,
        error: message,
      });
    }

    contentOverlayRemove();
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

    selectionBox.classList.add(OVERLAY_SELECTING_CLASS);
    overlay.classList.remove(OVERLAY_DIMMED_CLASS);

    let styleEl = shadow.getElementById(OVERLAY_DYNAMIC_STYLE_ID);

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = OVERLAY_DYNAMIC_STYLE_ID;
      shadow.append(styleEl);
    }

    styleEl.textContent = `
      .${OVERLAY_SELECTION_CLASS}.${OVERLAY_SELECTING_CLASS} {
        display: block;
        left: ${startX}px;
        top: ${startY}px;
        width: 0px;
        height: 0px;
      }
      .${OVERLAY_CLASS}.${OVERLAY_DIMMED_CLASS} {
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

    let styleEl = shadow.getElementById(OVERLAY_DYNAMIC_STYLE_ID);

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = OVERLAY_DYNAMIC_STYLE_ID;
      shadow.append(styleEl);
    }

    if (absWidth <= 0 || absHeight <= 0) {
      overlay.classList.remove(OVERLAY_DIMMED_CLASS);
      styleEl.textContent = `
        .${OVERLAY_SELECTION_CLASS}.${OVERLAY_SELECTING_CLASS} {
          display: block;
          left: ${left}px;
          top: ${top}px;
          width: ${absWidth}px;
          height: ${absHeight}px;
        }
        .${OVERLAY_CLASS}.${OVERLAY_DIMMED_CLASS} {
          clip-path: none;
        }
      `;
      return;
    }

    const right = left + absWidth;
    const bottom = top + absHeight;
    const clipPath = `polygon(0% 0%, 0% 100%, ${left}px 100%, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px 100%, 100% 100%, 100% 0%)`;

    overlay.classList.add(OVERLAY_DIMMED_CLASS);
    styleEl.textContent = `
      .${OVERLAY_SELECTION_CLASS}.${OVERLAY_SELECTING_CLASS} {
        display: block;
        left: ${left}px;
        top: ${top}px;
        width: ${absWidth}px;
        height: ${absHeight}px;
      }
      .${OVERLAY_CLASS}.${OVERLAY_DIMMED_CLASS} {
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

  contentOverlayActiveSession.teardown = () => {
    overlay.removeEventListener("pointerdown", onPointerDown);
    overlay.removeEventListener("pointermove", onPointerMove);
    overlay.removeEventListener("pointerup", onPointerUp);
    overlay.removeEventListener("pointercancel", onPointerUp);
    window.removeEventListener("keydown", onKeyDown, true);
    selectionBox.classList.remove(OVERLAY_SELECTING_CLASS);
    overlay.classList.remove(OVERLAY_DIMMED_CLASS);
    shadow.getElementById(OVERLAY_DYNAMIC_STYLE_ID)?.remove();
  };
}

export { contentOverlayStart };
