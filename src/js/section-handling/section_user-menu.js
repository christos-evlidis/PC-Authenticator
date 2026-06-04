const USER_MENU_SECTION_SELECTOR = '.user-menu-section';
const USER_MENU_BTN_SELECTOR = '.user-menu-btn';
const USER_MENU_CLOSE_BTN_SELECTOR = '.user-menu-close-btn';
const USER_MENU_BACKDROP_SELECTOR = '.user-menu-backdrop';
const USER_MENU_PANEL_SELECTOR = '.user-menu-panel';
const BLUR_TARGET_SELECTOR = '.extension-frame > .app-header';
const AUTH_THUMB_TRACK_SELECTOR = '.thumb-selector__track--auth';
const AUTH_THUMB_BTN_SELECTOR = '.thumb-selector--auth .thumb-selector__btn';
const THEME_THUMB_TRACK_SELECTOR = '.thumb-selector__track--theme';
const THEME_THUMB_BTN_SELECTOR = '.thumb-selector--theme .thumb-selector__btn';
const USER_MENU_BODY_SELECTOR = '.user-menu-body';
const USER_MENU_AUTH_VIEW_SELECTOR = '.user-menu-body__views > .user-menu-auth-view';
const USER_MENU_ACCOUNT_VIEW_SELECTOR = '.user-menu-body__views > .user-menu-account-view';
const USER_MENU_SIGN_IN_VIEW_SELECTOR = '.user-menu-auth-view__tabs > .sign-in-view';
const USER_MENU_SIGN_UP_VIEW_SELECTOR = '.user-menu-auth-view__tabs > .sign-up-view';
const ACCOUNT_FORM_SELECTOR = '.account-form';
const ACCOUNT_INPUT_SELECTOR = '.account-form__input';
const ACCOUNT_COPY_BTN_SELECTOR = '.account-form__copy-btn';
const ACCOUNT_DOWNLOAD_BTN_SELECTOR = '.account-form__download-btn';
const LOGOUT_BTN_SELECTOR = '.account-form__logout';
const ACCOUNT_ACTION_FEEDBACK_MS = 1500;
const ACCOUNT_ICON_COPY = 'fa-copy';
const ACCOUNT_ICON_DOWNLOAD = 'fa-download';
const ACCOUNT_ICON_CHECK = 'fa-check';
const LOGIN_LOADING_SELECTOR = '.login-status--loading';
const LOGIN_SUCCESS_SELECTOR = '.login-status--success';
const LOGIN_ERROR_SELECTOR = '.login-status--error';

const BODY_BLUR_CLASS = 'is-user-menu-blurred';
const BODY_AUTH_FLOW_LOCK_CLASS = 'is-auth-flow-locked';

const VIEW_SIGN_IN = 'sign-in';
const VIEW_SIGN_UP = 'sign-up';
const MAIN_VIEW_AUTH = 'auth';
const MAIN_VIEW_ACCOUNT = 'account';
let userMenuAnimationToken = 0;
let isUserMenuTabAnimating = false;
let isLoginSequenceRunning = false;

function getUserMenuButtons() {
    return document.querySelectorAll(USER_MENU_BTN_SELECTOR);
}

function getUserMenuSection() {
    return document.querySelector(USER_MENU_SECTION_SELECTOR);
}

function getUserMenuPanel() {
    return document.querySelector(USER_MENU_PANEL_SELECTOR);
}

function getBlurTarget() {
    return document.querySelector(BLUR_TARGET_SELECTOR);
}

function isUserMenuActive() {
    return getUserMenuSection()?.classList.contains('is-active') ?? false;
}

function parseDurationMs(value, fallback) {
    if (!value) return fallback;
    const trimmed = value.trim();
    if (trimmed.endsWith('ms')) return parseFloat(trimmed) || fallback;
    if (trimmed.endsWith('s')) return (parseFloat(trimmed) || fallback / 1000) * 1000;
    return fallback;
}

function getCssDurationMs(variableName, fallback) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(variableName);
    return parseDurationMs(value, fallback);
}

function getBlurDurationMs() {
    return getCssDurationMs('--user-menu-blur-duration', 250);
}

function getSlideDurationMs() {
    return getCssDurationMs('--user-menu-slide-duration', 250);
}

function getTabDurationMs() {
    return getCssDurationMs('--user-menu-tab-duration', 350);
}

function getLoginUiFadeMs() {
    return getCssDurationMs('--login-ui-fade-duration', 350);
}

function getLoginBodyExpandMs() {
    return getCssDurationMs('--login-body-expand-duration', 250);
}

function getLoginPanelImmersiveMs() {
    return getCssDurationMs('--login-panel-immersive-duration', 250);
}

async function waitForPanelImmersiveTransition(panel) {
    const waitMs = getLoginPanelImmersiveMs() + 16;

    await Promise.all([
        waitForTransitionEnd(panel, 'padding', waitMs),
        waitForTransitionEnd(panel, 'background-color', waitMs)
    ]);
}

async function enterPanelImmersive(panel) {
    panel.classList.add('is-panel-immersive');
    void panel.offsetWidth;
    await waitForPanelImmersiveTransition(panel);
}

async function exitPanelImmersive(panel) {
    panel.classList.remove('is-panel-immersive');
    void panel.offsetWidth;
    await waitForPanelImmersiveTransition(panel);
}

function getLoginDotsFadeInMs() {
    return getCssDurationMs('--login-dots-fade-in-duration', 250);
}

function getLoginDotsVisibleMs() {
    return getCssDurationMs('--login-dots-visible-duration', 2000);
}

function getLoginDotsFadeOutMs() {
    return getCssDurationMs('--login-dots-fade-out-duration', 250);
}

function getLoginResultFadeInMs() {
    return getCssDurationMs('--login-result-fade-in-duration', 250);
}

function getLoginCheckDrawMs() {
    return getCssDurationMs('--login-check-draw-duration', 500);
}

function getLoginIconDrawTotalMs() {
    const drawMs = getLoginCheckDrawMs();
    const markDelayMs = drawMs * 0.45;
    return drawMs + markDelayMs;
}

function waitForLoginIconDraw(icon) {
    const targets = icon.querySelectorAll('.login-status__icon-circle, .login-status__icon-mark');
    const fallbackMs = getLoginIconDrawTotalMs() + 32;

    if (!targets.length) {
        return delay(fallbackMs);
    }

    return new Promise((resolve) => {
        let pending = targets.length;
        let settled = false;

        const finish = () => {
            if (settled) return;
            settled = true;
            targets.forEach((el) => el.removeEventListener('animationend', onAnimationEnd));
            clearTimeout(fallbackId);
            resolve();
        };

        const onAnimationEnd = (event) => {
            if (!icon.contains(event.target)) return;
            pending -= 1;
            if (pending <= 0) {
                finish();
            }
        };

        targets.forEach((el) => el.addEventListener('animationend', onAnimationEnd));
        const fallbackId = setTimeout(finish, fallbackMs);
    });
}

function getLoginCheckFadeOutMs() {
    return getCssDurationMs('--login-check-fade-out-duration', 250);
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForTransitionEnd(element, propertyName, fallbackMs) {
    return new Promise((resolve) => {
        if (!element) {
            resolve();
            return;
        }

        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            element.removeEventListener('transitionend', onTransitionEnd);
            clearTimeout(fallbackId);
            resolve();
        };

        const onTransitionEnd = (event) => {
            if (event.target === element && event.propertyName === propertyName) {
                finish();
            }
        };

        const fallbackId = setTimeout(finish, fallbackMs);
        element.addEventListener('transitionend', onTransitionEnd);
    });
}

function bumpUserMenuAnimationToken() {
    userMenuAnimationToken += 1;
    return userMenuAnimationToken;
}

function isUserMenuAnimationCurrent(token) {
    return token === userMenuAnimationToken;
}

function setAuthFlowLock(isLocked) {
    document.body.classList.toggle(BODY_AUTH_FLOW_LOCK_CLASS, isLocked);
}

async function closeOtherOverlays() {
    if (window.ManualSetup?.isActive?.()) {
        await window.ManualSetup.close();
    }
}

async function openUserMenu() {
    if (isLoginSequenceRunning) return;

    const section = getUserMenuSection();
    const blurTarget = getBlurTarget();
    if (!section || isUserMenuActive()) return;

    await closeOtherOverlays();

    const token = bumpUserMenuAnimationToken();

    section.classList.add('is-active');
    document.body.classList.add(BODY_BLUR_CLASS);
    getUserMenuButtons().forEach((btn) => btn.classList.add('is-active'));

    void blurTarget?.offsetWidth;
    await waitForTransitionEnd(blurTarget, 'filter', getBlurDurationMs() + 16);

    if (!isUserMenuAnimationCurrent(token)) return;

    section.classList.add('is-panel-open');
    await waitForTransitionEnd(getUserMenuPanel(), 'transform', getSlideDurationMs() + 16);
}

async function closeUserMenu() {
    if (isLoginSequenceRunning) return;

    const section = getUserMenuSection();
    const panel = getUserMenuPanel();
    const blurTarget = getBlurTarget();
    if (!section || !isUserMenuActive()) return;

    const token = bumpUserMenuAnimationToken();

    section.classList.remove('is-panel-open');
    await waitForTransitionEnd(panel, 'transform', getSlideDurationMs() + 16);

    if (!isUserMenuAnimationCurrent(token)) return;

    document.body.classList.remove(BODY_BLUR_CLASS);
    await waitForTransitionEnd(blurTarget, 'filter', getBlurDurationMs() + 16);

    if (!isUserMenuAnimationCurrent(token)) return;

    section.classList.remove('is-active');
    getUserMenuButtons().forEach((btn) => btn.classList.remove('is-active'));

    const { accountNumber } = await chrome.storage.local.get(['accountNumber']);

    if (accountNumber && window.Codes?.hasPendingPostLoginReveal?.()) {
        await window.Codes.playPostLoginReveal();
    } else if (window.Codes?.hasPostLogoutBlank?.()) {
        await window.Codes.playPostLogoutReveal();
    }
}

function toggleUserMenu() {
    if (isLoginSequenceRunning) return;

    if (isUserMenuActive()) {
        closeUserMenu();
    } else {
        openUserMenu();
    }
}

function updateAuthThumbSelector(view) {
    const track = document.querySelector(AUTH_THUMB_TRACK_SELECTOR);
    const buttons = document.querySelectorAll(AUTH_THUMB_BTN_SELECTOR);
    const isSignIn = view === VIEW_SIGN_IN;

    if (track) {
        track.classList.toggle('is-sign-in', isSignIn);
        track.classList.toggle('is-sign-up', !isSignIn);
    }

    buttons.forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.view === view);
    });
}

function setAccountInputValue(accountNumber) {
    const input = document.querySelector(ACCOUNT_INPUT_SELECTOR);
    if (input) {
        input.value = accountNumber ?? '';
    }
}

function getAccountNumber() {
    return document.querySelector(ACCOUNT_INPUT_SELECTOR)?.value.trim() ?? '';
}

function setAccountActionButtonIcon(button, iconClass) {
    const icon = button?.querySelector('i');
    if (icon) {
        icon.className = `fas ${iconClass}`;
    }
}

function showAccountActionFeedback(button, originalIconClass) {
    if (!button || button.disabled) return;

    button.disabled = true;
    button.classList.add('is-success');
    setAccountActionButtonIcon(button, ACCOUNT_ICON_CHECK);

    window.setTimeout(() => {
        setAccountActionButtonIcon(button, originalIconClass);
        button.classList.remove('is-success');
        button.disabled = false;
    }, ACCOUNT_ACTION_FEEDBACK_MS);
}

async function copyAccountNumber() {
    const accountNumber = getAccountNumber();
    if (!accountNumber) return false;

    try {
        await navigator.clipboard.writeText(accountNumber);
        return true;
    } catch {
        const input = document.querySelector(ACCOUNT_INPUT_SELECTOR);
        if (!input) return false;

        input.removeAttribute('readonly');
        input.select();
        input.setSelectionRange(0, accountNumber.length);
        const copied = document.execCommand('copy');
        input.setAttribute('readonly', '');
        window.getSelection()?.removeAllRanges();
        return copied;
    }
}

function downloadAccountNumber() {
    const accountNumber = getAccountNumber();
    if (!accountNumber) return false;

    const blob = new Blob([`${accountNumber}\n`], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pc-authenticator-account-number.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    return true;
}

function handleAccountFormClick(event) {
    const copyBtn = event.target.closest(ACCOUNT_COPY_BTN_SELECTOR);
    if (copyBtn) {
        event.preventDefault();
        event.stopPropagation();
        void copyAccountNumber().then((copied) => {
            if (copied) {
                showAccountActionFeedback(copyBtn, ACCOUNT_ICON_COPY);
            }
        });
        return;
    }

    const downloadBtn = event.target.closest(ACCOUNT_DOWNLOAD_BTN_SELECTOR);
    if (downloadBtn) {
        event.preventDefault();
        event.stopPropagation();
        if (downloadAccountNumber()) {
            showAccountActionFeedback(downloadBtn, ACCOUNT_ICON_DOWNLOAD);
        }
    }
}

function initAccountActions() {
    document.querySelector(ACCOUNT_FORM_SELECTOR)?.addEventListener('click', handleAccountFormClick);
}

function setUserMenuMainView(view, options = {}) {
    const { instant = false } = options;
    const authView = document.querySelector(USER_MENU_AUTH_VIEW_SELECTOR);
    const accountView = document.querySelector(USER_MENU_ACCOUNT_VIEW_SELECTOR);
    const menuBody = document.querySelector(USER_MENU_BODY_SELECTOR);

    if (!authView || !accountView) return;

    const showAccount = view === MAIN_VIEW_ACCOUNT;
    const incoming = showAccount ? accountView : authView;
    const outgoing = showAccount ? authView : accountView;

    if (instant) {
        menuBody?.classList.add('is-main-view-instant');
        incoming.classList.add('is-active');
        outgoing.classList.remove('is-active');
        menuBody?.classList.remove('is-main-view-instant');
    }
}

function prepareSignedOutMenuViews() {
    const signInInput = document.querySelector('.sign-in-form__input');

    if (signInInput) {
        signInInput.value = '';
    }

    setAccountInputValue('');
    setUserMenuMainView(MAIN_VIEW_AUTH, { instant: true });
    setUserMenuTab(VIEW_SIGN_IN, { instant: true });
}

function applyAuthenticatedState(accountNumber) {
    if (!accountNumber) return;

    setAccountInputValue(accountNumber);
    setUserMenuMainView(MAIN_VIEW_ACCOUNT, { instant: true });
    showAuthenticatedThumbSelectorInstant();
}

async function applySignedOutState() {
    const panel = getUserMenuPanel();

    window.Codes?.clear?.();
    await window.AccountsStorage?.clearAllAccounts();
    panel?.classList.remove('is-authenticated');
    prepareSignedOutMenuViews();
}

async function playAuthFlowSequence(apiPromise, options = {}) {
    const { revealAuthenticated = true, onAuthSuccess = null, fadeAppOnSuccess = false } = options;

    if (isLoginSequenceRunning) {
        absorbPromise(apiPromise);
        return;
    }

    const panel = getUserMenuPanel();
    const menuBody = document.querySelector(USER_MENU_BODY_SELECTOR);
    const loader = document.querySelector(LOGIN_LOADING_SELECTOR);

    if (!panel || !menuBody || !loader) {
        absorbPromise(apiPromise);
        return;
    }

    isLoginSequenceRunning = true;
    setAuthFlowLock(true);

    try {
        panel.classList.add('is-fading-auth-ui');
        await delay(getLoginUiFadeMs());

        panel.classList.remove('is-fading-auth-ui');
        void menuBody.offsetWidth;
        panel.classList.add('is-login-flow', 'is-chrome-hidden');

        if (!revealAuthenticated) {
            prepareSignedOutMenuViews();
            panel.classList.add('is-signed-out-reveal');
        }

        menuBody.classList.add('is-expanded');
        await waitForTransitionEnd(menuBody, 'margin-top', getLoginBodyExpandMs() + 16);

        await enterPanelImmersive(panel);

        const apiResult = await runLoginLoaderPhase(loader, menuBody, apiPromise);

        if (apiResult.success) {
            if (onAuthSuccess) {
                await onAuthSuccess(apiResult);
            }

            await playLoginResultIcon(LOGIN_SUCCESS_SELECTOR, { fadeAppChrome: fadeAppOnSuccess });
            await exitPanelImmersive(panel);
            await shrinkLoginBody(panel, menuBody);
            await revealAuthChrome(revealAuthenticated);
            return apiResult;
        }

        await playLoginResultIcon(LOGIN_ERROR_SELECTOR);
        await exitPanelImmersive(panel);
        await shrinkLoginBody(panel, menuBody);
        await revealAuthChrome(false);
        throw new Error('Auth flow failed');
    } finally {
        isLoginSequenceRunning = false;
        setAuthFlowLock(false);
    }
}

async function playLogoutSequence() {
    await playAuthFlowSequence(Promise.resolve(), {
        revealAuthenticated: false,
        fadeAppOnSuccess: true,
        onAuthSuccess: async () => {
            await chrome.storage.local.remove(['accountNumber']);
        }
    });

    await applySignedOutState();
}

async function handleLogout() {
    if (isLoginSequenceRunning) return;

    try {
        await playLogoutSequence();
        window.Header?.refresh();
    } catch {
        // restore UI if the sequence fails
        await resetLoginSequence();
        await applySignedOutState();
        window.Header?.refresh();
    }
}

async function setUserMenuTab(view, options = {}) {
    const { instant = false } = options;
    const signInView = document.querySelector(USER_MENU_SIGN_IN_VIEW_SELECTOR);
    const signUpView = document.querySelector(USER_MENU_SIGN_UP_VIEW_SELECTOR);

    const isSignIn = view === VIEW_SIGN_IN;
    const incoming = isSignIn ? signInView : signUpView;
    const outgoing = isSignIn ? signUpView : signInView;

    if (!incoming || !outgoing) return;
    if (incoming.classList.contains('is-active') && !instant) return;

    if (instant) {
        updateAuthThumbSelector(view);

        const menuBody = document.querySelector(USER_MENU_BODY_SELECTOR);

        menuBody?.classList.add('is-tab-instant');
        incoming.classList.add('is-active');
        outgoing.classList.remove('is-active');
        menuBody?.classList.remove('is-tab-instant');
        return;
    }

    if (isUserMenuTabAnimating || isLoginSequenceRunning) return;

    updateAuthThumbSelector(view);

    const menuBody = document.querySelector(USER_MENU_BODY_SELECTOR);

    isUserMenuTabAnimating = true;

    outgoing.classList.remove('is-active');
    void outgoing.offsetWidth;
    incoming.classList.add('is-active');

    await waitForTransitionEnd(incoming, 'opacity', getTabDurationMs() + 16);

    isUserMenuTabAnimating = false;
}

function updateThemeThumbSelector(theme) {
    const track = document.querySelector(THEME_THUMB_TRACK_SELECTOR);
    const buttons = document.querySelectorAll(THEME_THUMB_BTN_SELECTOR);
    const isLight = theme === window.Theme?.LIGHT;

    if (track) {
        track.classList.toggle('is-light', isLight);
        track.classList.toggle('is-dark', !isLight);
    }

    buttons.forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.theme === theme);
    });
}

async function setUserMenuTheme(theme, options = {}) {
    const { instant = false } = options;
    const resolved = window.Theme?.resolve?.(theme);

    if (!resolved || !window.Theme) {
        return;
    }

    if (isUserMenuTabAnimating || isLoginSequenceRunning) {
        return;
    }

    if (instant) {
        window.Theme.apply(resolved, { instant: true });

        try {
            await chrome.storage.local.set({ theme: resolved });
        } catch {
            // chrome.storage unavailable
        }
    } else {
        await window.Theme.persist(resolved);
    }

    updateThemeThumbSelector(resolved);
}

function prepareAuthenticatedThumbSelector() {
    const panel = getUserMenuPanel();
    const authThumb = document.querySelector('.thumb-selector--auth');
    const themeThumb = document.querySelector('.thumb-selector--theme');

    panel?.classList.add('is-authenticated');
    authThumb?.classList.add('hidden');
    themeThumb?.classList.remove('hidden');
    themeThumb?.classList.remove('is-visible');
}

function showAuthenticatedThumbSelectorInstant() {
    prepareAuthenticatedThumbSelector();
    document.querySelector('.thumb-selector--theme')?.classList.add('is-visible');
}

function absorbPromise(promise) {
    if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {});
    }
}

function hideLoginStatusIcon(selector) {
    const icon = document.querySelector(selector);
    if (!icon) return;

    icon.classList.add('hidden');
    icon.classList.remove('is-shown', 'is-hiding', 'is-animating', 'is-drawn');
}

function getLoginStatusFadeInMs(element) {
    if (element?.classList.contains('login-status--loading')) {
        return getLoginDotsFadeInMs();
    }

    return getLoginResultFadeInMs();
}

function getLoginStatusFadeOutMs(element) {
    if (element?.classList.contains('login-status--loading')) {
        return getLoginDotsFadeOutMs();
    }

    return getLoginCheckFadeOutMs();
}

function cancelLoginStatusAnimations(element) {
    element.getAnimations().forEach((animation) => animation.cancel());
}

async function fadeInLoginStatus(element) {
    const durationMs = getLoginStatusFadeInMs(element);

    element.classList.remove('hidden', 'is-hiding');
    void element.offsetWidth;
    element.classList.add('is-shown');
    await waitForTransitionEnd(element, 'opacity', durationMs + 32);
}

async function fadeOutLoginStatus(element) {
    const durationMs = getLoginStatusFadeOutMs(element);

    element.classList.add('is-hiding');
    element.classList.remove('is-shown');
    await waitForTransitionEnd(element, 'opacity', durationMs + 32);
    element.classList.remove('is-hiding', 'is-animating', 'is-drawn');
    element.classList.add('hidden');
}

async function runLoginLoaderPhase(loader, menuBody, apiPromise) {
    const apiOutcome = apiPromise
        .then((value) => ({ success: true, value }))
        .catch(() => ({ success: false, value: null }));

    menuBody.classList.add('is-loader-active');
    await fadeInLoginStatus(loader);

    await delay(getLoginDotsVisibleMs());

    const result = await apiOutcome;

    await fadeOutLoginStatus(loader);
    menuBody.classList.remove('is-loader-active');

    return result;
}

async function resetLoginSequence() {
    const panel = getUserMenuPanel();
    const menuBody = document.querySelector(USER_MENU_BODY_SELECTOR);
    const loader = document.querySelector(LOGIN_LOADING_SELECTOR);

    panel?.classList.remove(
        'is-fading-auth-ui',
        'is-login-flow',
        'is-chrome-hidden',
        'is-chrome-preparing',
        'is-chrome-visible',
        'is-panel-immersive',
        'is-signed-out-reveal'
    );
    menuBody?.classList.remove('is-expanded');
    loader?.classList.add('hidden');
    loader?.classList.remove('is-shown', 'is-hiding');
    menuBody?.classList.remove('is-loader-active');
    panel?.classList.remove('is-chrome-preparing', 'is-chrome-visible');
    hideLoginStatusIcon(LOGIN_SUCCESS_SELECTOR);
    hideLoginStatusIcon(LOGIN_ERROR_SELECTOR);

    isLoginSequenceRunning = false;
    setAuthFlowLock(false);
}

async function playLoginResultIcon(selector, options = {}) {
    const { fadeAppChrome = false } = options;
    const icon = document.querySelector(selector);
    if (!icon) return;

    const otherSelector = selector === LOGIN_SUCCESS_SELECTOR
        ? LOGIN_ERROR_SELECTOR
        : LOGIN_SUCCESS_SELECTOR;
    hideLoginStatusIcon(otherSelector);

    icon.classList.remove('is-animating', 'is-hiding', 'is-drawn');

    if (fadeAppChrome) {
        await window.Codes?.enterPostLogoutBlankState?.();
    }

    await fadeInLoginStatus(icon);

    icon.classList.add('is-animating');
    await waitForLoginIconDraw(icon);

    icon.classList.remove('is-animating');
    icon.classList.add('is-drawn');
    cancelLoginStatusAnimations(icon);
    await fadeOutLoginStatus(icon);
}

async function revealAuthChrome(isSuccess) {
    const panel = getUserMenuPanel();
    const views = document.querySelector('.user-menu-body__views');
    const menuHeader = document.querySelector('.user-menu-header');
    const authThumb = document.querySelector('.thumb-selector--auth');
    const themeThumb = document.querySelector('.thumb-selector--theme');

    if (isSuccess) {
        prepareAuthenticatedThumbSelector();
    } else {
        prepareSignedOutMenuViews();
        panel?.classList.remove('is-authenticated');
        panel?.classList.add('is-signed-out-reveal');
        authThumb?.classList.remove('hidden');
        themeThumb?.classList.add('hidden');
        themeThumb?.classList.remove('is-visible');
    }

    panel?.classList.add('is-chrome-preparing');
    panel?.classList.remove('is-chrome-hidden');
    void panel?.offsetWidth;
    panel?.classList.add('is-chrome-visible');

    const fadeTarget = isSuccess ? themeThumb : authThumb;
    const fadeWaitMs = getLoginUiFadeMs() + 16;
    await Promise.all([
        waitForTransitionEnd(menuHeader, 'opacity', fadeWaitMs),
        waitForTransitionEnd(fadeTarget || views, 'opacity', fadeWaitMs),
        waitForTransitionEnd(views, 'opacity', fadeWaitMs)
    ]);

    panel?.classList.remove('is-chrome-preparing', 'is-chrome-visible');

    if (isSuccess) {
        themeThumb?.classList.add('is-visible');
    } else {
        panel?.classList.remove('is-signed-out-reveal');
    }
}

async function shrinkLoginBody(panel, menuBody) {
    menuBody.classList.remove('is-expanded');
    void menuBody.offsetWidth;
    await waitForTransitionEnd(menuBody, 'margin-top', getLoginBodyExpandMs() + 16);
    panel.classList.remove('is-login-flow');
}

async function playLoginSuccessSequence(apiPromise, options = {}) {
    const { accountNumber: accountNumberOption } = options;

    const apiResult = await playAuthFlowSequence(apiPromise, {
        revealAuthenticated: true,
        onAuthSuccess: async (result) => {
            const payload = result.value ?? {};
            const accountNumber = accountNumberOption ?? payload.accountNumber ?? '';

            if (accountNumber) {
                setAccountInputValue(accountNumber);
                await chrome.storage.local.set({ accountNumber });
                setUserMenuMainView(MAIN_VIEW_ACCOUNT, { instant: true });
                const accounts = await window.AccountsStorage?.setAccountsAll(accountNumber);
                window.Codes?.stagePostLoginReveal?.(accounts);
                await window.Codes?.enterPostLoginBlankState?.();
            }
        }
    });

    return apiResult;
}

function initUserMenuTabs() {
    const buttons = document.querySelectorAll(AUTH_THUMB_BTN_SELECTOR);

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            if (view === VIEW_SIGN_IN || view === VIEW_SIGN_UP) {
                setUserMenuTab(view);
            }
        });
    });

    setUserMenuTab(VIEW_SIGN_IN, { instant: true });
}

function initThemeTabs() {
    const buttons = document.querySelectorAll(THEME_THUMB_BTN_SELECTOR);

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const theme = btn.dataset.theme;
            if (theme === window.Theme?.LIGHT || theme === window.Theme?.DARK) {
                setUserMenuTheme(theme);
            }
        });
    });
}

async function initAuthenticatedMenuState() {
    const { accountNumber } = await chrome.storage.local.get(['accountNumber']);
    const resolvedTheme = await window.Theme?.syncFromChromeStorage?.() ?? window.Theme?.readLocal?.();

    updateThemeThumbSelector(resolvedTheme);

    if (accountNumber) {
        applyAuthenticatedState(accountNumber);
    } else {
        await applySignedOutState();
    }
}

function initUserMenu() {
    const closeBtn = document.querySelector(USER_MENU_CLOSE_BTN_SELECTOR);
    const backdrop = document.querySelector(USER_MENU_BACKDROP_SELECTOR);
    const panel = getUserMenuPanel();

    getUserMenuButtons().forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleUserMenu();
        });
    });

    closeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        closeUserMenu();
    });

    backdrop?.addEventListener('click', closeUserMenu);

    panel?.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    document.querySelector(LOGOUT_BTN_SELECTOR)?.addEventListener('click', handleLogout);

    initAccountActions();
    initUserMenuTabs();
    initThemeTabs();
    initSignInForm();
    initSignUpForm();
    initAuthenticatedMenuState();
}

function initSignInForm() {
    const form = document.querySelector('.sign-in-form');
    const input = document.querySelector('.sign-in-form__input');

    form?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const accountNumber = input?.value.trim() ?? '';

        if (accountNumber.length === 0) {
            return;
        }

        try {
            const verifyPromise = window.PcAuthApi.verifyAccount(accountNumber);
            await playLoginSuccessSequence(verifyPromise, { accountNumber });
        } catch {
            // failed login: X animation and UI restore handled in playLoginSuccessSequence
        }
    });
}

function initSignUpForm() {
    const submitBtn = document.querySelector('.sign-up-form__submit');

    submitBtn?.addEventListener('click', async () => {
        try {
            const createPromise = window.PcAuthApi.createAccount().then((accountNumber) => ({
                accountNumber
            }));
            await playLoginSuccessSequence(createPromise);
        } catch {
            // failed sign up: X animation and UI restore handled in playLoginSuccessSequence
        }
    });
}

document.addEventListener('DOMContentLoaded', initUserMenu);

window.UserMenu = {
    open: openUserMenu,
    close: closeUserMenu,
    toggle: toggleUserMenu,
    isActive: isUserMenuActive,
    setTab: setUserMenuTab,
    setTheme: setUserMenuTheme,
    playLoginSuccessSequence,
    playLogoutSequence,
    resetLoginSequence,
    applyAuthenticatedState,
    applySignedOutState,
    logout: handleLogout
};
