(() => {
    const MANUAL_SETUP_SECTION_SELECTOR = '.manual-setup-section';
    const MANUAL_SETUP_BTN_SELECTOR = '.manual-setup-btn';
    const MANUAL_SETUP_HEADER_SELECTOR = '.app-header';
    const MANUAL_SETUP_CLOSE_BTN_SELECTOR = '.manual-setup-close-btn';
    const MANUAL_SETUP_BACKDROP_SELECTOR = '.manual-setup-backdrop';
    const MANUAL_SETUP_PANEL_SELECTOR = '.manual-setup-panel';
    const MANUAL_SETUP_BODY_SELECTOR = '.manual-setup-body';
    const MANUAL_SETUP_FORM_SELECTOR = '.manual-setup-form';
    const MANUAL_SETUP_LOADING_SELECTOR = '.manual-setup-status--loading';
    const MANUAL_SETUP_SUCCESS_SELECTOR = '.manual-setup-status--success';
    const MANUAL_SETUP_ERROR_SELECTOR = '.manual-setup-status--error';
    const BLUR_TARGET_SELECTOR = '.extension-frame > .app-header';
    const BODY_BLUR_CLASS = 'is-user-menu-blurred';
    const BODY_AUTH_FLOW_LOCK_CLASS = 'is-auth-flow-locked';

    let manualSetupAnimationToken = 0;
    let isAddAccountSequenceRunning = false;

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

    function getLoginUiFadeMs() {
        return getCssDurationMs('--login-ui-fade-duration', 350);
    }

    function getLoginBodyExpandMs() {
        return getCssDurationMs('--login-body-expand-duration', 250);
    }

    function getLoginPanelImmersiveMs() {
        return getCssDurationMs('--login-panel-immersive-duration', 250);
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

    function getLoginCheckFadeOutMs() {
        return getCssDurationMs('--login-check-fade-out-duration', 250);
    }

    function getLoginIconDrawTotalMs() {
        const drawMs = getLoginCheckDrawMs();
        return drawMs + drawMs * 0.45;
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

    function bumpManualSetupAnimationToken() {
        manualSetupAnimationToken += 1;
        return manualSetupAnimationToken;
    }

    function isManualSetupAnimationCurrent(token) {
        return token === manualSetupAnimationToken;
    }

    function isAuthFlowLocked() {
        return document.body.classList.contains(BODY_AUTH_FLOW_LOCK_CLASS);
    }

    function setAuthFlowLock(isLocked) {
        document.body.classList.toggle(BODY_AUTH_FLOW_LOCK_CLASS, isLocked);
    }

    function getManualSetupSection() {
        return document.querySelector(MANUAL_SETUP_SECTION_SELECTOR);
    }

    function getManualSetupPanel() {
        return document.querySelector(MANUAL_SETUP_PANEL_SELECTOR);
    }

    function getManualSetupBody() {
        return document.querySelector(MANUAL_SETUP_BODY_SELECTOR);
    }

    function getManualSetupForm() {
        return document.querySelector(MANUAL_SETUP_FORM_SELECTOR);
    }

    function getBlurTarget() {
        return document.querySelector(BLUR_TARGET_SELECTOR);
    }

    function isManualSetupActive() {
        return getManualSetupSection()?.classList.contains('is-active') ?? false;
    }

    function getManualSetupButtons() {
        return document.querySelectorAll(MANUAL_SETUP_BTN_SELECTOR);
    }

    function setManualSetupButtonsActive(isActive) {
        getManualSetupButtons().forEach((btn) => {
            btn.classList.toggle('is-active', isActive);
        });
    }

    function cancelStatusAnimations(element) {
        element.getAnimations().forEach((animation) => animation.cancel());
    }

    function getStatusFadeInMs(element) {
        if (element?.classList.contains('login-status--loading')) {
            return getLoginDotsFadeInMs();
        }

        return getLoginResultFadeInMs();
    }

    function getStatusFadeOutMs(element) {
        if (element?.classList.contains('login-status--loading')) {
            return getLoginDotsFadeOutMs();
        }

        return getLoginCheckFadeOutMs();
    }

    function hideStatusIcon(selector) {
        const icon = document.querySelector(selector);
        if (!icon) return;

        icon.classList.add('hidden');
        icon.classList.remove('is-shown', 'is-hiding', 'is-animating', 'is-drawn');
    }

    async function fadeInStatus(element) {
        const durationMs = getStatusFadeInMs(element);

        element.classList.remove('hidden', 'is-hiding');
        void element.offsetWidth;
        element.classList.add('is-shown');
        await waitForTransitionEnd(element, 'opacity', durationMs + 32);
    }

    async function fadeOutStatus(element) {
        const durationMs = getStatusFadeOutMs(element);

        element.classList.add('is-hiding');
        element.classList.remove('is-shown');
        await waitForTransitionEnd(element, 'opacity', durationMs + 32);
        element.classList.remove('is-hiding', 'is-animating', 'is-drawn');
        element.classList.add('hidden');
    }

    function waitForIconDraw(icon) {
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

    async function runLoaderPhase(loader, setupBody, apiPromise) {
        const apiOutcome = apiPromise
            .then((value) => ({ success: true, value }))
            .catch(() => ({ success: false, value: null }));

        setupBody.classList.add('is-loader-active');
        await fadeInStatus(loader);
        await delay(getLoginDotsVisibleMs());

        const result = await apiOutcome;

        await fadeOutStatus(loader);
        setupBody.classList.remove('is-loader-active');

        return result;
    }

    async function playResultIcon(selector) {
        const icon = document.querySelector(selector);
        if (!icon) return;

        const otherSelector = selector === MANUAL_SETUP_SUCCESS_SELECTOR
            ? MANUAL_SETUP_ERROR_SELECTOR
            : MANUAL_SETUP_SUCCESS_SELECTOR;
        hideStatusIcon(otherSelector);

        icon.classList.remove('is-animating', 'is-hiding', 'is-drawn');
        await fadeInStatus(icon);

        icon.classList.add('is-animating');
        await waitForIconDraw(icon);

        icon.classList.remove('is-animating');
        icon.classList.add('is-drawn');
        cancelStatusAnimations(icon);
        await fadeOutStatus(icon);
    }

    async function shrinkSetupBody(panel, setupBody) {
        setupBody.classList.remove('is-expanded');
        void setupBody.offsetWidth;
        await waitForTransitionEnd(setupBody, 'margin-top', getLoginBodyExpandMs() + 16);
        panel.classList.remove('is-setup-flow');
    }

    async function revealSetupChrome() {
        const panel = getManualSetupPanel();
        const header = document.querySelector('.manual-setup-header');
        const content = document.querySelector('.manual-setup-body__content');

        panel?.classList.remove('is-chrome-hidden');
        panel?.classList.add('is-chrome-preparing');
        void panel?.offsetWidth;
        panel?.classList.add('is-chrome-visible');

        const fadeWaitMs = getLoginUiFadeMs() + 16;
        await Promise.all([
            waitForTransitionEnd(header, 'opacity', fadeWaitMs),
            waitForTransitionEnd(content, 'opacity', fadeWaitMs)
        ]);

        panel?.classList.remove('is-chrome-preparing', 'is-chrome-visible');
    }

    async function resetAddAccountSequence() {
        const panel = getManualSetupPanel();
        const setupBody = getManualSetupBody();
        const loader = document.querySelector(MANUAL_SETUP_LOADING_SELECTOR);

        panel?.classList.remove(
            'is-fading-setup-ui',
            'is-setup-flow',
            'is-chrome-hidden',
            'is-chrome-preparing',
            'is-chrome-visible',
            'is-panel-immersive'
        );
        setupBody?.classList.remove('is-expanded', 'is-loader-active');
        loader?.classList.add('hidden');
        loader?.classList.remove('is-shown', 'is-hiding');
        hideStatusIcon(MANUAL_SETUP_SUCCESS_SELECTOR);
        hideStatusIcon(MANUAL_SETUP_ERROR_SELECTOR);

        isAddAccountSequenceRunning = false;
        setAuthFlowLock(false);
        setSubmitDisabled(false);
    }

    function getFormSnapshot(form) {
        const data = new FormData(form);
        return {
            name: String(data.get('name') ?? ''),
            email: String(data.get('email') ?? ''),
            secret: String(data.get('secret') ?? '')
        };
    }

    function restoreFormSnapshot(form, snapshot) {
        const nameInput = form.querySelector('[name="name"]');
        const emailInput = form.querySelector('[name="email"]');
        const secretInput = form.querySelector('[name="secret"]');

        if (nameInput) nameInput.value = snapshot.name;
        if (emailInput) emailInput.value = snapshot.email;
        if (secretInput) secretInput.value = snapshot.secret;
    }

    function clearForm(form) {
        form.reset();
    }

    function prepareManualSetupChromeForReveal(form, formSnapshot = null) {
        if (formSnapshot) {
            restoreFormSnapshot(form, formSnapshot);
        } else {
            clearForm(form);
        }

        isAddAccountSequenceRunning = false;
        setAuthFlowLock(false);
        setSubmitDisabled(false);
    }

    function setSubmitDisabled(isDisabled) {
        const submit = getManualSetupForm()?.querySelector('.manual-setup-form__submit');

        if (submit) {
            submit.disabled = isDisabled;
        }
    }

    function createAddAccountPromise(formData) {
        return saveManualAccountToLocal(formData);
    }

    async function saveManualAccountToLocal(formData) {
        const { accountNumber } = await chrome.storage.local.get(['accountNumber']);

        if (!accountNumber) {
            throw new Error('Sign in to add accounts.');
        }

        const parsed = window.AccountsOtpauth.parseManualAccountInput(formData);
        const account = window.AccountsStorage.buildAccountRecord(parsed);

        await window.AccountsStorage.appendAccountUnencrypted(account);

        return account;
    }

    async function playAddAccountSequence(apiPromise, formSnapshot) {
        if (isAddAccountSequenceRunning) {
            apiPromise.catch(() => {});
            return { success: false };
        }

        const panel = getManualSetupPanel();
        const setupBody = getManualSetupBody();
        const loader = document.querySelector(MANUAL_SETUP_LOADING_SELECTOR);
        const form = getManualSetupForm();

        if (!panel || !setupBody || !loader || !form) {
            apiPromise.catch(() => {});
            return { success: false };
        }

        isAddAccountSequenceRunning = true;
        setAuthFlowLock(true);
        setSubmitDisabled(true);

        let succeeded = false;

        try {
            panel.classList.add('is-fading-setup-ui');
            await delay(getLoginUiFadeMs());

            panel.classList.remove('is-fading-setup-ui');
            void setupBody.offsetWidth;
            panel.classList.add('is-setup-flow', 'is-chrome-hidden');
            setupBody.classList.add('is-expanded');
            await waitForTransitionEnd(setupBody, 'margin-top', getLoginBodyExpandMs() + 16);

            await enterPanelImmersive(panel);

            const apiResult = await runLoaderPhase(loader, setupBody, apiPromise);

            if (apiResult.success) {
                const addedAccount = apiResult.value;

                await playResultIcon(MANUAL_SETUP_SUCCESS_SELECTOR);

                await exitPanelImmersive(panel);
                await shrinkSetupBody(panel, setupBody);
                prepareManualSetupChromeForReveal(form);
                await revealSetupChrome();

                await window.Codes?.animateManualAccountAdd?.(addedAccount);
                succeeded = true;

                const { accountNumber } = await chrome.storage.local.get(['accountNumber']);

                try {
                    await window.AccountsStorage.handleSync(accountNumber);
                } catch (error) {
                    console.error('Cloud backup failed after manual account add:', error);
                    await window.Codes?.render?.();
                }

                return apiResult;
            }

            await playResultIcon(MANUAL_SETUP_ERROR_SELECTOR);
            await exitPanelImmersive(panel);
            await shrinkSetupBody(panel, setupBody);
            prepareManualSetupChromeForReveal(form, formSnapshot);
            await revealSetupChrome();
            return apiResult;
        } finally {
            isAddAccountSequenceRunning = false;
            setAuthFlowLock(false);
            setSubmitDisabled(false);

            if (!succeeded) {
                panel.classList.remove(
                    'is-fading-setup-ui',
                    'is-chrome-hidden',
                    'is-chrome-preparing',
                    'is-chrome-visible',
                    'is-panel-immersive'
                );
            }
        }
    }

    async function closeOtherOverlays() {
        if (window.UserMenu?.isActive?.()) {
            await window.UserMenu.close();
        }

        if (window.QrCodeSetup?.isActive?.()) {
            await window.QrCodeSetup.close();
        }
    }

    async function openManualSetup() {
        if (isAuthFlowLocked()) return;

        const section = getManualSetupSection();
        const blurTarget = getBlurTarget();
        if (!section || isManualSetupActive()) return;

        await closeOtherOverlays();

        const token = bumpManualSetupAnimationToken();

        section.classList.add('is-active');
        document.body.classList.add(BODY_BLUR_CLASS);
        setManualSetupButtonsActive(true);

        void blurTarget?.offsetWidth;
        await waitForTransitionEnd(blurTarget, 'filter', getBlurDurationMs() + 16);

        if (!isManualSetupAnimationCurrent(token)) return;

        section.classList.add('is-panel-open');
        await waitForTransitionEnd(getManualSetupPanel(), 'transform', getSlideDurationMs() + 16);
    }

    async function closeManualSetup() {
        if (isAuthFlowLocked() || isAddAccountSequenceRunning) return;

        const section = getManualSetupSection();
        const panel = getManualSetupPanel();
        const blurTarget = getBlurTarget();
        if (!section || !isManualSetupActive()) return;

        const token = bumpManualSetupAnimationToken();

        section.classList.remove('is-panel-open');
        await waitForTransitionEnd(panel, 'transform', getSlideDurationMs() + 16);

        if (!isManualSetupAnimationCurrent(token)) return;

        document.body.classList.remove(BODY_BLUR_CLASS);
        await waitForTransitionEnd(blurTarget, 'filter', getBlurDurationMs() + 16);

        if (!isManualSetupAnimationCurrent(token)) return;

        section.classList.remove('is-active');
        setManualSetupButtonsActive(false);
    }

    function toggleManualSetup() {
        if (isAuthFlowLocked()) return;

        if (isManualSetupActive()) {
            closeManualSetup();
        } else {
            openManualSetup();
        }
    }

    function handleManualSetupOpenClick(event) {
        const openBtn = event.target.closest(MANUAL_SETUP_BTN_SELECTOR);
        if (!openBtn) return;

        event.preventDefault();
        event.stopPropagation();
        toggleManualSetup();
    }

    async function handleManualSetupSubmit(event) {
        event.preventDefault();

        if (isAuthFlowLocked() || isAddAccountSequenceRunning) return;

        const form = event.currentTarget;
        const snapshot = getFormSnapshot(form);
        const apiPromise = createAddAccountPromise(snapshot);

        try {
            await playAddAccountSequence(apiPromise, snapshot);
        } catch {
            await resetAddAccountSequence();
            restoreFormSnapshot(form, snapshot);
        }
    }

    function initManualSetup() {
        const header = document.querySelector(MANUAL_SETUP_HEADER_SELECTOR);
        const closeBtn = document.querySelector(MANUAL_SETUP_CLOSE_BTN_SELECTOR);
        const backdrop = document.querySelector(MANUAL_SETUP_BACKDROP_SELECTOR);
        const panel = getManualSetupPanel();
        const form = getManualSetupForm();

        header?.addEventListener('click', handleManualSetupOpenClick);

        closeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            closeManualSetup();
        });

        backdrop?.addEventListener('click', closeManualSetup);

        panel?.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        form?.addEventListener('submit', handleManualSetupSubmit);
    }

    document.addEventListener('DOMContentLoaded', initManualSetup);

    window.ManualSetup = {
        open: openManualSetup,
        close: closeManualSetup,
        toggle: toggleManualSetup,
        isActive: isManualSetupActive
    };
})();
