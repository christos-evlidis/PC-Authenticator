import { userMenuAnimationAccountCopy } from "../../animation/account/copy.js";
import { userMenuStateGet } from "../../state/get.js";

async function userMenuActionsAccountCopy() {
  const { authNumber } = userMenuStateGet();

  if (!authNumber) {
    return;
  }

  await navigator.clipboard?.writeText(authNumber);
  await userMenuAnimationAccountCopy();
}

export { userMenuActionsAccountCopy };
