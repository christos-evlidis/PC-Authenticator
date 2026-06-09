import { manualSetupFormSubmit } from "./actions/submit.js";
import { manualSetupPanelClose } from "./actions/close.js";
import { manualSetupPanelOpen } from "./actions/open.js";
import { manualSetupTypeSwitch } from "./actions/type-switch.js";
import { manualSetupStateGet } from "./state.js";

import { MANUAL_SETUP_ACTIVE_CLASS } from "./constants.js";
import { MANUAL_SETUP_BACKDROP_SELECTOR } from "./constants.js";
import { MANUAL_SETUP_CLOSE_BTN_SELECTOR } from "./constants.js";
import { MANUAL_SETUP_FORM_SELECTOR } from "./constants.js";
import { MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR } from "./constants.js";
import { MANUAL_SETUP_OTP_TYPE_TRACK_SELECTOR } from "./constants.js";
import { MANUAL_SETUP_OPEN_BTN_SELECTOR } from "./constants.js";
import { MANUAL_SETUP_PANEL_SELECTOR } from "./constants.js";
import { MANUAL_SETUP_ROOT_SELECTOR } from "./constants.js";

/** Returns whether the manual setup overlay is currently open. */
function manualSetupIsActive() {
  return (
    manualSetupStateGet().isOpen
    || (document.querySelector(MANUAL_SETUP_ROOT_SELECTOR)?.classList.contains(MANUAL_SETUP_ACTIVE_CLASS)
      ?? false)
  );
}

/** Registers manual setup listeners. */
function manualSetupInit() {
  document.querySelectorAll(MANUAL_SETUP_OPEN_BTN_SELECTOR).forEach((button) => {
    button.addEventListener("click", () => {
      void manualSetupPanelOpen();
    });
  });

  document
    .querySelector(MANUAL_SETUP_CLOSE_BTN_SELECTOR)
    ?.addEventListener("click", manualSetupPanelClose);

  document
    .querySelector(MANUAL_SETUP_BACKDROP_SELECTOR)
    ?.addEventListener("click", manualSetupPanelClose);

  document
    .querySelector(MANUAL_SETUP_PANEL_SELECTOR)
    ?.addEventListener("click", (event) => {
      event.stopPropagation();
    });

  document.querySelector(MANUAL_SETUP_FORM_SELECTOR)?.addEventListener("submit", (event) => {
    void manualSetupFormSubmit(event);
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
        manualSetupTypeSwitch(button.dataset.otpType);
      });
    });
  }
}

export const manualSetupSection = {
  init: manualSetupInit,
  open: manualSetupPanelOpen,
  close: manualSetupPanelClose,
  isActive: manualSetupIsActive,
};
