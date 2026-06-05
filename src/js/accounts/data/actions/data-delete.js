import { dataApiBackup } from "../data-api.js";
import { dataBackupRestore } from "../backup/data-restore.js";
import { dataBackupSync } from "../backup/data-sync.js";
import { dataCryptoDecrypt } from "../data-crypto.js";
import { dataCryptoIsEncrypted } from "../data-crypto.js";
import { dataCryptoEncrypt } from "../data-crypto.js";
import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageClearEncrypted } from "../data-storage.js";
import { dataStorageGetEncrypted } from "../data-storage.js";
import { dataStorageClearMerged } from "../data-storage.js";
import { dataStorageClearPending } from "../data-storage.js";

/** Deletes an account from backup and refreshes the local active list. */
export async function dataDelete(accountNumber, accountId) {
  try {
    const deleteId = String(accountId);
    await dataBackupRestore(accountNumber);
    let decrypted = [];
    const encryptedBlob = await dataStorageGetEncrypted();
    if (dataCryptoIsEncrypted(encryptedBlob)) {
      try {
        decrypted = dataSanitizeList(
          dataCryptoDecrypt(encryptedBlob, accountNumber),
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
    const encryptedPayload = dataCryptoEncrypt(filtered, accountNumber);
    await dataApiBackup(accountNumber, encryptedPayload);
    await dataStorageClearEncrypted();
    await dataStorageClearMerged();
    await dataStorageClearPending();
    return dataBackupSync(accountNumber);
  } catch (error) {
    console.warn("[data-actions] dataDelete failed", error);
    throw error;
  }
}
