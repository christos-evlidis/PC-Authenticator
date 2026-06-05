import { HEADER_BUTTON_SELECTOR } from "../constants.js";
import { HEADER_DISABLED_CLASS } from "../constants.js";
import { HEADER_ROOT_SELECTOR } from "../constants.js";

/** Enables header icon buttons during edit/delete flows. */
function headerIconsEnable() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);

  if (header) {
    header.classList.remove(HEADER_DISABLED_CLASS);
  }

  document.querySelectorAll(HEADER_BUTTON_SELECTOR).forEach((button) => {
    button.disabled = false;
    button.setAttribute("aria-disabled", "false");
  });
}

/** Disables header icon buttons during edit/delete flows. */
function headerIconsDisable() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);

  if (header) {
    header.classList.add(HEADER_DISABLED_CLASS);
  }

  document.querySelectorAll(HEADER_BUTTON_SELECTOR).forEach((button) => {
    button.disabled = true;
    button.setAttribute("aria-disabled", "true");
  });
}

export { headerIconsEnable };
export { headerIconsDisable };
