import { authStorageGet } from "../../../../../accounts/auth/storage/get.js";
import { dataActionAddManual } from "../../../../../accounts/data/action/add/manual.js";
import { manualSetupActionsFormEnable } from "./enable.js";
import { manualSetupActionsFormReset } from "./reset.js";
import { manualSetupAnimationSubmit } from "../../animation/submit.js";
import { manualSetupStateGet } from "../../state/get.js";

import { MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR } from "../../constants.js";
import { MANUAL_SETUP_ROOT_SELECTOR } from "../../constants.js";
import { MANUAL_SETUP_SUBMITTING_CLASS } from "../../constants.js";

async function manualSetupActionsFormSubmit(event) {
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

  const addPromise = authStorageGet().then((authNumber) =>
    dataActionAddManual(authNumber, snapshot),
  );

  await manualSetupAnimationSubmit(
    () => addPromise,
    (isSuccess) => {
      if (isSuccess) {
        manualSetupActionsFormReset(form);
      }

      manualSetupActionsFormEnable(form);
    },
  );

  document.querySelector(MANUAL_SETUP_ROOT_SELECTOR)?.classList.remove(MANUAL_SETUP_SUBMITTING_CLASS);
}

export { manualSetupActionsFormSubmit };
