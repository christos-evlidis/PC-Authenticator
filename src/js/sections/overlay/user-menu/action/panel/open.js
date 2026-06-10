import { userMenuAnimationPanelOpen } from "../../animation/panel/open.js";
import { userMenuStateGet } from "../../state/get.js";
import { userMenuStateSet } from "../../state/set.js";

/** Opens the user menu panel. */
async function userMenuActionPanelOpen() {
  if (userMenuStateGet().isOpen) {
    return;
  }

  userMenuStateSet({ isOpen: true });
  await userMenuAnimationPanelOpen();
}

export { userMenuActionPanelOpen };
