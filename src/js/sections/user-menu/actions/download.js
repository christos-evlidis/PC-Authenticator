import { userMenuStateGet } from "../state.js";
import { userMenuDownloadButtonAnimation } from "../animations/download-button-animation.js";

// Downloads the signed-in account number as a local backup text file.
export async function userMenuAccountDownload() {
  const { accountNumber } = userMenuStateGet();

  if (!accountNumber) {
    return;
  }

  const blob = new Blob([`${accountNumber}\n`], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "pc-authenticator-account-number.txt";
  link.click();
  URL.revokeObjectURL(url);
  await userMenuDownloadButtonAnimation();
}
