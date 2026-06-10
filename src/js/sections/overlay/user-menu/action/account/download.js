import { userMenuAnimationAccountDownload } from "../../animation/account/download.js";
import { userMenuStateGet } from "../../state/get.js";

async function userMenuActionsAccountDownload() {
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

export { userMenuActionsAccountDownload };
