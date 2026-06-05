import { DATA_KEY_FINAL } from "../data-constants.js";
import { dataStorageLogWarn } from "./data-storage-log.js";

/** Reads the final (active) account list from local storage. */
export async function dataStorageGetFinal() {
  return dataStorageLogWarn("dataStorageGetFinal", async () => {
    const stored = await chrome.storage.local.get([DATA_KEY_FINAL]);
    return stored[DATA_KEY_FINAL];
  });
}

/** Writes the final (active) account list to local storage. */
export async function dataStorageSetFinal(accounts) {
  return dataStorageLogWarn("dataStorageSetFinal", () =>
    chrome.storage.local.set({ [DATA_KEY_FINAL]: accounts }),
  );
}

/** Clears the final (active) account list from local storage. */
export async function dataStorageClearFinal() {
  return dataStorageLogWarn("dataStorageClearFinal", () =>
    chrome.storage.local.remove([DATA_KEY_FINAL]),
  );
}
