import { cross } from "../section-cross.js";
import { FRAME_BLUR_CLASS } from "../section-cross.js";

export const QR_SETUP_SECTION_SELECTOR = ".qr-setup-section";
export const QR_SETUP_BTN_SELECTOR = ".scan-qr-btn";
export const QR_SETUP_CLOSE_BTN_SELECTOR = ".qr-setup-close-btn";
export const QR_SETUP_BACKDROP_SELECTOR = ".qr-setup-backdrop";
export const QR_SETUP_PANEL_SELECTOR = ".qr-setup-panel";
export const QR_SETUP_BODY_SELECTOR = ".qr-setup-body";
export const BODY_AUTH_FLOW_LOCK_CLASS = "is-auth-flow-locked";
export const QR_GUIDE_SELECTOR = ".qr-setup-guide";
export const QR_GUIDE_TEXT_SELECTOR = ".qr-setup-guide__text";
export const QR_GUIDE_SELECTION_TEXT =
  "Drag your mouse over the QR code to select and scan it.";

let isQrBusy = false;
let isAwaitingPageSelection = false;

export function getIsQrBusy() {
  return isQrBusy;
}

export function setIsQrBusy(value) {
  isQrBusy = value;
}

export function getIsAwaitingPageSelection() {
  return isAwaitingPageSelection;
}

export function setIsAwaitingPageSelection(value) {
  isAwaitingPageSelection = value;
}

export function isAuthFlowLocked() {
  return document.body.classList.contains(BODY_AUTH_FLOW_LOCK_CLASS);
}

export function setAuthFlowLock(isLocked) {
  document.body.classList.toggle(BODY_AUTH_FLOW_LOCK_CLASS, isLocked);
}

export function getQrSetupSection() {
  return document.querySelector(QR_SETUP_SECTION_SELECTOR);
}

export function getQrSetupPanel() {
  return document.querySelector(QR_SETUP_PANEL_SELECTOR);
}

export function getQrSetupBody() {
  return document.querySelector(QR_SETUP_BODY_SELECTOR);
}

export function isQrSetupActive() {
  return getQrSetupSection()?.classList.contains("is-active") ?? false;
}

function getQrSetupButtons() {
  return document.querySelectorAll(QR_SETUP_BTN_SELECTOR);
}

function setQrSetupButtonsActive(isActive) {
  getQrSetupButtons().forEach((btn) => {
    btn.classList.toggle("is-active", isActive);
  });
}

export function getQrSetupGuide() {
  return document.querySelector(QR_GUIDE_SELECTOR);
}

export function setGuideText(text) {
  const guideText = document.querySelector(QR_GUIDE_TEXT_SELECTOR);

  if (guideText) {
    guideText.textContent = text;
  }
}

export function setGuideCopyVisible(isVisible) {
  document
    .querySelector(QR_GUIDE_TEXT_SELECTOR)
    ?.classList.toggle("hidden", !isVisible);
}

export function resetQrSetupGuide() {
  setGuideText(QR_GUIDE_SELECTION_TEXT);
  setGuideCopyVisible(true);
}

async function closeOtherOverlays() {
  if (cross.manualSetup.isActive()) {
    await cross.manualSetup.close();
  }
}

export function openQrSetupInstant() {
  const section = getQrSetupSection();

  if (!section) {
    return false;
  }

  resetQrSetupGuide();
  section.classList.add("is-active", "is-panel-open");
  document.body.classList.add(FRAME_BLUR_CLASS);
  setQrSetupButtonsActive(true);

  return true;
}

export async function openQrSetup() {
  const section = getQrSetupSection();

  if (!section || isQrSetupActive()) {
    return true;
  }

  await closeOtherOverlays();

  resetQrSetupGuide();
  section.classList.add("is-active", "is-panel-open");
  document.body.classList.add(FRAME_BLUR_CLASS);
  setQrSetupButtonsActive(true);

  return true;
}

export async function closeQrSetup(deps = {}) {
  const { cancelPageSelection } = deps;

  setIsQrBusy(false);
  setAuthFlowLock(false);

  const section = getQrSetupSection();

  if (!section || !isQrSetupActive()) {
    return;
  }

  await cancelPageSelection?.();

  section.classList.remove("is-panel-open", "is-active");
  document.body.classList.remove(FRAME_BLUR_CLASS);
  setQrSetupButtonsActive(false);
  isAwaitingPageSelection = false;
  resetQrSetupGuide();
}

export function initQrCodeSetupPanel({
  startQrScan,
  closeQrSetupBound,
  handleQrScanCancelled,
  handleQrSetupKeyDown,
}) {
  const closeBtn = document.querySelector(QR_SETUP_CLOSE_BTN_SELECTOR);
  const backdrop = document.querySelector(QR_SETUP_BACKDROP_SELECTOR);
  const panel = getQrSetupPanel();

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "qrScanCancelled") {
      handleQrScanCancelled();
    }
  });

  document.addEventListener("click", (event) => {
    const openBtn = event.target.closest(QR_SETUP_BTN_SELECTOR);

    if (!openBtn) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (isQrSetupActive()) {
      void closeQrSetupBound();
      return;
    }

    void startQrScan();
  });

  closeBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    void closeQrSetupBound();
  });

  backdrop?.addEventListener("click", () => {
    void closeQrSetupBound();
  });

  panel?.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("keydown", handleQrSetupKeyDown, true);
}
