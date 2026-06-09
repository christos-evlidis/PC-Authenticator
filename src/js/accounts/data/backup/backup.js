import { dataApiBackup } from "../api.js";
import { dataEncrypt } from "../crypto/encrypt.js";
import { dataSanitizeList } from "../records/sanitize.js";
import { dataSet } from "../storage/final.js";
import { dataGetMerged } from "../storage/merged.js";

/** Encrypts merged, uploads to cloud, then saves the decrypted list to dataReady. */
async function dataBackup(authNumber) {
  try {
    const merged = dataSanitizeList(
      await dataGetMerged(),
    );
    const encryptedPayload = dataEncrypt(merged, authNumber);
    await dataApiBackup(authNumber, encryptedPayload);
    await dataSet(merged);
  } catch (error) {
    console.warn("[data-dataBackup] dataBackup failed", error);
    throw error;
  }
}

export { dataBackup };
