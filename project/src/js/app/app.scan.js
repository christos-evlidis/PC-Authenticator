import { scanCancel, scanPendingClear, scanPendingGet, scanStart } from "../services/scan/scan-index.js";
import { dataActionAddQr } from "../services/data/data-index.js";

import { appStateGet } from "./app.state.js";

import { qrSetupResume } from "../sections/overlay/qr-code-setup/qr-code-setup.index.js";

import { UNSUPPORTED_PAGE_ERROR } from "../const/const.scan.js";


/** Starts a QR scan on the active browser tab. */
async function appScanStart() {
  return await scanStart(); // Delegate scan start to the scan service.
}

/** Cancels the active QR scan. */
async function appScanCancel() {
  return await scanCancel(); // Delegate scan cancellation to the scan service.
}

/** Returns any pending scan result saved for resume. */
async function appScanPendingGet() {
  return await scanPendingGet(); // Delegate pending scan lookup to the scan service.
}

/** Clears any pending scan result saved for resume. */
async function appScanPendingClear() {
  return await scanPendingClear(); // Delegate pending scan cleanup to the scan service.
}

/** Returns whether a scan result is ready to resume on startup. */
async function appScanCheck() {
  try {
    const pending = await appScanPendingGet(); // Read the saved pending scan state.
    return pending?.status === "ready" || pending?.status === "error"; // Resume only ready or error scan results.
  } catch (error) {
    console.warn("[app.scan] appScanCheck failed", error); // Log scan check failures without blocking startup.
    return false; // Treat failed scan checks as no pending resume work.
  }
}

/** Resumes a pending scan result and runs the QR setup flow. */
async function appScanResume() {
  const pending = await appScanPendingGet(); // Read the pending scan payload saved before reload.

  if (!pending) { // Stop when there is nothing to resume.
    return; // Exit without starting QR setup resume.
  }

  await appScanPendingClear(); // Clear pending scan storage before handling the result.

  let result = false; // Track whether the scanned QR was saved successfully.

  if (pending.status === "ready" && pending.uri) { // Handle successful scans with a URI payload.
    try {
      const authKey = appStateGet().authKey; // Read the active account key from app state.
      if (authKey) { // Save the scanned code only when the user is authenticated.
        await dataActionAddQr(authKey, pending.uri); // Persist the scanned authenticator entry.
        result = true; // Mark QR save as successful for the resume animation.
      }
    } catch {
      result = false; // Mark QR save as failed when persistence throws.
    }
  }

  await qrSetupResume(result); // Play the QR setup resume flow for success or failure.
}


export { appScanCancel, appScanCheck, appScanPendingClear, appScanPendingGet, appScanResume, appScanStart };
export { UNSUPPORTED_PAGE_ERROR };
