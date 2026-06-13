import { VAR_SLIDE_MS, VAR_STAGGER_MS } from "./const.utility.js";

// Shell selectors.
export const CODES_ROOT_SELECTOR = ".codes-section";
export const CODES_LIST_SELECTOR = ".codes-section__list";
export const CODES_CARD_TEMPLATE_SELECTOR = ".code-card-template";

// Shared state classes.
export const CODES_HIDDEN_CLASS = "is-hidden";
export const CODES_CARD_INTRO_PENDING_CLASS = "is-card-intro-pending";

// Shared timing vars (defined on .codes-section__list; read via animCssMsGet).
export const CODES_VAR_SLIDE_MS = VAR_SLIDE_MS;
export const CODES_VAR_STAGGER_MS = VAR_STAGGER_MS;
export const CODES_VAR_DELETE_POOF_MS = "--delete-poof-ms";
export const CODES_VAR_DELETE_POOF_SHRINK_MS = "--delete-poof-shrink-ms";

// Ticker / pie timer.
export const CODES_TIMER_INVERTED_KEY = "timerInverted";
export const CODES_PIE_CENTER = 16;
export const CODES_PIE_ARC_RADIUS = 14.5;

// Defaults.
export const CODES_EMAIL_PLACEHOLDER = "placeholder@example.com";
export const CODES_DEFAULT_CONTACT = "user@example.com";
