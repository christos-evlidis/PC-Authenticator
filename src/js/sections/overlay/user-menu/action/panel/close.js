import { userMenuAnimationPanelClose } from "../../animation/panel/close.js";
import { userMenuStateGet } from "../../state/get.js";
import { userMenuStateSet } from "../../state/set.js";

async function userMenuActionsPanelClose() {
  if (!userMenuStateGet().isOpen || userMenuStateGet().isSignInRunning) {
    return;
  }

  userMenuStateSet({ isOpen: false });
  await userMenuAnimationPanelClose();
}

export { userMenuActionsPanelClose };
