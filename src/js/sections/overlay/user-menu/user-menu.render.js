import { userMenuDomGet } from "./user-menu.dom.js";
import { userMenuAccountUpdate } from "./user-menu.account.js";
import { userMenuStateSet } from "./user-menu.state.js";

import { USER_MENU_HIDDEN_CLASS } from "./user-menu.constants.js";

function userMenuRenderSignedIn(authNumber) {
  userMenuStateSet({
    isSignedIn: true,
    authNumber: authNumber ?? null,
  });

  const dom = userMenuDomGet();

  dom.authBar?.classList.add(USER_MENU_HIDDEN_CLASS);
  dom.themeBar?.classList.remove(USER_MENU_HIDDEN_CLASS);
  dom.signedOutView?.classList.add(USER_MENU_HIDDEN_CLASS);
  dom.signedInView?.classList.remove(USER_MENU_HIDDEN_CLASS);
  userMenuAccountUpdate(authNumber ?? "");
}

function userMenuRenderSignedOut() {
  userMenuStateSet({
    isSignedIn: false,
    authNumber: null,
  });

  const dom = userMenuDomGet();

  dom.authBar?.classList.remove(USER_MENU_HIDDEN_CLASS);
  dom.themeBar?.classList.add(USER_MENU_HIDDEN_CLASS);
  dom.signedOutView?.classList.remove(USER_MENU_HIDDEN_CLASS);
  dom.signedInView?.classList.add(USER_MENU_HIDDEN_CLASS);
  userMenuAccountUpdate("");
}

export { userMenuRenderSignedIn };
export { userMenuRenderSignedOut };
