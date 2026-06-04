import { userMenuStateGet } from "../state.js";
import { userMenuCopyButtonAnimation } from "../animations/copy-button-animation.js";

// Copies the signed-in account number and confirms the action in the field button.
export async function userMenuAccountCopy() {
  const { accountNumber } = userMenuStateGet();

  if (!accountNumber) {
    return;
  }

  await navigator.clipboard?.writeText(accountNumber);
  await userMenuCopyButtonAnimation();
}
