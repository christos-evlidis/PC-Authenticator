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
