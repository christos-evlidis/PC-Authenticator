import { HEADER_SCAN_QR_BTN_SELECTOR } from "../../shell/header/header-const.js";

export const QR_SETUP_ROOT_SELECTOR = ".qr-setup";
export const QR_SETUP_BACKDROP_SELECTOR = ".qr-setup__backdrop";
export const QR_SETUP_PANEL_SELECTOR = ".qr-setup__panel";
export const QR_SETUP_HEADER_SELECTOR = ".qr-setup__header";
export const QR_SETUP_CONTENT_SELECTOR = ".qr-setup__content";
export const QR_SETUP_BODY_SELECTOR = ".qr-setup__body";
export const QR_SETUP_CLOSE_BTN_SELECTOR = ".qr-setup__close-btn";
export const QR_SETUP_OPEN_BTN_SELECTOR = HEADER_SCAN_QR_BTN_SELECTOR;

export const QR_SETUP_GUIDE_SELECTOR = ".qr-setup__guide";
export const QR_SETUP_GUIDE_TEXT_SELECTOR = ".qr-setup__guide-text";

export const QR_SETUP_HIDDEN_CLASS = "is-hidden";
export const QR_SETUP_ACTIVE_CLASS = "is-active";
export const QR_SETUP_OPEN_CLASS = "is-open";

export const QR_SETUP_PANEL_OPENING_CLASS = "is-panel-opening";
export const QR_SETUP_PANEL_OPEN_CLASS = "is-panel-open";
export const QR_SETUP_PANEL_CLOSING_CLASS = "is-panel-closing";
export const QR_SETUP_PANEL_BACKDROP_CLOSING_CLASS = "is-panel-backdrop-closing";

export const QR_SETUP_HEADER_BTN_ACTIVE_CLASS = "is-qr-setup-btn-active";
export const QR_SETUP_BUSY_CLASS = "is-busy";
export const BODY_AUTH_FLOW_LOCK_CLASS = "is-auth-flow-locked";

export const QR_SETUP_VAR_BLUR_MS = "--blur-ms";
export const QR_SETUP_VAR_SLIDE_MS = "--qr-setup-slide-ms";
export const QR_SETUP_VAR_ANIMATION_TIMEOUT_BUFFER_MS = "--buffer-ms";

export const QR_SETUP_PANEL_ANIMATION_RUN_ID = { value: 0 };
export const QR_SETUP_RESUME_ANIMATION_RUN_ID = { value: 0 };

export const QR_SETUP_STATUS_LOADING_SELECTOR =
  ".qr-setup__status .login-status--loading";
export const QR_SETUP_STATUS_SUCCESS_SELECTOR =
  ".qr-setup__status .login-status--success";
export const QR_SETUP_STATUS_ERROR_SELECTOR =
  ".qr-setup__status .login-status--error";
export const QR_SETUP_STATUS_ICON_CIRCLE_SELECTOR = ".login-status__icon-circle";
export const QR_SETUP_STATUS_ICON_MARK_SELECTOR = ".login-status__icon-mark";

export const QR_SETUP_RESUME_RUNNING_CLASS = "is-resume-running";
export const QR_SETUP_RESUME_LOCKED_CLASS = "is-resume-locked";
export const QR_SETUP_RESUME_ABSOLUTE_CLASS = "is-resume-absolute";
export const QR_SETUP_RESUME_FADE_CLASS = "is-resume-fade";
export const QR_SETUP_RESUME_EXPAND_UP_CLASS = "is-resume-expand-up";
export const QR_SETUP_RESUME_EXPAND_FULL_CLASS = "is-resume-expand-full";
export const QR_SETUP_RESUME_DOTS_FADE_IN_CLASS = "is-resume-dots-fade-in";
export const QR_SETUP_RESUME_DOTS_RUN_CLASS = "is-resume-dots-run";
export const QR_SETUP_RESUME_DOTS_FADE_OUT_CLASS = "is-resume-dots-fade-out";
export const QR_SETUP_RESUME_RESULT_DRAW_CLASS = "is-resume-result-draw";
export const QR_SETUP_RESUME_RESULT_FADE_OUT_CLASS = "is-resume-result-fade-out";
export const QR_SETUP_RESUME_SHRINK_FULL_CLASS = "is-resume-shrink-full";
export const QR_SETUP_RESUME_SHRINK_DOWN_CLASS = "is-resume-shrink-down";

export const QR_SETUP_VAR_RESUME_FADE_MS = "--qr-setup-resume-fade-ms";
export const QR_SETUP_VAR_RESUME_EXPAND_UP_MS = "--qr-setup-resume-expand-up-ms";
export const QR_SETUP_VAR_RESUME_EXPAND_FULL_MS = "--qr-setup-resume-expand-full-ms";
export const QR_SETUP_VAR_RESUME_DOTS_FADE_IN_MS = "--qr-setup-resume-dots-fade-in-ms";
export const QR_SETUP_VAR_RESUME_DOTS_RUN_MS = "--qr-setup-resume-dots-run-ms";
export const QR_SETUP_VAR_RESUME_DOTS_FADE_OUT_MS = "--qr-setup-resume-dots-fade-out-ms";
export const QR_SETUP_VAR_RESUME_RESULT_DRAW_MS = "--qr-setup-resume-result-draw-ms";
export const QR_SETUP_VAR_RESUME_RESULT_FADE_OUT_MS = "--qr-setup-resume-result-fade-out-ms";
export const QR_SETUP_VAR_RESUME_SHRINK_FULL_MS = "--qr-setup-resume-shrink-full-ms";
export const QR_SETUP_VAR_RESUME_SHRINK_DOWN_MS = "--qr-setup-resume-shrink-down-ms";

export const QR_SETUP_VAR_RESUME_ORIGIN_TOP = "--sign-in-origin-top";
export const QR_SETUP_VAR_RESUME_ORIGIN_LEFT = "--sign-in-origin-left";
export const QR_SETUP_VAR_RESUME_ORIGIN_WIDTH = "--sign-in-origin-width";
export const QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT = "--sign-in-origin-height";
export const QR_SETUP_VAR_RESUME_EXPAND_TOP = "--sign-in-expand-top";
export const QR_SETUP_VAR_RESUME_EXPAND_LEFT = "--sign-in-expand-left";
export const QR_SETUP_VAR_RESUME_EXPAND_WIDTH = "--sign-in-expand-width";
export const QR_SETUP_VAR_RESUME_EXPAND_HEIGHT = "--sign-in-expand-height";
export const QR_SETUP_VAR_RESUME_FULL_TOP = "--sign-in-full-top";
export const QR_SETUP_VAR_RESUME_FULL_LEFT = "--sign-in-full-left";
export const QR_SETUP_VAR_RESUME_FULL_WIDTH = "--sign-in-full-width";
export const QR_SETUP_VAR_RESUME_FULL_HEIGHT = "--sign-in-full-height";
export const QR_SETUP_VAR_RESUME_RESTORE_TOP = "--sign-in-restore-top";
export const QR_SETUP_VAR_RESUME_RESTORE_LEFT = "--sign-in-restore-left";
export const QR_SETUP_VAR_RESUME_RESTORE_WIDTH = "--sign-in-restore-width";
export const QR_SETUP_VAR_RESUME_RESTORE_HEIGHT = "--sign-in-restore-height";

export const QR_SETUP_RESUME_FADE_SELECTORS = [
  QR_SETUP_HEADER_SELECTOR,
  QR_SETUP_GUIDE_SELECTOR,
].join(", ");

export const QR_SETUP_RESUME_LAYOUT_VARS = [
  QR_SETUP_VAR_RESUME_ORIGIN_TOP,
  QR_SETUP_VAR_RESUME_ORIGIN_LEFT,
  QR_SETUP_VAR_RESUME_ORIGIN_WIDTH,
  QR_SETUP_VAR_RESUME_ORIGIN_HEIGHT,
  QR_SETUP_VAR_RESUME_EXPAND_TOP,
  QR_SETUP_VAR_RESUME_EXPAND_LEFT,
  QR_SETUP_VAR_RESUME_EXPAND_WIDTH,
  QR_SETUP_VAR_RESUME_EXPAND_HEIGHT,
  QR_SETUP_VAR_RESUME_FULL_TOP,
  QR_SETUP_VAR_RESUME_FULL_LEFT,
  QR_SETUP_VAR_RESUME_FULL_WIDTH,
  QR_SETUP_VAR_RESUME_FULL_HEIGHT,
  QR_SETUP_VAR_RESUME_RESTORE_TOP,
  QR_SETUP_VAR_RESUME_RESTORE_LEFT,
  QR_SETUP_VAR_RESUME_RESTORE_WIDTH,
  QR_SETUP_VAR_RESUME_RESTORE_HEIGHT,
];

export const QR_SETUP_RESUME_CONTENT_PHASE_CLASSES = [
  QR_SETUP_RESUME_ABSOLUTE_CLASS,
  QR_SETUP_RESUME_EXPAND_UP_CLASS,
  QR_SETUP_RESUME_EXPAND_FULL_CLASS,
  QR_SETUP_RESUME_SHRINK_FULL_CLASS,
  QR_SETUP_RESUME_SHRINK_DOWN_CLASS,
];

export const QR_SETUP_GUIDE_SELECTION_TEXT =
  "Drag your mouse over the QR code to select and scan it.";
