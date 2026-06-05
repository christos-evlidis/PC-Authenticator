import { userMenuStateGet } from "../state.js";
import { userMenuStateSet } from "../state.js";
import { userMenuPanelOpenAnimation } from "../animations/panel-open.js";

/** Opens the user menu and plays the panel entrance sequence. */
async function userMenuPanelOpen() {
  if (userMenuStateGet().isOpen) {
    return;
  }

  userMenuStateSet({ isOpen: true });
  await userMenuPanelOpenAnimation();
}

export { userMenuPanelOpen };
