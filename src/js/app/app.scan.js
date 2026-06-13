import { scanStart, scanCancel, scanPendingGet, scanPendingClear } from "../services/scan/scan-index.js";
import { UNSUPPORTED_PAGE_ERROR } from "../const/const.scan.js";
import { dataActionAddQr } from "../services/data/data-index.js";
import { qrSetupResumePerform } from "../sections/overlay/qr-code-setup/qr-code-setup.index.js";
import { appStateGet } from "./app.state.js";

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

async function appScanCheck() {
  try {
    const pending = await appScanPendingGet();
    return pending?.status === "ready" || pending?.status === "error";
  } catch (error) {
    console.warn("[app.scan] appScanCheck failed", error);
    return false;
  }
}

async function appScanResume() {
  const pending = await appScanPendingGet();

  if (!pending) {
    return;
  }

  await appScanPendingClear();

  let result = false;

  if (pending.status === "ready" && pending.uri) {
    try {
      const authKey = appStateGet().authKey;
      if (authKey) {
        await dataActionAddQr(authKey, pending.uri);
        result = true;
      }
    } catch {
      result = false;
    }
  }

  await qrSetupResumePerform(result);
}

export { appScanStart };
export { appScanCancel };
export { appScanPendingGet };
export { appScanPendingClear };
export { appScanCheck };
export { appScanResume };
export { UNSUPPORTED_PAGE_ERROR };
