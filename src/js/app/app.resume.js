import { appScanPendingClear, appScanPendingGet } from "./app.scan.js";
import { appActionAddQr } from "./app.actions.js";
import { qrSetupResumePerform } from "../sections/overlay/qr-code-setup/qr-code-setup.index.js";

async function appResumeCheck() {
  try {
    const pending = await appScanPendingGet();

    if (pending?.status !== "ready" && pending?.status !== "error") {
      return false;
    }

    void appResumePending(pending);
    return true;
  } catch (error) {
    console.warn("[app.resume] appResumeCheck failed", error);
    return false;
  }
}

async function appResumePending(pending) {
  if (!pending) {
    return;
  }

  await appScanPendingClear();

  let addedAccount = null;
  let scanResult = false;

  if (pending.status === "ready" && pending.uri) {
    try {
      addedAccount = await appActionAddQr(pending.uri);
      scanResult = true;
    } catch {
      scanResult = false;
    }
  }

  await qrSetupResumePerform(scanResult);
}

export { appResumeCheck };
