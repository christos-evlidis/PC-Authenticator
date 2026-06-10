import { userMenuAnimationPanelClose } from "../../animation/panel/close.js";
import { userMenuStateGet } from "../../state/get.js";
import { userMenuStateSet } from "../../state/set.js";

/** Closes the user menu panel when open and auth is not running. */
async function userMenuActionPanelClose() {
  if (!userMenuStateGet().isOpen || userMenuStateGet().isSignInRunning) {
    return;
  }

  userMenuStateSet({ isOpen: false });
  await userMenuAnimationPanelClose();
}

export { userMenuActionPanelClose };
