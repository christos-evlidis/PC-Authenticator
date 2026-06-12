import { scanStart, scanCancel, scanPendingGet, scanPendingClear } from "../services/scan/scan-index.js";
import { UNSUPPORTED_PAGE_ERROR } from "../services/scan/scan-const.js";

async function appScanStart() {
  return await scanStart();
}

async function appScanCancel() {
  return await scanCancel();
}

async function appScanPendingGet() {
  return await scanPendingGet();
}

async function appScanPendingClear() {
  return await scanPendingClear();
}

export {
  appScanStart,
  appScanCancel,
  appScanPendingGet,
  appScanPendingClear,
  UNSUPPORTED_PAGE_ERROR,
};
