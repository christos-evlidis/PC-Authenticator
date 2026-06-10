import { manualSetupActionsFormSubmit } from "./action/form/submit.js";
import { manualSetupActionsPanelClose } from "./action/panel/close.js";
import { manualSetupActionsPanelOpen } from "./action/panel/open.js";
import { manualSetupActionsTypeSwitch } from "./action/type/switch.js";

import { MANUAL_SETUP_BACKDROP_SELECTOR } from "./manual-setup-const.js";
import { MANUAL_SETUP_CLOSE_BTN_SELECTOR } from "./manual-setup-const.js";
import { MANUAL_SETUP_FORM_SELECTOR } from "./manual-setup-const.js";
import { MANUAL_SETUP_OPEN_BTN_SELECTOR } from "./manual-setup-const.js";
import { MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR } from "./manual-setup-const.js";
import { MANUAL_SETUP_OTP_TYPE_TRACK_SELECTOR } from "./manual-setup-const.js";
import { MANUAL_SETUP_PANEL_SELECTOR } from "./manual-setup-const.js";

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

export { manualSetupActionsFormEnable } from "./action/form/enable.js";
export { manualSetupActionsFormReset } from "./action/form/reset.js";
export { manualSetupActionsFormSubmit } from "./action/form/submit.js";
export { manualSetupActionsPanelClose } from "./action/panel/close.js";
export { manualSetupActionsPanelOpen } from "./action/panel/open.js";
export { manualSetupActionsTypeSwitch } from "./action/type/switch.js";
export { manualSetupAnimationClose } from "./animation/close.js";
export { manualSetupAnimationOpen } from "./animation/open.js";
export { manualSetupAnimationSubmit } from "./animation/submit.js";
export { manualSetupStateGet } from "./state/get.js";
export { manualSetupStateSet } from "./state/set.js";
export { manualSetupStateStore } from "./state/store.js";
