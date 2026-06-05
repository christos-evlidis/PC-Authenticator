// Selectors
export const SEARCH_ROOT_SELECTOR = ".codes-search";
export const SEARCH_INPUT_SELECTOR = ".codes-search__input";

export const SEARCH_FILTER_CARD_SELECTOR =
  ".account-block:not(.account-block--manual-add-spacer):not(.account-block--exit-spacer)";

// State classes
export const SEARCH_HIDDEN_CLASS = "hidden";

// Animation support classes
export const SEARCH_ANIMATION_PENDING_CLASS = "is-search-animation-pending";
export const SEARCH_FADE_IN_CLASS = "is-search-fade-in";

// Shared timing vars (defined on .codes-search; read via cssMs).
export const SEARCH_VAR_INTRO_FADE_MS = "--search-intro-fade-ms";
export const SEARCH_VAR_ANIMATION_TIMEOUT_BUFFER_MS = "--search-animation-timeout-buffer-ms";
