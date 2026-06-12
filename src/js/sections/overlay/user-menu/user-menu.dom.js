import { USER_MENU_HIDDEN_CLASS, USER_MENU_ACCOUNT_COPY_BTN_SELECTOR, USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR, USER_MENU_ACCOUNT_FIELD_SIGNED_IN_SELECTOR, USER_MENU_AUTH_BAR_SELECTOR, USER_MENU_AUTH_BTN_SELECTOR, USER_MENU_AUTH_THUMB_SELECTOR, USER_MENU_AUTH_TRACK_SELECTOR, USER_MENU_BACKDROP_SELECTOR, USER_MENU_CLOSE_BTN_SELECTOR, USER_MENU_CONTENT_SELECTOR, USER_MENU_HEADER_SELECTOR, USER_MENU_LOGOUT_BTN_SELECTOR, USER_MENU_OPEN_BTN_SELECTOR, USER_MENU_PANEL_SELECTOR, USER_MENU_ROOT_SELECTOR, USER_MENU_SIGNED_IN_VIEW_SELECTOR, USER_MENU_SIGNED_OUT_VIEW_SELECTOR, USER_MENU_SIGN_IN_FORM_SELECTOR, USER_MENU_ACCOUNT_FIELD_SIGNED_OUT_SELECTOR, USER_MENU_SIGN_IN_VIEW_SELECTOR, USER_MENU_SIGN_UP_BTN_SELECTOR, USER_MENU_SIGN_UP_VIEW_SELECTOR, USER_MENU_STATUS_ERROR_SELECTOR, USER_MENU_STATUS_LOADING_SELECTOR, USER_MENU_STATUS_SUCCESS_SELECTOR, USER_MENU_THEME_BAR_SELECTOR, USER_MENU_THEME_BTN_SELECTOR, USER_MENU_THEME_THUMB_SELECTOR, USER_MENU_THEME_TRACK_SELECTOR } from "./user-menu.constants.js";

// Queries and returns references to all user menu DOM elements.
function userMenuDomGet() {
  return {
    root: document.querySelector(USER_MENU_ROOT_SELECTOR),
    backdrop: document.querySelector(USER_MENU_BACKDROP_SELECTOR),
    panel: document.querySelector(USER_MENU_PANEL_SELECTOR),
    header: document.querySelector(USER_MENU_HEADER_SELECTOR),
    content: document.querySelector(USER_MENU_CONTENT_SELECTOR),
    closeBtn: document.querySelector(USER_MENU_CLOSE_BTN_SELECTOR),
    openBtns: [...document.querySelectorAll(USER_MENU_OPEN_BTN_SELECTOR)],
    signedOutView: document.querySelector(USER_MENU_SIGNED_OUT_VIEW_SELECTOR),
    signedInView: document.querySelector(USER_MENU_SIGNED_IN_VIEW_SELECTOR),
    authBar: document.querySelector(USER_MENU_AUTH_BAR_SELECTOR),
    authTrack: document.querySelector(USER_MENU_AUTH_TRACK_SELECTOR),
    authThumb: document.querySelector(USER_MENU_AUTH_THUMB_SELECTOR),
    authBtns: [...document.querySelectorAll(USER_MENU_AUTH_BTN_SELECTOR)],
    themeBar: document.querySelector(USER_MENU_THEME_BAR_SELECTOR),
    themeTrack: document.querySelector(USER_MENU_THEME_TRACK_SELECTOR),
    themeThumb: document.querySelector(USER_MENU_THEME_THUMB_SELECTOR),
    themeBtns: [...document.querySelectorAll(USER_MENU_THEME_BTN_SELECTOR)],
    signInView: document.querySelector(USER_MENU_SIGN_IN_VIEW_SELECTOR),
    signInForm: document.querySelector(USER_MENU_SIGN_IN_FORM_SELECTOR),
    accountFieldSignedOut: document.querySelector(
      USER_MENU_ACCOUNT_FIELD_SIGNED_OUT_SELECTOR,
    ),
    signUpView: document.querySelector(USER_MENU_SIGN_UP_VIEW_SELECTOR),
    signUpBtn: document.querySelector(USER_MENU_SIGN_UP_BTN_SELECTOR),
    accountFieldSignedIn: document.querySelector(
      USER_MENU_ACCOUNT_FIELD_SIGNED_IN_SELECTOR,
    ),
    accountCopyBtn: document.querySelector(USER_MENU_ACCOUNT_COPY_BTN_SELECTOR),
    accountDownloadBtn: document.querySelector(
      USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR,
    ),
    logoutBtn: document.querySelector(USER_MENU_LOGOUT_BTN_SELECTOR),
    statusLoading: document.querySelector(USER_MENU_STATUS_LOADING_SELECTOR),
    statusSuccess: document.querySelector(USER_MENU_STATUS_SUCCESS_SELECTOR),
    statusError: document.querySelector(USER_MENU_STATUS_ERROR_SELECTOR),
  };
}

// Updates user menu DOM element properties based on the provided state object.
function userMenuDomSet(next = {}) {
  const dom = userMenuDomGet();

  if (
    typeof next.accountFieldSignedIn === "string" &&
    dom.accountFieldSignedIn
  ) {
    dom.accountFieldSignedIn.value = next.accountFieldSignedIn;
  }

  if (
    typeof next.accountFieldSignedOut === "string" &&
    dom.accountFieldSignedOut
  ) {
    dom.accountFieldSignedOut.value = next.accountFieldSignedOut;
  }

  if (typeof next.showBarAuth === "boolean") {
    dom.authBar?.classList.toggle(USER_MENU_HIDDEN_CLASS, !next.showBarAuth);
  }

  if (typeof next.showBarTheme === "boolean") {
    dom.themeBar?.classList.toggle(USER_MENU_HIDDEN_CLASS, !next.showBarTheme);
  }

  if (typeof next.showViewSignedIn === "boolean") {
    dom.signedInView?.classList.toggle(
      USER_MENU_HIDDEN_CLASS,
      !next.showViewSignedIn,
    );
  }

  if (typeof next.showViewSignedOut === "boolean") {
    dom.signedOutView?.classList.toggle(
      USER_MENU_HIDDEN_CLASS,
      !next.showViewSignedOut,
    );
  }

  if (typeof next.showViewSignIn === "boolean") {
    dom.signInView?.classList.toggle(
      USER_MENU_HIDDEN_CLASS,
      !next.showViewSignIn,
    );
  }

  if (typeof next.showViewSignUp === "boolean") {
    dom.signUpView?.classList.toggle(
      USER_MENU_HIDDEN_CLASS,
      !next.showViewSignUp,
    );
  }

  return dom;
}

export { userMenuDomGet, userMenuDomSet };
