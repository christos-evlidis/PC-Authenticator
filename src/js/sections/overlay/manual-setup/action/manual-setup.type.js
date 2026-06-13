import { manualSetupStateGet } from "../manual-setup.state.js";
import { manualSetupDomGet } from "../manual-setup.dom.js";
import { manualSetupRenderTypeSwitch } from "../manual-setup.render.js";

/** Switches the manual-setup form between TOTP and HOTP. */
function manualSetupTypeSwitch(otpType) {
  if (manualSetupStateGet().isSubmitting) {
    return;
  }
  const dom = manualSetupDomGet();
  if (!dom.form) {
    return;
  }
  const type = otpType === "hotp" ? "hotp" : "totp";
  const typeInput = dom.form.querySelector('[name="type"]');
  if (typeInput) {
    typeInput.value = type;
  }
  manualSetupRenderTypeSwitch(type);
}

export { manualSetupTypeSwitch };
