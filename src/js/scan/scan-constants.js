export const QR_SCAN_MESSAGES = {
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

export const QR_SCAN_UNSUPPORTED_PAGE_ERROR =
  "QR scanning cannot run on this page. Open a normal website tab and try again.";

export const CONTENT_SCRIPT_PATH = "js/scan/scan-content/scan-script.js";

export const PENDING_KEY = "qrScanPending";

export const OVERLAY_HOST_CLASS = "pc-auth-qr-scan-host";
export const OVERLAY_CSS_PATH = "css/scan/scan-overlay.css";

export const SCAN_START_FAILED_ERROR =
  "Could not start QR scanning on this tab. Close the extension popup and try again from the website tab.";
