import { AUTH_API_BASE_URL } from "../auth/auth-constants.js";

/** Wraps fetch, logs HTTP failures, and rethrows errors. */
async function dataApiFetchWarn(label, request) {
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
export async function dataApiRestore(accountNumber) {
  try {
    const response = await dataApiFetchWarn("dataApiRestore", () =>
      fetch(`${AUTH_API_BASE_URL}/restore-accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: accountNumber }),
      }),
    );
    const data = await response.json();
    if (data?.success === false && data?.error === "No backup found") {
      return { accounts: null };
    }
    if (!response.ok) {
      throw new Error(`dataApiRestore HTTP ${response.status}`);
    }
    return { accounts: data.accounts };
  } catch (error) {
    console.warn("[data-api] dataApiRestore failed", error);
    throw error;
  }
}

/** Uploads an encrypted accounts blob, replacing any previous backup. */
export async function dataApiBackup(accountNumber, encryptedAccounts) {
  try {
    const response = await dataApiFetchWarn("dataApiBackup", () =>
      fetch(`${AUTH_API_BASE_URL}/backup-accounts`, {
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
    console.warn("[data-api] dataApiBackup failed", error);
    throw error;
  }
}
