import { dataRemoteBackup } from "../data-api.js";
import { dataRestore } from "../backup/data-restore.js";
import { dataSync } from "../backup/data-sync.js";
import { dataDecrypt } from "../data-crypto.js";
import { dataEncryptedIs } from "../data-crypto.js";
import { dataEncrypt } from "../data-crypto.js";
import { dataListSanitize } from "../records/data-sanitize.js";
import { dataEncryptedClear } from "../data-storage.js";
import { dataEncryptedGet } from "../data-storage.js";
import { dataMergedClear } from "../data-storage.js";
import { dataPendingClear } from "../data-storage.js";

/** Deletes an account from backup and refreshes the local active list. */
export async function dataDelete(accountNumber, accountId) {
  try {
    const deleteId = String(accountId);
    await dataRestore(accountNumber);
    let decrypted = [];
    const encryptedBlob = await dataEncryptedGet();
    if (dataEncryptedIs(encryptedBlob)) {
      try {
        decrypted = dataListSanitize(
          dataDecrypt(encryptedBlob, accountNumber),
        );
      } catch (error) {
        console.warn(
          "[data-actions] decrypt cached backup failed, using []",
          error,
        );
      }
    }
    const filtered = decrypted.filter(
      (account) => String(account.id) !== deleteId,
    );
    const encryptedPayload = dataEncrypt(filtered, accountNumber);
    await dataRemoteBackup(accountNumber, encryptedPayload);
    await dataEncryptedClear();
    await dataMergedClear();
    await dataPendingClear();
    return dataSync(accountNumber);
  } catch (error) {
    console.warn("[data-actions] dataDelete failed", error);
    throw error;
  }
}
