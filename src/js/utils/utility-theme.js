import { animDelay } from "./utility-animation.js";

const THEME_LIGHT = "light";
const THEME_DARK = "dark";
const THEME_STORAGE_KEY = "pca-theme";
const THEME_TRANSITION_MS = 220;
const THEME_ICON_SIZE_16 = 16;
const THEME_ICON_SIZE_48 = 48;
const THEME_ICON_SIZE_128 = 128;

const THEME_DARK_CLASS = "theme-dark";
const THEME_TRANSITION_CLASS = "theme-transition-active";
const THEME_ICON_SIZES = [
  THEME_ICON_SIZE_16,
  THEME_ICON_SIZE_48,
  THEME_ICON_SIZE_128,
];
const THEME_LAYER_SELECTORS = [
  "body",
  ".extension-frame",
  ".app-header",
  ".codes-search",
  ".app-body",
  ".app-user-menu",
];

/** Coerces any stored or requested value to light or dark. */
function themeNormalize(theme) {
  return theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;
}

/** Returns DOM nodes that receive theme-dark in sync. */
function themeLayersGet() {
  return THEME_LAYER_SELECTORS.map((selector) => document.querySelector(selector)).filter(
    Boolean,
  );
}

/** Writes the resolved theme to localStorage when available. */
function themeLocalSet(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeNormalize(theme));
  } catch {
    // localStorage unavailable
  }
}

/** Returns whether dark mode is active on the body layer. */
function themeDarkIsActive() {
  return document.body.classList.contains(THEME_DARK_CLASS);
}

/** Returns the light or dark filename prefix for toolbar icons. */
function themeIconPrefixGet(theme) {
  return themeNormalize(theme) === THEME_DARK ? "dark" : "light";
}

/** Returns an extension-root icon path for a theme and size. */
function themeIconPathGet(theme, size) {
  return `icons/${themeIconPrefixGet(theme)}-icon${size}.png`;
}

/** Updates the Chrome toolbar icon set to match the theme. */
function themeExtensionIconSet(theme) {
  if (typeof chrome === "undefined" || !chrome.action?.setIcon || !chrome.runtime?.getURL) {
    return;
  }

  const iconPaths = Object.fromEntries(
    THEME_ICON_SIZES.map((size) => [
      size,
      chrome.runtime.getURL(themeIconPathGet(theme, size)),
    ]),
  );

  try {
    chrome.action.setIcon({ path: iconPaths });
  } catch {
    // chrome.action unavailable
  }
}

/** Toggles theme-dark on every layer and syncs toolbar icons. */
function themeLayersSet(isDark) {
  const theme = isDark ? THEME_DARK : THEME_LIGHT;

  themeLayersGet().forEach((element) => {
    element.classList.toggle(THEME_DARK_CLASS, isDark);
  });

  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  themeExtensionIconSet(theme);
}

/** Applies a layer theme change with a synchronized CSS transition. */
async function themeLayersAnimate(isDark) {
  document.body.classList.add(THEME_TRANSITION_CLASS);
  void document.body.offsetWidth;

  themeLayersSet(isDark);

  await animDelay(THEME_TRANSITION_MS + 24);
  document.body.classList.remove(THEME_TRANSITION_CLASS);
}

/** Reads the saved theme from localStorage. */
function themeGet() {
  try {
    return themeNormalize(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return THEME_LIGHT;
  }
}

/** Applies a theme instantly or with a synchronized layer transition. */
function themeApply(theme, options = {}) {
  const { instant = false } = options;
  const resolved = themeNormalize(theme);
  const isDark = resolved === THEME_DARK;

  if (themeDarkIsActive() === isDark && !instant) {
    themeLocalSet(resolved);
    themeExtensionIconSet(resolved);
    return resolved;
  }

  if (instant) {
    themeLayersSet(isDark);
  } else {
    void themeLayersAnimate(isDark);
  }

  themeLocalSet(resolved);
  return resolved;
}

/** Persists a theme to chrome.storage and applies it across all layers. */
async function themePersist(theme) {
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

/** Syncs theme from chrome.storage, falling back to localStorage. */
async function themeChromeStorageSync() {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return themeGet();
  }

  try {
    const { theme } = await chrome.storage.local.get(["theme"]);

    if (theme === THEME_LIGHT || theme === THEME_DARK) {
      return themeApply(theme, { instant: true });
    }
  } catch {
    // chrome.storage unavailable
  }

  const local = themeGet();

  try {
    await chrome.storage.local.set({ theme: local });
  } catch {
    // chrome.storage unavailable
  }

  return local;
}

/** Applies the saved theme on popup load without transition. */
function themeStartupApply() {
  themeApply(themeGet(), { instant: true });
}

export { themeGet };
export { themeApply };
export { themePersist };
export { themeChromeStorageSync };
export { themeStartupApply };

export { THEME_LIGHT };
export { THEME_DARK };
export { THEME_STORAGE_KEY };
export { THEME_TRANSITION_MS };
export { THEME_ICON_SIZE_16 };
export { THEME_ICON_SIZE_48 };
export { THEME_ICON_SIZE_128 };
