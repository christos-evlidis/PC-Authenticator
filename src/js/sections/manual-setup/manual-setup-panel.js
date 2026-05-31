import { cross } from "../section-cross.js";
import { FRAME_BLUR_CLASS } from "../section-cross.js";

export const MANUAL_SETUP_SECTION_SELECTOR = ".manual-setup-section";
export const MANUAL_SETUP_BTN_SELECTOR = ".manual-setup-btn";
export const MANUAL_SETUP_CLOSE_BTN_SELECTOR = ".manual-setup-close-btn";
export const MANUAL_SETUP_BACKDROP_SELECTOR = ".manual-setup-backdrop";
export const MANUAL_SETUP_PANEL_SELECTOR = ".manual-setup-panel";
export const MANUAL_SETUP_BODY_SELECTOR = ".manual-setup-body";
export const MANUAL_SETUP_FORM_SELECTOR = ".manual-setup-form";
export const BODY_AUTH_FLOW_LOCK_CLASS = "is-auth-flow-locked";

let isManualSubmitting = false;

export function getIsManualSubmitting() {
  return isManualSubmitting;
}

export function setIsManualSubmitting(value) {
  isManualSubmitting = value;
}

export function isAuthFlowLocked() {
  return document.body.classList.contains(BODY_AUTH_FLOW_LOCK_CLASS);
}

export function setAuthFlowLock(isLocked) {
  document.body.classList.toggle(BODY_AUTH_FLOW_LOCK_CLASS, isLocked);
}

export function getManualSetupSection() {
  return document.querySelector(MANUAL_SETUP_SECTION_SELECTOR);
}

export function getManualSetupPanel() {
  return document.querySelector(MANUAL_SETUP_PANEL_SELECTOR);
}

export function getManualSetupBody() {
  return document.querySelector(MANUAL_SETUP_BODY_SELECTOR);
}

export function getManualSetupForm() {
  return document.querySelector(MANUAL_SETUP_FORM_SELECTOR);
}

export function isManualSetupActive() {
  return getManualSetupSection()?.classList.contains("is-active") ?? false;
}

function getManualSetupButtons() {
  return document.querySelectorAll(MANUAL_SETUP_BTN_SELECTOR);
}

function setManualSetupButtonsActive(isActive) {
  getManualSetupButtons().forEach((btn) => {
    btn.classList.toggle("is-active", isActive);
  });
}

async function closeOtherOverlays() {
  if (cross.qrCodeSetup.isActive()) {
    await cross.qrCodeSetup.close();
  }
}

export async function openManualSetup() {
  if (isAuthFlowLocked()) return;

  const section = getManualSetupSection();
  if (!section || isManualSetupActive()) return;

  await closeOtherOverlays();

  section.classList.add("is-active", "is-panel-open");
  document.body.classList.add(FRAME_BLUR_CLASS);
  setManualSetupButtonsActive(true);
}

export async function closeManualSetup() {
  const section = getManualSetupSection();
  if (!section || !isManualSetupActive()) return;

  setIsManualSubmitting(false);
  setAuthFlowLock(false);

  section.classList.remove("is-panel-open", "is-active");
  document.body.classList.remove(FRAME_BLUR_CLASS);
  setManualSetupButtonsActive(false);
}

export function toggleManualSetup() {
  if (isAuthFlowLocked()) return;

  if (isManualSetupActive()) {
    void closeManualSetup();
  } else {
    void openManualSetup();
  }
}

function handleManualSetupOpenClick(event) {
  const openBtn = event.target.closest(MANUAL_SETUP_BTN_SELECTOR);
  if (!openBtn) return;

  event.preventDefault();
  event.stopPropagation();
  toggleManualSetup();
}

export function initManualSetupPanel() {
  const closeBtn = document.querySelector(MANUAL_SETUP_CLOSE_BTN_SELECTOR);
  const backdrop = document.querySelector(MANUAL_SETUP_BACKDROP_SELECTOR);
  const panel = getManualSetupPanel();

  document.addEventListener("click", handleManualSetupOpenClick);

  closeBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    void closeManualSetup();
  });

  backdrop?.addEventListener("click", () => {
    void closeManualSetup();
  });

  panel?.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}
