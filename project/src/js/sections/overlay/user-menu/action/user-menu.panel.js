import { appStateGet } from "../../../../app/app.state.js";
import { appAuthGet } from "../../../../app/app.actions.js";

import { userMenuRenderSignedIn, userMenuRenderSignedOut, userMenuRenderSwitchAuth } from "../user-menu.render.js";
import { userMenuStateGet, userMenuStateSet } from "../user-menu.state.js";
import { userMenuDomGet } from "../user-menu.dom.js";
import { USER_MENU_HIDDEN_CLASS, USER_MENU_OPEN_CLASS } from "../../../../const/const.user-menu.js";

/** Opens the user-menu panel instantly. */
async function _userMenuPanelOpen() {
  if (userMenuStateGet().statePanel) {
    return;
  }
  const { stateAuth, authKey } = appStateGet();
  userMenuRenderSwitchAuth(appAuthGet());
  if (stateAuth) {
    userMenuRenderSignedIn(authKey);
  } else {
    userMenuRenderSignedOut(authKey);
  }
  userMenuStateSet({ statePanel: true });
  
  const dom = userMenuDomGet();
  dom.root?.classList.remove(USER_MENU_HIDDEN_CLASS);
  dom.root?.classList.add(USER_MENU_OPEN_CLASS);
}

/** Closes the user-menu panel instantly. */
async function _userMenuPanelClose() {
  if (!userMenuStateGet().statePanel) {
    return;
  }
  userMenuStateSet({ statePanel: false });
  
  const dom = userMenuDomGet();
  dom.root?.classList.add(USER_MENU_HIDDEN_CLASS);
  dom.root?.classList.remove(USER_MENU_OPEN_CLASS);
}

/** Toggles the user-menu panel instantly. */
async function _userMenuPanelToggle() {
  if (userMenuStateGet().statePanel) {
    await _userMenuPanelClose();
  } else {
    await _userMenuPanelOpen();
  }
}

export {
  _userMenuPanelClose as userMenuPanelClose,
  _userMenuPanelOpen as userMenuPanelOpen,
  _userMenuPanelToggle as userMenuPanelToggle,
};
