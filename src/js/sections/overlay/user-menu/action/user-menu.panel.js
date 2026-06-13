import { userMenuStateGet } from "../user-menu.state.js";
import { userMenuStateSet } from "../user-menu.state.js";

import { userMenuAnimationPanelClose } from "../user-menu.animation.js";
import { userMenuAnimationPanelOpen } from "../user-menu.animation.js";

import { userMenuRenderSignedIn } from "../user-menu.render.js";
import { userMenuRenderSignedOut } from "../user-menu.render.js";
import { userMenuRenderSwitchTheme } from "../user-menu.render.js";
import { userMenuRenderSwitchAuth } from "../user-menu.render.js";

import { appStateGet } from "../../../../app/app.state.js";

import { appAuthGet } from "../../../../app/app.actions.js";
import { themeStateGet } from "../../../../services/theme/state/get.js";


// Opens the user menu panel.
async function userMenuPanelOpen() {
  if (userMenuStateGet().statePanel) {
    return;
  }
  const { stateAuth, authKey } = appStateGet();
  userMenuRenderSwitchTheme(themeStateGet());
  userMenuRenderSwitchAuth(appAuthGet());
  if (stateAuth) {
    userMenuRenderSignedIn(authKey);
  } else {
    userMenuRenderSignedOut(authKey);
  }
  userMenuStateSet({ statePanel: true });
  await userMenuAnimationPanelOpen();
}

// Closes the user menu panel.
async function userMenuPanelClose() {
  if (!userMenuStateGet().statePanel) {
    return;
  }
  userMenuStateSet({ statePanel: false });
  await userMenuAnimationPanelClose();
}

// Toggles the user menu panel open or closed.
async function userMenuPanelToggle() {
  if (userMenuStateGet().statePanel) {
    await userMenuPanelClose();
  } else {
    await userMenuPanelOpen();
  }
}


export { userMenuPanelClose };
export { userMenuPanelOpen };
export { userMenuPanelToggle };
