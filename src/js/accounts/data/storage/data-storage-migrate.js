import { DATA_KEY_FINAL } from "../data-constants.js";
import { DATA_KEY_LEGACY } from "../data-constants.js";
import { DATA_KEY_LEGACY_ACCOUNTS } from "../data-constants.js";
import { DATA_KEY_LEGACY_ALL } from "../data-constants.js";
import { DATA_KEY_LEGACY_ENCRYPTED } from "../data-constants.js";
import { DATA_KEY_LEGACY_RESTORE } from "../data-constants.js";
import { dataCryptoDecrypt } from "../crypto/data-crypto-decrypt.js";
import { dataCryptoIsEncrypted } from "../crypto/data-crypto-type.js";
import { dataMergeLists } from "../records/data-merge-lists.js";
import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageSetFinal } from "./data-storage-final.js";

async function dataStorageLogWarn(operation, fn) {
  try {
    return await fn();
  } catch (error) {
    console.warn(`[data-storage] ${operation} failed`, error);
    throw error;
  }
}

/** Turns a legacy storage value into a plain account list. */
function dataLegacyAccountsFromValue(value, accountNumber) {
  if (value == null) {
    return [];
  }

  if (typeof value === "string" && dataCryptoIsEncrypted(value)) {
    if (!accountNumber) {
      return [];
    }
    try {
      return dataSanitizeList(dataCryptoDecrypt(value, accountNumber));
    } catch (error) {
      console.warn(
        "[data-storage] dataStorageMigrateLegacy decrypt failed",
        error,
      );
      return [];
    }
  }

  return dataSanitizeList(value);
}

/** Reads pre-refactor storage keys (accountsAll era) into dataReady. */
export async function dataStorageMigrateLegacy(accountNumber) {
  return dataStorageLogWarn("dataStorageMigrateLegacy", async () => {
    const stored = await chrome.storage.local.get([
      DATA_KEY_FINAL,
      DATA_KEY_LEGACY_ALL,
      DATA_KEY_LEGACY_ACCOUNTS,
      DATA_KEY_LEGACY_ENCRYPTED,
      DATA_KEY_LEGACY_RESTORE,
    ]);

    let list = dataSanitizeList(stored[DATA_KEY_FINAL]);
    list = dataMergeLists(
      list,
      dataLegacyAccountsFromValue(stored[DATA_KEY_LEGACY_ALL], accountNumber),
    );
    list = dataMergeLists(
      list,
      dataLegacyAccountsFromValue(stored[DATA_KEY_LEGACY_ACCOUNTS], accountNumber),
    );
    list = dataMergeLists(
      list,
      dataLegacyAccountsFromValue(stored[DATA_KEY_LEGACY_ENCRYPTED], accountNumber),
    );
    list = dataMergeLists(
      list,
      dataLegacyAccountsFromValue(stored[DATA_KEY_LEGACY_RESTORE], accountNumber),
    );

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
