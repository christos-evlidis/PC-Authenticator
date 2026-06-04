const HEADER_SIGNED_OUT_VIEW_SELECTOR = '.app-header .signed-out-view';
const HEADER_SIGNED_IN_VIEW_SELECTOR = '.app-header .signed-in-view';
const BODY_SIGNED_OUT_VIEW_SELECTOR = '.app-body > .signed-out-view';
const BODY_SIGNED_IN_VIEW_SELECTOR = '.app-body > .signed-in-view';

const HEADER_INTRO_TYPE_MS = 1000;
const HEADER_INTRO_BTN_POP_MS = 250;
const HEADER_INTRO_BTN_STAGGER_MS = 225;
const LOGIN_BLANK_FADE_MS = 350;

let headerIntroPlayed = false;
let resolveHeaderIntroComplete;

const headerIntroCompletePromise = new Promise((resolve) => {
    resolveHeaderIntroComplete = resolve;
});

function setBodyAuthState(isLoggedIn, options = {}) {
    const { skipSignedOutReveal = false } = options;
    const signedOutView = document.querySelector(BODY_SIGNED_OUT_VIEW_SELECTOR);
    const signedInView = document.querySelector(BODY_SIGNED_IN_VIEW_SELECTOR);

    if (signedOutView) {
        signedOutView.classList.toggle('hidden', isLoggedIn);
    }

    if (signedInView) {
        signedInView.classList.toggle('hidden', !isLoggedIn);
    }

    if (
        !isLoggedIn
        && !skipSignedOutReveal
        && !document.querySelector('.extension-frame')?.classList.contains('is-app-intro-pending')
        && !document.querySelector('.extension-frame')?.classList.contains('is-post-logout-blank')
        && !window.BodyIntro?.isSignedOutIntroRunning?.()
    ) {
        window.BodyIntro?.revealSignedOutContentStatic?.();
    }
}

function setHeaderAuthState(isLoggedIn, options = {}) {
    const signedOutView = document.querySelector(HEADER_SIGNED_OUT_VIEW_SELECTOR);
    const signedInView = document.querySelector(HEADER_SIGNED_IN_VIEW_SELECTOR);

    if (signedOutView) {
        signedOutView.classList.toggle('hidden', isLoggedIn);
    }

    if (signedInView) {
        signedInView.classList.toggle('hidden', !isLoggedIn);
    }

    setBodyAuthState(isLoggedIn, options);

    if (isLoggedIn) {
        window.ManualSetup?.refreshBindings?.();
    }
}

function clearChromeFadeState() {
    document.querySelectorAll('.is-login-fade-out, .is-login-fade-out--active').forEach((element) => {
        clearLoginFadeClasses(element);
    });
}

function clearHeaderChromeFadeState() {
    const header = document.querySelector('.app-header');

    if (!header) {
        return;
    }

    const title = header.querySelector('.app-header__title');
    const buttons = header.querySelectorAll('.app-header__btn');

    clearLoginFadeClasses(title);
    buttons.forEach(clearLoginFadeClasses);
}

async function refreshHeaderAuthState(options = {}) {
    const { skipSignedOutReveal = false } = options;
    const { accountNumber } = await chrome.storage.local.get(['accountNumber']);
    const isLoggedIn = Boolean(accountNumber);
    const isLogoutBlank = document.querySelector('.extension-frame')?.classList.contains('is-post-logout-blank');

    if (!isLogoutBlank) {
        clearChromeFadeState();
    }

    setHeaderAuthState(isLoggedIn, { skipSignedOutReveal });

    if (!isLoggedIn && !isLogoutBlank) {
        window.Codes?.clear?.();
    }
}

function setHeaderActionsEnabled(enabled) {
    const header = document.querySelector('.app-header');

    if (header) {
        header.classList.toggle('app-header--actions-disabled', !enabled);
    }

    document.querySelectorAll('.app-header__btn').forEach((button) => {
        button.disabled = !enabled;
        button.setAttribute('aria-disabled', enabled ? 'false' : 'true');
    });
}

function getVisibleHeaderButtons() {
    const header = document.querySelector('.app-header');

    if (!header) {
        return [];
    }

    const activeView = header.querySelector('.signed-in-view:not(.hidden)')
        || header.querySelector('.signed-out-view:not(.hidden)');

    if (!activeView) {
        return [];
    }

    return [...activeView.querySelectorAll('.app-header__btn')];
}

function prepareHeaderIntro() {
    const header = document.querySelector('.app-header');
    const title = header?.querySelector('.app-header__title');

    if (!header || !title) {
        return null;
    }

    const fullTitle = title.dataset.fullTitle || title.textContent.trim() || 'PC Authenticator';
    title.dataset.fullTitle = fullTitle;
    title.textContent = '';

    getVisibleHeaderButtons().forEach((button) => {
        button.classList.add('is-pop-pending');
    });

    return { header, title, fullTitle };
}

function typeHeaderTitle(title, fullTitle) {
    return new Promise((resolve) => {
        const characters = [...fullTitle];

        if (!characters.length) {
            title.classList.remove('is-title-awaiting-type');
            resolve();
            return;
        }

        title.textContent = '';
        title.classList.add('is-intro-typing');

        const stepMs = HEADER_INTRO_TYPE_MS / characters.length;
        let index = 0;

        const tick = () => {
            if (index === 0) {
                title.classList.remove('is-title-awaiting-type');
            }

            title.textContent += characters[index];
            index += 1;

            if (index < characters.length) {
                window.setTimeout(tick, stepMs);
            } else {
                title.classList.remove('is-intro-typing');
                resolve();
            }
        };

        tick();
    });
}

function popHeaderButtons(buttons) {
    return new Promise((resolve) => {
        if (!buttons.length) {
            resolve();
            return;
        }

        let completed = 0;
        const total = buttons.length;

        const onButtonFinished = () => {
            completed += 1;

            if (completed >= total) {
                resolve();
            }
        };

        buttons.forEach((button, index) => {
            window.setTimeout(() => {
                button.classList.remove('is-pop-pending');
                button.classList.add('is-pop-active');

                let settled = false;

                const finish = () => {
                    if (settled) {
                        return;
                    }

                    settled = true;
                    button.classList.remove('is-pop-active');
                    onButtonFinished();
                };

                button.addEventListener('animationend', (event) => {
                    if (event.target === button && event.animationName === 'app-header-btn-pop') {
                        finish();
                    }
                }, { once: true });

                window.setTimeout(finish, HEADER_INTRO_BTN_POP_MS + 32);
            }, index * HEADER_INTRO_BTN_STAGGER_MS);
        });
    });
}

function revealHeaderIntroStatic() {
    const header = document.querySelector('.app-header');
    const title = header?.querySelector('.app-header__title');

    if (title) {
        const fullTitle = title.dataset.fullTitle || title.textContent.trim() || 'PC Authenticator';

        title.dataset.fullTitle = fullTitle;
        title.textContent = fullTitle;
        title.classList.remove('is-title-awaiting-type', 'is-intro-typing');
        clearLoginFadeClasses(title);
    }

    getVisibleHeaderButtons().forEach((button) => {
        button.classList.remove('is-pop-pending', 'is-pop-active');
        clearLoginFadeClasses(button);
    });

    header?.classList.add('is-intro-complete');

    if (!headerIntroPlayed) {
        headerIntroPlayed = true;
        resolveHeaderIntroComplete();
    }
}

async function playHeaderIntro() {
    if (headerIntroPlayed) {
        resolveHeaderIntroComplete();
        return;
    }

    headerIntroPlayed = true;
    await runHeaderIntroSequence();
    resolveHeaderIntroComplete();
}

function waitForIntroComplete() {
    return headerIntroCompletePromise;
}

function waitForTransitionEnd(element, propertyName, timeoutMs) {
    return new Promise((resolve) => {
        if (!element) {
            resolve();
            return;
        }

        const timer = window.setTimeout(resolve, timeoutMs);
        const onEnd = (event) => {
            if (event.target !== element) {
                return;
            }

            if (event.propertyName === propertyName) {
                window.clearTimeout(timer);
                element.removeEventListener('transitionend', onEnd);
                resolve();
            }
        };

        element.addEventListener('transitionend', onEnd);
    });
}

function clearLoginFadeClasses(element) {
    if (!element) {
        return;
    }

    element.classList.remove(
        'is-intro-typing',
        'is-pop-active',
        'is-pop-pending',
        'is-login-fade-out',
        'is-login-fade-out--active'
    );
}

function waitForNextFrame() {
    return new Promise((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
}

async function runHeaderIntroSequence() {
    const prepared = prepareHeaderIntro();

    if (!prepared) {
        document.querySelector('.app-header__title')?.classList.remove('is-title-awaiting-type');
        return;
    }

    const { header, title, fullTitle } = prepared;

    await typeHeaderTitle(title, fullTitle);

    const buttons = getVisibleHeaderButtons();
    await popHeaderButtons(buttons);

    header.classList.add('is-intro-complete');
}

function getLoginBlankFadeTargets() {
    const header = document.querySelector('.app-header');
    const title = header?.querySelector('.app-header__title');
    const buttons = getVisibleHeaderButtons();

    return [title, ...buttons].filter(Boolean);
}

function getLogoutBlankFadeTargets() {
    const header = document.querySelector('.app-header');
    const title = header?.querySelector('.app-header__title');
    const signedInView = header?.querySelector(HEADER_SIGNED_IN_VIEW_SELECTOR);
    const signedOutView = header?.querySelector(HEADER_SIGNED_OUT_VIEW_SELECTOR);
    const activeView = signedInView?.classList.contains('hidden') ? signedOutView : signedInView;
    const buttons = activeView ? [...activeView.querySelectorAll('.app-header__btn')] : [];

    return [title, ...buttons].filter(Boolean);
}

function prepareLogoutBlankHeaderFade() {
    const header = document.querySelector('.app-header');
    const title = header?.querySelector('.app-header__title');
    const buttons = header?.querySelectorAll('.app-header__btn') ?? [];

    if (title) {
        clearLoginFadeClasses(title);
        title.classList.remove('is-title-awaiting-type', 'is-intro-typing');
    }

    buttons.forEach(clearLoginFadeClasses);
}

function afterLoginBlankHeaderFade() {
    const title = document.querySelector('.app-header__title');

    if (title) {
        title.textContent = '';
        title.classList.remove('is-intro-typing');
    }
}

async function fadeOutChromeElements(elements, durationMs = LOGIN_BLANK_FADE_MS) {
    const targets = elements.filter(Boolean);

    if (!targets.length) {
        return;
    }

    targets.forEach((element) => {
        element.classList.remove('is-login-fade-out--active');
        element.classList.add('is-login-fade-out');
    });

    void targets[0].offsetWidth;

    targets.forEach((element) => {
        element.classList.add('is-login-fade-out--active');
    });

    await Promise.all(
        targets.map((element) => waitForTransitionEnd(element, 'opacity', durationMs + 32))
    );
}

async function fadeOutElement(element, durationMs = LOGIN_BLANK_FADE_MS) {
    await fadeOutChromeElements([element], durationMs);
}

async function fadeOutForLoginBlank() {
    await fadeOutChromeElements(getLoginBlankFadeTargets());
    afterLoginBlankHeaderFade();
}

async function fadeOutHeaderForLogout() {
    prepareLogoutBlankHeaderFade();
    await fadeOutChromeElements(getLogoutBlankFadeTargets());
    afterLoginBlankHeaderFade();
}

async function playSignedOutHeaderIntro() {
    const header = document.querySelector('.app-header');
    const title = header?.querySelector('.app-header__title');

    setHeaderAuthState(false, { skipSignedOutReveal: true });
    await waitForNextFrame();

    if (title) {
        clearLoginFadeClasses(title);
        title.classList.remove('is-title-awaiting-type', 'is-intro-typing');
    }

    getVisibleHeaderButtons().forEach(clearLoginFadeClasses);

    await runHeaderIntroSequence();
}

async function playSignedInHeaderIntro() {
    const header = document.querySelector('.app-header');
    const title = header?.querySelector('.app-header__title');

    setHeaderAuthState(true);
    await waitForNextFrame();

    if (title) {
        title.classList.add('is-title-awaiting-type', 'is-login-fade-snap');
        clearLoginFadeClasses(title);
        void title.offsetWidth;
        title.classList.remove('is-login-fade-snap');
    }

    getVisibleHeaderButtons().forEach(clearLoginFadeClasses);

    await runHeaderIntroSequence();
}

async function initHeader() {
    const skipIntro = await window.PopupResume?.whenReady?.();

    await refreshHeaderAuthState();
    setHeaderActionsEnabled(true);

    if (skipIntro) {
        revealHeaderIntroStatic();
        return;
    }

    await playHeaderIntro();
}

document.addEventListener('DOMContentLoaded', () => {
    void initHeader();
});

window.Header = {
    setAuthState: setHeaderAuthState,
    refresh: refreshHeaderAuthState,
    setActionsEnabled: setHeaderActionsEnabled,
    waitForIntroComplete,
    fadeOutChromeElement: fadeOutElement,
    fadeOutChromeElements,
    getLoginBlankFadeTargets,
    getLogoutBlankFadeTargets,
    prepareLogoutBlankHeaderFade,
    afterLoginBlankHeaderFade,
    fadeOutForLoginBlank,
    fadeOutHeaderForLogout,
    clearChromeFadeState,
    clearHeaderChromeFadeState,
    playSignedOutHeaderIntro,
    playSignedInHeaderIntro,
    revealHeaderIntroStatic
};
