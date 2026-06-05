import { dataApiBackup } from "../data-api.js";
import { dataRestore } from "../backup/data-restore.js";
import { dataSync } from "../backup/data-sync.js";
import { dataCryptoDecrypt } from "../crypto/data-crypto-decrypt.js";
import { dataCryptoIsEncrypted } from "../crypto/data-crypto-type.js";
import { dataCryptoEncrypt } from "../crypto/data-crypto-encrypt.js";
import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageClearEncrypted } from "../storage/data-storage-encrypted.js";
import { dataStorageGetEncrypted } from "../storage/data-storage-encrypted.js";
import { dataStorageClearMerged } from "../storage/data-storage-merged.js";
import { dataStorageClearPending } from "../storage/data-storage-pending.js";

/** Deletes an account from backup and refreshes the local active list. */
export async function dataDelete(accountNumber, accountId) {
  try {
    const deleteId = String(accountId);
    await dataRestore(accountNumber);
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
    return dataSync(accountNumber);
  } catch (error) {
    console.warn("[data-actions] dataDelete failed", error);
    throw error;
  }
}
