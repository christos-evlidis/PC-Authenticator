import { manualSetupEventsBind } from "./manual-setup.events.js";
import { manualSetupDomGet } from "./manual-setup.dom.js";

/** Registers manual-setup panel listeners and form handlers. */
function manualSetupInit() {
  manualSetupEventsBind();
  const dom = manualSetupDomGet();
  if (dom.form) {
    const typeInput = dom.form.querySelector('[name="type"]');
    if (typeInput) {
      typeInput.value = "totp";
    }
    if (dom.typeTrack) {
      dom.typeTrack.classList.remove("is-hotp");
    }
    dom.typeBtns.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.otpType !== "hotp");
    });
  }
}

export { manualSetupInit };
