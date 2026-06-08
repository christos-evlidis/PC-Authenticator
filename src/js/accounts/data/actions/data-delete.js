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

/** Deletes an account from backup and refreshes the local active list. */
async function dataDelete(authNumber, accountId) {
  try {
    const deleteId = String(accountId);
    await dataRestore(authNumber);

    let accounts = dataSanitizeList(await dataStorageGetFinal());
    if (!accounts.length) {
      accounts = dataSanitizeList(await dataStorageGetRestored());
    }

    const filtered = accounts.filter(
      (account) => String(account.id) !== deleteId,
    );

    await dataStorageSetMerged(filtered);
    await dataBackup(authNumber);
    await dataStorageClearRestored();
    await dataStorageClearMerged();
    await dataStorageClearPending();
    return dataSync(authNumber);
  } catch (error) {
    console.warn("[data-actions] dataDelete failed", error);
    throw error;
  }
}

export { dataDelete };
