import { AUTH_API_BASE_URL } from "./auth-constants.js";

/** Wraps fetch, logs HTTP failures, and rethrows errors. */
async function authFetchWarn(label, request) {
  try {
    const response = await request();
    if (!response.ok) {
      console.warn(
        `[auth-api] ${label} HTTP ${response.status}`,
        response.statusText,
      );
    }
    return response;
  } catch (error) {
    console.warn(`[auth-api] ${label} failed`, error);
    throw error;
  }
}

/** Confirms that an account number exists on the server. */
export async function authVerify(accountNumber) {
  try {
    const response = await authFetchWarn("authVerify", () =>
      fetch(`${AUTH_API_BASE_URL}/verify-account`, {
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
    console.warn("[auth-api] authVerify failed", error);
    throw error;
  }
}

/** Creates a new user account and returns its 24-digit account number. */
export async function authCreate() {
  try {
    const response = await authFetchWarn("authCreate", () =>
      fetch(`${AUTH_API_BASE_URL}/create-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }),
    );

    if (!response.ok) {
      throw new Error(`authCreate HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data?.account_number) {
      throw new Error("authCreate response missing account_number");
    }

    return data.account_number;
  } catch (error) {
    console.warn("[auth-api] authCreate failed", error);
    throw error;
  }
}
