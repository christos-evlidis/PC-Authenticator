import { userMenuStateGet, userMenuStateSet } from "./user-menu.state.js";
import { userMenuAnimationPanelClose, userMenuAnimationPanelOpen } from "./user-menu.animation.js";

async function userMenuPanelOpen() {
  if (userMenuStateGet().isOpen) {
    return;
  }

  userMenuStateSet({ isOpen: true });
  await userMenuAnimationPanelOpen();
}

async function userMenuPanelClose() {
  if (!userMenuStateGet().isOpen || userMenuStateGet().isAuthRunning) {
    return;
  }

  userMenuStateSet({ isOpen: false });
  await userMenuAnimationPanelClose();
}

async function userMenuPanelToggle() {
  if (userMenuStateGet().isOpen) {
    await userMenuPanelClose();
    return;
  }

  await userMenuPanelOpen();
}

export { userMenuPanelClose };
export { userMenuPanelOpen };
export { userMenuPanelToggle };
