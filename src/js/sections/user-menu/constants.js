// Overlay shell and panel structure.
export const USER_MENU_ROOT_SELECTOR = ".app-user-menu";
export const USER_MENU_BACKDROP_SELECTOR = ".app-user-menu__backdrop";
export const USER_MENU_PANEL_SELECTOR = ".app-user-menu__panel";
export const USER_MENU_HEADER_SELECTOR = ".app-user-menu__header";
export const USER_MENU_CONTENT_SELECTOR = ".app-user-menu__content";
export const USER_MENU_CLOSE_BTN_SELECTOR = ".app-user-menu__close-btn";
export const USER_MENU_OPEN_BTN_SELECTOR = ".app-header__user-menu-btn";

// Header trigger button states.
export const USER_MENU_HEADER_BTN_ACTIVE_CLASS = "is-user-menu-btn-active";
export const USER_MENU_HEADER_BTN_DISABLED_CLASS = "is-user-menu-btn-disabled";

// Signed-in vs signed-out body views.
export const USER_MENU_SIGNED_OUT_VIEW_SELECTOR = ".app-user-menu__view--signed-out";
export const USER_MENU_SIGNED_IN_VIEW_SELECTOR = ".app-user-menu__view--signed-in";

// Auth view switch.
export const USER_MENU_AUTH_BAR_SELECTOR = ".app-user-menu__auth-bar";
export const USER_MENU_AUTH_TRACK_SELECTOR = ".app-user-menu__auth-switch-track";
export const USER_MENU_AUTH_THUMB_SELECTOR = ".app-user-menu__auth-switch-thumb";
export const USER_MENU_AUTH_BTN_SELECTOR = ".app-user-menu__auth-switch-btn";

// Theme switch.
export const USER_MENU_THEME_BAR_SELECTOR = ".app-user-menu__theme-bar";
export const USER_MENU_THEME_TRACK_SELECTOR = ".app-user-menu__theme-switch-track";
export const USER_MENU_THEME_THUMB_SELECTOR = ".app-user-menu__theme-switch-thumb";
export const USER_MENU_THEME_BTN_SELECTOR = ".app-user-menu__theme-switch-btn";

// Sign-in form.
export const USER_MENU_SIGN_IN_VIEW_SELECTOR = ".app-user-menu__auth-view--sign-in";
export const USER_MENU_SIGN_IN_FORM_SELECTOR = ".app-user-menu__form--sign-in";
export const USER_MENU_SIGN_IN_INPUT_SELECTOR = ".app-user-menu__sign-in-input";

// Sign-up panel.
export const USER_MENU_SIGN_UP_VIEW_SELECTOR = ".app-user-menu__auth-view--sign-up";
export const USER_MENU_SIGN_UP_BTN_SELECTOR = ".app-user-menu__sign-up-submit";

// Signed-in account field and actions.
export const USER_MENU_ACCOUNT_INPUT_SELECTOR = ".app-user-menu__account-input";
export const USER_MENU_ACCOUNT_COPY_BTN_SELECTOR = ".app-user-menu__account-copy-btn";
export const USER_MENU_ACCOUNT_DOWNLOAD_BTN_SELECTOR = ".app-user-menu__account-download-btn";

// Log out.
export const USER_MENU_LOGOUT_BTN_SELECTOR = ".app-user-menu__logout-btn";

// Auth result status overlays and SVG draw targets.
export const USER_MENU_STATUS_LOADING_SELECTOR = ".app-user-menu__status .login-status--loading";
export const USER_MENU_STATUS_SUCCESS_SELECTOR = ".app-user-menu__status .login-status--success";
export const USER_MENU_STATUS_ERROR_SELECTOR = ".app-user-menu__status .login-status--error";
export const USER_MENU_STATUS_ICON_CIRCLE_SELECTOR = ".login-status__icon-circle";
export const USER_MENU_STATUS_ICON_MARK_SELECTOR = ".login-status__icon-mark";

// Auth tab identity strings.
export const USER_MENU_AUTH_VIEW_SIGN_IN = "sign-in";
export const USER_MENU_AUTH_VIEW_SIGN_UP = "sign-up";

// Shared overlay state classes.
export const USER_MENU_HIDDEN_CLASS = "is-hidden";
export const USER_MENU_ACTIVE_CLASS = "is-active";
export const USER_MENU_OPEN_CLASS = "is-open";

// Panel open/close animation phases.
export const USER_MENU_PANEL_OPENING_CLASS = "is-panel-opening";
export const USER_MENU_PANEL_OPEN_CLASS = "is-panel-open";
export const USER_MENU_PANEL_CLOSING_CLASS = "is-panel-closing";
export const USER_MENU_PANEL_BACKDROP_CLOSING_CLASS = "is-panel-backdrop-closing";

// Account action feedback.
export const USER_MENU_ACCOUNT_CONFIRMED_CLASS = "is-confirmed";

// Auth switch track position classes.
export const USER_MENU_AUTH_SIGN_IN_CLASS = "is-sign-in";
export const USER_MENU_AUTH_SIGN_UP_CLASS = "is-sign-up";

// Theme switch track position classes.
export const USER_MENU_THEME_LIGHT_CLASS = "is-light";
export const USER_MENU_THEME_DARK_CLASS = "is-dark";

// Shared timing vars (defined on .app-user-menu; read via cssMs).
export const USER_MENU_VAR_BLUR_MS = "--user-menu-blur-ms";
export const USER_MENU_VAR_SLIDE_MS = "--user-menu-slide-ms";
export const USER_MENU_VAR_ACCOUNT_ACTION_CONFIRM_MS = "--user-menu-account-action-confirm-ms";
export const USER_MENU_VAR_AUTH_THUMB_MS = "--user-menu-auth-thumb-ms";
export const USER_MENU_VAR_THEME_THUMB_MS = "--user-menu-theme-thumb-ms";
export const USER_MENU_VAR_ANIMATION_TIMEOUT_BUFFER_MS = "--user-menu-animation-timeout-buffer-ms";

// Animation run-id guards; increment to cancel in-flight sequences.
export const USER_MENU_PANEL_ANIMATION_RUN_ID = { value: 0 };
export const USER_MENU_SIGN_IN_ANIMATION_RUN_ID = { value: 0 };
export const USER_MENU_SIGN_UP_ANIMATION_RUN_ID = { value: 0 };
export const USER_MENU_SIGN_OUT_ANIMATION_RUN_ID = { value: 0 };
export const USER_MENU_COPY_BUTTON_ANIMATION_RUN_ID = { value: 0 };
export const USER_MENU_DOWNLOAD_BUTTON_ANIMATION_RUN_ID = { value: 0 };

// Sign-in animation — support classes.
export const USER_MENU_SIGN_IN_RUNNING_CLASS = "is-sign-in-running";
export const USER_MENU_SIGN_IN_LOCKED_CLASS = "is-sign-in-locked";
export const USER_MENU_SIGN_IN_ABSOLUTE_CLASS = "is-sign-in-absolute";

// Sign-in animation — phase classes.
export const USER_MENU_SIGN_IN_FADE_CLASS = "is-sign-in-fade";
export const USER_MENU_SIGN_IN_EXPAND_UP_CLASS = "is-sign-in-expand-up";
export const USER_MENU_SIGN_IN_EXPAND_FULL_CLASS = "is-sign-in-expand-full";
export const USER_MENU_SIGN_IN_DOTS_FADE_IN_CLASS = "is-sign-in-dots-fade-in";
export const USER_MENU_SIGN_IN_DOTS_RUN_CLASS = "is-sign-in-dots-run";
export const USER_MENU_SIGN_IN_DOTS_FADE_OUT_CLASS = "is-sign-in-dots-fade-out";
export const USER_MENU_SIGN_IN_RESULT_DRAW_CLASS = "is-sign-in-result-draw";
export const USER_MENU_SIGN_IN_RESULT_FADE_OUT_CLASS = "is-sign-in-result-fade-out";
export const USER_MENU_SIGN_IN_SHRINK_FULL_CLASS = "is-sign-in-shrink-full";
export const USER_MENU_SIGN_IN_SHRINK_DOWN_CLASS = "is-sign-in-shrink-down";
export const USER_MENU_SIGN_IN_RESTORE_FADE_CLASS = "is-sign-in-restore-fade";

// Sign-in animation — timing vars.
export const USER_MENU_VAR_SIGN_IN_FADE_MS = "--user-menu-sign-in-fade-ms";
export const USER_MENU_VAR_SIGN_IN_EXPAND_UP_MS = "--user-menu-sign-in-expand-up-ms";
export const USER_MENU_VAR_SIGN_IN_EXPAND_FULL_MS = "--user-menu-sign-in-expand-full-ms";
export const USER_MENU_VAR_SIGN_IN_DOTS_FADE_IN_MS = "--user-menu-sign-in-dots-fade-in-ms";
export const USER_MENU_VAR_SIGN_IN_DOTS_RUN_MS = "--user-menu-sign-in-dots-run-ms";
export const USER_MENU_VAR_SIGN_IN_DOTS_FADE_OUT_MS = "--user-menu-sign-in-dots-fade-out-ms";
export const USER_MENU_VAR_SIGN_IN_RESULT_DRAW_MS = "--user-menu-sign-in-result-draw-ms";
export const USER_MENU_VAR_SIGN_IN_RESULT_FADE_OUT_MS = "--user-menu-sign-in-result-fade-out-ms";
export const USER_MENU_VAR_SIGN_IN_SHRINK_FULL_MS = "--user-menu-sign-in-shrink-full-ms";
export const USER_MENU_VAR_SIGN_IN_SHRINK_DOWN_MS = "--user-menu-sign-in-shrink-down-ms";
export const USER_MENU_VAR_SIGN_IN_RESTORE_FADE_MS = "--user-menu-sign-in-restore-fade-ms";

// Sign-in animation — layout vars (origin).
export const USER_MENU_VAR_SIGN_IN_ORIGIN_TOP = "--sign-in-origin-top";
export const USER_MENU_VAR_SIGN_IN_ORIGIN_LEFT = "--sign-in-origin-left";
export const USER_MENU_VAR_SIGN_IN_ORIGIN_WIDTH = "--sign-in-origin-width";
export const USER_MENU_VAR_SIGN_IN_ORIGIN_HEIGHT = "--sign-in-origin-height";

// Sign-in animation — layout vars (expand).
export const USER_MENU_VAR_SIGN_IN_EXPAND_TOP = "--sign-in-expand-top";
export const USER_MENU_VAR_SIGN_IN_EXPAND_LEFT = "--sign-in-expand-left";
export const USER_MENU_VAR_SIGN_IN_EXPAND_WIDTH = "--sign-in-expand-width";
export const USER_MENU_VAR_SIGN_IN_EXPAND_HEIGHT = "--sign-in-expand-height";

// Sign-in animation — layout vars (full).
export const USER_MENU_VAR_SIGN_IN_FULL_TOP = "--sign-in-full-top";
export const USER_MENU_VAR_SIGN_IN_FULL_LEFT = "--sign-in-full-left";
export const USER_MENU_VAR_SIGN_IN_FULL_WIDTH = "--sign-in-full-width";
export const USER_MENU_VAR_SIGN_IN_FULL_HEIGHT = "--sign-in-full-height";

// Sign-in animation — layout vars (restore).
export const USER_MENU_VAR_SIGN_IN_RESTORE_TOP = "--sign-in-restore-top";
export const USER_MENU_VAR_SIGN_IN_RESTORE_LEFT = "--sign-in-restore-left";
export const USER_MENU_VAR_SIGN_IN_RESTORE_WIDTH = "--sign-in-restore-width";
export const USER_MENU_VAR_SIGN_IN_RESTORE_HEIGHT = "--sign-in-restore-height";

// Sign-in animation — elements faded during the intro phase.
export const USER_MENU_SIGN_IN_FADE_SELECTORS = [
  USER_MENU_HEADER_SELECTOR,
  USER_MENU_AUTH_BAR_SELECTOR,
  USER_MENU_THEME_BAR_SELECTOR,
  USER_MENU_SIGNED_OUT_VIEW_SELECTOR,
  USER_MENU_SIGNED_IN_VIEW_SELECTOR,
].join(", ");

// Sign-in animation — inline layout vars cleared on reset.
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
  USER_MENU_VAR_SIGN_IN_RESTORE_TOP,
  USER_MENU_VAR_SIGN_IN_RESTORE_LEFT,
  USER_MENU_VAR_SIGN_IN_RESTORE_WIDTH,
  USER_MENU_VAR_SIGN_IN_RESTORE_HEIGHT,
];

// Sign-in animation — content phase classes cleared on reset.
export const USER_MENU_SIGN_IN_CONTENT_PHASE_CLASSES = [
  USER_MENU_SIGN_IN_ABSOLUTE_CLASS,
  USER_MENU_SIGN_IN_EXPAND_UP_CLASS,
  USER_MENU_SIGN_IN_EXPAND_FULL_CLASS,
  USER_MENU_SIGN_IN_SHRINK_FULL_CLASS,
  USER_MENU_SIGN_IN_SHRINK_DOWN_CLASS,
];

// Sign-up animation — support classes.
export const USER_MENU_SIGN_UP_RUNNING_CLASS = "is-sign-in-running";
export const USER_MENU_SIGN_UP_LOCKED_CLASS = "is-sign-in-locked";
export const USER_MENU_SIGN_UP_ABSOLUTE_CLASS = "is-sign-in-absolute";

// Sign-up animation — phase classes.
export const USER_MENU_SIGN_UP_FADE_CLASS = "is-sign-up-fade";
export const USER_MENU_SIGN_UP_EXPAND_UP_CLASS = "is-sign-up-expand-up";
export const USER_MENU_SIGN_UP_EXPAND_FULL_CLASS = "is-sign-up-expand-full";
export const USER_MENU_SIGN_UP_DOTS_FADE_IN_CLASS = "is-sign-up-dots-fade-in";
export const USER_MENU_SIGN_UP_DOTS_RUN_CLASS = "is-sign-up-dots-run";
export const USER_MENU_SIGN_UP_DOTS_FADE_OUT_CLASS = "is-sign-up-dots-fade-out";
export const USER_MENU_SIGN_UP_RESULT_DRAW_CLASS = "is-sign-up-result-draw";
export const USER_MENU_SIGN_UP_RESULT_FADE_OUT_CLASS = "is-sign-up-result-fade-out";
export const USER_MENU_SIGN_UP_SHRINK_FULL_CLASS = "is-sign-up-shrink-full";
export const USER_MENU_SIGN_UP_SHRINK_DOWN_CLASS = "is-sign-up-shrink-down";
export const USER_MENU_SIGN_UP_RESTORE_FADE_CLASS = "is-sign-up-restore-fade";

// Sign-up animation — timing vars.
export const USER_MENU_VAR_SIGN_UP_FADE_MS = "--user-menu-sign-up-fade-ms";
export const USER_MENU_VAR_SIGN_UP_EXPAND_UP_MS = "--user-menu-sign-up-expand-up-ms";
export const USER_MENU_VAR_SIGN_UP_EXPAND_FULL_MS = "--user-menu-sign-up-expand-full-ms";
export const USER_MENU_VAR_SIGN_UP_DOTS_FADE_IN_MS = "--user-menu-sign-up-dots-fade-in-ms";
export const USER_MENU_VAR_SIGN_UP_DOTS_RUN_MS = "--user-menu-sign-up-dots-run-ms";
export const USER_MENU_VAR_SIGN_UP_DOTS_FADE_OUT_MS = "--user-menu-sign-up-dots-fade-out-ms";
export const USER_MENU_VAR_SIGN_UP_RESULT_DRAW_MS = "--user-menu-sign-up-result-draw-ms";
export const USER_MENU_VAR_SIGN_UP_RESULT_FADE_OUT_MS = "--user-menu-sign-up-result-fade-out-ms";
export const USER_MENU_VAR_SIGN_UP_SHRINK_FULL_MS = "--user-menu-sign-up-shrink-full-ms";
export const USER_MENU_VAR_SIGN_UP_SHRINK_DOWN_MS = "--user-menu-sign-up-shrink-down-ms";
export const USER_MENU_VAR_SIGN_UP_RESTORE_FADE_MS = "--user-menu-sign-up-restore-fade-ms";

// Sign-up animation — layout vars (origin).
export const USER_MENU_VAR_SIGN_UP_ORIGIN_TOP = "--sign-in-origin-top";
export const USER_MENU_VAR_SIGN_UP_ORIGIN_LEFT = "--sign-in-origin-left";
export const USER_MENU_VAR_SIGN_UP_ORIGIN_WIDTH = "--sign-in-origin-width";
export const USER_MENU_VAR_SIGN_UP_ORIGIN_HEIGHT = "--sign-in-origin-height";

// Sign-up animation — layout vars (expand).
export const USER_MENU_VAR_SIGN_UP_EXPAND_TOP = "--sign-in-expand-top";
export const USER_MENU_VAR_SIGN_UP_EXPAND_LEFT = "--sign-in-expand-left";
export const USER_MENU_VAR_SIGN_UP_EXPAND_WIDTH = "--sign-in-expand-width";
export const USER_MENU_VAR_SIGN_UP_EXPAND_HEIGHT = "--sign-in-expand-height";

// Sign-up animation — layout vars (full).
export const USER_MENU_VAR_SIGN_UP_FULL_TOP = "--sign-in-full-top";
export const USER_MENU_VAR_SIGN_UP_FULL_LEFT = "--sign-in-full-left";
export const USER_MENU_VAR_SIGN_UP_FULL_WIDTH = "--sign-in-full-width";
export const USER_MENU_VAR_SIGN_UP_FULL_HEIGHT = "--sign-in-full-height";

// Sign-up animation — layout vars (restore).
export const USER_MENU_VAR_SIGN_UP_RESTORE_TOP = "--sign-in-restore-top";
export const USER_MENU_VAR_SIGN_UP_RESTORE_LEFT = "--sign-in-restore-left";
export const USER_MENU_VAR_SIGN_UP_RESTORE_WIDTH = "--sign-in-restore-width";
export const USER_MENU_VAR_SIGN_UP_RESTORE_HEIGHT = "--sign-in-restore-height";

// Sign-up animation — elements faded during the intro phase.
export const USER_MENU_SIGN_UP_FADE_SELECTORS = [
  USER_MENU_HEADER_SELECTOR,
  USER_MENU_AUTH_BAR_SELECTOR,
  USER_MENU_THEME_BAR_SELECTOR,
  USER_MENU_SIGNED_OUT_VIEW_SELECTOR,
  USER_MENU_SIGNED_IN_VIEW_SELECTOR,
].join(", ");

// Sign-up animation — inline layout vars cleared on reset.
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
  USER_MENU_VAR_SIGN_UP_RESTORE_TOP,
  USER_MENU_VAR_SIGN_UP_RESTORE_LEFT,
  USER_MENU_VAR_SIGN_UP_RESTORE_WIDTH,
  USER_MENU_VAR_SIGN_UP_RESTORE_HEIGHT,
];

// Sign-up animation — content phase classes cleared on reset.
export const USER_MENU_SIGN_UP_CONTENT_PHASE_CLASSES = [
  USER_MENU_SIGN_UP_ABSOLUTE_CLASS,
  USER_MENU_SIGN_UP_EXPAND_UP_CLASS,
  USER_MENU_SIGN_UP_EXPAND_FULL_CLASS,
  USER_MENU_SIGN_UP_SHRINK_FULL_CLASS,
  USER_MENU_SIGN_UP_SHRINK_DOWN_CLASS,
];

// Sign-out animation — support classes.
export const USER_MENU_SIGN_OUT_RUNNING_CLASS = "is-sign-in-running";
export const USER_MENU_SIGN_OUT_LOCKED_CLASS = "is-sign-in-locked";
export const USER_MENU_SIGN_OUT_ABSOLUTE_CLASS = "is-sign-in-absolute";

// Sign-out animation — phase classes.
export const USER_MENU_SIGN_OUT_FADE_CLASS = "is-sign-out-fade";
export const USER_MENU_SIGN_OUT_EXPAND_UP_CLASS = "is-sign-out-expand-up";
export const USER_MENU_SIGN_OUT_EXPAND_FULL_CLASS = "is-sign-out-expand-full";
export const USER_MENU_SIGN_OUT_DOTS_FADE_IN_CLASS = "is-sign-out-dots-fade-in";
export const USER_MENU_SIGN_OUT_DOTS_RUN_CLASS = "is-sign-out-dots-run";
export const USER_MENU_SIGN_OUT_DOTS_FADE_OUT_CLASS = "is-sign-out-dots-fade-out";
export const USER_MENU_SIGN_OUT_RESULT_DRAW_CLASS = "is-sign-out-result-draw";
export const USER_MENU_SIGN_OUT_RESULT_FADE_OUT_CLASS = "is-sign-out-result-fade-out";
export const USER_MENU_SIGN_OUT_SHRINK_FULL_CLASS = "is-sign-out-shrink-full";
export const USER_MENU_SIGN_OUT_SHRINK_DOWN_CLASS = "is-sign-out-shrink-down";
export const USER_MENU_SIGN_OUT_RESTORE_FADE_CLASS = "is-sign-out-restore-fade";

// Sign-out animation — timing vars.
export const USER_MENU_VAR_SIGN_OUT_FADE_MS = "--user-menu-sign-out-fade-ms";
export const USER_MENU_VAR_SIGN_OUT_EXPAND_UP_MS = "--user-menu-sign-out-expand-up-ms";
export const USER_MENU_VAR_SIGN_OUT_EXPAND_FULL_MS = "--user-menu-sign-out-expand-full-ms";
export const USER_MENU_VAR_SIGN_OUT_DOTS_FADE_IN_MS = "--user-menu-sign-out-dots-fade-in-ms";
export const USER_MENU_VAR_SIGN_OUT_DOTS_RUN_MS = "--user-menu-sign-out-dots-run-ms";
export const USER_MENU_VAR_SIGN_OUT_DOTS_FADE_OUT_MS = "--user-menu-sign-out-dots-fade-out-ms";
export const USER_MENU_VAR_SIGN_OUT_RESULT_DRAW_MS = "--user-menu-sign-out-result-draw-ms";
export const USER_MENU_VAR_SIGN_OUT_RESULT_FADE_OUT_MS = "--user-menu-sign-out-result-fade-out-ms";
export const USER_MENU_VAR_SIGN_OUT_SHRINK_FULL_MS = "--user-menu-sign-out-shrink-full-ms";
export const USER_MENU_VAR_SIGN_OUT_SHRINK_DOWN_MS = "--user-menu-sign-out-shrink-down-ms";
export const USER_MENU_VAR_SIGN_OUT_RESTORE_FADE_MS = "--user-menu-sign-out-restore-fade-ms";

// Sign-out animation — layout vars (origin).
export const USER_MENU_VAR_SIGN_OUT_ORIGIN_TOP = "--sign-in-origin-top";
export const USER_MENU_VAR_SIGN_OUT_ORIGIN_LEFT = "--sign-in-origin-left";
export const USER_MENU_VAR_SIGN_OUT_ORIGIN_WIDTH = "--sign-in-origin-width";
export const USER_MENU_VAR_SIGN_OUT_ORIGIN_HEIGHT = "--sign-in-origin-height";

// Sign-out animation — layout vars (expand).
export const USER_MENU_VAR_SIGN_OUT_EXPAND_TOP = "--sign-in-expand-top";
export const USER_MENU_VAR_SIGN_OUT_EXPAND_LEFT = "--sign-in-expand-left";
export const USER_MENU_VAR_SIGN_OUT_EXPAND_WIDTH = "--sign-in-expand-width";
export const USER_MENU_VAR_SIGN_OUT_EXPAND_HEIGHT = "--sign-in-expand-height";

// Sign-out animation — layout vars (full).
export const USER_MENU_VAR_SIGN_OUT_FULL_TOP = "--sign-in-full-top";
export const USER_MENU_VAR_SIGN_OUT_FULL_LEFT = "--sign-in-full-left";
export const USER_MENU_VAR_SIGN_OUT_FULL_WIDTH = "--sign-in-full-width";
export const USER_MENU_VAR_SIGN_OUT_FULL_HEIGHT = "--sign-in-full-height";

// Sign-out animation — layout vars (restore).
export const USER_MENU_VAR_SIGN_OUT_RESTORE_TOP = "--sign-in-restore-top";
export const USER_MENU_VAR_SIGN_OUT_RESTORE_LEFT = "--sign-in-restore-left";
export const USER_MENU_VAR_SIGN_OUT_RESTORE_WIDTH = "--sign-in-restore-width";
export const USER_MENU_VAR_SIGN_OUT_RESTORE_HEIGHT = "--sign-in-restore-height";

// Sign-out animation — elements faded during the intro phase.
export const USER_MENU_SIGN_OUT_FADE_SELECTORS = [
  USER_MENU_HEADER_SELECTOR,
  USER_MENU_AUTH_BAR_SELECTOR,
  USER_MENU_THEME_BAR_SELECTOR,
  USER_MENU_SIGNED_OUT_VIEW_SELECTOR,
  USER_MENU_SIGNED_IN_VIEW_SELECTOR,
].join(", ");

// Sign-out animation — inline layout vars cleared on reset.
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
  USER_MENU_VAR_SIGN_OUT_RESTORE_TOP,
  USER_MENU_VAR_SIGN_OUT_RESTORE_LEFT,
  USER_MENU_VAR_SIGN_OUT_RESTORE_WIDTH,
  USER_MENU_VAR_SIGN_OUT_RESTORE_HEIGHT,
];

// Sign-out animation — content phase classes cleared on reset.
export const USER_MENU_SIGN_OUT_CONTENT_PHASE_CLASSES = [
  USER_MENU_SIGN_OUT_ABSOLUTE_CLASS,
  USER_MENU_SIGN_OUT_EXPAND_UP_CLASS,
  USER_MENU_SIGN_OUT_EXPAND_FULL_CLASS,
  USER_MENU_SIGN_OUT_SHRINK_FULL_CLASS,
  USER_MENU_SIGN_OUT_SHRINK_DOWN_CLASS,
];


