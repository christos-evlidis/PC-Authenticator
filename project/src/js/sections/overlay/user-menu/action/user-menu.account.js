import { appAuthGet } from "../../../../app/app.actions.js";

/** Copies the signed-in account number to the clipboard. */
async function _userMenuAccountNumberCopy() {
  const authKey = appAuthGet();
  if (!authKey) { return; }
  await navigator.clipboard?.writeText(authKey);
}

/** Downloads the signed-in account number as a text file. */
async function _userMenuAccountNumberDownload() {
  const authKey = appAuthGet();
  if (!authKey) { return; }
  const blob = new Blob([authKey], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "pc-authenticator-account-number.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export {
  _userMenuAccountNumberCopy as userMenuAccountNumberCopy,
  _userMenuAccountNumberDownload as userMenuAccountNumberDownload,
};
