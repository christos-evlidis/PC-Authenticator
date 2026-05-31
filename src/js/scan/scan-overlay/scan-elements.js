/** Builds overlay UI nodes inside the shadow root. */
export function qrScanOverlayElementsCreate(shadow) {
  const overlay = document.createElement("div");
  overlay.className = "pc-auth-qr-scan-overlay";

  const selectionBox = document.createElement("div");
  selectionBox.className = "pc-auth-qr-scan-selection";

  const instruction = document.createElement("div");
  instruction.className = "pc-auth-qr-scan-instruction";
  instruction.textContent =
    "Drag your mouse over the QR code to select and scan it. Press ESC to cancel.";

  overlay.append(selectionBox, instruction);
  shadow.append(overlay);

  return { overlay, selectionBox };
}
