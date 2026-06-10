import { userMenuAnimationPanelOpen } from "../../animation/panel/open.js";
import { userMenuStateGet } from "../../state/get.js";
import { userMenuStateSet } from "../../state/set.js";

async function userMenuActionsPanelOpen() {
  if (userMenuStateGet().isOpen) {
    return;
  }

  userMenuStateSet({ isOpen: true });
  await userMenuAnimationPanelOpen();
}

export { userMenuActionsPanelOpen };
