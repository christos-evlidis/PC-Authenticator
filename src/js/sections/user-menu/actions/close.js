import { userMenuStateGet } from "../state.js";
import { userMenuStateSet } from "../state.js";
import { userMenuPanelCloseAnimation } from "../animations/panel-close-animation.js";

// Closes the user menu when it is open and no auth sequence is running.
export async function userMenuPanelClose() {
  if (!userMenuStateGet().isOpen || userMenuStateGet().isSignInRunning) {
    return;
  }

  userMenuStateSet({ isOpen: false });
  await userMenuPanelCloseAnimation();
}
