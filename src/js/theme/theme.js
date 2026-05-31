export const THEME_LIGHT = "light";
export const THEME_DARK = "dark";
export const STORAGE_KEY = "pca-theme";
export const TRANSITION_MS = 220;

export function resolveTheme(theme) {
  return theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;
}

export function readLocalTheme() {
  try {
    return resolveTheme(localStorage.getItem(STORAGE_KEY));
  } catch {
    return THEME_LIGHT;
  }
}

function writeLocalTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, resolveTheme(theme));
  } catch {
    // localStorage unavailable
  }
}

export function applyTheme(theme, options = {}) {
  const { instant = false } = options;
  const resolved = resolveTheme(theme);
  const isDark = resolved === THEME_DARK;
  const root = document.documentElement;
  const alreadyDark = root.classList.contains("theme-dark");

  if (alreadyDark === isDark && !instant) {
    writeLocalTheme(resolved);
    return resolved;
  }

  if (instant) {
    root.classList.toggle("theme-dark", isDark);
  } else {
    root.classList.add("theme-transition-active");
    void root.offsetWidth;
    root.classList.toggle("theme-dark", isDark);

    window.setTimeout(() => {
      root.classList.remove("theme-transition-active");
    }, TRANSITION_MS + 24);
  }

  writeLocalTheme(resolved);
  return resolved;
}

export async function syncThemeFromChromeStorage() {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return readLocalTheme();
  }

  try {
    const { theme } = await chrome.storage.local.get(["theme"]);

    if (theme === THEME_LIGHT || theme === THEME_DARK) {
      return applyTheme(theme, { instant: true });
    }
  } catch {
    // chrome.storage unavailable
  }

  const local = readLocalTheme();

  try {
    await chrome.storage.local.set({ theme: local });
  } catch {
    // chrome.storage unavailable
  }

  return local;
}

export async function persistTheme(theme) {
  const resolved = applyTheme(theme);
  writeLocalTheme(resolved);

  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    try {
      await chrome.storage.local.set({ theme: resolved });
    } catch {
      // chrome.storage unavailable
    }
  }

  return resolved;
}

export function initTheme() {
  applyTheme(readLocalTheme(), { instant: true });
}
