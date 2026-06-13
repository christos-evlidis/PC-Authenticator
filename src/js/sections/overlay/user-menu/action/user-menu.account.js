import { appAuthGet } from "../../../../app/app.actions.js";

import { userMenuAnimationCopyRun, userMenuAnimationDownloadRun } from "../user-menu.animation.js";

/** Copies the signed-in account number to the clipboard. */
async function userMenuAccountNumberCopy() {
  const authKey = appAuthGet(); // Read the signed-in account number from app state.
  if (!authKey) { return; } // Stop when there is no account number to copy.
  await navigator.clipboard?.writeText(authKey); // Write the account number to the clipboard.
  void userMenuAnimationCopyRun(); // Play the copy confirmation animation on the button.
}

/** Downloads the signed-in account number as a text file. */
async function userMenuAccountNumberDownload() {
  const authKey = appAuthGet(); // Read the signed-in account number from app state.
  if (!authKey) { return; } // Stop when there is no account number to download.
  const blob = new Blob([authKey], { type: "text/plain" }); // Build a plain-text file payload from the account number.
  const url = URL.createObjectURL(blob); // Create a temporary object URL for the file blob.
  const link = document.createElement("a"); // Create a hidden anchor element for the download.
  link.href = url; // Point the anchor at the temporary file URL.
  link.download = "pc-authenticator-account-number.txt"; // Set the downloaded file name.
  document.body.appendChild(link); // Attach the anchor so the browser can trigger the download.
  link.click(); // Programmatically click the anchor to start the download.
  link.remove(); // Remove the temporary anchor from the page.
  URL.revokeObjectURL(url); // Release the temporary object URL from memory.
  void userMenuAnimationDownloadRun(); // Play the download confirmation animation on the button.
}

export { userMenuAccountNumberCopy, userMenuAccountNumberDownload };
