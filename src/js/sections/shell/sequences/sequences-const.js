// Overlay shell.
export const INTRO_ROOT_SELECTOR = ".app-intro";
export const INTRO_OVERLAY_SELECTOR = ".app-intro__overlay";
export const INTRO_STYLESHEET_HREF = "../css/sections/intro.css";

// Shared state classes.
export const INTRO_ACTIVE_CLASS = "is-active";
export const INTRO_SIGN_IN_STAGED_CLASS = "is-sign-in-staged";
export const INTRO_SIGN_UP_STAGED_CLASS = "is-sign-up-staged";

// Logo fade phase.
export const INTRO_LOGO_FADE_CLASS = "is-logo-fade";

// Overlay corner radius after the frame shrink phase.
export const INTRO_ROUNDED_CLASS = "is-intro-rounded";

// Shrink phase classes.
export const INTRO_SHRINK_FRAME_CLASS = "is-intro-shrink-frame";
export const INTRO_SHRINK_HEADER_CLASS = "is-intro-shrink-header";
export const INTRO_SHRINK_SEARCH_CLASS = "is-intro-shrink-search";
export const INTRO_SHRINK_BODY_CLASS = "is-intro-shrink-body";

// Shared timing vars (defined on .app-intro; read via animCssMsGet).
export const INTRO_VAR_LOGO_HOLD_MS = "--intro-logo-hold-ms";
export const INTRO_VAR_SHRINK_FRAME_MS = "--intro-shrink-frame-ms";
export const INTRO_VAR_SHRINK_HEADER_MS = "--intro-shrink-header-ms";
export const INTRO_VAR_SHRINK_SEARCH_MS = "--intro-shrink-search-ms";
export const INTRO_VAR_SHRINK_BODY_MS = "--intro-shrink-body-ms";
export const INTRO_VAR_ANIMATION_TIMEOUT_BUFFER_MS = "--intro-animation-timeout-buffer-ms";

// Layout vars (from / to positions for shrink keyframes).
export const INTRO_VAR_FROM_TOP = "--intro-from-top";
export const INTRO_VAR_FROM_LEFT = "--intro-from-left";
export const INTRO_VAR_FROM_WIDTH = "--intro-from-width";
export const INTRO_VAR_FROM_HEIGHT = "--intro-from-height";
export const INTRO_VAR_TO_TOP = "--intro-to-top";
export const INTRO_VAR_TO_LEFT = "--intro-to-left";
export const INTRO_VAR_TO_WIDTH = "--intro-to-width";
export const INTRO_VAR_TO_HEIGHT = "--intro-to-height";

// Resting overlay position vars updated after each shrink phase.
export const INTRO_VAR_TOP = "--intro-top";
export const INTRO_VAR_LEFT = "--intro-left";
export const INTRO_VAR_WIDTH = "--intro-width";
export const INTRO_VAR_HEIGHT = "--intro-height";

// Layout measurement anchors.
export const INTRO_FRAME_SELECTOR = ".extension-frame";
export const EXTENSION_FRAME_SELECTOR = ".extension-frame";
export const INTRO_HEADER_SELECTOR = ".app-header";
export const INTRO_SEARCH_SELECTOR = ".codes-search";
export const INTRO_BODY_SELECTOR = ".app-body";


