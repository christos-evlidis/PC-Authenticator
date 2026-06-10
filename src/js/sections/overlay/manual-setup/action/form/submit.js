import { authStorageGet } from "../../../../../accounts/accounts-index.js";
import { dataActionAddManual } from "../../../../../accounts/accounts-index.js";
import { codesActionAdd } from "../../../../shell/codes/codes-index.js";
import { authChromeApply } from "../../../../../utils/utility-auth.js";
import { manualSetupActionFormEnable } from "./enable.js";
import { manualSetupActionFormReset } from "./reset.js";
import { manualSetupActionPanelClose } from "../panel/close.js";
import { manualSetupAnimationSubmitFinish } from "../../animation/finish.js";
import { manualSetupAnimationSubmit } from "../../animation/submit.js";
import { manualSetupStateGet } from "../../state/get.js";

import { MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR } from "../../manual-setup-const.js";
import { MANUAL_SETUP_ROOT_SELECTOR } from "../../manual-setup-const.js";
import { MANUAL_SETUP_SUBMITTING_CLASS } from "../../manual-setup-const.js";

/** Validates and adds a manual account with submit animation. */
async function manualSetupActionFormSubmit(event) {
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

  let addedAccount = null;

  const isSuccess = await manualSetupAnimationSubmit(async () => {
    addedAccount = await addPromise;
    return true;
  });

  if (isSuccess) {
    manualSetupActionFormReset(form);

    if (addedAccount) {
      await codesActionAdd(addedAccount);
      await authChromeApply({
        isSignedIn: true,
        hasAccounts: true,
        authNumber: await authStorageGet(),
      });
    }
  }

  manualSetupActionFormEnable(form);
  await manualSetupActionPanelClose();
  manualSetupAnimationSubmitFinish();

  document.querySelector(MANUAL_SETUP_ROOT_SELECTOR)?.classList.remove(MANUAL_SETUP_SUBMITTING_CLASS);
}

export { manualSetupActionFormSubmit };
