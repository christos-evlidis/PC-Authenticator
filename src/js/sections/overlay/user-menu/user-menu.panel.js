import { userMenuStateGet, userMenuStateSet } from "./user-menu.state.js";
import { userMenuAnimationPanelClose, userMenuAnimationPanelOpen } from "./user-menu.animation.js";

// Opens the user menu panel.
async function userMenuPanelOpen() {
  if (userMenuStateGet().statePanel) {
    return;
  }

  userMenuStateSet({ statePanel: true });
  await userMenuAnimationPanelOpen();
}

// Closes the user menu panel.
async function userMenuPanelClose() {
  if (!userMenuStateGet().statePanel) {
    return;
  }

  userMenuStateSet({ statePanel: false });
  await userMenuAnimationPanelClose();
}

// Toggles the user menu panel open or closed.
async function userMenuPanelToggle() {
  if (userMenuStateGet().statePanel) {
    await userMenuPanelClose();
    return;
  }

  await userMenuPanelOpen();
}

export { userMenuPanelClose, userMenuPanelOpen, userMenuPanelToggle };
