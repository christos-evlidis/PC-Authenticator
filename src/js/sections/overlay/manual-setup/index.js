import { manualSetupActionsFormSubmit } from "./action/form/submit.js";
import { manualSetupActionsPanelClose } from "./action/panel/close.js";
import { manualSetupActionsPanelOpen } from "./action/panel/open.js";
import { manualSetupActionsTypeSwitch } from "./action/type/switch.js";

import { MANUAL_SETUP_BACKDROP_SELECTOR } from "./constants.js";
import { MANUAL_SETUP_CLOSE_BTN_SELECTOR } from "./constants.js";
import { MANUAL_SETUP_FORM_SELECTOR } from "./constants.js";
import { MANUAL_SETUP_OPEN_BTN_SELECTOR } from "./constants.js";
import { MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR } from "./constants.js";
import { MANUAL_SETUP_OTP_TYPE_TRACK_SELECTOR } from "./constants.js";
import { MANUAL_SETUP_PANEL_SELECTOR } from "./constants.js";

function manualSetupInit() {
  document.querySelectorAll(MANUAL_SETUP_OPEN_BTN_SELECTOR).forEach((button) => {
    button.addEventListener("click", () => {
      void manualSetupActionsPanelOpen();
    });
  });

  document
    .querySelector(MANUAL_SETUP_CLOSE_BTN_SELECTOR)
    ?.addEventListener("click", manualSetupActionsPanelClose);

  document
    .querySelector(MANUAL_SETUP_BACKDROP_SELECTOR)
    ?.addEventListener("click", manualSetupActionsPanelClose);

  document
    .querySelector(MANUAL_SETUP_PANEL_SELECTOR)
    ?.addEventListener("click", (event) => {
      event.stopPropagation();
    });

  document.querySelector(MANUAL_SETUP_FORM_SELECTOR)?.addEventListener("submit", (event) => {
    void manualSetupActionsFormSubmit(event);
  });

  const form = document.querySelector(MANUAL_SETUP_FORM_SELECTOR);

  if (form) {
    const typeInput = form.querySelector('[name="type"]');

    if (typeInput) {
      typeInput.value = "totp";
    }

    form.querySelector(MANUAL_SETUP_OTP_TYPE_TRACK_SELECTOR)?.classList.remove("is-hotp");

    form.querySelectorAll(MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR).forEach((button) => {
      button.classList.toggle("is-active", button.dataset.otpType !== "hotp");
      button.addEventListener("click", (event) => {
        event.preventDefault();
        manualSetupActionsTypeSwitch(button.dataset.otpType);
      });
    });
  }
}

export { manualSetupInit };
