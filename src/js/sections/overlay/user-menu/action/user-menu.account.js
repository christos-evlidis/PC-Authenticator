import { userMenuAnimationCopyRun } from "../user-menu.animation.js";
import { userMenuAnimationDownloadRun } from "../user-menu.animation.js";

import { appStateGet } from "../../../../app/app.state.js";


// Copies the signed-in user's account number to their clipboard.
async function userMenuAccountNumberCopy() {
  const authKey = appStateGet().authKey;

  if (!authKey) { return; }

  await navigator.clipboard?.writeText(authKey);

  void userMenuAnimationCopyRun();
}

// Triggers a file download containing the signed-in user's account number.
async function userMenuAccountNumberDownload() {
  const authKey = appStateGet().authKey;

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

  void userMenuAnimationDownloadRun();
}


export { userMenuAccountNumberCopy };
export { userMenuAccountNumberDownload };
