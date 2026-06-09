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

export const PENDING_KEY = "qrScanPending";

export const START_FAILED_ERROR =
  "Could not start QR scanning on this tab. Close the extension popup and try again from the website tab.";
