import { VAR_BLUR_MS, VAR_BUFFER_MS, VAR_DOTS_RUN_MS, VAR_EXPAND_FULL_MS, VAR_EXPAND_UP_MS, VAR_FADE_MS, VAR_HOLD_MS, VAR_RESULT_MAIN_DRAW_MS, VAR_SHRINK_DOWN_MS, VAR_SHRINK_FULL_MS, VAR_SLIDE_MS } from "../../../utils/utility-const.js";

// Overlay shell selectors.
export const USER_MENU_ROOT_SELECTOR = ".app-user-menu";
export const USER_MENU_BACKDROP_SELECTOR = ".app-user-menu__backdrop";
export const USER_MENU_PANEL_SELECTOR = ".app-user-menu__panel";
export const USER_MENU_HEADER_SELECTOR = ".app-user-menu__header";
export const USER_MENU_CONTENT_SELECTOR = ".app-user-menu__content";
export const USER_MENU_CLOSE_BTN_SELECTOR = ".app-user-menu__close-btn";
export const USER_MENU_OPEN_BTN_SELECTOR = ".app-header__user-menu-btn";

export const USER_MENU_HEADER_BTN_ACTIVE_CLASS = "is-user-menu-btn-active";

export const USER_MENU_SIGNED_OUT_VIEW_SELECTOR =
  ".app-user-menu__view--signed-out";
export const USER_MENU_SIGNED_IN_VIEW_SELECTOR =
  ".app-user-menu__view--signed-in";

export const USER_MENU_AUTH_BAR_SELECTOR = ".app-user-menu__auth-bar";
export const USER_MENU_AUTH_TRACK_SELECTOR =
  ".app-user-menu__auth-switch-track";
export const USER_MENU_AUTH_THUMB_SELECTOR =
  ".app-user-menu__auth-switch-thumb";
export const USER_MENU_AUTH_BTN_SELECTOR = ".app-user-menu__auth-switch-btn";

export const USER_MENU_THEME_BAR_SELECTOR = ".app-user-menu__theme-bar";
export const USER_MENU_THEME_TRACK_SELECTOR =
  ".app-user-menu__theme-switch-track";
export const USER_MENU_THEME_THUMB_SELECTOR =
  ".app-user-menu__theme-switch-thumb";
export const USER_MENU_THEME_BTN_SELECTOR = ".app-user-menu__theme-switch-btn";

export const USER_MENU_SIGN_IN_VIEW_SELECTOR =
  ".app-user-menu__auth-view--sign-in";
export const USER_MENU_SIGN_IN_FORM_SELECTOR = ".app-user-menu__form--sign-in";
export const USER_MENU_ACCOUNT_FIELD_SIGNED_OUT_SELECTOR =
  ".app-user-menu__sign-in-input";

export const USER_MENU_SIGN_UP_VIEW_SELECTOR =
  ".app-user-menu__auth-view--sign-up";
export const USER_MENU_SIGN_UP_BTN_SELECTOR = ".app-user-menu__sign-up-submit";

export const USER_MENU_ACCOUNT_FIELD_SIGNED_IN_SELECTOR =
  ".app-user-menu__account-input";
export const USER_MENU_ACCOUNT_COPY_BTN_SELECTOR =
  ".app-user-menu__account-copy-btn";
export const USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR =
  ".app-user-menu__account-download-btn";

export const USER_MENU_LOGOUT_BTN_SELECTOR = ".app-user-menu__logout-btn";

export const USER_MENU_STATUS_LOADING_SELECTOR =
  ".app-user-menu__status .user-menu-status--loading";
export const USER_MENU_STATUS_SUCCESS_SELECTOR =
  ".app-user-menu__status .user-menu-status--success";
export const USER_MENU_STATUS_ERROR_SELECTOR =
  ".app-user-menu__status .user-menu-status--error";
export const USER_MENU_STATUS_ICON_CIRCLE_SELECTOR =
  ".user-menu-status__icon-circle";
export const USER_MENU_STATUS_ICON_MARK_SELECTOR =
  ".user-menu-status__icon-mark";

export const USER_MENU_AUTH_VIEW_SIGN_IN = "sign-in";
export const USER_MENU_AUTH_VIEW_SIGN_UP = "sign-up";

// Shared state classes.
export const USER_MENU_HIDDEN_CLASS = "is-hidden";
export const USER_MENU_ACTIVE_CLASS = "is-active";
export const USER_MENU_OPEN_CLASS = "is-open";

export const USER_MENU_PANEL_OPENING_CLASS = "is-panel-opening";
export const USER_MENU_PANEL_OPEN_CLASS = "is-panel-open";
export const USER_MENU_PANEL_CLOSING_CLASS = "is-panel-closing";
export const USER_MENU_PANEL_BACKDROP_CLOSING_CLASS =
  "is-panel-backdrop-closing";

// Panel / account state classes.

export const USER_MENU_AUTH_SIGN_IN_CLASS = "is-sign-in";
export const USER_MENU_AUTH_SIGN_UP_CLASS = "is-sign-up";

export const USER_MENU_THEME_LIGHT_CLASS = "is-light";
export const USER_MENU_THEME_DARK_CLASS = "is-dark";

// Shared timing vars (defined on .app-user-menu; read via animCssMsGet).
export const USER_MENU_VAR_BLUR_MS = VAR_BLUR_MS;
export const USER_MENU_VAR_SLIDE_MS = VAR_SLIDE_MS;

export const USER_MENU_VAR_AUTH_THUMB_MS = VAR_SLIDE_MS;
export const USER_MENU_VAR_THEME_THUMB_MS = VAR_SLIDE_MS;
export const USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS = VAR_BUFFER_MS;

// Sign-in animation phase classes.
export const USER_MENU_SIGN_IN_RUNNING_CLASS = "is-animating";
export const USER_MENU_SIGN_IN_LOCKED_CLASS = "is-sign-in-locked";
export const USER_MENU_SIGN_IN_ABSOLUTE_CLASS = "is-sign-in-absolute";

export const USER_MENU_SIGN_IN_FADE_CLASS = "is-sign-in-fade";
export const USER_MENU_SIGN_IN_EXPAND_UP_CLASS = "is-sign-in-expand-up";
export const USER_MENU_SIGN_IN_EXPAND_FULL_CLASS = "is-sign-in-expand-full";
export const USER_MENU_SIGN_IN_EXPAND_EXTENSION_CLASS =
  "is-sign-in-expand-extension";
export const USER_MENU_SIGN_IN_DOTS_FADE_IN_CLASS = "is-sign-in-dots-fade-in";
export const USER_MENU_SIGN_IN_DOTS_RUN_CLASS = "is-sign-in-dots-run";
export const USER_MENU_SIGN_IN_DOTS_FADE_OUT_CLASS = "is-sign-in-dots-fade-out";
export const USER_MENU_SIGN_IN_RESULT_DRAW_CLASS = "is-sign-in-result-draw";
export const USER_MENU_SIGN_IN_RESULT_FADE_OUT_CLASS =
  "is-sign-in-result-fade-out";
export const USER_MENU_SIGN_IN_SHRINK_TO_FULL_CLASS =
  "is-sign-in-shrink-to-full";
export const USER_MENU_SIGN_IN_SHRINK_FULL_CLASS = "is-sign-in-shrink-full";
export const USER_MENU_SIGN_IN_SHRINK_DOWN_CLASS = "is-sign-in-shrink-down";
export const USER_MENU_SIGN_IN_RESTORE_FADE_CLASS = "is-sign-in-restore-fade";

// Sign-in timing vars.
export const USER_MENU_VAR_SIGN_IN_FADE_MS = VAR_FADE_MS;
export const USER_MENU_VAR_SIGN_IN_EXPAND_UP_MS = VAR_EXPAND_UP_MS;
export const USER_MENU_VAR_SIGN_IN_EXPAND_FULL_MS = VAR_EXPAND_FULL_MS;
export const USER_MENU_VAR_SIGN_IN_EXPAND_EXTENSION_MS = VAR_EXPAND_UP_MS;
export const USER_MENU_VAR_SIGN_IN_DOTS_FADE_IN_MS = VAR_FADE_MS;
export const USER_MENU_VAR_SIGN_IN_DOTS_RUN_MS = VAR_DOTS_RUN_MS;
export const USER_MENU_VAR_SIGN_IN_DOTS_FADE_OUT_MS = VAR_FADE_MS;
export const USER_MENU_VAR_SIGN_IN_RESULT_DRAW_MS = VAR_RESULT_MAIN_DRAW_MS;
export const USER_MENU_VAR_SIGN_IN_RESULT_FADE_OUT_MS = VAR_FADE_MS;
export const USER_MENU_VAR_SIGN_IN_SHRINK_TO_FULL_MS = VAR_SHRINK_DOWN_MS;
export const USER_MENU_VAR_SIGN_IN_SHRINK_FULL_MS = VAR_SHRINK_FULL_MS;
export const USER_MENU_VAR_SIGN_IN_SHRINK_DOWN_MS = VAR_SHRINK_DOWN_MS;
export const USER_MENU_VAR_SIGN_IN_RESTORE_FADE_MS = VAR_FADE_MS;

// Sign-in layout vars.
export const USER_MENU_VAR_SIGN_IN_ORIGIN_TOP = "--sign-in-origin-top";
export const USER_MENU_VAR_SIGN_IN_ORIGIN_LEFT = "--sign-in-origin-left";
export const USER_MENU_VAR_SIGN_IN_ORIGIN_WIDTH = "--sign-in-origin-width";
export const USER_MENU_VAR_SIGN_IN_ORIGIN_HEIGHT = "--sign-in-origin-height";

export const USER_MENU_VAR_SIGN_IN_EXPAND_TOP = "--sign-in-expand-top";
export const USER_MENU_VAR_SIGN_IN_EXPAND_LEFT = "--sign-in-expand-left";
export const USER_MENU_VAR_SIGN_IN_EXPAND_WIDTH = "--sign-in-expand-width";
export const USER_MENU_VAR_SIGN_IN_EXPAND_HEIGHT = "--sign-in-expand-height";

export const USER_MENU_VAR_SIGN_IN_FULL_TOP = "--sign-in-full-top";
export const USER_MENU_VAR_SIGN_IN_FULL_LEFT = "--sign-in-full-left";
export const USER_MENU_VAR_SIGN_IN_FULL_WIDTH = "--sign-in-full-width";
export const USER_MENU_VAR_SIGN_IN_FULL_HEIGHT = "--sign-in-full-height";

export const USER_MENU_VAR_SIGN_IN_EXTENSION_TOP = "--sign-in-extension-top";
export const USER_MENU_VAR_SIGN_IN_EXTENSION_LEFT = "--sign-in-extension-left";
export const USER_MENU_VAR_SIGN_IN_EXTENSION_WIDTH =
  "--sign-in-extension-width";
export const USER_MENU_VAR_SIGN_IN_EXTENSION_HEIGHT =
  "--sign-in-extension-height";

export const USER_MENU_VAR_SIGN_IN_RESTORE_TOP = "--sign-in-restore-top";
export const USER_MENU_VAR_SIGN_IN_RESTORE_LEFT = "--sign-in-restore-left";
export const USER_MENU_VAR_SIGN_IN_RESTORE_WIDTH = "--sign-in-restore-width";
export const USER_MENU_VAR_SIGN_IN_RESTORE_HEIGHT = "--sign-in-restore-height";

export const USER_MENU_SIGN_IN_FADE_SELECTORS = [
  USER_MENU_HEADER_SELECTOR,
  USER_MENU_AUTH_BAR_SELECTOR,
  USER_MENU_THEME_BAR_SELECTOR,
  USER_MENU_SIGNED_OUT_VIEW_SELECTOR,
  USER_MENU_SIGNED_IN_VIEW_SELECTOR,
].join(", ");

export const USER_MENU_SIGN_IN_LAYOUT_VARS = [
  USER_MENU_VAR_SIGN_IN_ORIGIN_TOP,
  USER_MENU_VAR_SIGN_IN_ORIGIN_LEFT,
  USER_MENU_VAR_SIGN_IN_ORIGIN_WIDTH,
  USER_MENU_VAR_SIGN_IN_ORIGIN_HEIGHT,
  USER_MENU_VAR_SIGN_IN_EXPAND_TOP,
  USER_MENU_VAR_SIGN_IN_EXPAND_LEFT,
  USER_MENU_VAR_SIGN_IN_EXPAND_WIDTH,
  USER_MENU_VAR_SIGN_IN_EXPAND_HEIGHT,
  USER_MENU_VAR_SIGN_IN_FULL_TOP,
  USER_MENU_VAR_SIGN_IN_FULL_LEFT,
  USER_MENU_VAR_SIGN_IN_FULL_WIDTH,
  USER_MENU_VAR_SIGN_IN_FULL_HEIGHT,
  USER_MENU_VAR_SIGN_IN_EXTENSION_TOP,
  USER_MENU_VAR_SIGN_IN_EXTENSION_LEFT,
  USER_MENU_VAR_SIGN_IN_EXTENSION_WIDTH,
  USER_MENU_VAR_SIGN_IN_EXTENSION_HEIGHT,
  USER_MENU_VAR_SIGN_IN_RESTORE_TOP,
  USER_MENU_VAR_SIGN_IN_RESTORE_LEFT,
  USER_MENU_VAR_SIGN_IN_RESTORE_WIDTH,
  USER_MENU_VAR_SIGN_IN_RESTORE_HEIGHT,
];

export const USER_MENU_SIGN_IN_CONTENT_PHASE_CLASSES = [
  USER_MENU_SIGN_IN_ABSOLUTE_CLASS,
  USER_MENU_SIGN_IN_EXPAND_UP_CLASS,
  USER_MENU_SIGN_IN_EXPAND_FULL_CLASS,
  USER_MENU_SIGN_IN_EXPAND_EXTENSION_CLASS,
  USER_MENU_SIGN_IN_SHRINK_TO_FULL_CLASS,
  USER_MENU_SIGN_IN_SHRINK_FULL_CLASS,
  USER_MENU_SIGN_IN_SHRINK_DOWN_CLASS,
];

// Sign-up animation phase classes.
export const USER_MENU_SIGN_UP_RUNNING_CLASS = "is-animating";
export const USER_MENU_SIGN_UP_LOCKED_CLASS = "is-sign-in-locked";
export const USER_MENU_SIGN_UP_ABSOLUTE_CLASS = "is-sign-in-absolute";

export const USER_MENU_SIGN_UP_FADE_CLASS = "is-sign-up-fade";
export const USER_MENU_SIGN_UP_EXPAND_UP_CLASS = "is-sign-up-expand-up";
export const USER_MENU_SIGN_UP_EXPAND_FULL_CLASS = "is-sign-up-expand-full";
export const USER_MENU_SIGN_UP_EXPAND_EXTENSION_CLASS =
  "is-sign-up-expand-extension";
export const USER_MENU_SIGN_UP_DOTS_FADE_IN_CLASS = "is-sign-up-dots-fade-in";
export const USER_MENU_SIGN_UP_DOTS_RUN_CLASS = "is-sign-up-dots-run";
export const USER_MENU_SIGN_UP_DOTS_FADE_OUT_CLASS = "is-sign-up-dots-fade-out";
export const USER_MENU_SIGN_UP_RESULT_DRAW_CLASS = "is-sign-up-result-draw";
export const USER_MENU_SIGN_UP_RESULT_FADE_OUT_CLASS =
  "is-sign-up-result-fade-out";
export const USER_MENU_SIGN_UP_SHRINK_TO_FULL_CLASS =
  "is-sign-up-shrink-to-full";
export const USER_MENU_SIGN_UP_SHRINK_FULL_CLASS = "is-sign-up-shrink-full";
export const USER_MENU_SIGN_UP_SHRINK_DOWN_CLASS = "is-sign-up-shrink-down";
export const USER_MENU_SIGN_UP_RESTORE_FADE_CLASS = "is-sign-up-restore-fade";

export const USER_MENU_VAR_SIGN_UP_FADE_MS = VAR_FADE_MS;
export const USER_MENU_VAR_SIGN_UP_EXPAND_UP_MS = VAR_EXPAND_UP_MS;
export const USER_MENU_VAR_SIGN_UP_EXPAND_FULL_MS = VAR_EXPAND_FULL_MS;
export const USER_MENU_VAR_SIGN_UP_EXPAND_EXTENSION_MS = VAR_EXPAND_UP_MS;
export const USER_MENU_VAR_SIGN_UP_DOTS_FADE_IN_MS = VAR_FADE_MS;
export const USER_MENU_VAR_SIGN_UP_DOTS_RUN_MS = VAR_DOTS_RUN_MS;
export const USER_MENU_VAR_SIGN_UP_DOTS_FADE_OUT_MS = VAR_FADE_MS;
export const USER_MENU_VAR_SIGN_UP_RESULT_DRAW_MS = VAR_RESULT_MAIN_DRAW_MS;
export const USER_MENU_VAR_SIGN_UP_RESULT_FADE_OUT_MS = VAR_FADE_MS;
export const USER_MENU_VAR_SIGN_UP_SHRINK_TO_FULL_MS = VAR_SHRINK_DOWN_MS;
export const USER_MENU_VAR_SIGN_UP_SHRINK_FULL_MS = VAR_SHRINK_FULL_MS;
export const USER_MENU_VAR_SIGN_UP_SHRINK_DOWN_MS = VAR_SHRINK_DOWN_MS;
export const USER_MENU_VAR_SIGN_UP_RESTORE_FADE_MS = VAR_FADE_MS;

export const USER_MENU_VAR_SIGN_UP_ORIGIN_TOP = "--sign-in-origin-top";
export const USER_MENU_VAR_SIGN_UP_ORIGIN_LEFT = "--sign-in-origin-left";
export const USER_MENU_VAR_SIGN_UP_ORIGIN_WIDTH = "--sign-in-origin-width";
export const USER_MENU_VAR_SIGN_UP_ORIGIN_HEIGHT = "--sign-in-origin-height";

export const USER_MENU_VAR_SIGN_UP_EXPAND_TOP = "--sign-in-expand-top";
export const USER_MENU_VAR_SIGN_UP_EXPAND_LEFT = "--sign-in-expand-left";
export const USER_MENU_VAR_SIGN_UP_EXPAND_WIDTH = "--sign-in-expand-width";
export const USER_MENU_VAR_SIGN_UP_EXPAND_HEIGHT = "--sign-in-expand-height";

export const USER_MENU_VAR_SIGN_UP_FULL_TOP = "--sign-in-full-top";
export const USER_MENU_VAR_SIGN_UP_FULL_LEFT = "--sign-in-full-left";
export const USER_MENU_VAR_SIGN_UP_FULL_WIDTH = "--sign-in-full-width";
export const USER_MENU_VAR_SIGN_UP_FULL_HEIGHT = "--sign-in-full-height";

export const USER_MENU_VAR_SIGN_UP_EXTENSION_TOP = "--sign-in-extension-top";
export const USER_MENU_VAR_SIGN_UP_EXTENSION_LEFT = "--sign-in-extension-left";
export const USER_MENU_VAR_SIGN_UP_EXTENSION_WIDTH =
  "--sign-in-extension-width";
export const USER_MENU_VAR_SIGN_UP_EXTENSION_HEIGHT =
  "--sign-in-extension-height";

export const USER_MENU_VAR_SIGN_UP_RESTORE_TOP = "--sign-in-restore-top";
export const USER_MENU_VAR_SIGN_UP_RESTORE_LEFT = "--sign-in-restore-left";
export const USER_MENU_VAR_SIGN_UP_RESTORE_WIDTH = "--sign-in-restore-width";
export const USER_MENU_VAR_SIGN_UP_RESTORE_HEIGHT = "--sign-in-restore-height";

export const USER_MENU_SIGN_UP_FADE_SELECTORS = [
  USER_MENU_HEADER_SELECTOR,
  USER_MENU_AUTH_BAR_SELECTOR,
  USER_MENU_THEME_BAR_SELECTOR,
  USER_MENU_SIGNED_OUT_VIEW_SELECTOR,
  USER_MENU_SIGNED_IN_VIEW_SELECTOR,
].join(", ");

export const USER_MENU_SIGN_UP_LAYOUT_VARS = [
  USER_MENU_VAR_SIGN_UP_ORIGIN_TOP,
  USER_MENU_VAR_SIGN_UP_ORIGIN_LEFT,
  USER_MENU_VAR_SIGN_UP_ORIGIN_WIDTH,
  USER_MENU_VAR_SIGN_UP_ORIGIN_HEIGHT,
  USER_MENU_VAR_SIGN_UP_EXPAND_TOP,
  USER_MENU_VAR_SIGN_UP_EXPAND_LEFT,
  USER_MENU_VAR_SIGN_UP_EXPAND_WIDTH,
  USER_MENU_VAR_SIGN_UP_EXPAND_HEIGHT,
  USER_MENU_VAR_SIGN_UP_FULL_TOP,
  USER_MENU_VAR_SIGN_UP_FULL_LEFT,
  USER_MENU_VAR_SIGN_UP_FULL_WIDTH,
  USER_MENU_VAR_SIGN_UP_FULL_HEIGHT,
  USER_MENU_VAR_SIGN_UP_EXTENSION_TOP,
  USER_MENU_VAR_SIGN_UP_EXTENSION_LEFT,
  USER_MENU_VAR_SIGN_UP_EXTENSION_WIDTH,
  USER_MENU_VAR_SIGN_UP_EXTENSION_HEIGHT,
  USER_MENU_VAR_SIGN_UP_RESTORE_TOP,
  USER_MENU_VAR_SIGN_UP_RESTORE_LEFT,
  USER_MENU_VAR_SIGN_UP_RESTORE_WIDTH,
  USER_MENU_VAR_SIGN_UP_RESTORE_HEIGHT,
];

export const USER_MENU_SIGN_UP_CONTENT_PHASE_CLASSES = [
  USER_MENU_SIGN_UP_ABSOLUTE_CLASS,
  USER_MENU_SIGN_UP_EXPAND_UP_CLASS,
  USER_MENU_SIGN_UP_EXPAND_FULL_CLASS,
  USER_MENU_SIGN_UP_EXPAND_EXTENSION_CLASS,
  USER_MENU_SIGN_UP_SHRINK_TO_FULL_CLASS,
  USER_MENU_SIGN_UP_SHRINK_FULL_CLASS,
  USER_MENU_SIGN_UP_SHRINK_DOWN_CLASS,
];

// Sign-out animation phase classes.
export const USER_MENU_SIGN_OUT_RUNNING_CLASS = "is-animating";
export const USER_MENU_SIGN_OUT_LOCKED_CLASS = "is-sign-in-locked";
export const USER_MENU_SIGN_OUT_ABSOLUTE_CLASS = "is-sign-in-absolute";

export const USER_MENU_SIGN_OUT_FADE_CLASS = "is-sign-out-fade";
export const USER_MENU_SIGN_OUT_EXPAND_UP_CLASS = "is-sign-out-expand-up";
export const USER_MENU_SIGN_OUT_EXPAND_FULL_CLASS = "is-sign-out-expand-full";
export const USER_MENU_SIGN_OUT_EXPAND_EXTENSION_CLASS =
  "is-sign-out-expand-extension";
export const USER_MENU_SIGN_OUT_DOTS_FADE_IN_CLASS = "is-sign-out-dots-fade-in";
export const USER_MENU_SIGN_OUT_DOTS_RUN_CLASS = "is-sign-out-dots-run";
export const USER_MENU_SIGN_OUT_DOTS_FADE_OUT_CLASS =
  "is-sign-out-dots-fade-out";
export const USER_MENU_SIGN_OUT_RESULT_DRAW_CLASS = "is-sign-out-result-draw";
export const USER_MENU_SIGN_OUT_RESULT_FADE_OUT_CLASS =
  "is-sign-out-result-fade-out";
export const USER_MENU_SIGN_OUT_SHRINK_TO_FULL_CLASS =
  "is-sign-out-shrink-to-full";
export const USER_MENU_SIGN_OUT_SHRINK_FULL_CLASS = "is-sign-out-shrink-full";
export const USER_MENU_SIGN_OUT_SHRINK_DOWN_CLASS = "is-sign-out-shrink-down";
export const USER_MENU_SIGN_OUT_RESTORE_FADE_CLASS = "is-sign-out-restore-fade";

export const USER_MENU_VAR_SIGN_OUT_FADE_MS = VAR_FADE_MS;
export const USER_MENU_VAR_SIGN_OUT_EXPAND_UP_MS = VAR_EXPAND_UP_MS;
export const USER_MENU_VAR_SIGN_OUT_EXPAND_FULL_MS = VAR_EXPAND_FULL_MS;
export const USER_MENU_VAR_SIGN_OUT_EXPAND_EXTENSION_MS = VAR_EXPAND_UP_MS;
export const USER_MENU_VAR_SIGN_OUT_DOTS_FADE_IN_MS = VAR_FADE_MS;
export const USER_MENU_VAR_SIGN_OUT_DOTS_RUN_MS = VAR_DOTS_RUN_MS;
export const USER_MENU_VAR_SIGN_OUT_DOTS_FADE_OUT_MS = VAR_FADE_MS;
export const USER_MENU_VAR_SIGN_OUT_RESULT_DRAW_MS = VAR_RESULT_MAIN_DRAW_MS;
export const USER_MENU_VAR_SIGN_OUT_RESULT_FADE_OUT_MS = VAR_FADE_MS;
export const USER_MENU_VAR_SIGN_OUT_SHRINK_TO_FULL_MS = VAR_SHRINK_DOWN_MS;
export const USER_MENU_VAR_SIGN_OUT_SHRINK_FULL_MS = VAR_SHRINK_FULL_MS;
export const USER_MENU_VAR_SIGN_OUT_SHRINK_DOWN_MS = VAR_SHRINK_DOWN_MS;
export const USER_MENU_VAR_SIGN_OUT_RESTORE_FADE_MS = VAR_FADE_MS;

export const USER_MENU_VAR_SIGN_OUT_ORIGIN_TOP = "--sign-in-origin-top";
export const USER_MENU_VAR_SIGN_OUT_ORIGIN_LEFT = "--sign-in-origin-left";
export const USER_MENU_VAR_SIGN_OUT_ORIGIN_WIDTH = "--sign-in-origin-width";
export const USER_MENU_VAR_SIGN_OUT_ORIGIN_HEIGHT = "--sign-in-origin-height";

export const USER_MENU_VAR_SIGN_OUT_EXPAND_TOP = "--sign-in-expand-top";
export const USER_MENU_VAR_SIGN_OUT_EXPAND_LEFT = "--sign-in-expand-left";
export const USER_MENU_VAR_SIGN_OUT_EXPAND_WIDTH = "--sign-in-expand-width";
export const USER_MENU_VAR_SIGN_OUT_EXPAND_HEIGHT = "--sign-in-expand-height";

export const USER_MENU_VAR_SIGN_OUT_FULL_TOP = "--sign-in-full-top";
export const USER_MENU_VAR_SIGN_OUT_FULL_LEFT = "--sign-in-full-left";
export const USER_MENU_VAR_SIGN_OUT_FULL_WIDTH = "--sign-in-full-width";
export const USER_MENU_VAR_SIGN_OUT_FULL_HEIGHT = "--sign-in-full-height";

export const USER_MENU_VAR_SIGN_OUT_EXTENSION_TOP = "--sign-in-extension-top";
export const USER_MENU_VAR_SIGN_OUT_EXTENSION_LEFT = "--sign-in-extension-left";
export const USER_MENU_VAR_SIGN_OUT_EXTENSION_WIDTH =
  "--sign-in-extension-width";
export const USER_MENU_VAR_SIGN_OUT_EXTENSION_HEIGHT =
  "--sign-in-extension-height";

export const USER_MENU_VAR_SIGN_OUT_RESTORE_TOP = "--sign-in-restore-top";
export const USER_MENU_VAR_SIGN_OUT_RESTORE_LEFT = "--sign-in-restore-left";
export const USER_MENU_VAR_SIGN_OUT_RESTORE_WIDTH = "--sign-in-restore-width";
export const USER_MENU_VAR_SIGN_OUT_RESTORE_HEIGHT = "--sign-in-restore-height";

export const USER_MENU_SIGN_OUT_FADE_SELECTORS = [
  USER_MENU_HEADER_SELECTOR,
  USER_MENU_AUTH_BAR_SELECTOR,
  USER_MENU_THEME_BAR_SELECTOR,
  USER_MENU_SIGNED_OUT_VIEW_SELECTOR,
  USER_MENU_SIGNED_IN_VIEW_SELECTOR,
].join(", ");

export const USER_MENU_SIGN_OUT_LAYOUT_VARS = [
  USER_MENU_VAR_SIGN_OUT_ORIGIN_TOP,
  USER_MENU_VAR_SIGN_OUT_ORIGIN_LEFT,
  USER_MENU_VAR_SIGN_OUT_ORIGIN_WIDTH,
  USER_MENU_VAR_SIGN_OUT_ORIGIN_HEIGHT,
  USER_MENU_VAR_SIGN_OUT_EXPAND_TOP,
  USER_MENU_VAR_SIGN_OUT_EXPAND_LEFT,
  USER_MENU_VAR_SIGN_OUT_EXPAND_WIDTH,
  USER_MENU_VAR_SIGN_OUT_EXPAND_HEIGHT,
  USER_MENU_VAR_SIGN_OUT_FULL_TOP,
  USER_MENU_VAR_SIGN_OUT_FULL_LEFT,
  USER_MENU_VAR_SIGN_OUT_FULL_WIDTH,
  USER_MENU_VAR_SIGN_OUT_FULL_HEIGHT,
  USER_MENU_VAR_SIGN_OUT_EXTENSION_TOP,
  USER_MENU_VAR_SIGN_OUT_EXTENSION_LEFT,
  USER_MENU_VAR_SIGN_OUT_EXTENSION_WIDTH,
  USER_MENU_VAR_SIGN_OUT_EXTENSION_HEIGHT,
  USER_MENU_VAR_SIGN_OUT_RESTORE_TOP,
  USER_MENU_VAR_SIGN_OUT_RESTORE_LEFT,
  USER_MENU_VAR_SIGN_OUT_RESTORE_WIDTH,
  USER_MENU_VAR_SIGN_OUT_RESTORE_HEIGHT,
];

export const USER_MENU_SIGN_OUT_CONTENT_PHASE_CLASSES = [
  USER_MENU_SIGN_OUT_ABSOLUTE_CLASS,
  USER_MENU_SIGN_OUT_EXPAND_UP_CLASS,
  USER_MENU_SIGN_OUT_EXPAND_FULL_CLASS,
  USER_MENU_SIGN_OUT_EXPAND_EXTENSION_CLASS,
  USER_MENU_SIGN_OUT_SHRINK_TO_FULL_CLASS,
  USER_MENU_SIGN_OUT_SHRINK_FULL_CLASS,
  USER_MENU_SIGN_OUT_SHRINK_DOWN_CLASS,
];
