import { cssMs } from "../../../utils/utility-animation.js";
import { delay } from "../../../utils/utility-animation.js";
import { USER_MENU_VAR_ACCOUNT_ACTION_CONFIRM_MS } from "../user-menu-constants.js";
import { USER_MENU_ACCOUNT_CONFIRMED_CLASS } from "../user-menu-constants.js";
import { USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR } from "../user-menu-constants.js";
import { USER_MENU_DOWNLOAD_BUTTON_ANIMATION_RUN_ID } from "../user-menu-constants.js";

// Swaps the account download button icon to a checkmark after downloading.
export async function userMenuDownloadButtonAnimation() {
  const button = document.querySelector(USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR);
  const icon = button?.querySelector("i");

  if (!button || !icon) {
    return;
  }

  const runId = ++USER_MENU_DOWNLOAD_BUTTON_ANIMATION_RUN_ID.value;

  button.classList.add(USER_MENU_ACCOUNT_CONFIRMED_CLASS);
  icon.className = "fas fa-check";

  await delay(cssMs(button, USER_MENU_VAR_ACCOUNT_ACTION_CONFIRM_MS));

  if (runId !== USER_MENU_DOWNLOAD_BUTTON_ANIMATION_RUN_ID.value) {
    return;
  }

  button.classList.remove(USER_MENU_ACCOUNT_CONFIRMED_CLASS);
  icon.className = "fas fa-download";
}
