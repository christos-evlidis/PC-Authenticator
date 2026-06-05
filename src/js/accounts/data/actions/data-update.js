import { dataApiBackup } from "../data-api.js";
import { dataBackupRestore } from "../backup/data-restore.js";
import { dataBackupSync } from "../backup/data-sync.js";
import { dataCryptoDecrypt } from "../crypto/data-crypto-decrypt.js";
import { dataCryptoIsEncrypted } from "../crypto/data-crypto-type.js";
import { dataCryptoEncrypt } from "../crypto/data-crypto-encrypt.js";
import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageClearEncrypted } from "../storage/data-storage-encrypted.js";
import { dataStorageGetEncrypted } from "../storage/data-storage-encrypted.js";
import { dataStorageClearMerged } from "../storage/data-storage-merged.js";
import { dataStorageClearPending } from "../storage/data-storage-pending.js";

/** Patches account fields, re-encrypts the list, uploads backup, and syncs locally. */
export async function dataUpdate(accountNumber, accountId, patch) {
  try {
    const updateId = String(accountId);
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
    const account = decrypted.find((entry) => String(entry.id) === updateId);
    if (!account) {
      console.warn(
        `[data-actions] dataUpdate: account ${updateId} not found in backup`,
      );
    } else {
      if (patch.name != null) {
        account.name = patch.name;
      }
      if (patch.email !== undefined) {
        account.email = patch.email;
      }
      if (patch.username !== undefined) {
        account.username = patch.username;
      }
      if (patch.counter != null) {
        account.counter = patch.counter;
      }
    }
    const encryptedPayload = dataCryptoEncrypt(decrypted, accountNumber);
    await dataApiBackup(accountNumber, encryptedPayload);
    await dataStorageClearEncrypted();
    await dataStorageClearMerged();
    await dataStorageClearPending();
    return dataBackupSync(accountNumber);
  } catch (error) {
    console.warn("[data-actions] dataUpdate failed", error);
    throw error;
  }
}
