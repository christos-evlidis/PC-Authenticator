import { dataApiRestore } from "../api.js";
import { dataDecrypt } from "../crypto/decrypt.js";
import { dataIsEncrypted } from "../crypto/type.js";
import { dataSanitizeList } from "../records/sanitize.js";
import { dataClearRestored } from "../storage/restored.js";
import { dataSetRestored } from "../storage/restored.js";

/** Fetches cloud dataBackup, decrypts when needed, and caches under restored. */
async function dataRestore(authNumber) {
  let result;
  try {
    result = await dataApiRestore(authNumber);
  } catch (error) {
    console.warn("[data-dataBackup] dataRestore fetch failed", error);
    throw error;
  }
  try {
    if (result.accounts == null) {
      await dataClearRestored();
    } else if (
      typeof result.accounts === "string" &&
      dataIsEncrypted(result.accounts)
    ) {
      try {
        const decrypted = dataSanitizeList(
          dataDecrypt(result.accounts, authNumber),
        );
        await dataSetRestored(decrypted);
      } catch (error) {
        console.warn("[data-dataBackup] dataRestore decrypt failed", error);
        await dataClearRestored();
        throw error;
      }
    } else {
      await dataSetRestored(
        dataSanitizeList(result.accounts),
      );
    }
  } catch (error) {
    console.warn("[data-dataBackup] dataRestore cache update failed", error);
    throw error;
  }
  return result;
}

export { dataRestore };
