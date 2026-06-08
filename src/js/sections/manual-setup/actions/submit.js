import { dataAddManual } from "../../../accounts/accounts-index.js";
import { authNumberGet } from "../../../accounts/accounts-index.js";
import { manualSetupSubmitAnimation } from "../animations/submit.js";
import { manualSetupStateGet } from "../state.js";

import { MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR } from "../constants.js";
import { MANUAL_SETUP_OTP_TYPE_TRACK_SELECTOR } from "../constants.js";
import { MANUAL_SETUP_ROOT_SELECTOR } from "../constants.js";
import { MANUAL_SETUP_SUBMITTING_CLASS } from "../constants.js";

/** Re-enables manual setup form controls. */
function manualSetupFormEnable(form) {
  const submit = form.querySelector(".manual-setup__submit");

  if (submit) {
    submit.disabled = false;
  }

  form.querySelectorAll(MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR).forEach((button) => {
    button.disabled = false;
  });
}

/** Resets the manual setup form to its default state. */
function manualSetupFormReset(form) {
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

/** Handles manual setup form submission. */
async function manualSetupFormSubmit(event) {
  event.preventDefault();

  if (manualSetupStateGet().isSubmitting) {
    return;
  }

  const form = event.currentTarget;
  const data = new FormData(form);
  const typeValue = String(form.querySelector('[name="type"]')?.value ?? "").toLowerCase();
  const snapshot = {
    name: String(data.get("name") ?? ""),
    email: String(data.get("email") ?? ""),
    secret: String(data.get("secret") ?? ""),
    type: typeValue === "hotp" ? "hotp" : "totp",
  };

  document.querySelector(MANUAL_SETUP_ROOT_SELECTOR)?.classList.add(MANUAL_SETUP_SUBMITTING_CLASS);

  const submit = form.querySelector(".manual-setup__submit");

  if (submit) {
    submit.disabled = true;
  }

  form.querySelectorAll(MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR).forEach((button) => {
    button.disabled = true;
  });

  const addPromise = authNumberGet().then((authNumber) =>
    dataAddManual(authNumber, snapshot),
  );

  await manualSetupSubmitAnimation(
    () => addPromise,
    (isSuccess) => {
      if (isSuccess) {
        manualSetupFormReset(form);
      }

      manualSetupFormEnable(form);
    },
  );

  document.querySelector(MANUAL_SETUP_ROOT_SELECTOR)?.classList.remove(MANUAL_SETUP_SUBMITTING_CLASS);
}

export { manualSetupFormSubmit };
