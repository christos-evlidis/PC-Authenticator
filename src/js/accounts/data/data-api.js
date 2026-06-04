import { ACCOUNT_API_BASE_URL } from "../auth/constants.js";

/** Wraps fetch, logs HTTP failures, and rethrows errors. */
async function dataFetchWarn(label, request) {
  try {
    const response = await request();
    if (!response.ok) {
      console.warn(
        `[data-api] ${label} HTTP ${response.status}`,
        response.statusText,
      );
    }
    return response;
  } catch (error) {
    console.warn(`[data-api] ${label} failed`, error);
    throw error;
  }
}

/** Downloads the latest backup payload for an account. */
export async function dataRemoteRestore(accountNumber) {
  try {
    const response = await dataFetchWarn("dataRemoteRestore", () =>
      fetch(`${ACCOUNT_API_BASE_URL}/restore-accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: accountNumber }),
      }),
    );
    const data = await response.json();
    return { accounts: data.accounts };
  } catch (error) {
    console.warn("[data-api] dataRemoteRestore failed", error);
    throw error;
  }
}

/** Uploads an encrypted accounts blob, replacing any previous backup. */
export async function dataRemoteBackup(accountNumber, encryptedAccounts) {
  try {
    const response = await dataFetchWarn("dataRemoteBackup", () =>
      fetch(`${ACCOUNT_API_BASE_URL}/backup-accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          account_number: accountNumber,
          accounts: encryptedAccounts,
          encrypted: true,
        }),
      }),
    );
    return response.json();
  } catch (error) {
    console.warn("[data-api] dataRemoteBackup failed", error);
    throw error;
  }
}
