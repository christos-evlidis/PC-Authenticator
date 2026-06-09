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

/** Patches account fields, re-encrypts the list, uploads dataBackup, and syncs locally. */
async function dataUpdate(authNumber, accountId, patch) {
  try {
    const updateId = String(accountId);
    await dataRestore(authNumber);

    let accounts = dataSanitizeList(await dataGet());
    if (!accounts.length) {
      accounts = dataSanitizeList(await dataGetRestored());
    }

    const account = accounts.find((entry) => String(entry.id) === updateId);
    if (!account) {
      console.warn(
        `[data-actions] update: account ${updateId} not found in dataBackup`,
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

    await dataSetMerged(accounts);
    await dataBackup(authNumber);
    await dataClearRestored();
    await dataClearMerged();
    await dataClearPending();
    return dataSync(authNumber);
  } catch (error) {
    console.warn("[data-actions] update failed", error);
    throw error;
  }
}

export { dataUpdate };
