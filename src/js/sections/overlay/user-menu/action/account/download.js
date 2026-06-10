import { userMenuAnimationAccountDownload } from "../../animation/account/download.js";
import { userMenuStateGet } from "../../state/get.js";

/** Downloads the account number as a text file with confirmation animation. */
async function userMenuActionAccountDownload() {
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

  await userMenuAnimationAccountDownload();
}

export { userMenuActionAccountDownload };
