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

/** Patches account fields, re-encrypts the list, uploads backup, and syncs locally. */
export async function dataUpdate(accountNumber, accountId, patch) {
  try {
    const updateId = String(accountId);
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
    const encryptedPayload = dataEncrypt(decrypted, accountNumber);
    await dataRemoteBackup(accountNumber, encryptedPayload);
    await dataEncryptedClear();
    await dataMergedClear();
    await dataPendingClear();
    return dataSync(accountNumber);
  } catch (error) {
    console.warn("[data-actions] dataUpdate failed", error);
    throw error;
  }
}
