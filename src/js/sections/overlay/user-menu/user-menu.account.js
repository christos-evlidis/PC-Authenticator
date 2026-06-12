import { authStorageGet } from "../../../accounts/accounts-index.js";

// Copies the signed-in user's account number to their clipboard.
async function userMenuAccountNumberCopy() {
  const authNumber = await authStorageGet();

  if (!authNumber) {
    return;
  }

  await navigator.clipboard?.writeText(authNumber);
}

// Triggers a file download containing the signed-in user's account number.
async function userMenuAccountNumberDownload() {
  const authNumber = await authStorageGet();

  if (!authNumber) {
    return;
  }

  const blob = new Blob([`${authNumber}\n`], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "pc-authenticator-account-number.txt";
  link.click();
  URL.revokeObjectURL(url);
}

export { userMenuAccountNumberCopy, userMenuAccountNumberDownload };
