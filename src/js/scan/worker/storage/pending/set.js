import { PENDING_KEY } from "../../../constants.js";

async function workerStoragePendingSet(payload) {
  try {
    await chrome.storage.session.set({ [PENDING_KEY]: payload });
  } catch (error) {
    console.warn("[scan-storage] workerStoragePendingSet failed", error);
    throw error;
  }
}

export { workerStoragePendingSet };
