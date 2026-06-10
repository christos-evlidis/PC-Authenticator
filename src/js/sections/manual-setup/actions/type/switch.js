import { manualSetupStateGet } from "../../state/get.js";

import { MANUAL_SETUP_FORM_SELECTOR } from "../../constants.js";
import { MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR } from "../../constants.js";
import { MANUAL_SETUP_OTP_TYPE_TRACK_SELECTOR } from "../../constants.js";

/** Switches the manual setup form between TOTP and HOTP. */
function manualSetupActionsTypeSwitch(otpType) {
  if (manualSetupStateGet().isSubmitting) {
    return;
  }

  const form = document.querySelector(MANUAL_SETUP_FORM_SELECTOR);

  if (!form) {
    return;
  }

  const type = otpType === "hotp" ? "hotp" : "totp";
  const otpIsHotp = type === "hotp";
  const typeInput = form.querySelector('[name="type"]');

  if (typeInput) {
    typeInput.value = type;
  }

  form.querySelector(MANUAL_SETUP_OTP_TYPE_TRACK_SELECTOR)?.classList.toggle("is-hotp", otpIsHotp);

  form.querySelectorAll(MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR).forEach((button) => {
    const buttonType = button.dataset.otpType === "hotp" ? "hotp" : "totp";
    button.classList.toggle("is-active", buttonType === type);
  });
}

export { manualSetupActionsTypeSwitch };
