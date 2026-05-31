import { initManualSetupForm } from "./manual-setup-form.js";
import { closeManualSetup } from "./manual-setup-panel.js";
import { initManualSetupPanel } from "./manual-setup-panel.js";
import { isManualSetupActive } from "./manual-setup-panel.js";
import { openManualSetup } from "./manual-setup-panel.js";
import { toggleManualSetup } from "./manual-setup-panel.js";

function initManualSetup() {
  initManualSetupPanel();
  initManualSetupForm();
}

export function refreshBindings() {
  // Header/manual-setup listeners are registered once in init; nothing to rebind.
}

export const manualSetupSection = {
  init: initManualSetup,
  open: openManualSetup,
  close: () => closeManualSetup(),
  toggle: () => toggleManualSetup(),
  isActive: isManualSetupActive,
  refreshBindings,
};

export { initManualSetup };
