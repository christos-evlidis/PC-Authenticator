import { dataBackup } from "../backup/backup.js";
import { dataRestore } from "../backup/restore.js";
import { dataSync } from "../backup/sync.js";
import { dataSanitizeList } from "../records/sanitize.js";
import { dataGet } from "../storage/final.js";
import { dataSetMerged } from "../storage/merged.js";
import { dataClearPending } from "../storage/pending.js";
import { dataClearMerged } from "../storage/merged.js";
import { dataGetRestored } from "../storage/restored.js";
import { dataClearRestored } from "../storage/restored.js";

/** Deletes an account from dataBackup and refreshes the local active list. */
async function dataRemove(authNumber, accountId) {
  try {
    const deleteId = String(accountId);
    await dataRestore(authNumber);

    let accounts = dataSanitizeList(await dataGet());
    if (!accounts.length) {
      accounts = dataSanitizeList(await dataGetRestored());
    }

    const filtered = accounts.filter(
      (account) => String(account.id) !== deleteId,
    );

    await dataSetMerged(filtered);
    await dataBackup(authNumber);
    await dataClearRestored();
    await dataClearMerged();
    await dataClearPending();
    return dataSync(authNumber);
  } catch (error) {
    console.warn("[data-actions] remove failed", error);
    throw error;
  }
}

export { dataRemove };
