import { showScanError } from "./qr-code-setup-add.js";
import { closeQrSetup } from "./qr-code-setup-panel.js";
import { getIsAwaitingPageSelection } from "./qr-code-setup-panel.js";
import { getIsQrBusy } from "./qr-code-setup-panel.js";
import { initQrCodeSetupPanel } from "./qr-code-setup-panel.js";
import { isQrSetupActive } from "./qr-code-setup-panel.js";
import { openQrSetup } from "./qr-code-setup-panel.js";
import { cancelPageSelection } from "./qr-code-setup-scan.js";
import { createQrSetupKeyDownHandler } from "./qr-code-setup-scan.js";
import { handleQrScanCancelled } from "./qr-code-setup-scan.js";
import { processPendingQrScan } from "./qr-code-setup-scan.js";
import { startQrScan } from "./qr-code-setup-scan.js";

function startQrScanBound() {
  return startQrScan({ onScanError: showScanError });
}

function processPendingQrScanBound(options = {}) {
  return processPendingQrScan({
    ...options,
    onScanError: showScanError,
  });
}

function closeQrSetupBound() {
  return closeQrSetup({
    cancelPageSelection,
  });
}

function initQrCodeSetup() {
  initQrCodeSetupPanel({
    startQrScan: startQrScanBound,
    closeQrSetupBound,
    handleQrScanCancelled,
    handleQrSetupKeyDown: createQrSetupKeyDownHandler(closeQrSetupBound),
  });
}

export const qrCodeSetupSection = {
  init: initQrCodeSetup,
  open: openQrSetup,
  close: closeQrSetupBound,
  startScan: startQrScanBound,
  processPendingScan: processPendingQrScanBound,
  isActive: isQrSetupActive,
  isRunning: () => getIsQrBusy() || getIsAwaitingPageSelection(),
};

export { initQrCodeSetup };
