import { dataBackup } from "../backup/backup.js";
import { dataMerge } from "../backup/merge.js";
import { dataRestore } from "../backup/restore.js";
import { dataParseManual } from "../parser/manual.js";
import { dataParseQr } from "../parser/qr.js";
import { dataBuildFinal } from "../records/build.js";
import { dataAppendPending } from "../storage/pending.js";
import { dataClearPending } from "../storage/pending.js";
import { dataClearMerged } from "../storage/merged.js";
import { dataClearRestored } from "../storage/restored.js";

/** Adds an account from manual setup, merges with cloud dataBackup, and syncs. */
async function dataAddManual(authNumber, formData) {
  try {
    const parsed = dataParseManual(formData);
    const account = dataBuildFinal(parsed);
    await dataAppendPending(account);
    await dataRestore(authNumber);
    await dataMerge(authNumber);
    await dataBackup(authNumber);
    await dataClearRestored();
    await dataClearPending();
    await dataClearMerged();
    return account;
  } catch (error) {
    console.warn("[data-actions] dataAddManual failed", error);
    throw error;
  }
}

/** Adds an account from a scanned otpauth URI, merges with cloud dataBackup, and syncs. */
async function dataAddQr(authNumber, otpauthUri) {
  try {
    const parsed = dataParseQr(otpauthUri);
    const account = dataBuildFinal(parsed);
    await dataAppendPending(account);
    await dataRestore(authNumber);
    await dataMerge(authNumber);
    await dataBackup(authNumber);
    await dataClearRestored();
    await dataClearPending();
    await dataClearMerged();
    return account;
  } catch (error) {
    console.warn("[data-actions] dataAddQr failed", error);
    throw error;
  }
}

export { dataAddManual };
export { dataAddQr };
