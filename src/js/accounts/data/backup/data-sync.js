import { dataDecrypt } from "../data-crypto.js";
import { dataEncryptedIs } from "../data-crypto.js";
import { dataListSanitize } from "../records/data-sanitize.js";
import { dataEncryptedClear } from "../data-storage.js";
import { dataEncryptedGet } from "../data-storage.js";
import { dataFinalGet } from "../data-storage.js";
import { dataFinalSet } from "../data-storage.js";
import { dataMergedClear } from "../data-storage.js";
import { dataPendingClear } from "../data-storage.js";
import { dataPendingGet } from "../data-storage.js";
import { dataMerge } from "./data-merge.js";
import { dataRestore } from "./data-restore.js";

/** Restores from cloud, merges pending adds, writes the active list, and clears temp keys. */
export async function dataSync(accountNumber) {
  try {
    const result = await dataRestore(accountNumber);
    if (result.accounts == null) {
      const existing = dataListSanitize(
        await dataFinalGet(),
      );
      await dataEncryptedClear();
      await dataMergedClear();
      await dataPendingClear();
      if (existing.length) {
        console.debug(
          `[data-backup] dataSync: empty restore; keeping ${existing.length} local account(s)`,
        );
        return existing;
      }
      await dataFinalSet([]);
      return [];
    }
    let plainAccounts = [];
    if (
      typeof result.accounts === "string" &&
      dataEncryptedIs(result.accounts)
    ) {
      const encryptedBlob = await dataEncryptedGet();
      if (dataEncryptedIs(encryptedBlob)) {
        try {
          plainAccounts = dataListSanitize(
            dataDecrypt(encryptedBlob, accountNumber),
          );
        } catch (error) {
          console.warn(
            "[data-backup] decrypt cached backup failed, using []",
            error,
          );
        }
      }
    } else {
      plainAccounts = dataListSanitize(result.accounts);
    }
    const pending = dataListSanitize(
      await dataPendingGet(),
    );
    if (pending.length) {
      plainAccounts = await dataMerge(accountNumber, {
        baseList: plainAccounts,
      });
    } else {
      await dataFinalSet(plainAccounts);
    }
    try {
      await dataEncryptedClear();
      await dataMergedClear();
      await dataPendingClear();
    } catch (error) {
      console.warn(
        "[data-backup] dataSync clear temp keys failed",
        error,
      );
      throw error;
    }
    return plainAccounts;
  } catch (error) {
    console.warn("[data-backup] dataSync failed", error);
    throw error;
  }
}
