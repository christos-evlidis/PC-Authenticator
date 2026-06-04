import { dataBackup } from "../backup/data-backup.js";
import { dataMerge } from "../backup/data-merge.js";
import { dataRestore } from "../backup/data-restore.js";
import { dataSync } from "../backup/data-sync.js";
import { dataManualParse } from "../parser/data-parser-manual.js";
import { dataQrParse } from "../parser/data-parser-qr.js";
import { dataFinalBuild } from "../records/data-build.js";
import { dataEncryptedClear } from "../data-storage.js";
import { dataMergedClear } from "../data-storage.js";
import { dataPendingAppend } from "../data-storage.js";
import { dataPendingClear } from "../data-storage.js";

/** Adds an account from manual setup, merges with cloud backup, and syncs. */
export async function dataManualAdd(accountNumber, formData) {
  try {
    const parsed = dataManualParse(formData);
    const account = dataFinalBuild(parsed);
    await dataPendingAppend(account);
    await dataRestore(accountNumber);
    await dataMerge(accountNumber);
    await dataEncryptedClear();
    await dataPendingClear();
    await dataBackup(accountNumber);
    await dataMergedClear();
    await dataSync(accountNumber);
    return account;
  } catch (error) {
    console.warn("[data-actions] dataManualAdd failed", error);
    throw error;
  }
}

/** Adds an account from a scanned otpauth URI, merges with cloud backup, and syncs. */
export async function dataQrAdd(accountNumber, otpauthUri) {
  try {
    const parsed = dataQrParse(otpauthUri);
    const account = dataFinalBuild(parsed);
    await dataPendingAppend(account);
    await dataRestore(accountNumber);
    await dataMerge(accountNumber);
    await dataEncryptedClear();
    await dataPendingClear();
    await dataBackup(accountNumber);
    await dataMergedClear();
    await dataSync(accountNumber);
    return account;
  } catch (error) {
    console.warn("[data-actions] dataQrAdd failed", error);
    throw error;
  }
}
