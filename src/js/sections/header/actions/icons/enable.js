import { HEADER_BUTTON_SELECTOR } from "../../constants.js";
import { HEADER_DISABLED_CLASS } from "../../constants.js";
import { HEADER_ROOT_SELECTOR } from "../../constants.js";

/** Enables header icon buttons during edit/delete flows. */
function headerActionsIconsEnable() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);

  if (header) {
    header.classList.remove(HEADER_DISABLED_CLASS);
  }

  document.querySelectorAll(HEADER_BUTTON_SELECTOR).forEach((button) => {
    button.disabled = false;
    button.setAttribute("aria-disabled", "false");
  });
}

export { headerActionsIconsEnable };
