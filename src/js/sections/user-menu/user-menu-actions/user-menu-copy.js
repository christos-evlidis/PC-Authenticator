import { userMenuStateGet } from "../user-menu-state.js";
import { userMenuCopyButtonAnimation } from "../user-menu-animations/user-menu-copy-button-animation.js";

// Copies the signed-in account number and confirms the action in the field button.
export async function userMenuAccountCopy() {
  const { accountNumber } = userMenuStateGet();

  if (!accountNumber) {
    return;
  }

  await navigator.clipboard?.writeText(accountNumber);
  await userMenuCopyButtonAnimation();
}
