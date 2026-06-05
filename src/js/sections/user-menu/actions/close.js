import { signInAnimationPendingIs } from "../../sequences/index.js";
import { signInAnimationRun } from "../../sequences/index.js";
import { userMenuStateGet } from "../state.js";
import { userMenuStateSet } from "../state.js";
import { userMenuPanelCloseAnimation } from "../animations/panel-close.js";

/** Closes the user menu when it is open and no auth sequence is running. */
async function userMenuPanelClose() {
  if (!userMenuStateGet().isOpen || userMenuStateGet().isSignInRunning) {
    return;
  }

  userMenuStateSet({ isOpen: false });
  await userMenuPanelCloseAnimation();

  if (signInAnimationPendingIs()) {
    await signInAnimationRun();
  }
}

export { userMenuPanelClose };
