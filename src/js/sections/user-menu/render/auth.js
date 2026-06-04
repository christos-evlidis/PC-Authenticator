import { USER_MENU_ACTIVE_CLASS } from "../constants.js";
import { USER_MENU_AUTH_BTN_SELECTOR } from "../constants.js";
import { USER_MENU_AUTH_SIGN_IN_CLASS } from "../constants.js";
import { USER_MENU_AUTH_SIGN_UP_CLASS } from "../constants.js";
import { USER_MENU_AUTH_TRACK_SELECTOR } from "../constants.js";
import { USER_MENU_AUTH_VIEW_SIGN_UP } from "../constants.js";
import { USER_MENU_HIDDEN_CLASS } from "../constants.js";
import { USER_MENU_SIGN_IN_INPUT_SELECTOR } from "../constants.js";
import { USER_MENU_SIGN_IN_VIEW_SELECTOR } from "../constants.js";
import { USER_MENU_SIGN_UP_VIEW_SELECTOR } from "../constants.js";

/** Updates sign-in vs sign-up auth panels and auth switch labels in the DOM. */
export function userMenuAuthViewApply(authView) {
  const signInView = document.querySelector(USER_MENU_SIGN_IN_VIEW_SELECTOR);
  const signUpView = document.querySelector(USER_MENU_SIGN_UP_VIEW_SELECTOR);

  const isSignUp = authView === USER_MENU_AUTH_VIEW_SIGN_UP;

  signInView?.classList.toggle(USER_MENU_HIDDEN_CLASS, isSignUp);
  signUpView?.classList.toggle(USER_MENU_HIDDEN_CLASS, !isSignUp);

  document.querySelectorAll(USER_MENU_AUTH_BTN_SELECTOR).forEach((button) => {
    button.classList.toggle(
      USER_MENU_ACTIVE_CLASS,
      button.dataset.view === authView,
    );
  });
}

/** Updates auth switch track classes for the active sign-in vs sign-up thumb position. */
export function userMenuAuthTrackApply(authView) {
  const track = document.querySelector(USER_MENU_AUTH_TRACK_SELECTOR);
  const isSignUp = authView === USER_MENU_AUTH_VIEW_SIGN_UP;

  track?.classList.toggle(USER_MENU_AUTH_SIGN_IN_CLASS, !isSignUp);
  track?.classList.toggle(USER_MENU_AUTH_SIGN_UP_CLASS, isSignUp);
}

/** Clears the sign-in account number input after a successful sign-in. */
export function userMenuSignInInputClear() {
  const input = document.querySelector(USER_MENU_SIGN_IN_INPUT_SELECTOR);

  if (input) {
    input.value = "";
  }
}
