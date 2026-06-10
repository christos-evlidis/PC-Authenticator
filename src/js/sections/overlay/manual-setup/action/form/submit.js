import { authStorageGet } from "../../../../../accounts/accounts-index.js";
import { dataActionAddManual } from "../../../../../accounts/accounts-index.js";
import { authChromeApply } from "../../../../../utils/utility-auth.js";
import { codesActionsAdd } from "../../../../shell/codes/codes-index.js";
import { manualSetupActionsFormEnable } from "./enable.js";
import { manualSetupActionsFormReset } from "./reset.js";
import { manualSetupActionsPanelClose } from "../panel/close.js";
import { manualSetupAnimationSubmit } from "../../animation/submit.js";
import { manualSetupAnimationSubmitFinish } from "../../animation/submit-finish.js";
import { manualSetupStateGet } from "../../state/get.js";

import { MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR } from "../../manual-setup-const.js";
import { MANUAL_SETUP_ROOT_SELECTOR } from "../../manual-setup-const.js";
import { MANUAL_SETUP_SUBMITTING_CLASS } from "../../manual-setup-const.js";

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

  let addedAccount = null;

  const isSuccess = await manualSetupAnimationSubmit(async () => {
    addedAccount = await addPromise;
    return true;
  });

  if (isSuccess) {
    manualSetupActionsFormReset(form);

    if (addedAccount) {
      await codesActionsAdd(addedAccount);
      await authChromeApply({
        isSignedIn: true,
        hasAccounts: true,
        authNumber: await authStorageGet(),
      });
    }
  }

  manualSetupActionsFormEnable(form);
  await manualSetupActionsPanelClose();
  manualSetupAnimationSubmitFinish();

  document.querySelector(MANUAL_SETUP_ROOT_SELECTOR)?.classList.remove(MANUAL_SETUP_SUBMITTING_CLASS);
}

export { manualSetupActionsFormSubmit };
