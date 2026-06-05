import { DATA_KEY_ENCRYPTED } from "../data-constants.js";
import { DATA_KEY_FINAL } from "../data-constants.js";
import { DATA_KEY_LEGACY } from "../data-constants.js";
import { DATA_KEY_MERGED } from "../data-constants.js";
import { DATA_KEY_PENDING } from "../data-constants.js";
import { dataCryptoDecrypt } from "../crypto/data-crypto-decrypt.js";
import { dataCryptoIsEncrypted } from "../crypto/data-crypto-type.js";
import { dataMergeLists } from "../records/data-merge-lists.js";
import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageSetFinal } from "./data-storage-final.js";

const DATA_KEY_LEGACY_FINAL = "accountsFinal";
const DATA_KEY_LEGACY_ENCRYPTED = "accountsEncrypted";
const DATA_KEY_LEGACY_PENDING = "accountsUnencrypted";
const DATA_KEY_LEGACY_MERGED = "accountsMerged";

async function dataStorageLogWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Reads legacy and current storage keys into one merged active list. */
export async function dataStorageMigrateLegacy(accountNumber) {
  return dataStorageLogWarn("dataStorageMigrateLegacy", async () => {
    const stored = await chrome.storage.local.get([
      DATA_KEY_FINAL,
      DATA_KEY_ENCRYPTED,
      DATA_KEY_PENDING,
      DATA_KEY_MERGED,
      DATA_KEY_LEGACY_FINAL,
      DATA_KEY_LEGACY_ENCRYPTED,
      DATA_KEY_LEGACY_PENDING,
      DATA_KEY_LEGACY_MERGED,
    ]);

    let list = dataSanitizeList(stored[DATA_KEY_FINAL]);
    list = dataMergeLists(list, dataSanitizeList(stored[DATA_KEY_LEGACY_FINAL]));
    list = dataMergeLists(list, dataSanitizeList(stored[DATA_KEY_MERGED]));
    list = dataMergeLists(list, dataSanitizeList(stored[DATA_KEY_LEGACY_MERGED]));
    list = dataMergeLists(list, dataSanitizeList(stored[DATA_KEY_PENDING]));
    list = dataMergeLists(list, dataSanitizeList(stored[DATA_KEY_LEGACY_PENDING]));

    for (const encryptedBlob of [
      stored[DATA_KEY_ENCRYPTED],
      stored[DATA_KEY_LEGACY_ENCRYPTED],
    ]) {
      if (!dataCryptoIsEncrypted(encryptedBlob) || !accountNumber) {
        continue;
      }
      try {
        list = dataMergeLists(
          list,
          dataSanitizeList(dataCryptoDecrypt(encryptedBlob, accountNumber)),
        );
      } catch (error) {
        console.warn(
          "[data-storage] dataStorageMigrateLegacy decrypt failed",
          error,
        );
      }
    }

    await dataStorageSetFinal(list);
    return list;
  });
}

/** Removes legacy storage keys after a successful migration. */
export async function dataStorageClearLegacy() {
  return dataStorageLogWarn("dataStorageClearLegacy", () =>
    chrome.storage.local.remove(DATA_KEY_LEGACY),
  );
}
