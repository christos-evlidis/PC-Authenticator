import * as api from "../account-api.js";
import * as crypto from "../account-crypto.js";
import { accountListSanitize } from "../account-records/account-sanitize.js";
import * as storage from "../account-storage.js";

/** Encrypts the merged list and uploads it as the cloud backup. */
export async function accountBackup(accountNumber) {
  try {
    const merged = accountListSanitize(
      await storage.accountsMergedGet(),
    );
    const encryptedPayload = crypto.accountEncrypt(merged, accountNumber);
    await api.accountApiBackup(accountNumber, encryptedPayload);
  } catch (error) {
    console.warn("[account-backup] accountBackup failed", error);
    throw error;
  }
}
