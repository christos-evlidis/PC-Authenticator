import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageGetFinal } from "../storage/data-storage-final.js";
import { dataStorageSetMerged } from "../storage/data-storage-merged.js";
import { dataStorageGetPending } from "../storage/data-storage-pending.js";
import { dataStorageGetRestored } from "../storage/data-storage-restored.js";

/** Merges incoming accounts into a base list by id (updates in place, prepends new). */
function dataMergeIncoming(base, incoming) {
  const indexById = new Map();
  base.forEach((account, index) => {
    indexById.set(String(account.id), index);
  });
  const toPrepend = [];
  for (const account of incoming) {
    const id = String(account.id);
    if (indexById.has(id)) {
      base[indexById.get(id)] = account;
    } else {
      toPrepend.push(account);
    }
  }
  return [...toPrepend.reverse(), ...base];
}

/** Merges dataRestored + dataReady + dataPending and persists the result to dataMerged. */
async function dataMerge(authNumber, options = {}) {
  try {
    const restored = dataSanitizeList(
      options.baseList ?? (await dataStorageGetRestored()),
    );
    const ready = dataSanitizeList(await dataStorageGetFinal());
    const pending = dataSanitizeList(await dataStorageGetPending());

    let merged = restored;
    merged = dataMergeIncoming(merged, ready);
    merged = dataMergeIncoming(merged, pending);

    try {
      await dataStorageSetMerged(merged);
    } catch (error) {
      console.warn("[data-backup] dataMerge persist failed", error);
      throw error;
    }
    return merged;
  } catch (error) {
    console.warn("[data-backup] dataMerge failed", error);
    throw error;
  }
}

export { dataMerge };
