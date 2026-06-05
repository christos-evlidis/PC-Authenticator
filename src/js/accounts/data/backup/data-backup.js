import { dataApiBackup } from "../data-api.js";
import { dataCryptoEncrypt } from "../crypto/data-crypto-encrypt.js";
import { dataSanitizeList } from "../records/data-sanitize.js";
import { dataStorageGetMerged } from "../storage/data-storage-merged.js";

/** Encrypts the merged list and uploads it as the cloud backup. */
export async function dataBackupUpload(accountNumber) {
  try {
    const merged = dataSanitizeList(
      await dataStorageGetMerged(),
    );
    const encryptedPayload = dataCryptoEncrypt(merged, accountNumber);
    await dataApiBackup(accountNumber, encryptedPayload);
  } catch (error) {
    console.warn("[data-backup] dataBackupUpload failed", error);
    throw error;
  }
}
