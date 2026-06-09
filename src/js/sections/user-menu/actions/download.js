import { userMenuStateGet } from "../state.js";
import { userMenuDownloadButtonAnimation } from "../animations/download-button.js";

/** Downloads the signed-in account number as a local accountsBackup text file. */
async function userMenuAccountDownload() {
  const { authNumber } = userMenuStateGet();

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
  await userMenuDownloadButtonAnimation();
}

export { userMenuAccountDownload };
