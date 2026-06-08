import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageGetFinal } from "../storage/data-storage-final.js";
import { dataStorageSetFinal } from "../storage/data-storage-final.js";
import { dataStorageClearPending } from "../storage/data-storage-pending.js";
import { dataStorageGetPending } from "../storage/data-storage-pending.js";
import { dataStorageClearMerged } from "../storage/data-storage-merged.js";
import { dataStorageClearRestored } from "../storage/data-storage-restored.js";
import { dataStorageGetRestored } from "../storage/data-storage-restored.js";
import { dataMerge } from "./data-merge.js";
import { dataRestore } from "./data-restore.js";

/** Restores from cloud, merges pending adds when present, and refreshes dataReady. */
async function dataSync(authNumber) {
  try {
    const result = await dataRestore(authNumber);
    if (result.accounts == null) {
      const existing = dataSanitizeList(
        await dataStorageGetFinal(),
      );
      await dataStorageClearRestored();
      await dataStorageClearPending();
      await dataStorageClearMerged();
      if (existing.length) {
        console.debug(
          `[data-backup] dataSync: empty restore; keeping ${existing.length} local account(s)`,
        );
        return existing;
      }
      await dataStorageSetFinal([]);
      return [];
    }

    const pending = dataSanitizeList(
      await dataStorageGetPending(),
    );
    if (pending.length) {
      return dataMerge(authNumber);
    }

    const restored = dataSanitizeList(
      await dataStorageGetRestored(),
    );
    await dataStorageSetFinal(restored);

    try {
      await dataStorageClearRestored();
      await dataStorageClearPending();
      await dataStorageClearMerged();
    } catch (error) {
      console.warn(
        "[data-backup] dataSync clear temp keys failed",
        error,
      );
      throw error;
    }
    return restored;
  } catch (error) {
    console.warn("[data-backup] dataSync failed", error);
    throw error;
  }
}

export { dataSync };
