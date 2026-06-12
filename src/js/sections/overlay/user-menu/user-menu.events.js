import { themeGet, themePersist } from "../../../theme/theme.js";
import { userMenuAccountNumberCopy, userMenuAccountNumberDownload } from "./user-menu.account.js";
import { userMenuStartSignIn, userMenuStartSignOut, userMenuStartSignUp } from "./user-menu.auth.js";
import { userMenuDomGet, userMenuDomSet } from "./user-menu.dom.js";
import { userMenuPanelClose, userMenuPanelToggle } from "./user-menu.panel.js";
import { userMenuRenderTheme, userMenuAuthSwitch } from "./user-menu.render.js";
import { userMenuAnimationSwitchTheme } from "./user-menu.animation.js";

let userMenuEventsBound = false;

// Handles clicks on the auth toggle buttons.
function userMenuOnClickBtnAuth(event) {
  userMenuAuthSwitch(event.currentTarget.dataset.view);
}

// Handles clicks on the theme toggle buttons.
async function userMenuOnClickBtnTheme(event) {
  const nextTheme = event.currentTarget.dataset.theme;
  const currentTheme = themeGet();

  if (currentTheme === nextTheme) {
    return;
  }

  await themePersist(nextTheme);
  userMenuRenderTheme(nextTheme);
  void userMenuAnimationSwitchTheme(nextTheme);
}

// Handles form submission for the sign-in view.
function userMenuOnClickSignIn(event) {
  event.preventDefault();
  const dom = userMenuDomGet();
  void userMenuStartSignIn(dom.accountFieldSignedOut?.value);
}

// Handles clicks on the sign-up button.
function userMenuOnClickSignUp() {
  void userMenuStartSignUp();
}

// Handles clicks on the sign-out button.
function userMenuOnClickSignOut() {
  void userMenuStartSignOut();
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

  dom.openBtns.forEach((button) => {
    button.addEventListener("click", userMenuPanelToggle);
  });

  dom.closeBtn?.addEventListener("click", userMenuPanelClose);
  dom.backdrop?.addEventListener("click", userMenuPanelClose);

  dom.authBtns.forEach((button) => {
    button.addEventListener("click", userMenuOnClickBtnAuth);
  });

  dom.themeBtns.forEach((button) => {
    button.addEventListener("click", userMenuOnClickBtnTheme);
  });

  dom.signInForm?.addEventListener("submit", userMenuOnClickSignIn);
  dom.signUpBtn?.addEventListener("click", userMenuOnClickSignUp);
  dom.logoutBtn?.addEventListener("click", userMenuOnClickSignOut);
  dom.accountCopyBtn?.addEventListener(
    "click",
    userMenuOnClickAccountNumberCopy,
  );
  dom.accountDownloadBtn?.addEventListener(
    "click",
    userMenuOnClickAccountNumberDownload,
  );

  userMenuDomSet({ showViewSignUp: false });
}

export { userMenuEventsBind };
