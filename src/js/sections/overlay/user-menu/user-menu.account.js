import { userMenuDomSet } from "./user-menu.dom.js";
import { userMenuStateGet } from "./user-menu.state.js";
import { userMenuAnimationAccountConfirm } from "./user-menu.animation.js";

function userMenuAccountUpdate(value) {
  userMenuDomSet({ accountValue: value });
}

async function userMenuAccountCopy() {
  const { authNumber } = userMenuStateGet();

  if (!authNumber) {
    return;
  }

  await navigator.clipboard?.writeText(authNumber);
  await userMenuAnimationAccountConfirm("copy");
}

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

  await userMenuAnimationAccountConfirm("download");
}

export { userMenuAccountCopy };
export { userMenuAccountDownload };
export { userMenuAccountUpdate };
