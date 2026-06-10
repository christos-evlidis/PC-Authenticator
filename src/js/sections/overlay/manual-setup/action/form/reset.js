import { MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR } from "../../constants.js";
import { MANUAL_SETUP_OTP_TYPE_TRACK_SELECTOR } from "../../constants.js";

function manualSetupActionsFormReset(form) {
  form.reset();

  const typeInput = form.querySelector('[name="type"]');

  if (typeInput) {
    typeInput.value = "totp";
  }

  form.querySelector(MANUAL_SETUP_OTP_TYPE_TRACK_SELECTOR)?.classList.remove("is-hotp");

  form.querySelectorAll(MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR).forEach((button) => {
    button.classList.toggle("is-active", button.dataset.otpType !== "hotp");
  });
}

export { manualSetupActionsFormReset };
