export const OTP_TYPE_TRACK_SELECTOR = ".manual-setup-type-selector__track";
export const OTP_TYPE_BTN_SELECTOR = ".manual-setup-type-selector__btn";

export function getFormOtpType(form) {
  const typeInput = form.querySelector('[name="type"]');
  const value = String(typeInput?.value ?? "").toLowerCase();

  return value === "hotp" ? "hotp" : "totp";
}

export function setFormOtpType(form, type) {
  const isHotp = type === "hotp";
  const track = form.querySelector(OTP_TYPE_TRACK_SELECTOR);
  const typeInput = form.querySelector('[name="type"]');

  if (typeInput) {
    typeInput.value = isHotp ? "hotp" : "totp";
  }

  track?.classList.toggle("is-hotp", isHotp);

  form.querySelectorAll(OTP_TYPE_BTN_SELECTOR).forEach((button) => {
    const buttonType = button.dataset.otpType === "hotp" ? "hotp" : "totp";
    button.classList.toggle(
      "is-active",
      buttonType === (isHotp ? "hotp" : "totp"),
    );
  });
}

export function getFormSnapshot(form) {
  const data = new FormData(form);

  return {
    name: String(data.get("name") ?? ""),
    email: String(data.get("email") ?? ""),
    secret: String(data.get("secret") ?? ""),
    type: getFormOtpType(form),
  };
}

export function restoreFormSnapshot(form, snapshot) {
  const nameInput = form.querySelector('[name="name"]');
  const emailInput = form.querySelector('[name="email"]');
  const secretInput = form.querySelector('[name="secret"]');

  if (nameInput) nameInput.value = snapshot.name;
  if (emailInput) emailInput.value = snapshot.email;
  if (secretInput) secretInput.value = snapshot.secret;
  setFormOtpType(form, snapshot.type === "hotp" ? "hotp" : "totp");
}

export function clearForm(form) {
  form.reset();
  setFormOtpType(form, "totp");
}

export function setSubmitDisabled(form, isDisabled) {
  const submit = form.querySelector(".manual-setup-form__submit");

  if (submit) {
    submit.disabled = isDisabled;
  }

  form.querySelectorAll(OTP_TYPE_BTN_SELECTOR).forEach((button) => {
    button.disabled = isDisabled;
  });
}
