import { AUTH_API_BASE_URL } from "../../accounts-const.js";

async function authApiCreate() {
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/create-account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.warn(
        `[auth-api] authApiCreate HTTP ${response.status}`,
        response.statusText,
      );
      throw new Error(`authApiCreate HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data?.account_number) {
      throw new Error("authApiCreate response missing account_number");
    }

    return data.account_number;
  } catch (error) {
    console.warn("[auth-api] authApiCreate failed", error);
    throw error;
  }
}

export { authApiCreate };
