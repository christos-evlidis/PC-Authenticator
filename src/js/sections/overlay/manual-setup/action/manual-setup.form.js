import { authStorageGet } from "../../../../services/auth/auth-index.js";
import { dataActionAddManual } from "../../../../services/data/data-index.js";
import { codesActionAdd } from "../../../shell/codes/action/add.js";
import { appSessionRefresh } from "../../../../app/app.session.js";
import { manualSetupPanelClose } from "./manual-setup.panel.js";
import { manualSetupAnimationSubmitFinish, manualSetupAnimationSubmit } from "../manual-setup.animation.js";
import { manualSetupStateGet } from "../manual-setup.state.js";
import {MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR,MANUAL_SETUP_ROOT_SELECTOR,MANUAL_SETUP_SUBMITTING_CLASS,MANUAL_SETUP_OTP_TYPE_TRACK_SELECTOR } from "../../../../const/const.manual-setup.js";

function _manualSetupFormEnable(form) {
  const submit = form.querySelector(".manual-setup__submit");
  if (submit) {
    submit.disabled = false;
  }
  form.querySelectorAll(MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR).forEach((button) => {
    button.disabled = false;
  });
}

function _manualSetupFormReset(form) {
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

async function _manualSetupFormSubmit(event) {
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
    _manualSetupFormReset(form);
  }
  _manualSetupFormEnable(form);
  await manualSetupPanelClose();
  manualSetupAnimationSubmitFinish();
  if (isSuccess && addedAccount) {
    await codesActionAdd(addedAccount);
    await appSessionRefresh();
  }
  document.querySelector(MANUAL_SETUP_ROOT_SELECTOR)?.classList.remove(MANUAL_SETUP_SUBMITTING_CLASS);
}

export { _manualSetupFormEnable as manualSetupFormEnable, _manualSetupFormReset as manualSetupFormReset, _manualSetupFormSubmit as manualSetupFormSubmit };
