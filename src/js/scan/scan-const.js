export const MESSAGES = {
  PING: "ping",
  START_OVERLAY: "startQRScan",
  CANCEL_OVERLAY: "cancelQRScan",
  CAPTURE_TAB: "captureTab",
  SCAN_QR_CODE: "scanQRCode",
  CANCELLED_EVENT: "qrScanCancelled",
  START: "startQrScan",
  GET_PENDING: "getQrScanPending",
  CLEAR_PENDING: "clearQrScanPending",
  CANCEL: "cancelQrScan",
  GET_SCAN_TARGET: "getScanTargetTab",
};

export const UNSUPPORTED_PAGE_ERROR =
  "QR scanning cannot run on this page. Open a normal website tab and try again.";

export const PENDING_KEY = "qrScanPending";

export const START_FAILED_ERROR =
  "Could not start QR scanning on this tab. Close the extension popup and try again from the website tab.";

export const OVERLAY_HOST_CLASS = "pc-auth-qr-scan-host";
export const OVERLAY_HOST_STYLE_ID = "pc-auth-qr-scan-host-styles";
export const OVERLAY_CLASS = "pc-auth-qr-scan-overlay";
export const OVERLAY_SELECTION_CLASS = "pc-auth-qr-scan-selection";
export const OVERLAY_INSTRUCTION_CLASS = "pc-auth-qr-scan-instruction";
export const OVERLAY_SELECTING_CLASS = "is-selecting";
export const OVERLAY_DIMMED_CLASS = "is-dimmed";
export const OVERLAY_INSTRUCTION_TEXT =
  "Drag your mouse over the QR code to select and scan it. Press ESC to cancel.";
export const OVERLAY_CSS_PATH = "css/overlay/scan.css";

export const CONTENT_INDEX_PATH = "js/scan/content/content-index.js";
