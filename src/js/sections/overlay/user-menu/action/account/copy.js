import { userMenuAnimationAccountCopy } from "../../animation/account/copy.js";
import { userMenuStateGet } from "../../state/get.js";

/** Copies the signed-in account number with confirmation animation. */
async function userMenuActionAccountCopy() {
  const { authNumber } = userMenuStateGet();

  if (!authNumber) {
    return;
  }

  await navigator.clipboard?.writeText(authNumber);
  await userMenuAnimationAccountCopy();
}

export { userMenuActionAccountCopy };
