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

/** Updates the selection box and dimmed overlay clip path. */
export function qrScanSelectionVisualUpdate(
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

  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;
  selectionBox.style.left = `${left}px`;
  selectionBox.style.top = `${top}px`;

  if (width <= 0 || height <= 0) {
    overlay.style.clipPath = "none";
    return;
  }

  const right = left + width;
  const bottom = top + height;
  overlay.style.clipPath = `polygon(0% 0%, 0% 100%, ${left}px 100%, ${left}px ${top}px, ${right}px ${top}px, ${right}px ${bottom}px, ${left}px ${bottom}px, ${left}px 100%, 100% 100%, 100% 0%)`;
}

/** Attaches pointer and keyboard handlers for region selection. */
export function qrScanSelectionHandlersAttach(overlay, selectionBox, callbacks) {
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

    selectionBox.style.display = "block";
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    selectionBox.style.width = "0";
    selectionBox.style.height = "0";
    overlay.style.clipPath = "none";

    overlay.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isSelecting) {
      return;
    }

    qrScanSelectionVisualUpdate(
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
  };
}
