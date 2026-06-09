import { dataSanitizeList } from "../records/sanitize.js";
import { dataGet } from "../storage/final.js";
import { dataSet } from "../storage/final.js";
import { dataClearPending } from "../storage/pending.js";
import { dataGetPending } from "../storage/pending.js";
import { dataClearMerged } from "../storage/merged.js";
import { dataClearRestored } from "../storage/restored.js";
import { dataGetRestored } from "../storage/restored.js";
import { dataMerge } from "./merge.js";
import { dataRestore } from "./restore.js";

/** Restores from cloud, merges pending adds when present, and refreshes dataReady. */
async function dataSync(authNumber) {
  try {
    const result = await dataRestore(authNumber);
    if (result.accounts == null) {
      const existing = dataSanitizeList(
        await dataGet(),
      );
      await dataClearRestored();
      await dataClearPending();
      await dataClearMerged();
      if (existing.length) {
        console.debug(
          `[data-dataBackup] dataSync: empty dataRestore; keeping ${existing.length} local account(s)`,
        );
        return existing;
      }
      await dataSet([]);
      return [];
    }

    const pending = dataSanitizeList(
      await dataGetPending(),
    );
    if (pending.length) {
      return dataMerge(authNumber);
    }

    const restored = dataSanitizeList(
      await dataGetRestored(),
    );
    await dataSet(restored);

    try {
      await dataClearRestored();
      await dataClearPending();
      await dataClearMerged();
    } catch (error) {
      console.warn(
        "[data-dataBackup] dataSync clear temp keys failed",
        error,
      );
      throw error;
    }
    return restored;
  } catch (error) {
    console.warn("[data-dataBackup] dataSync failed", error);
    throw error;
  }
}

export { dataSync };
