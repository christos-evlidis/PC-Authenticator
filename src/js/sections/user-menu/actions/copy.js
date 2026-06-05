import { userMenuStateGet } from "../state.js";
import { userMenuCopyButtonAnimation } from "../animations/copy-button.js";

/** Copies the signed-in account number and confirms the action in the field button. */
async function userMenuAccountCopy() {
  const { authNumber } = userMenuStateGet();

  if (!authNumber) {
    return;
  }

  await navigator.clipboard?.writeText(authNumber);
  await userMenuCopyButtonAnimation();
}

export { userMenuAccountCopy };
