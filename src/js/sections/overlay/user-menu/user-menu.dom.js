import { THEME_DARK_KEY } from "../../../const/const.theme.js";
import { USER_MENU_ACCOUNT_COPY_BTN_SELECTOR, USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR, USER_MENU_ACCOUNT_FIELD_SIGNED_IN_SELECTOR, USER_MENU_ACCOUNT_FIELD_SIGNED_OUT_SELECTOR, USER_MENU_AUTH_BAR_SELECTOR, USER_MENU_AUTH_BTN_SELECTOR, USER_MENU_AUTH_SIGN_IN_CLASS, USER_MENU_AUTH_SIGN_UP_CLASS, USER_MENU_AUTH_THUMB_SELECTOR, USER_MENU_AUTH_TRACK_SELECTOR, USER_MENU_AUTH_VIEW_SIGN_UP, USER_MENU_BACKDROP_SELECTOR, USER_MENU_CLOSE_BTN_SELECTOR, USER_MENU_CONTENT_SELECTOR, USER_MENU_HEADER_SELECTOR, USER_MENU_HIDDEN_CLASS, USER_MENU_LOGOUT_BTN_SELECTOR, USER_MENU_OPEN_BTN_SELECTOR, USER_MENU_PANEL_SELECTOR, USER_MENU_ROOT_SELECTOR, USER_MENU_SIGNED_IN_VIEW_SELECTOR, USER_MENU_SIGNED_OUT_VIEW_SELECTOR, USER_MENU_SIGN_IN_FORM_SELECTOR, USER_MENU_SIGN_IN_VIEW_SELECTOR, USER_MENU_SIGN_UP_BTN_SELECTOR, USER_MENU_SIGN_UP_VIEW_SELECTOR, USER_MENU_STATUS_ERROR_SELECTOR, USER_MENU_STATUS_LOADING_SELECTOR, USER_MENU_STATUS_SUCCESS_SELECTOR, USER_MENU_THEME_BAR_SELECTOR, USER_MENU_THEME_BTN_SELECTOR, USER_MENU_THEME_THUMB_SELECTOR, USER_MENU_THEME_TRACK_SELECTOR, USER_MENU_THEME_VIEW_DARK, USER_MENU_THEME_VIEW_LIGHT, USER_MENU_VIEW_ACTIVE_AUTH, USER_MENU_VIEW_ACTIVE_THEME } from "../../../const/const.user-menu.js";

/** Queries and returns references to all user-menu DOM elements. */
function userMenuDomQuery() {
  return {
    root: document.querySelector(USER_MENU_ROOT_SELECTOR), // Overlay root container.
    backdrop: document.querySelector(USER_MENU_BACKDROP_SELECTOR), // Clickable backdrop behind the panel.
    panel: document.querySelector(USER_MENU_PANEL_SELECTOR), // Sliding user-menu panel.
    header: document.querySelector(USER_MENU_HEADER_SELECTOR), // Panel header area.
    content: document.querySelector(USER_MENU_CONTENT_SELECTOR), // Main panel content wrapper.
    closeBtn: document.querySelector(USER_MENU_CLOSE_BTN_SELECTOR), // Panel close button.
    openBtns: [...document.querySelectorAll(USER_MENU_OPEN_BTN_SELECTOR)], // Header buttons that open the panel.
    signedOutView: document.querySelector(USER_MENU_SIGNED_OUT_VIEW_SELECTOR), // Signed-out content block.
    signedInView: document.querySelector(USER_MENU_SIGNED_IN_VIEW_SELECTOR), // Signed-in content block.
    authBar: document.querySelector(USER_MENU_AUTH_BAR_SELECTOR), // Sign-in/sign-up tab bar.
    authTrack: document.querySelector(USER_MENU_AUTH_TRACK_SELECTOR), // Auth thumb track.
    authThumb: document.querySelector(USER_MENU_AUTH_THUMB_SELECTOR), // Auth thumb slider.
    authBtns: [...document.querySelectorAll(USER_MENU_AUTH_BTN_SELECTOR)], // Sign-in and sign-up tab buttons.
    themeBar: document.querySelector(USER_MENU_THEME_BAR_SELECTOR), // Light/dark theme tab bar.
    themeTrack: document.querySelector(USER_MENU_THEME_TRACK_SELECTOR), // Theme thumb track.
    themeThumb: document.querySelector(USER_MENU_THEME_THUMB_SELECTOR), // Theme thumb slider.
    themeBtns: [...document.querySelectorAll(USER_MENU_THEME_BTN_SELECTOR)], // Light and dark theme buttons.
    signInView: document.querySelector(USER_MENU_SIGN_IN_VIEW_SELECTOR), // Sign-in form view.
    signInForm: document.querySelector(USER_MENU_SIGN_IN_FORM_SELECTOR), // Sign-in form element.
    accountFieldSignedOut: document.querySelector(USER_MENU_ACCOUNT_FIELD_SIGNED_OUT_SELECTOR), // Account number input on sign-in view.
    signUpView: document.querySelector(USER_MENU_SIGN_UP_VIEW_SELECTOR), // Sign-up view.
    signUpBtn: document.querySelector(USER_MENU_SIGN_UP_BTN_SELECTOR), // Sign-up action button.
    accountFieldSignedIn: document.querySelector(USER_MENU_ACCOUNT_FIELD_SIGNED_IN_SELECTOR), // Read-only signed-in account field.
    accountCopyBtn: document.querySelector(USER_MENU_ACCOUNT_COPY_BTN_SELECTOR), // Copy account number button.
    accountDownloadBtn: document.querySelector(USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR), // Download account number button.
    logoutBtn: document.querySelector(USER_MENU_LOGOUT_BTN_SELECTOR), // Sign-out button.
    statusLoading: document.querySelector(USER_MENU_STATUS_LOADING_SELECTOR), // Auth loading status icon.
    statusSuccess: document.querySelector(USER_MENU_STATUS_SUCCESS_SELECTOR), // Auth success status icon.
    statusError: document.querySelector(USER_MENU_STATUS_ERROR_SELECTOR), // Auth error status icon.
  };
}

/** Returns the current user-menu DOM references. */
function userMenuDomGet() {
  return userMenuDomQuery(); // Query the current user-menu DOM references.
}

/** Applies user-menu DOM updates from the provided state object. */
function userMenuDomSet(next = {}) {
  const dom = userMenuDomQuery(); // Read the latest DOM references before applying updates.
  if (typeof next.accountFieldSignedIn === "string" && dom.accountFieldSignedIn) { // Update the signed-in account field when a value is provided.
    dom.accountFieldSignedIn.value = next.accountFieldSignedIn; // Write the account number into the signed-in field.
  }
  if (typeof next.accountFieldSignedOut === "string" && dom.accountFieldSignedOut) { // Update the signed-out account field when a value is provided.
    dom.accountFieldSignedOut.value = next.accountFieldSignedOut; // Write the account number into the sign-in input field.
  }
  if (typeof next.showBarAuth === "boolean") { // Toggle auth tab bar visibility when requested.
    dom.authBar?.classList.toggle(USER_MENU_HIDDEN_CLASS, !next.showBarAuth); // Show or hide the sign-in/sign-up bar.
  }
  if (typeof next.showBarTheme === "boolean") { // Toggle theme tab bar visibility when requested.
    dom.themeBar?.classList.toggle(USER_MENU_HIDDEN_CLASS, !next.showBarTheme); // Show or hide the light/dark theme bar.
  }
  if (typeof next.showViewSignedIn === "boolean") { // Toggle signed-in view visibility when requested.
    dom.signedInView?.classList.toggle(USER_MENU_HIDDEN_CLASS, !next.showViewSignedIn); // Show or hide the signed-in panel content.
  }
  if (typeof next.showViewSignedOut === "boolean") { // Toggle signed-out view visibility when requested.
    dom.signedOutView?.classList.toggle(USER_MENU_HIDDEN_CLASS, !next.showViewSignedOut); // Show or hide the signed-out panel content.
  }
  if (typeof next.showViewSignIn === "boolean") { // Toggle sign-in form visibility when requested.
    dom.signInView?.classList.toggle(USER_MENU_HIDDEN_CLASS, !next.showViewSignIn); // Show or hide the sign-in form view.
  }
  if (typeof next.showViewSignUp === "boolean") { // Toggle sign-up view visibility when requested.
    dom.signUpView?.classList.toggle(USER_MENU_HIDDEN_CLASS, !next.showViewSignUp); // Show or hide the sign-up view.
  }
  if (typeof next.authView === "string") { // Update auth tab state when a view name is provided.
    const isSignUp = next.authView === USER_MENU_AUTH_VIEW_SIGN_UP; // Track whether sign-up should be active.
    dom.authBtns.forEach((button) => button.classList.toggle(USER_MENU_VIEW_ACTIVE_AUTH, button.dataset.view === next.authView)); // Mark the active sign-in or sign-up tab button.
    dom.authTrack?.classList.toggle(USER_MENU_AUTH_SIGN_IN_CLASS, !isSignUp); // Position the auth track for sign-in when needed.
    dom.authTrack?.classList.toggle(USER_MENU_AUTH_SIGN_UP_CLASS, isSignUp); // Position the auth track for sign-up when needed.
  }
  if (typeof next.theme === "string") { // Update theme tab state when a theme key is provided.
    const isDark = next.theme === THEME_DARK_KEY; // Track whether dark theme should be active.
    dom.themeBtns.forEach((button) => button.classList.toggle(USER_MENU_VIEW_ACTIVE_THEME, button.dataset.theme === next.theme)); // Mark the active light or dark theme button.
    dom.themeTrack?.classList.toggle(USER_MENU_THEME_VIEW_LIGHT, !isDark); // Position the theme track for light mode when needed.
    dom.themeTrack?.classList.toggle(USER_MENU_THEME_VIEW_DARK, isDark); // Position the theme track for dark mode when needed.
  }
  if (typeof next.showCopyCheck === "boolean") { // Toggle copy confirmation styling when requested.
    dom.accountCopyBtn?.classList.toggle("is-success-active", next.showCopyCheck); // Show or hide the copy success checkmark state.
  }
  if (typeof next.showDownloadCheck === "boolean") { // Toggle download confirmation styling when requested.
    dom.accountDownloadBtn?.classList.toggle("is-success-active", next.showDownloadCheck); // Show or hide the download success checkmark state.
  }
  return dom; // Return the updated DOM references to the caller.
}

export { userMenuDomGet, userMenuDomSet };
