import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { animDelay } from "../../../../../utils/utility-animation.js";

import { USER_MENU_ACCOUNT_CONFIRMED_CLASS } from "../../user-menu-const.js";
import { USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR } from "../../user-menu-const.js";
import { USER_MENU_DOWNLOAD_BUTTON_ANIMATION_RUN_ID } from "../../user-menu-const.js";
import { USER_MENU_VAR_ACCOUNT_ACTION_CONFIRM_MS } from "../../user-menu-const.js";

/** Shows a brief checkmark confirmation on the download button. */
async function userMenuAnimationAccountDownload() {
  const button = document.querySelector(USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR);
  const icon = button?.querySelector("i");

  if (!button || !icon) {
    return;
  }

  const runId = ++USER_MENU_DOWNLOAD_BUTTON_ANIMATION_RUN_ID.value;

  button.classList.add(USER_MENU_ACCOUNT_CONFIRMED_CLASS);
  icon.className = "fas fa-check";

  await animDelay(animCssMsGet(button, USER_MENU_VAR_ACCOUNT_ACTION_CONFIRM_MS));

  if (runId !== USER_MENU_DOWNLOAD_BUTTON_ANIMATION_RUN_ID.value) {
    return;
  }

  button.classList.remove(USER_MENU_ACCOUNT_CONFIRMED_CLASS);
  icon.className = "fas fa-download";
}

export { userMenuAnimationAccountDownload };
