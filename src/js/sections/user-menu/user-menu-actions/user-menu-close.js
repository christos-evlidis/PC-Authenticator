import { userMenuStateGet } from "../user-menu-state.js";
import { userMenuStateSet } from "../user-menu-state.js";
import { userMenuPanelCloseAnimation } from "../user-menu-animations/user-menu-panel-close-animation.js";

// Closes the user menu when it is open and no auth sequence is running.
export async function userMenuPanelClose() {
  if (!userMenuStateGet().isOpen || userMenuStateGet().isSignInRunning) {
    return;
  }

  userMenuStateSet({ isOpen: false });
  await userMenuPanelCloseAnimation();
}
