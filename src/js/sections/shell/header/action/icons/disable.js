import { HEADER_BUTTON_SELECTOR } from "../../header-const.js";
import { HEADER_DISABLED_CLASS } from "../../header-const.js";
import { HEADER_ROOT_SELECTOR } from "../../header-const.js";

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
