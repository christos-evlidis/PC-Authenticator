import { cssMs } from "../../../utils/utility-animation.js";
import { delay } from "../../../utils/utility-animation.js";
import { USER_MENU_VAR_ACCOUNT_ACTION_CONFIRM_MS } from "../constants.js";
import { USER_MENU_ACCOUNT_CONFIRMED_CLASS } from "../constants.js";
import { USER_MENU_ACCOUNT_COPY_BTN_SELECTOR } from "../constants.js";
import { USER_MENU_COPY_BUTTON_ANIMATION_RUN_ID } from "../constants.js";

// Swaps the account copy button icon to a checkmark briefly after copying.
export async function userMenuCopyButtonAnimation() {
  const button = document.querySelector(USER_MENU_ACCOUNT_COPY_BTN_SELECTOR);
  const icon = button?.querySelector("i");

  if (!button || !icon) {
    return;
  }

  const runId = ++USER_MENU_COPY_BUTTON_ANIMATION_RUN_ID.value;

  button.classList.add(USER_MENU_ACCOUNT_CONFIRMED_CLASS);
  icon.className = "fas fa-check";

  await delay(cssMs(button, USER_MENU_VAR_ACCOUNT_ACTION_CONFIRM_MS));

  if (runId !== USER_MENU_COPY_BUTTON_ANIMATION_RUN_ID.value) {
    return;
  }

  button.classList.remove(USER_MENU_ACCOUNT_CONFIRMED_CLASS);
  icon.className = "fas fa-copy";
}
