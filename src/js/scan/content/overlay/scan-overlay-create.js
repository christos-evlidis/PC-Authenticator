import { OVERLAY_CSS_PATH } from "../../scan-constants.js";
import { OVERLAY_HOST_CLASS } from "../../scan-constants.js";

/** Creates the full-page QR scan overlay on the website. */
function scanOverlayCreate() {
  const styleId = "pc-auth-qr-scan-host-styles";

  if (!document.getElementById(styleId)) {
    const link = document.createElement("link");
    link.id = styleId;
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL(OVERLAY_CSS_PATH);
    document.head.append(link);
  }

  const bodyStyle = getComputedStyle(document.body);
  const mountParent =
    bodyStyle.transform !== "none" ||
    bodyStyle.filter !== "none" ||
    bodyStyle.perspective !== "none" ||
    bodyStyle.isolation === "isolate" ||
    bodyStyle.willChange.includes("transform") ||
    bodyStyle.willChange.includes("filter")
      ? document.documentElement
      : document.body;

  const host = document.createElement("div");
  host.className = OVERLAY_HOST_CLASS;

  const shadow = host.attachShadow({ mode: "closed" });
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = chrome.runtime.getURL(OVERLAY_CSS_PATH);
  shadow.append(stylesheet);

  const overlay = document.createElement("div");
  overlay.className = "pc-auth-qr-scan-overlay";

  const selectionBox = document.createElement("div");
  selectionBox.className = "pc-auth-qr-scan-selection";

  const instruction = document.createElement("div");
  instruction.className = "pc-auth-qr-scan-instruction";
  instruction.textContent =
    "Drag your mouse over the QR code to select and scan it. Press ESC to cancel.";

  overlay.append(selectionBox, instruction);
  shadow.append(overlay);
  mountParent.append(host);

  return { host, shadow, overlay, selectionBox };
}

export { scanOverlayCreate };
