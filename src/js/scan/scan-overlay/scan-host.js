import { OVERLAY_CSS_PATH } from "../scan-constants.js";
import { OVERLAY_HOST_CLASS } from "../scan-constants.js";

/** Returns whether the body element creates a stacking context. */
export function qrScanOverlayStackingContextHas() {
  const style = getComputedStyle(document.body);

  return (
    style.transform !== "none" ||
    style.filter !== "none" ||
    style.perspective !== "none" ||
    style.isolation === "isolate" ||
    style.willChange.includes("transform") ||
    style.willChange.includes("filter")
  );
}

/** Returns the DOM parent used to mount the overlay host. */
export function qrScanOverlayMountParentGet() {
  return qrScanOverlayStackingContextHas()
    ? document.documentElement
    : document.body;
}

/** Removes any existing overlay host element from the page. */
export function qrScanOverlayHostRemove() {
  document.querySelector(`.${OVERLAY_HOST_CLASS}`)?.remove();
}

/** Ensures host styles are loaded in the page (avoids inline style CSP violations). */
function qrScanOverlayHostStylesEnsure() {
  const styleId = "pc-auth-qr-scan-host-styles";

  if (document.getElementById(styleId)) {
    return;
  }

  const link = document.createElement("link");
  link.id = styleId;
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL(OVERLAY_CSS_PATH);
  document.head.append(link);
}

/** Creates the shadow-DOM overlay host and attaches stylesheet. */
export function qrScanOverlayHostCreate() {
  qrScanOverlayHostStylesEnsure();

  const host = document.createElement("div");
  host.className = OVERLAY_HOST_CLASS;

  const shadow = host.attachShadow({ mode: "closed" });
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = chrome.runtime.getURL(OVERLAY_CSS_PATH);
  shadow.append(stylesheet);
  qrScanOverlayMountParentGet().append(host);

  return { host, shadow };
}
