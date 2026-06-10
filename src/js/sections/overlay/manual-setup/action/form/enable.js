import { MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR } from "../../manual-setup-const.js";

function manualSetupActionsFormEnable(form) {
  const submit = form.querySelector(".manual-setup__submit");

  if (submit) {
    submit.disabled = false;
  }

  form.querySelectorAll(MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR).forEach((button) => {
    button.disabled = false;
  });
}

export { manualSetupActionsFormEnable };
