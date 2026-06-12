import { themeGet } from "../../../utils/utility-theme.js";
import { userMenuAccountCopy, userMenuAccountDownload } from "./user-menu.account.js";
import { userMenuAuthSwitch, userMenuStartSignIn, userMenuStartSignOut, userMenuStartSignUp } from "./user-menu.auth.js";
import { userMenuDomGet } from "./user-menu.dom.js";
import { userMenuPanelClose, userMenuPanelToggle } from "./user-menu.panel.js";
import { userMenuStateSet } from "./user-menu.state.js";
import { userMenuUpdateTheme } from "./user-menu.theme.js";
import { USER_MENU_AUTH_VIEW_SIGN_IN, USER_MENU_HIDDEN_CLASS } from "./user-menu.constants.js";

let userMenuEventsController = null;

function userMenuOnAuthBtnClick(event) {
  userMenuAuthSwitch(event.currentTarget.dataset.view);
}

function userMenuOnThemeBtnClick(event) {
  void userMenuUpdateTheme(event.currentTarget.dataset.theme);
}

function userMenuOnSignInSubmit(event) {
  event.preventDefault();
  const dom = userMenuDomGet();
  void userMenuStartSignIn(dom.signInInput?.value);
}

function userMenuOnSignUpClick() {
  void userMenuStartSignUp();
}

function userMenuOnSignOutClick() {
  void userMenuStartSignOut();
}

function userMenuOnAccountCopyClick() {
  void userMenuAccountCopy();
}

function userMenuOnAccountDownloadClick() {
  void userMenuAccountDownload();
}

function userMenuEventsBind() {
  if (userMenuEventsController) {
    return;
  }

  userMenuEventsController = new AbortController();
  const { signal } = userMenuEventsController;
  const dom = userMenuDomGet();

  dom.openBtns.forEach((button) => {
    button.addEventListener("click", userMenuPanelToggle, { signal });
  });

  dom.closeBtn?.addEventListener("click", userMenuPanelClose, { signal });
  dom.backdrop?.addEventListener("click", userMenuPanelClose, { signal });

  dom.authBtns.forEach((button) => {
    button.addEventListener("click", userMenuOnAuthBtnClick, { signal });
  });

  dom.themeBtns.forEach((button) => {
    button.addEventListener("click", userMenuOnThemeBtnClick, { signal });
  });

  dom.signInForm?.addEventListener("submit", userMenuOnSignInSubmit, { signal });
  dom.signUpBtn?.addEventListener("click", userMenuOnSignUpClick, { signal });
  dom.logoutBtn?.addEventListener("click", userMenuOnSignOutClick, { signal });
  dom.accountCopyBtn?.addEventListener("click", userMenuOnAccountCopyClick, { signal });
  dom.accountDownloadBtn?.addEventListener("click", userMenuOnAccountDownloadClick, { signal });

  const theme = themeGet();

  dom.signUpView?.classList.add(USER_MENU_HIDDEN_CLASS);
  userMenuStateSet({ theme, authView: USER_MENU_AUTH_VIEW_SIGN_IN });
}

function userMenuEventsDrop() {
  userMenuEventsController?.abort();
  userMenuEventsController = null;
}

export { userMenuEventsBind };
export { userMenuEventsDrop };
