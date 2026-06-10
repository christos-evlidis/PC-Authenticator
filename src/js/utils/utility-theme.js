import { animCssMsGet } from "./utility-animation.js";
import { animDelay } from "./utility-animation.js";
import { VAR_BUFFER_MS, VAR_THEME_TRANSITION_MS } from "./motion-const.js";

const THEME_LIGHT = "light";
const THEME_DARK = "dark";
const THEME_STORAGE_KEY = "pca-theme";
const THEME_ICON_SIZE_16 = 16;
const THEME_ICON_SIZE_48 = 48;
const THEME_ICON_SIZE_128 = 128;

const THEME_WHITE_CLASS = "theme-white";
const THEME_DARK_CLASS = "theme-dark";
const THEME_TRANSITION_CLASS = "theme-transition-active";
const THEME_ICON_SIZES = [
  THEME_ICON_SIZE_16,
  THEME_ICON_SIZE_48,
  THEME_ICON_SIZE_128,
];

/** Coerces any stored or requested value to light or dark. */
function themeNormalize(theme) {
  return theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;
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
  return `icons/${themeIconPrefixGet(theme)}/icon${size}.png`;
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

/** Toggles theme-white / theme-dark on body and syncs toolbar icons. */
function themeLayersSet(isDark) {
  const theme = isDark ? THEME_DARK : THEME_LIGHT;

  document.body.classList.toggle(THEME_WHITE_CLASS, !isDark);
  document.body.classList.toggle(THEME_DARK_CLASS, isDark);

  themeExtensionIconSet(theme);
}

/** Applies a layer theme change with a synchronized CSS transition. */
async function themeLayersAnimate(isDark) {
  document.body.classList.add(THEME_TRANSITION_CLASS);
  void document.body.offsetWidth;

  themeLayersSet(isDark);

  const themeTransitionMs = animCssMsGet(document.body, VAR_THEME_TRANSITION_MS);
  const timeoutBufferMs = animCssMsGet(document.body, VAR_BUFFER_MS);
  await animDelay(themeTransitionMs + timeoutBufferMs);
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

export { themeApply };
export { themeChromeStorageSync };
export { themeGet };
export { themePersist };
export { themeStartupApply };
export { THEME_DARK };
export { THEME_ICON_SIZE_128 };
export { THEME_ICON_SIZE_16 };
export { THEME_ICON_SIZE_48 };
export { THEME_LIGHT };
export { THEME_STORAGE_KEY };
