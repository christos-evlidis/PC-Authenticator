import { delay } from "./utility-animation.js";

export const THEME_LIGHT = "light";
export const THEME_DARK = "dark";
export const THEME_STORAGE_KEY = "pca-theme";
export const THEME_TRANSITION_MS = 220;

export const THEME_ICON_SIZE_16 = 16;
export const THEME_ICON_SIZE_48 = 48;
export const THEME_ICON_SIZE_128 = 128;

const THEME_DARK_CLASS = "theme-dark";
const THEME_TRANSITION_CLASS = "theme-transition-active";
const THEME_ICON_SIZES = [
  THEME_ICON_SIZE_16,
  THEME_ICON_SIZE_48,
  THEME_ICON_SIZE_128,
];
const THEME_SPLASH_LOGO_SELECTOR = ".app-body__splash-logo";

const THEME_LAYER_SELECTORS = [
  "body",
  ".extension-frame",
  ".app-header",
  ".codes-search",
  ".app-body",
  ".app-user-menu",
];

// Normalizes a stored or requested theme value to light or dark.
function themeResolve(theme) {
  return theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;
}

// Returns theme layer elements for synchronized class toggling.
function themeLayerElements() {
  return THEME_LAYER_SELECTORS.map((selector) => document.querySelector(selector)).filter(
    Boolean,
  );
}

// Persists the resolved theme in localStorage when available.
function themeWriteLocal(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeResolve(theme));
  } catch {
    // localStorage unavailable
  }
}

// Returns whether the outermost theme layer is currently in dark mode.
function themeIsDarkActive() {
  return document.body.classList.contains(THEME_DARK_CLASS);
}

// Returns the light or dark prefix used for extension icon filenames.
function themeIconPrefix(theme) {
  return themeResolve(theme) === THEME_DARK ? "dark" : "light";
}

// Returns an extension-root icon path for toolbar and manifest assets.
export function themeExtensionIconPath(theme, size) {
  return `icons/${themeIconPrefix(theme)}-icon${size}.png`;
}

// Returns a popup-relative splash logo path for the body intro animation.
export function themeSplashIconPath(theme) {
  return `../icons/${themeIconPrefix(theme)}-icon${THEME_ICON_SIZE_128}.png`;
}

// Updates the Chrome toolbar icon set to match the active theme.
function themeApplyExtensionIcon(theme) {
  if (typeof chrome === "undefined" || !chrome.action?.setIcon || !chrome.runtime?.getURL) {
    return;
  }

  const iconPaths = Object.fromEntries(
    THEME_ICON_SIZES.map((size) => [
      size,
      chrome.runtime.getURL(themeExtensionIconPath(theme, size)),
    ]),
  );

  try {
    chrome.action.setIcon({ path: iconPaths });
  } catch {
    // chrome.action unavailable
  }
}

// Updates the body splash logo used during the header and body intro sequence.
export function themeApplySplashLogo(theme) {
  const splashLogo = document.querySelector(THEME_SPLASH_LOGO_SELECTOR);

  if (!splashLogo) {
    return;
  }

  splashLogo.src = themeSplashIconPath(theme);
}

// Syncs extension and intro splash icons with the active theme.
function themeApplyIcons(theme) {
  themeApplyExtensionIcon(theme);
  themeApplySplashLogo(theme);
}

// Toggles theme-dark on every layer at once for instant startup or sync.
function themeSetAllLayers(isDark) {
  const theme = isDark ? THEME_DARK : THEME_LIGHT;

  themeLayerElements().forEach((element) => {
    element.classList.toggle(THEME_DARK_CLASS, isDark);
  });

  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  themeApplyIcons(theme);
}

// Applies theme-dark on every layer at once while CSS transitions run.
async function themeApplyLayersAnimated(isDark) {
  document.body.classList.add(THEME_TRANSITION_CLASS);
  void document.body.offsetWidth;

  themeSetAllLayers(isDark);

  await delay(THEME_TRANSITION_MS + 24);
  document.body.classList.remove(THEME_TRANSITION_CLASS);
}

/** Reads the saved theme from localStorage. */
export function themeRead() {
  try {
    return themeResolve(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return THEME_LIGHT;
  }
}

/** Applies a theme instantly or with a synchronized layer transition. */
export function themeApply(theme, options = {}) {
  const { instant = false } = options;
  const resolved = themeResolve(theme);
  const isDark = resolved === THEME_DARK;

  if (themeIsDarkActive() === isDark && !instant) {
    themeWriteLocal(resolved);
    themeApplyIcons(resolved);
    return resolved;
  }

  if (instant) {
    themeSetAllLayers(isDark);
  } else {
    void themeApplyLayersAnimated(isDark);
  }

  themeWriteLocal(resolved);
  return resolved;
}

/** Persists a theme to storage and applies it across all theme layers. */
export async function themePersist(theme) {
  const resolved = themeApply(theme);

  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    try {
      await chrome.storage.local.set({ theme: resolved });
    } catch {
      // chrome.storage unavailable
    }
  }

  return resolved;
}

/** Pulls the saved theme from chrome.storage when present and applies it. */
export async function themeSyncFromChromeStorage() {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return themeRead();
  }

  try {
    const { theme } = await chrome.storage.local.get(["theme"]);

    if (theme === THEME_LIGHT || theme === THEME_DARK) {
      return themeApply(theme, { instant: true });
    }
  } catch {
    // chrome.storage unavailable
  }

  const local = themeRead();

  try {
    await chrome.storage.local.set({ theme: local });
  } catch {
    // chrome.storage unavailable
  }

  return local;
}

/** Applies the saved theme on popup load without transition. */
export function themeInit() {
  themeApply(themeRead(), { instant: true });
}
