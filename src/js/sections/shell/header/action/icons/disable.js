import { HEADER_BUTTON_SELECTOR } from "../../constants.js";
import { HEADER_DISABLED_CLASS } from "../../constants.js";
import { HEADER_ROOT_SELECTOR } from "../../constants.js";

function headerActionsIconsDisable() {
  const header = document.querySelector(HEADER_ROOT_SELECTOR);

  if (header) {
    header.classList.add(HEADER_DISABLED_CLASS);
  }

  document.querySelectorAll(HEADER_BUTTON_SELECTOR).forEach((button) => {
    button.disabled = true;
    button.setAttribute("aria-disabled", "true");
  });
}

export { headerActionsIconsDisable };
