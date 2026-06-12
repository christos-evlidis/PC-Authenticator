import { userMenuAccountNumberCopy, userMenuAccountNumberDownload } from "./user-menu.account.js";
import { userMenuActionSignIn, userMenuActionSignOut, userMenuActionSignUp, userMenuActionSwitchAuth, userMenuActionSwitchTheme } from "./user-menu.actions.js";
import { userMenuDomGet, userMenuDomSet } from "./user-menu.dom.js";
import { userMenuPanelClose, userMenuPanelToggle } from "./user-menu.panel.js";
import { USER_MENU_ACCOUNT_FIELD_SIGNED_OUT_SELECTOR } from "./user-menu.constants.js";

let userMenuEventsBound = false;

// Handles clicks on the auth toggle buttons.
function userMenuOnClickBtnAuth(event) {
  event.preventDefault();
  userMenuActionSwitchAuth(event.currentTarget.dataset.view);
}

// Handles clicks on the theme toggle buttons.
async function userMenuOnClickBtnTheme(event) {
  event.preventDefault();
  const nextTheme = event.currentTarget.dataset.theme;
  await userMenuActionSwitchTheme(nextTheme);
}

// Handles form submission for the sign-in view.
function userMenuOnClickSignIn(event) {
  event.preventDefault();
  const input = event.currentTarget.querySelector(USER_MENU_ACCOUNT_FIELD_SIGNED_OUT_SELECTOR);
  void userMenuActionSignIn(input?.value);
}

// Handles clicks on the sign-up button.
function userMenuOnClickSignUp() {
  void userMenuActionSignUp();
}

// Handles clicks on the sign-out button.
function userMenuOnClickSignOut() {
  void userMenuActionSignOut();
}

// Handles clicks on the copy account number button.
function userMenuOnClickAccountNumberCopy() {
  void userMenuAccountNumberCopy();
}

// Handles clicks on the download account number button.
function userMenuOnClickAccountNumberDownload() {
  void userMenuAccountNumberDownload();
}


// Binds all event listeners for the user menu.
function userMenuEventsBind() {
  if (userMenuEventsBound) {
    return;
  }

  userMenuEventsBound = true;
  const dom = userMenuDomGet();

  dom.openBtns.forEach((button) => {button.addEventListener("click", userMenuPanelToggle)});
  dom.closeBtn?.addEventListener("click", userMenuPanelClose);
  dom.backdrop?.addEventListener("click", userMenuPanelClose);
  dom.authBtns.forEach((button) => {button.addEventListener("click", userMenuOnClickBtnAuth)});
  dom.themeBtns.forEach((button) => {button.addEventListener("click", userMenuOnClickBtnTheme)});
  dom.signInForm?.addEventListener("submit", userMenuOnClickSignIn);
  dom.signUpBtn?.addEventListener("click", userMenuOnClickSignUp);
  dom.logoutBtn?.addEventListener("click", userMenuOnClickSignOut);
  dom.accountCopyBtn?.addEventListener("click", userMenuOnClickAccountNumberCopy);
  dom.accountDownloadBtn?.addEventListener("click", userMenuOnClickAccountNumberDownload);

  userMenuDomSet({ showViewSignUp: false });
}

export { userMenuEventsBind };
