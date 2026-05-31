import { ACCOUNT_API_BASE_URL } from "./account-constants.js";

/** Wraps fetch, logs HTTP failures, and rethrows errors. */
async function accountFetchWarn(label, request) {
  try {
    const response = await request();
    if (!response.ok) {
      console.warn(
        `[account-api] ${label} HTTP ${response.status}`,
        response.statusText,
      );
    }
    return response;
  } catch (error) {
    console.warn(`[account-api] ${label} failed`, error);
    throw error;
  }
}

/** Confirms that an account number exists on the server. */
export async function accountVerify(accountNumber) {
  try {
    const response = await accountFetchWarn("accountVerify", () =>
      fetch(`${ACCOUNT_API_BASE_URL}/verify-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: accountNumber }),
      }),
    );
    return response.json();
  } catch (error) {
    console.warn("[account-api] accountVerify failed", error);
    throw error;
  }
}

/** Creates a new user account and returns its 24-digit account number. */
export async function accountCreate() {
  try {
    const response = await accountFetchWarn("accountCreate", () =>
      fetch(`${ACCOUNT_API_BASE_URL}/create-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );
    const data = await response.json();
    return data.account_number;
  } catch (error) {
    console.warn("[account-api] accountCreate failed", error);
    throw error;
  }
}

/** Downloads the latest backup payload for an account. */
export async function accountApiRestore(accountNumber) {
  try {
    const response = await accountFetchWarn("accountRestore", () =>
      fetch(`${ACCOUNT_API_BASE_URL}/restore-accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_number: accountNumber }),
      }),
    );
    const data = await response.json();
    return { accounts: data.accounts };
  } catch (error) {
    console.warn("[account-api] accountRestore failed", error);
    throw error;
  }
}

/** Uploads an encrypted accounts blob, replacing any previous backup. */
export async function accountApiBackup(accountNumber, encryptedAccounts) {
  try {
    const response = await accountFetchWarn("accountBackup", () =>
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
    console.warn("[account-api] accountBackup failed", error);
    throw error;
  }
}
