import { ACCOUNT_API_BASE_URL } from "./constants.js";

/** Wraps fetch, logs HTTP failures, and rethrows errors. */
async function accountFetchWarn(label, request) {
  try {
    const response = await request();
    if (!response.ok) {
      console.warn(
        `[account-auth-api] ${label} HTTP ${response.status}`,
        response.statusText,
      );
    }
    return response;
  } catch (error) {
    console.warn(`[account-auth-api] ${label} failed`, error);
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

    if (!response.ok) {
      return { success: false };
    }

    return response.json();
  } catch (error) {
    console.warn("[account-auth-api] accountVerify failed", error);
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

    if (!response.ok) {
      throw new Error(`accountCreate HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data?.account_number) {
      throw new Error("accountCreate response missing account_number");
    }

    return data.account_number;
  } catch (error) {
    console.warn("[account-auth-api] accountCreate failed", error);
    throw error;
  }
}
