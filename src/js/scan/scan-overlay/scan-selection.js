const QR_SCAN_DYNAMIC_STYLE_ID = "pc-auth-qr-scan-dynamic-styles";

/** Computes selection bounds from start and end pointer coordinates. */
export function qrScanSelectionRectCalculate(startX, startY, endX, endY) {
  const width = endX - startX;
  const height = endY - startY;
  const absWidth = Math.abs(width);
  const absHeight = Math.abs(height);
  const left = width < 0 ? endX : startX;
  const top = height < 0 ? endY : startY;

  return {
    x: Math.min(startX, endX),
    y: Math.min(startY, endY),
    width: absWidth,
    height: absHeight,
    left,
    top,
  };
}

/** Returns the shadow-root style element used for live selection geometry. */
function qrScanSelectionDynamicStylesEnsure(shadow) {
  let styleEl = shadow.getElementById(QR_SCAN_DYNAMIC_STYLE_ID);

  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = QR_SCAN_DYNAMIC_STYLE_ID;
    shadow.append(styleEl);
  }

  return styleEl;
}

/** Writes selection box and overlay dim rules into the shadow stylesheet. */
function qrScanSelectionDynamicStylesApply(
  shadow,
  { left, top, width, height, clipPath },
) {
  const styleEl = qrScanSelectionDynamicStylesEnsure(shadow);
  const clipRule = clipPath ? `clip-path: ${clipPath};` : "clip-path: none;";

  styleEl.textContent = `
    .pc-auth-qr-scan-selection.is-selecting {
      display: block;
      left: ${left}px;
      top: ${top}px;
      width: ${width}px;
      height: ${height}px;
    }
    .pc-auth-qr-scan-overlay.is-dimmed {
      ${clipRule}
    }
  `;
}

/** Updates the selection box and dimmed overlay clip path. */
export function qrScanSelectionVisualUpdate(
  shadow,
  overlay,
  selectionBox,
  startX,
  startY,
  cursorX,
  cursorY,
) {
  const { width, height, left, top } = qrScanSelectionRectCalculate(
    startX,
    startY,
    cursorX,
    cursorY,
  );

  if (width <= 0 || height <= 0) {
    overlay.classList.remove("is-dimmed");
    qrScanSelectionDynamicStylesApply(shadow, {
      left,
      top,
      width,
      height,
      clipPath: null,
    });
    return;
  }

  const right = left + width;
  const bottom = top + height;
  const clipPath = `polygon(0% 0%, 0% 100%, ${left}px 100%, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px 100%, 100% 100%, 100% 0%)`;

  overlay.classList.add("is-dimmed");
  qrScanSelectionDynamicStylesApply(shadow, {
    left,
    top,
    width,
    height,
    clipPath,
  });
}

/** Attaches pointer and keyboard handlers for region selection. */
export function qrScanSelectionHandlersAttach(overlay, selectionBox, callbacks) {
  const shadow = overlay.getRootNode();
  let startX = 0;
  let startY = 0;
  let isSelecting = false;

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
    qrScanSelectionDynamicStylesApply(shadow, {
      left: startX,
      top: startY,
      width: 0,
      height: 0,
      clipPath: null,
    });

    overlay.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isSelecting) {
      return;
    }

    qrScanSelectionVisualUpdate(
      shadow,
      overlay,
      selectionBox,
      startX,
      startY,
      event.clientX,
      event.clientY,
    );
  };

  const onPointerUp = async (event) => {
    if (!isSelecting) {
      return;
    }

    isSelecting = false;

    if (overlay.hasPointerCapture(event.pointerId)) {
      overlay.releasePointerCapture(event.pointerId);
    }

    const selection = qrScanSelectionRectCalculate(
      startX,
      startY,
      event.clientX,
      event.clientY,
    );

    await callbacks.onComplete({
      x: selection.x,
      y: selection.y,
      width: selection.width,
      height: selection.height,
    });
  };

  const onKeyDown = (event) => {
    if (event.key !== "Escape") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    callbacks.onCancel();
  };

  overlay.addEventListener("pointerdown", onPointerDown);
  overlay.addEventListener("pointermove", onPointerMove);
  overlay.addEventListener("pointerup", onPointerUp);
  overlay.addEventListener("pointercancel", onPointerUp);
  window.addEventListener("keydown", onKeyDown, true);

  return () => {
    overlay.removeEventListener("pointerdown", onPointerDown);
    overlay.removeEventListener("pointermove", onPointerMove);
    overlay.removeEventListener("pointerup", onPointerUp);
    overlay.removeEventListener("pointercancel", onPointerUp);
    window.removeEventListener("keydown", onKeyDown, true);
    selectionBox.classList.remove("is-selecting");
    overlay.classList.remove("is-dimmed");
    shadow.getElementById(QR_SCAN_DYNAMIC_STYLE_ID)?.remove();
  };
}
