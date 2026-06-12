import { HEADER_MANUAL_SETUP_BTN_SELECTOR } from "../../shell/header/header-const.js";
import {
  VAR_BLUR_MS,
  VAR_BUFFER_MS,
  VAR_DOTS_RUN_MS,
  VAR_EXPAND_FULL_MS,
  VAR_EXPAND_UP_MS,
  VAR_FADE_MS,
  VAR_RESULT_MAIN_DRAW_MS,
  VAR_SHRINK_DOWN_MS,
  VAR_SHRINK_FULL_MS,
  VAR_SLIDE_MS,
} from "../../../utils/utility-const.js";

// Overlay shell selectors.
export const MANUAL_SETUP_ROOT_SELECTOR = ".manual-setup";
export const MANUAL_SETUP_BACKDROP_SELECTOR = ".manual-setup__backdrop";
export const MANUAL_SETUP_PANEL_SELECTOR = ".manual-setup__panel";
export const MANUAL_SETUP_HEADER_SELECTOR = ".manual-setup__header";
export const MANUAL_SETUP_CONTENT_SELECTOR = ".manual-setup__content";
export const MANUAL_SETUP_BODY_SELECTOR = ".manual-setup__body";
export const MANUAL_SETUP_FORM_SELECTOR = ".manual-setup__form";
export const MANUAL_SETUP_CLOSE_BTN_SELECTOR = ".manual-setup__close-btn";
export const MANUAL_SETUP_OPEN_BTN_SELECTOR = HEADER_MANUAL_SETUP_BTN_SELECTOR;

export const MANUAL_SETUP_OTP_TYPE_TRACK_SELECTOR = ".manual-setup__type-track";
export const MANUAL_SETUP_OTP_TYPE_BTN_SELECTOR = ".manual-setup__type-btn";

// Shared state classes.
export const MANUAL_SETUP_HIDDEN_CLASS = "is-hidden";
export const MANUAL_SETUP_ACTIVE_CLASS = "is-active";
export const MANUAL_SETUP_OPEN_CLASS = "is-open";
export const MANUAL_SETUP_SUBMITTING_CLASS = "is-submitting";

// Panel phase classes.
export const MANUAL_SETUP_PANEL_OPENING_CLASS = "is-panel-opening";
export const MANUAL_SETUP_PANEL_OPEN_CLASS = "is-panel-open";
export const MANUAL_SETUP_PANEL_CLOSING_CLASS = "is-panel-closing";
export const MANUAL_SETUP_PANEL_BACKDROP_CLOSING_CLASS = "is-panel-backdrop-closing";
export const MANUAL_SETUP_HEADER_BTN_ACTIVE_CLASS = "is-manual-setup-btn-active";

// Shared timing vars (defined on .manual-setup; read via animCssMsGet).
export const MANUAL_SETUP_VAR_BLUR_MS = VAR_BLUR_MS;
export const MANUAL_SETUP_VAR_SLIDE_MS = VAR_SLIDE_MS;
export const MANUAL_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS = VAR_BUFFER_MS;

// Animation run ids.
export const MANUAL_SETUP_PANEL_ANIMATION_RUN_ID = { value: 0 };
export const MANUAL_SETUP_SUBMIT_ANIMATION_RUN_ID = { value: 0 };

// Status icon selectors.
export const MANUAL_SETUP_STATUS_LOADING_SELECTOR =
  ".manual-setup__status .manual-setup-status--loading";
export const MANUAL_SETUP_STATUS_SUCCESS_SELECTOR =
  ".manual-setup__status .manual-setup-status--success";
export const MANUAL_SETUP_STATUS_ERROR_SELECTOR =
  ".manual-setup__status .manual-setup-status--error";
export const MANUAL_SETUP_STATUS_ICON_CIRCLE_SELECTOR = ".manual-setup-status__icon-circle";
export const MANUAL_SETUP_STATUS_ICON_MARK_SELECTOR = ".manual-setup-status__icon-mark";

// Submit animation phase classes.
export const MANUAL_SETUP_SUBMIT_RUNNING_CLASS = "is-submit-running";
export const MANUAL_SETUP_SUBMIT_LOCKED_CLASS = "is-submit-locked";
export const MANUAL_SETUP_SUBMIT_ABSOLUTE_CLASS = "is-submit-absolute";
export const MANUAL_SETUP_SUBMIT_FADE_CLASS = "is-submit-fade";
export const MANUAL_SETUP_SUBMIT_EXPAND_UP_CLASS = "is-submit-expand-up";
export const MANUAL_SETUP_SUBMIT_EXPAND_FULL_CLASS = "is-submit-expand-full";
export const MANUAL_SETUP_SUBMIT_EXPAND_EXTENSION_CLASS = "is-submit-expand-extension";
export const MANUAL_SETUP_SUBMIT_DOTS_FADE_IN_CLASS = "is-submit-dots-fade-in";
export const MANUAL_SETUP_SUBMIT_DOTS_RUN_CLASS = "is-submit-dots-run";
export const MANUAL_SETUP_SUBMIT_DOTS_FADE_OUT_CLASS = "is-submit-dots-fade-out";
export const MANUAL_SETUP_SUBMIT_RESULT_DRAW_CLASS = "is-submit-result-draw";
export const MANUAL_SETUP_SUBMIT_RESULT_FADE_OUT_CLASS = "is-submit-result-fade-out";
export const MANUAL_SETUP_SUBMIT_SHRINK_TO_FULL_CLASS = "is-submit-shrink-to-full";
export const MANUAL_SETUP_SUBMIT_SHRINK_FULL_CLASS = "is-submit-shrink-full";
export const MANUAL_SETUP_SUBMIT_SHRINK_DOWN_CLASS = "is-submit-shrink-down";
export const MANUAL_SETUP_SUBMIT_RESTORE_FADE_CLASS = "is-submit-restore-fade";

// Submit timing vars.
export const MANUAL_SETUP_VAR_SUBMIT_FADE_MS = VAR_FADE_MS;
export const MANUAL_SETUP_VAR_SUBMIT_EXPAND_UP_MS = VAR_EXPAND_UP_MS;
export const MANUAL_SETUP_VAR_SUBMIT_EXPAND_FULL_MS = VAR_EXPAND_FULL_MS;
export const MANUAL_SETUP_VAR_SUBMIT_EXPAND_EXTENSION_MS = VAR_EXPAND_UP_MS;
export const MANUAL_SETUP_VAR_SUBMIT_DOTS_FADE_IN_MS = VAR_FADE_MS;
export const MANUAL_SETUP_VAR_SUBMIT_DOTS_RUN_MS = VAR_DOTS_RUN_MS;
export const MANUAL_SETUP_VAR_SUBMIT_DOTS_FADE_OUT_MS = VAR_FADE_MS;
export const MANUAL_SETUP_VAR_SUBMIT_RESULT_DRAW_MS = VAR_RESULT_MAIN_DRAW_MS;
export const MANUAL_SETUP_VAR_SUBMIT_RESULT_FADE_OUT_MS = VAR_FADE_MS;
export const MANUAL_SETUP_VAR_SUBMIT_SHRINK_TO_FULL_MS = VAR_SHRINK_DOWN_MS;
export const MANUAL_SETUP_VAR_SUBMIT_SHRINK_FULL_MS = VAR_SHRINK_FULL_MS;
export const MANUAL_SETUP_VAR_SUBMIT_SHRINK_DOWN_MS = VAR_SHRINK_DOWN_MS;
export const MANUAL_SETUP_VAR_SUBMIT_RESTORE_FADE_MS = VAR_FADE_MS;

// Submit layout vars (from / to positions for expand keyframes).
export const MANUAL_SETUP_VAR_SUBMIT_ORIGIN_TOP = "--sign-in-origin-top";
export const MANUAL_SETUP_VAR_SUBMIT_ORIGIN_LEFT = "--sign-in-origin-left";
export const MANUAL_SETUP_VAR_SUBMIT_ORIGIN_WIDTH = "--sign-in-origin-width";
export const MANUAL_SETUP_VAR_SUBMIT_ORIGIN_HEIGHT = "--sign-in-origin-height";

export const MANUAL_SETUP_VAR_SUBMIT_EXPAND_TOP = "--sign-in-expand-top";
export const MANUAL_SETUP_VAR_SUBMIT_EXPAND_LEFT = "--sign-in-expand-left";
export const MANUAL_SETUP_VAR_SUBMIT_EXPAND_WIDTH = "--sign-in-expand-width";
export const MANUAL_SETUP_VAR_SUBMIT_EXPAND_HEIGHT = "--sign-in-expand-height";

export const MANUAL_SETUP_VAR_SUBMIT_FULL_TOP = "--sign-in-full-top";
export const MANUAL_SETUP_VAR_SUBMIT_FULL_LEFT = "--sign-in-full-left";
export const MANUAL_SETUP_VAR_SUBMIT_FULL_WIDTH = "--sign-in-full-width";
export const MANUAL_SETUP_VAR_SUBMIT_FULL_HEIGHT = "--sign-in-full-height";

export const MANUAL_SETUP_VAR_SUBMIT_EXTENSION_TOP = "--sign-in-extension-top";
export const MANUAL_SETUP_VAR_SUBMIT_EXTENSION_LEFT = "--sign-in-extension-left";
export const MANUAL_SETUP_VAR_SUBMIT_EXTENSION_WIDTH = "--sign-in-extension-width";
export const MANUAL_SETUP_VAR_SUBMIT_EXTENSION_HEIGHT = "--sign-in-extension-height";

export const MANUAL_SETUP_VAR_SUBMIT_RESTORE_TOP = "--sign-in-restore-top";
export const MANUAL_SETUP_VAR_SUBMIT_RESTORE_LEFT = "--sign-in-restore-left";
export const MANUAL_SETUP_VAR_SUBMIT_RESTORE_WIDTH = "--sign-in-restore-width";
export const MANUAL_SETUP_VAR_SUBMIT_RESTORE_HEIGHT = "--sign-in-restore-height";

// Submit animation helpers.
export const MANUAL_SETUP_SUBMIT_FADE_SELECTORS = [
  MANUAL_SETUP_HEADER_SELECTOR,
  MANUAL_SETUP_FORM_SELECTOR,
].join(", ");

export const MANUAL_SETUP_SUBMIT_LAYOUT_VARS = [
  MANUAL_SETUP_VAR_SUBMIT_ORIGIN_TOP,
  MANUAL_SETUP_VAR_SUBMIT_ORIGIN_LEFT,
  MANUAL_SETUP_VAR_SUBMIT_ORIGIN_WIDTH,
  MANUAL_SETUP_VAR_SUBMIT_ORIGIN_HEIGHT,
  MANUAL_SETUP_VAR_SUBMIT_EXPAND_TOP,
  MANUAL_SETUP_VAR_SUBMIT_EXPAND_LEFT,
  MANUAL_SETUP_VAR_SUBMIT_EXPAND_WIDTH,
  MANUAL_SETUP_VAR_SUBMIT_EXPAND_HEIGHT,
  MANUAL_SETUP_VAR_SUBMIT_FULL_TOP,
  MANUAL_SETUP_VAR_SUBMIT_FULL_LEFT,
  MANUAL_SETUP_VAR_SUBMIT_FULL_WIDTH,
  MANUAL_SETUP_VAR_SUBMIT_FULL_HEIGHT,
  MANUAL_SETUP_VAR_SUBMIT_EXTENSION_TOP,
  MANUAL_SETUP_VAR_SUBMIT_EXTENSION_LEFT,
  MANUAL_SETUP_VAR_SUBMIT_EXTENSION_WIDTH,
  MANUAL_SETUP_VAR_SUBMIT_EXTENSION_HEIGHT,
  MANUAL_SETUP_VAR_SUBMIT_RESTORE_TOP,
  MANUAL_SETUP_VAR_SUBMIT_RESTORE_LEFT,
  MANUAL_SETUP_VAR_SUBMIT_RESTORE_WIDTH,
  MANUAL_SETUP_VAR_SUBMIT_RESTORE_HEIGHT,
];

export const MANUAL_SETUP_SUBMIT_CONTENT_PHASE_CLASSES = [
  MANUAL_SETUP_SUBMIT_ABSOLUTE_CLASS,
  MANUAL_SETUP_SUBMIT_EXPAND_UP_CLASS,
  MANUAL_SETUP_SUBMIT_EXPAND_FULL_CLASS,
  MANUAL_SETUP_SUBMIT_EXPAND_EXTENSION_CLASS,
  MANUAL_SETUP_SUBMIT_SHRINK_TO_FULL_CLASS,
  MANUAL_SETUP_SUBMIT_SHRINK_FULL_CLASS,
  MANUAL_SETUP_SUBMIT_SHRINK_DOWN_CLASS,
];
