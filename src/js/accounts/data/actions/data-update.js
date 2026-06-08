import { dataBackup } from "../backup/data-backup.js";
import { dataRestore } from "../backup/data-restore.js";
import { dataSync } from "../backup/data-sync.js";
import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageGetFinal } from "../storage/data-storage-final.js";
import { dataStorageSetMerged } from "../storage/data-storage-merged.js";
import { dataStorageClearPending } from "../storage/data-storage-pending.js";
import { dataStorageClearMerged } from "../storage/data-storage-merged.js";
import { dataStorageGetRestored } from "../storage/data-storage-restored.js";
import { dataStorageClearRestored } from "../storage/data-storage-restored.js";

/** Patches account fields, re-encrypts the list, uploads backup, and syncs locally. */
async function dataUpdate(authNumber, accountId, patch) {
  try {
    const updateId = String(accountId);
    await dataRestore(authNumber);

    let accounts = dataSanitizeList(await dataStorageGetFinal());
    if (!accounts.length) {
      accounts = dataSanitizeList(await dataStorageGetRestored());
    }

    const account = accounts.find((entry) => String(entry.id) === updateId);
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

    await dataStorageSetMerged(accounts);
    await dataBackup(authNumber);
    await dataStorageClearRestored();
    await dataStorageClearMerged();
    await dataStorageClearPending();
    return dataSync(authNumber);
  } catch (error) {
    console.warn("[data-actions] dataUpdate failed", error);
    throw error;
  }
}

export { dataUpdate };
