import { VAR_BUFFER_MS, VAR_FADE_MS } from "../../../utils/motion-const.js";

// Shell selectors.
export const SEARCH_ROOT_SELECTOR = ".codes-search";
export const SEARCH_INPUT_SELECTOR = ".codes-search__input";
export const SEARCH_FILTER_CARD_SELECTOR =
  ".account-block:not(.account-block--manual-add-spacer):not(.account-block--exit-spacer)";

// Shared state classes.
export const SEARCH_HIDDEN_CLASS = "is-hidden";

// Animation phase classes.
export const SEARCH_ANIMATION_PENDING_CLASS = "is-search-animation-pending";
export const SEARCH_FADE_IN_CLASS = "is-search-fade-in";

// Shared timing vars (defined on .codes-search; read via animCssMsGet).
export const SEARCH_VAR_INTRO_FADE_MS = VAR_FADE_MS;
export const SEARCH_VAR_ANIMATION_TIMEOUT_BUFFER_MS = VAR_BUFFER_MS;
