import { dataRemoteBackup } from "../data-api.js";
import { dataEncrypt } from "../data-crypto.js";
import { dataListSanitize } from "../records/data-sanitize.js";
import { dataMergedGet } from "../data-storage.js";

/** Encrypts the merged list and uploads it as the cloud backup. */
export async function dataBackup(accountNumber) {
  try {
    const merged = dataListSanitize(
      await dataMergedGet(),
    );
    const encryptedPayload = dataEncrypt(merged, accountNumber);
    await dataRemoteBackup(accountNumber, encryptedPayload);
  } catch (error) {
    console.warn("[data-backup] dataBackup failed", error);
    throw error;
  }
}
