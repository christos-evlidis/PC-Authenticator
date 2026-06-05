import { dataAddManual } from "../../accounts/account-index.js";
import { cross } from "../section-cross.js";
import { accountNumberGet } from "../../accounts/account-index.js";
import { clearForm } from "./manual-setup-form-utils.js";
import { getFormSnapshot } from "./manual-setup-form-utils.js";
import { getManualSetupForm } from "./manual-setup-panel.js";
import { getIsManualSubmitting } from "./manual-setup-panel.js";
import { isAuthFlowLocked } from "./manual-setup-panel.js";
import { setAuthFlowLock } from "./manual-setup-panel.js";
import { setIsManualSubmitting } from "./manual-setup-panel.js";
import { OTP_TYPE_BTN_SELECTOR } from "./manual-setup-form-utils.js";
import { setFormOtpType } from "./manual-setup-form-utils.js";
import { setSubmitDisabled } from "./manual-setup-form-utils.js";

export {
  OTP_TYPE_BTN_SELECTOR,
  OTP_TYPE_TRACK_SELECTOR,
  clearForm,
  getFormOtpType,
  getFormSnapshot,
  restoreFormSnapshot,
  setFormOtpType,
  setSubmitDisabled,
} from "./manual-setup-form-utils.js";

export async function createAddAccountPromise(formData) {
  const accountNumber = await accountNumberGet();

  return dataAddManual(accountNumber, formData);
}

export async function submitManualAddAccount(form) {
  if (isAuthFlowLocked() || getIsManualSubmitting()) {
    return;
  }

  const snapshot = getFormSnapshot(form);
  setIsManualSubmitting(true);
  setAuthFlowLock(true);
  setSubmitDisabled(form, true);

  try {
    const addedAccount = await createAddAccountPromise(snapshot);
    clearForm(form);
    await cross.codes.animateManualAccountAdd(addedAccount);
  } finally {
    setIsManualSubmitting(false);
    setAuthFlowLock(false);
    setSubmitDisabled(form, false);
  }
}

export function initManualSetupForm() {
  const form = getManualSetupForm();

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitManualAddAccount(event.currentTarget);
  });

  if (form) {
    setFormOtpType(form, "totp");

    form.querySelectorAll(OTP_TYPE_BTN_SELECTOR).forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();

        if (isAuthFlowLocked() || getIsManualSubmitting()) {
          return;
        }

        setFormOtpType(
          form,
          button.dataset.otpType === "hotp" ? "hotp" : "totp",
        );
      });
    });
  }
}
