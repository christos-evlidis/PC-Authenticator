import { FRAME_BLUR_CLASS } from "../sections/section-cross.js";
import { scanPendingGet } from "../scan/scan-index.js";

let pending = null;
let readyPromise = null;

/** Loads pending scan state when status is ready or error. */
async function queryPendingQrScan() {
  const response = await scanPendingGet();

  if (response?.status === "ready" || response?.status === "error") {
    return response;
  }

  return null;
}

function applySkipIntroDomState() {
  document.documentElement.classList.add("is-popup-qr-resume");
  document.body.classList.add(FRAME_BLUR_CLASS);
}

export function initPopupResume() {
  readyPromise = queryPendingQrScan().then((scanPending) => {
    pending = scanPending;

    if (scanPending) {
      applySkipIntroDomState();
    }

    return Boolean(scanPending);
  });
}

export function whenPopupResumeReady() {
  return readyPromise ?? Promise.resolve(false);
}

export function getPopupResumePending() {
  return pending;
}

export function clearPopupResumeState() {
  pending = null;
  document.documentElement.classList.remove("is-popup-qr-resume");
}
