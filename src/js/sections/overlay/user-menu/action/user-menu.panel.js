import { appStateGet } from "../../../../app/app.state.js";
import { appAuthGet, appThemeGet } from "../../../../app/app.actions.js";

import { userMenuAnimationPanelClose, userMenuAnimationPanelOpen } from "../user-menu.animation.js";
import { userMenuRenderSignedIn, userMenuRenderSignedOut, userMenuRenderSwitchAuth, userMenuRenderSwitchTheme } from "../user-menu.render.js";
import { userMenuStateGet, userMenuStateSet } from "../user-menu.state.js";

/** Opens the user-menu panel and refreshes its content. */
async function userMenuPanelOpen() {
  if (userMenuStateGet().statePanel) { // Stop when the panel is already open.
    return; // Exit without replaying the open animation.
  }
  const { stateAuth, authKey } = appStateGet(); // Read the current signed-in state and account key from app state.
  userMenuRenderSwitchTheme(appThemeGet()); // Sync the theme toggle UI to the active Chrome theme.
  userMenuRenderSwitchAuth(appAuthGet()); // Sync the auth tab UI to the current sign-in or sign-up view.
  if (stateAuth) { // Choose the signed-in panel content when the user is authenticated.
    userMenuRenderSignedIn(authKey); // Show the account number, theme bar, and signed-in actions.
  } else { // Choose the signed-out panel content when the user is not authenticated.
    userMenuRenderSignedOut(authKey); // Show the sign-in form, sign-up button, and auth bar.
  }
  userMenuStateSet({ statePanel: true }); // Mark the panel as open before the open animation runs.
  await userMenuAnimationPanelOpen(); // Play the slide, blur, and header button active-state animation.
}

/** Closes the user-menu panel. */
async function userMenuPanelClose() {
  if (!userMenuStateGet().statePanel) { // Stop when the panel is already closed.
    return; // Exit without replaying the close animation.
  }
  userMenuStateSet({ statePanel: false }); // Mark the panel as closed before the close animation runs.
  await userMenuAnimationPanelClose(); // Play the slide-out, backdrop fade, and header button reset animation.
}

/** Toggles the user-menu panel open or closed. */
async function userMenuPanelToggle() {
  if (userMenuStateGet().statePanel) { // Use the close flow when the panel is currently open.
    await userMenuPanelClose(); // Run the close animation and update panel state.
  } else { // Use the open flow when the panel is currently closed.
    await userMenuPanelOpen(); // Refresh panel content and run the open animation.
  }
}

export { userMenuPanelClose, userMenuPanelOpen, userMenuPanelToggle };
