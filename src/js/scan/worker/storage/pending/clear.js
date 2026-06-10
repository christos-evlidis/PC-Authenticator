import { PENDING_KEY } from "../../../constants.js";

async function workerStoragePendingClear() {
  try {
    await chrome.storage.session.remove([PENDING_KEY]);
  } catch (error) {
    console.warn("[scan-storage] workerStoragePendingClear failed", error);
    throw error;
  }
}

export { workerStoragePendingClear };
