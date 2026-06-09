import { dataSanitizeList } from "../records/sanitize.js";
import { dataGet } from "../storage/final.js";
import { dataSetMerged } from "../storage/merged.js";
import { dataGetPending } from "../storage/pending.js";
import { dataGetRestored } from "../storage/restored.js";

/** Merges dataRestored + dataReady + dataPending and persists the result to dataMerged. */
async function dataMerge(authNumber, options = {}) {
  try {
    const restored = dataSanitizeList(
      options.baseList ?? (await dataGetRestored()),
    );
    const ready = dataSanitizeList(await dataGet());
    const pending = dataSanitizeList(await dataGetPending());

    let merged = restored;

    for (const incoming of [ready, pending]) {
      const indexById = new Map();
      merged.forEach((account, index) => {
        indexById.set(String(account.id), index);
      });
      const toPrepend = [];
      for (const account of incoming) {
        const id = String(account.id);
        if (indexById.has(id)) {
          merged[indexById.get(id)] = account;
        } else {
          toPrepend.push(account);
        }
      }
      merged = [...toPrepend.reverse(), ...merged];
    }

    try {
      await dataSetMerged(merged);
    } catch (error) {
      console.warn("[data-dataBackup] dataMerge persist failed", error);
      throw error;
    }
    return merged;
  } catch (error) {
    console.warn("[data-dataBackup] dataMerge failed", error);
    throw error;
  }
}

export { dataMerge };