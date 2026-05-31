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

/** Creates the shadow-DOM overlay host and attaches stylesheet. */
export function qrScanOverlayHostCreate() {
  const host = document.createElement("div");
  host.className = OVERLAY_HOST_CLASS;
  host.style.cssText = [
    "position: fixed !important",
    "inset: 0 !important",
    "width: 100% !important",
    "height: 100% !important",
    "z-index: 2147483647 !important",
    "pointer-events: none !important",
    "margin: 0 !important",
    "padding: 0 !important",
    "border: none !important",
    "background: transparent !important",
  ].join(" ");

  const shadow = host.attachShadow({ mode: "closed" });
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = chrome.runtime.getURL(OVERLAY_CSS_PATH);
  shadow.append(stylesheet);
  qrScanOverlayMountParentGet().append(host);

  return { host, shadow };
}
