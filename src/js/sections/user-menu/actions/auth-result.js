import { signInAnimationCancel } from "../../sequences/index.js";
import { signInAnimationPrepare } from "../../sequences/index.js";
import { bodyAnimationPrepare } from "../../body/index.js";
import { headerAnimationPrepare } from "../../header/index.js";
import { refreshAuth } from "../../../utils/utility-auth.js";
import { themeRead } from "../../../utils/utility-theme.js";
import { THEME_DARK } from "../../../utils/utility-theme.js";
import { USER_MENU_ACTIVE_CLASS } from "../constants.js";
import { USER_MENU_AUTH_BAR_SELECTOR } from "../constants.js";
import { USER_MENU_AUTH_BTN_SELECTOR } from "../constants.js";
import { USER_MENU_AUTH_SIGN_IN_CLASS } from "../constants.js";
import { USER_MENU_AUTH_SIGN_UP_CLASS } from "../constants.js";
import { USER_MENU_AUTH_TRACK_SELECTOR } from "../constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN } from "../constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "../constants.js";
import { USER_MENU_CONTENT_SELECTOR } from "../constants.js";
import { USER_MENU_HEADER_SELECTOR } from "../constants.js";
import { USER_MENU_HIDDEN_CLASS } from "../constants.js";
import { USER_MENU_PANEL_SELECTOR } from "../constants.js";
import { USER_MENU_SIGNED_OUT_VIEW_SELECTOR } from "../constants.js";
import { USER_MENU_SIGN_IN_INPUT_SELECTOR } from "../constants.js";
import { USER_MENU_SIGN_IN_VIEW_SELECTOR } from "../constants.js";
import { USER_MENU_SIGN_UP_VIEW_SELECTOR } from "../constants.js";
import { USER_MENU_STATUS_ERROR_SELECTOR } from "../constants.js";
import { USER_MENU_STATUS_LOADING_SELECTOR } from "../constants.js";
import { USER_MENU_STATUS_SUCCESS_SELECTOR } from "../constants.js";
import { USER_MENU_THEME_BTN_SELECTOR } from "../constants.js";
import { USER_MENU_THEME_DARK_CLASS } from "../constants.js";
import { USER_MENU_THEME_LIGHT_CLASS } from "../constants.js";
import { USER_MENU_THEME_TRACK_SELECTOR } from "../constants.js";

/** Returns whether the auth sequence animation has the DOM it needs. */
export function userMenuAuthAnimationCanRun() {
  return Boolean(
    document.querySelector(USER_MENU_PANEL_SELECTOR) &&
      document.querySelector(USER_MENU_HEADER_SELECTOR) &&
      document.querySelector(USER_MENU_AUTH_BAR_SELECTOR) &&
      document.querySelector(USER_MENU_CONTENT_SELECTOR) &&
      document.querySelector(USER_MENU_SIGNED_OUT_VIEW_SELECTOR) &&
      document.querySelector(USER_MENU_STATUS_LOADING_SELECTOR) &&
      document.querySelector(USER_MENU_STATUS_SUCCESS_SELECTOR) &&
      document.querySelector(USER_MENU_STATUS_ERROR_SELECTOR),
  );
}

/** Clears the sign-in credential input. */
export function userMenuSignInInputClear() {
  const input = document.querySelector(USER_MENU_SIGN_IN_INPUT_SELECTOR);

  if (input) {
    input.value = "";
  }
}

/** Applies sign-in result state after the shrink phase, before menu restore fade. */
export async function userMenuAuthSignInResultApply(resultIsSuccess) {
  if (resultIsSuccess) {
    await headerAnimationPrepare("sign-in-fade");
    await bodyAnimationPrepare("sign-in-fade");
    await refreshAuth();
    await signInAnimationPrepare();
    userMenuSignInInputClear();

    const theme = themeRead();

    document.querySelectorAll(USER_MENU_THEME_BTN_SELECTOR).forEach((button) => {
      button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.theme === theme);
    });

    const themeTrack = document.querySelector(USER_MENU_THEME_TRACK_SELECTOR);
    const isDark = theme === THEME_DARK;

    themeTrack?.classList.toggle(USER_MENU_THEME_LIGHT_CLASS, !isDark);
    themeTrack?.classList.toggle(USER_MENU_THEME_DARK_CLASS, isDark);
    return;
  }

  const signInView = document.querySelector(USER_MENU_SIGN_IN_VIEW_SELECTOR);
  const signUpView = document.querySelector(USER_MENU_SIGN_UP_VIEW_SELECTOR);

  signInView?.classList.remove(USER_MENU_HIDDEN_CLASS);
  signUpView?.classList.add(USER_MENU_HIDDEN_CLASS);

  document.querySelectorAll(USER_MENU_AUTH_BTN_SELECTOR).forEach((button) => {
    button.classList.toggle(
      USER_MENU_ACTIVE_CLASS,
      button.dataset.view === USER_MENU_AUTH_VIEW_SIGN_IN,
    );
  });

  const authTrack = document.querySelector(USER_MENU_AUTH_TRACK_SELECTOR);

  authTrack?.classList.add(USER_MENU_AUTH_SIGN_IN_CLASS);
  authTrack?.classList.remove(USER_MENU_AUTH_SIGN_UP_CLASS);
}

/** Applies sign-up result state after the shrink phase, before menu restore fade. */
export async function userMenuAuthSignUpResultApply(resultIsSuccess) {
  if (resultIsSuccess) {
    await headerAnimationPrepare("sign-in-fade");
    await bodyAnimationPrepare("sign-in-fade");
    await refreshAuth();
    await signInAnimationPrepare();
    userMenuSignInInputClear();

    const theme = themeRead();

    document.querySelectorAll(USER_MENU_THEME_BTN_SELECTOR).forEach((button) => {
      button.classList.toggle(USER_MENU_ACTIVE_CLASS, button.dataset.theme === theme);
    });

    const themeTrack = document.querySelector(USER_MENU_THEME_TRACK_SELECTOR);
    const isDark = theme === THEME_DARK;

    themeTrack?.classList.toggle(USER_MENU_THEME_LIGHT_CLASS, !isDark);
    themeTrack?.classList.toggle(USER_MENU_THEME_DARK_CLASS, isDark);
    return;
  }

  const signInView = document.querySelector(USER_MENU_SIGN_IN_VIEW_SELECTOR);
  const signUpView = document.querySelector(USER_MENU_SIGN_UP_VIEW_SELECTOR);

  signInView?.classList.add(USER_MENU_HIDDEN_CLASS);
  signUpView?.classList.remove(USER_MENU_HIDDEN_CLASS);

  document.querySelectorAll(USER_MENU_AUTH_BTN_SELECTOR).forEach((button) => {
    button.classList.toggle(
      USER_MENU_ACTIVE_CLASS,
      button.dataset.view === USER_MENU_AUTH_VIEW_SIGN_UP,
    );
  });

  const authTrack = document.querySelector(USER_MENU_AUTH_TRACK_SELECTOR);

  authTrack?.classList.remove(USER_MENU_AUTH_SIGN_IN_CLASS);
  authTrack?.classList.add(USER_MENU_AUTH_SIGN_UP_CLASS);
}

/** Applies sign-out result state after the shrink phase, before menu restore fade. */
export async function userMenuAuthSignOutResultApply() {
  signInAnimationCancel();

  const signInView = document.querySelector(USER_MENU_SIGN_IN_VIEW_SELECTOR);
  const signUpView = document.querySelector(USER_MENU_SIGN_UP_VIEW_SELECTOR);

  signInView?.classList.remove(USER_MENU_HIDDEN_CLASS);
  signUpView?.classList.add(USER_MENU_HIDDEN_CLASS);

  document.querySelectorAll(USER_MENU_AUTH_BTN_SELECTOR).forEach((button) => {
    button.classList.toggle(
      USER_MENU_ACTIVE_CLASS,
      button.dataset.view === USER_MENU_AUTH_VIEW_SIGN_IN,
    );
  });

  const authTrack = document.querySelector(USER_MENU_AUTH_TRACK_SELECTOR);

  authTrack?.classList.add(USER_MENU_AUTH_SIGN_IN_CLASS);
  authTrack?.classList.remove(USER_MENU_AUTH_SIGN_UP_CLASS);

  userMenuSignInInputClear();
  await refreshAuth();
}
