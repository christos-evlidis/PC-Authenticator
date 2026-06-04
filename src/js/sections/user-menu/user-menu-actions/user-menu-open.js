import { userMenuStateGet } from "../user-menu-state.js";
import { userMenuStateSet } from "../user-menu-state.js";
import { userMenuPanelOpenAnimation } from "../user-menu-animations/user-menu-panel-open-animation.js";

// Opens the user menu and plays the panel entrance sequence.
export async function userMenuPanelOpen() {
  if (userMenuStateGet().isOpen) {
    return;
  }

  userMenuStateSet({ isOpen: true });
  await userMenuPanelOpenAnimation();
}
