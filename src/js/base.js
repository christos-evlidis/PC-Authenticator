(function () {
    const THEME_LIGHT = 'light';
    const THEME_DARK = 'dark';
    const STORAGE_KEY = 'pca-theme';
    const TRANSITION_MS = 220;

    function resolveTheme(theme) {
        return theme === THEME_DARK ? THEME_DARK : THEME_LIGHT;
    }

    function readLocalTheme() {
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

    function applyDocumentTheme(theme, options = {}) {
        const { instant = false } = options;
        const resolved = resolveTheme(theme);
        const isDark = resolved === THEME_DARK;
        const root = document.documentElement;
        const alreadyDark = root.classList.contains('theme-dark');

        root.style.colorScheme = isDark ? 'dark' : 'light';

        if (alreadyDark === isDark && !instant) {
            writeLocalTheme(resolved);
            return resolved;
        }

        if (instant) {
            root.classList.toggle('theme-dark', isDark);
        } else {
            root.classList.add('theme-transition-active');
            void root.offsetWidth;
            root.classList.toggle('theme-dark', isDark);

            window.setTimeout(() => {
                root.classList.remove('theme-transition-active');
            }, TRANSITION_MS + 24);
        }

        writeLocalTheme(resolved);
        return resolved;
    }

    async function syncFromChromeStorage() {
        if (typeof chrome === 'undefined' || !chrome.storage?.local) {
            return readLocalTheme();
        }

        try {
            const { theme } = await chrome.storage.local.get(['theme']);

            if (theme === THEME_LIGHT || theme === THEME_DARK) {
                return applyDocumentTheme(theme, { instant: true });
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

    async function persistTheme(theme) {
        const resolved = applyDocumentTheme(theme);
        writeLocalTheme(resolved);

        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
            try {
                await chrome.storage.local.set({ theme: resolved });
            } catch {
                // chrome.storage unavailable
            }
        }

        return resolved;
    }

    applyDocumentTheme(readLocalTheme(), { instant: true });

    window.Theme = {
        LIGHT: THEME_LIGHT,
        DARK: THEME_DARK,
        STORAGE_KEY,
        TRANSITION_MS,
        resolve: resolveTheme,
        readLocal: readLocalTheme,
        apply: applyDocumentTheme,
        syncFromChromeStorage,
        persist: persistTheme
    };
})();

(function () {
    function queryPendingQrScan() {
        return new Promise((resolve) => {
            if (!chrome?.runtime?.sendMessage) {
                resolve(null);
                return;
            }

            chrome.runtime.sendMessage({ action: 'getQrScanPending' }, (response) => {
                if (chrome.runtime.lastError) {
                    resolve(null);
                    return;
                }

                if (response?.status === 'ready' || response?.status === 'error') {
                    resolve(response);
                    return;
                }

                resolve(null);
            });
        });
    }

    window.PopupResume = {
        pending: null,
        skipIntro: false,
        ready: queryPendingQrScan().then((pending) => {
            window.PopupResume.pending = pending;
            window.PopupResume.skipIntro = Boolean(pending);

            if (window.PopupResume.skipIntro) {
                document.documentElement.classList.add('is-popup-qr-resume');
                document.body.classList.add('is-user-menu-blurred');
            }

            return window.PopupResume.skipIntro;
        }),
        whenReady() {
            return window.PopupResume.ready;
        },
        getPending() {
            return window.PopupResume.pending;
        }
    };
})();
