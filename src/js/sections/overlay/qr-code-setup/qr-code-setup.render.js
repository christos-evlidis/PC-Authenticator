import { qrSetupDomSet } from "./qr-code-setup.dom.js";


// Updates the guide text in the UI.
function qrSetupRenderGuide(guideText) {
  qrSetupDomSet({ guideText });
}


export { qrSetupRenderGuide };
