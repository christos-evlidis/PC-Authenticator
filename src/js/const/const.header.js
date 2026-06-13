import {
  VAR_BUFFER_MS,
  VAR_FADE_MS,
  VAR_POP_MS,
  VAR_STAGGER_MS,
  VAR_TYPE_MS,
} from "./const.utility.js";

// Shell selectors.
export const HEADER_ROOT_SELECTOR = ".app-header";
export const HEADER_SHELL_SELECTOR = ".app-header__shell";
export const HEADER_INTRO_CONTENT_SELECTOR = ".app-header__intro-content";
export const HEADER_TITLE_SELECTOR = ".app-header__title";
export const HEADER_TITLE_SPACER_SELECTOR = ".app-header__title-spacer";
export const HEADER_TITLE_DISPLAY_SELECTOR = ".app-header__title-display";
export const HEADER_SIGNED_OUT_VIEW_SELECTOR = ".app-header__view--signed-out";
export const HEADER_SIGNED_IN_VIEW_SELECTOR = ".app-header__view--signed-in";
export const HEADER_VIEW_SELECTOR = ".app-header__view";
export const HEADER_BUTTON_SELECTOR = ".app-header__btn";
export const HEADER_MANUAL_SETUP_BTN_SELECTOR = ".app-header__manual-setup-btn";
export const HEADER_SCAN_QR_BTN_SELECTOR = ".app-header__scan-qr-btn";

// Shared state classes.
export const HEADER_HIDDEN_CLASS = "is-hidden";
export const HEADER_DISABLED_CLASS = "is-disabled";

// Animation phase classes.
export const HEADER_ANIMATION_PENDING_CLASS = "is-header-animation-pending";
export const HEADER_CONTENT_PENDING_CLASS = "is-header-content-pending";
export const HEADER_FADE_IN_CLASS = "is-header-fade-in";
export const HEADER_TITLE_TYPING_CLASS = "is-header-title-typing";
export const HEADER_ICON_POP_PENDING_CLASS = "is-header-pop-pending";
export const HEADER_ICON_POP_REVEALED_CLASS = "is-header-pop-revealed";

// Shared timing vars (defined on .app-header; read via animCssMsGet).
export const HEADER_VAR_INTRO_FADE_MS = VAR_FADE_MS;
export const HEADER_VAR_TITLE_TYPE_MS = VAR_TYPE_MS;
export const HEADER_VAR_ICON_POP_MS = VAR_POP_MS;
export const HEADER_VAR_ICON_POP_STAGGER_MS = VAR_STAGGER_MS;
export const HEADER_VAR_ANIMATION_TIMEOUT_BUFFER_MS = VAR_BUFFER_MS;

// Copy.
export const HEADER_TITLE_TEXT = "PC Authenticator";
