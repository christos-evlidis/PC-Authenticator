import { dataApiBackup } from "../data-api.js";
import { dataCryptoEncrypt } from "../crypto/data-crypto-encrypt.js";
import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageSetFinal } from "../storage/data-storage-final.js";
import { dataStorageGetMerged } from "../storage/data-storage-merged.js";

/** Encrypts dataMerged, uploads to cloud, then saves the decrypted list to dataReady. */
async function dataBackup(authNumber) {
  try {
    const merged = dataSanitizeList(
      await dataStorageGetMerged(),
    );
    const encryptedPayload = dataCryptoEncrypt(merged, authNumber);
    await dataApiBackup(authNumber, encryptedPayload);
    await dataStorageSetFinal(merged);
  } catch (error) {
    console.warn("[data-backup] dataBackup failed", error);
    throw error;
  }
}

export { dataBackup };
