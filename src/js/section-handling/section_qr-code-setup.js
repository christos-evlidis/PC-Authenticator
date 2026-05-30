(() => {
    const QR_SETUP_SECTION_SELECTOR = '.qr-setup-section';
    const QR_SETUP_BTN_SELECTOR = '.scan-qr-btn';
    const QR_SETUP_HEADER_SELECTOR = '.app-header';
    const QR_SETUP_CLOSE_BTN_SELECTOR = '.qr-setup-close-btn';
    const QR_SETUP_BACKDROP_SELECTOR = '.qr-setup-backdrop';
    const QR_SETUP_PANEL_SELECTOR = '.qr-setup-panel';
    const QR_SETUP_BODY_SELECTOR = '.qr-setup-body';
    const QR_SETUP_LOADING_SELECTOR = '.qr-setup-status--loading';
    const QR_SETUP_SUCCESS_SELECTOR = '.qr-setup-status--success';
    const QR_SETUP_ERROR_SELECTOR = '.qr-setup-status--error';
    const BLUR_TARGET_SELECTOR = '.extension-frame > .app-header';
    const BODY_BLUR_CLASS = 'is-user-menu-blurred';
    const BODY_AUTH_FLOW_LOCK_CLASS = 'is-auth-flow-locked';
    const QR_GUIDE_SELECTOR = '.qr-setup-guide';
    const QR_GUIDE_TEXT_SELECTOR = '.qr-setup-guide__text';
    const QR_GUIDE_SELECTION_TEXT = 'Drag your mouse over the QR code to select and scan it.';

    let qrSetupAnimationToken = 0;
    let isQrSequenceRunning = false;
    let isAwaitingPageSelection = false;

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
                if (settled) {
                    return;
                }

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

    function parseDurationMs(value, fallback) {
        if (!value) {
            return fallback;
        }

        const trimmed = value.trim();

        if (trimmed.endsWith('ms')) {
            return parseFloat(trimmed) || fallback;
        }

        if (trimmed.endsWith('s')) {
            return (parseFloat(trimmed) || fallback / 1000) * 1000;
        }

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

    function getLoginDotsFadeInMs() {
        return getCssDurationMs('--login-dots-fade-in-duration', 250);
    }

    function getLoginDotsFadeOutMs() {
        return getCssDurationMs('--login-dots-fade-out-duration', 250);
    }

    function getLoginDotsVisibleMs() {
        return getCssDurationMs('--login-dots-visible-duration', 2000);
    }

    function getLoginResultFadeInMs() {
        return getCssDurationMs('--login-result-fade-in-duration', 250);
    }

    function getLoginCheckFadeOutMs() {
        return getCssDurationMs('--login-check-fade-out-duration', 250);
    }

    function getLoginIconDrawTotalMs() {
        const drawMs = getCssDurationMs('--login-check-draw-duration', 500);
        return drawMs + drawMs * 0.45;
    }

    function bumpQrSetupAnimationToken() {
        qrSetupAnimationToken += 1;
        return qrSetupAnimationToken;
    }

    function isQrSetupAnimationCurrent(token) {
        return token === qrSetupAnimationToken;
    }

    function isAuthFlowLocked() {
        return document.body.classList.contains(BODY_AUTH_FLOW_LOCK_CLASS);
    }

    function setAuthFlowLock(isLocked) {
        document.body.classList.toggle(BODY_AUTH_FLOW_LOCK_CLASS, isLocked);
    }

    function getQrSetupSection() {
        return document.querySelector(QR_SETUP_SECTION_SELECTOR);
    }

    function getQrSetupPanel() {
        return document.querySelector(QR_SETUP_PANEL_SELECTOR);
    }

    function getQrSetupBody() {
        return document.querySelector(QR_SETUP_BODY_SELECTOR);
    }

    function getBlurTarget() {
        return document.querySelector(BLUR_TARGET_SELECTOR);
    }

    function isQrSetupActive() {
        return getQrSetupSection()?.classList.contains('is-active') ?? false;
    }

    function getQrSetupButtons() {
        return document.querySelectorAll(QR_SETUP_BTN_SELECTOR);
    }

    function setQrSetupButtonsActive(isActive) {
        getQrSetupButtons().forEach((btn) => {
            btn.classList.toggle('is-active', isActive);
        });
    }

    function setQrSetupCloseEnabled(isEnabled) {
        const closeBtn = document.querySelector(QR_SETUP_CLOSE_BTN_SELECTOR);

        if (!closeBtn) {
            return;
        }

        closeBtn.disabled = !isEnabled;
        closeBtn.setAttribute('aria-disabled', String(!isEnabled));
    }

    function getQrSetupGuide() {
        return document.querySelector(QR_GUIDE_SELECTOR);
    }

    function setGuideText(text) {
        const guideText = document.querySelector(QR_GUIDE_TEXT_SELECTOR);

        if (guideText) {
            guideText.textContent = text;
        }
    }

    function setGuideCopyVisible(isVisible) {
        document.querySelector(QR_GUIDE_TEXT_SELECTOR)?.classList.toggle('hidden', !isVisible);
    }

    function setGuideStatusActive(isActive) {
        getQrSetupGuide()?.classList.toggle('is-status-active', isActive);
    }

    function resetGuideStatusUi() {
        const setupBody = getQrSetupBody();

        setGuideStatusActive(false);
        setupBody?.classList.remove('is-loader-active');
        setGuideCopyVisible(true);
        hideStatusIcon(QR_SETUP_LOADING_SELECTOR);
        hideStatusIcon(QR_SETUP_SUCCESS_SELECTOR);
        hideStatusIcon(QR_SETUP_ERROR_SELECTOR);
    }

    function resetQrSetupPanelChrome(panel, setupBody) {
        panel?.classList.remove(
            'is-fading-setup-ui',
            'is-setup-flow',
            'is-chrome-hidden',
            'is-chrome-preparing',
            'is-chrome-visible',
            'is-panel-immersive'
        );
        setupBody?.classList.remove('is-expanded', 'is-loader-active');
        resetGuideStatusUi();
    }

    function prepareQrSetupChromeForReveal() {
        const panel = getQrSetupPanel();
        const setupBody = getQrSetupBody();

        resetQrSetupPanelChrome(panel, setupBody);
        setGuideText(QR_GUIDE_SELECTION_TEXT);
        isAwaitingPageSelection = false;
    }

    function queryQrStatus(selector) {
        return getQrSetupSection()?.querySelector(selector) ?? null;
    }

    function beginQrAddProcessingLayout() {
        const section = getQrSetupSection();
        const panel = getQrSetupPanel();

        section?.classList.remove('is-instant-open');
        void panel?.offsetWidth;

        setGuideCopyVisible(false);
        setGuideStatusActive(true);
        panel?.classList.remove('is-fading-setup-ui');
    }

    async function closeQrSetupAfterSequence() {
        const section = getQrSetupSection();
        const panel = getQrSetupPanel();

        section?.classList.remove('is-instant-open');
        void panel?.offsetWidth;

        isQrSequenceRunning = false;
        setAuthFlowLock(false);
        await closeQrSetup();
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
        const icon = queryQrStatus(selector);

        if (!icon) {
            return;
        }

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
                if (settled) {
                    return;
                }

                settled = true;
                targets.forEach((el) => el.removeEventListener('animationend', onAnimationEnd));
                clearTimeout(fallbackId);
                resolve();
            };

            const onAnimationEnd = (event) => {
                if (!icon.contains(event.target)) {
                    return;
                }

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
            .catch((error) => ({ success: false, error }));

        setupBody.classList.add('is-loader-active');
        await fadeInStatus(loader);
        await delay(getLoginDotsVisibleMs());

        const result = await apiOutcome;

        await fadeOutStatus(loader);
        setupBody.classList.remove('is-loader-active');

        return result;
    }

    async function playResultIcon(selector) {
        const icon = queryQrStatus(selector);

        if (!icon) {
            return;
        }

        const otherSelector = selector === QR_SETUP_SUCCESS_SELECTOR
            ? QR_SETUP_ERROR_SELECTOR
            : QR_SETUP_SUCCESS_SELECTOR;

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

    async function playQrOutcomeSequence(loader, setupBody, apiPromise) {
        const apiResult = await runLoaderPhase(loader, setupBody, apiPromise);
        const resultSelector = apiResult.success
            ? QR_SETUP_SUCCESS_SELECTOR
            : QR_SETUP_ERROR_SELECTOR;

        await playResultIcon(resultSelector);

        return apiResult;
    }

    async function closeOtherOverlays() {
        if (window.UserMenu?.isActive?.()) {
            await window.UserMenu.close();
        }

        if (window.ManualSetup?.isActive?.()) {
            await window.ManualSetup.close();
        }
    }

    function openQrSetupInstant() {
        const section = getQrSetupSection();

        if (!section) {
            return false;
        }

        prepareQrSetupChromeForReveal();
        section.classList.add('is-active', 'is-panel-open', 'is-instant-open');
        document.body.classList.add(BODY_BLUR_CLASS);
        setQrSetupButtonsActive(true);
        setQrSetupCloseEnabled(false);

        return true;
    }

    async function openQrSetup() {
        if (isAuthFlowLocked()) {
            return false;
        }

        const section = getQrSetupSection();
        const blurTarget = getBlurTarget();

        if (!section || isQrSetupActive()) {
            return true;
        }

        await closeOtherOverlays();

        const token = bumpQrSetupAnimationToken();

        prepareQrSetupChromeForReveal();
        section.classList.remove('is-instant-open');
        section.classList.add('is-active');
        document.body.classList.add(BODY_BLUR_CLASS);
        setQrSetupButtonsActive(true);
        setQrSetupCloseEnabled(false);

        void blurTarget?.offsetWidth;
        await waitForTransitionEnd(blurTarget, 'filter', getBlurDurationMs() + 16);

        if (!isQrSetupAnimationCurrent(token)) {
            return false;
        }

        section.classList.add('is-panel-open');
        await waitForTransitionEnd(getQrSetupPanel(), 'transform', getSlideDurationMs() + 16);

        return isQrSetupAnimationCurrent(token);
    }

    async function cancelPageSelection() {
        if (!isAwaitingPageSelection) {
            return;
        }

        isAwaitingPageSelection = false;

        try {
            await sendRuntimeMessage({ action: 'cancelQrScan' });
        } catch {
            // Ignore cancel failures when the tab overlay is already gone.
        }
    }

    async function closeQrSetup(options = {}) {
        const { force = false } = options;

        if (!force && (isAuthFlowLocked() || isQrSequenceRunning || isAwaitingPageSelection)) {
            return;
        }

        const section = getQrSetupSection();
        const panel = getQrSetupPanel();
        const blurTarget = getBlurTarget();

        if (!section || !isQrSetupActive()) {
            return;
        }

        await cancelPageSelection();

        const token = bumpQrSetupAnimationToken();
        const instantClose = section.classList.contains('is-instant-open');

        section.classList.remove('is-panel-open');

        if (!instantClose) {
            await waitForTransitionEnd(panel, 'transform', getSlideDurationMs() + 16);
        }

        if (!isQrSetupAnimationCurrent(token)) {
            return;
        }

        document.body.classList.remove(BODY_BLUR_CLASS);

        if (!instantClose) {
            await waitForTransitionEnd(blurTarget, 'filter', getBlurDurationMs() + 16);
        }

        if (!isQrSetupAnimationCurrent(token)) {
            return;
        }

        section.classList.remove('is-active', 'is-panel-open', 'is-instant-open');
        setQrSetupButtonsActive(false);
        setQrSetupCloseEnabled(true);
        prepareQrSetupChromeForReveal();
    }

    function sendRuntimeMessage(message) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, (response) => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }

                resolve(response);
            });
        });
    }

    async function getPendingQrScan() {
        const response = await sendRuntimeMessage({ action: 'getQrScanPending' });
        return response ?? null;
    }

    async function clearPendingQrScan() {
        await sendRuntimeMessage({ action: 'clearQrScanPending' });
    }

    async function createQrAddPromise(accountNumber, otpauthUri) {
        return window.AccountsStorage.handleQrAdd(accountNumber, otpauthUri);
    }

    async function playQrAddSequence(otpauthUri, options = {}) {
        const { instantOpen = false } = options;

        if (isQrSequenceRunning) {
            return { success: false };
        }

        const panel = getQrSetupPanel();
        const setupBody = getQrSetupBody();
        const loader = queryQrStatus(QR_SETUP_LOADING_SELECTOR);
        const { accountNumber } = await chrome.storage.local.get(['accountNumber']);

        if (!panel || !setupBody || !loader || !accountNumber) {
            return { success: false, error: new Error('Sign in to add accounts.') };
        }

        isQrSequenceRunning = true;
        isAwaitingPageSelection = false;
        setAuthFlowLock(true);

        let succeeded = false;

        try {
            if (instantOpen) {
                openQrSetupInstant();
            } else {
                await openQrSetup();
            }

            beginQrAddProcessingLayout();

            const apiResult = await playQrOutcomeSequence(
                loader,
                setupBody,
                createQrAddPromise(accountNumber, otpauthUri)
            );

            await closeQrSetupAfterSequence();

            if (apiResult.success) {
                const addedAccount = apiResult.value;

                await window.Codes?.animateManualAccountAdd?.(addedAccount);
                succeeded = true;

                try {
                    await window.AccountsStorage.handleSync(accountNumber);
                } catch (error) {
                    console.error('Cloud backup failed after QR account add:', error);
                    await window.Codes?.render?.();
                }

                return { success: true, value: addedAccount };
            }

            return { success: false, error: apiResult.error };
        } finally {
            if (!succeeded) {
                isQrSequenceRunning = false;
                setAuthFlowLock(false);
            }
        }
    }

    async function showScanError(options = {}) {
        const { instantOpen = false } = options;
        const setupBody = getQrSetupBody();
        const loader = queryQrStatus(QR_SETUP_LOADING_SELECTOR);

        if (!setupBody || !loader) {
            return;
        }

        isQrSequenceRunning = true;
        setAuthFlowLock(true);

        try {
            if (instantOpen) {
                openQrSetupInstant();
            } else {
                await openQrSetup();
            }

            beginQrAddProcessingLayout();

            await playQrOutcomeSequence(
                loader,
                setupBody,
                Promise.reject(new Error('QR scan failed'))
            );
            await closeQrSetupAfterSequence();
        } finally {
            isQrSequenceRunning = false;
            setAuthFlowLock(false);
        }
    }

    async function processPendingQrScan(options = {}) {
        const { instantOpen = false } = options;

        if (isQrSequenceRunning) {
            return;
        }

        const pending = window.PopupResume?.getPending?.() ?? await getPendingQrScan();

        if (!pending) {
            return;
        }

        await clearPendingQrScan();
        if (window.PopupResume) {
            window.PopupResume.pending = null;
            window.PopupResume.skipIntro = false;
            document.documentElement.classList.remove('is-popup-qr-resume');
        }
        isAwaitingPageSelection = false;

        if (pending.status === 'ready' && pending.uri) {
            await playQrAddSequence(pending.uri, { instantOpen });
            return;
        }

        if (pending.status === 'error') {
            await showScanError({ instantOpen });
        }
    }

    async function startQrScan() {
        if (isAuthFlowLocked() || isQrSequenceRunning) {
            return;
        }

        const { accountNumber } = await chrome.storage.local.get(['accountNumber']);

        if (!accountNumber) {
            await showScanError();
            return;
        }

        const opened = await openQrSetup();

        if (!opened) {
            return;
        }

        isAwaitingPageSelection = true;
        setGuideText(QR_GUIDE_SELECTION_TEXT);

        try {
            const response = await sendRuntimeMessage({ action: 'startQrScan' });

            if (!response?.success) {
                isAwaitingPageSelection = false;
                throw new Error(response?.error || 'Could not start QR scan.');
            }
        } catch (error) {
            isAwaitingPageSelection = false;
            await showScanError();
        }
    }

    function handleQrSetupOpenClick(event) {
        const openBtn = event.target.closest(QR_SETUP_BTN_SELECTOR);

        if (!openBtn) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (isQrSetupActive()) {
            if (!isAwaitingPageSelection && !isQrSequenceRunning) {
                closeQrSetup();
            }

            return;
        }

        startQrScan();
    }

    function handleQrScanCancelled() {
        isAwaitingPageSelection = false;
        setQrSetupCloseEnabled(true);
        setGuideText('Scan cancelled. Tap the QR button to try again.');
    }

    function initQrCodeSetup() {
        const header = document.querySelector(QR_SETUP_HEADER_SELECTOR);
        const closeBtn = document.querySelector(QR_SETUP_CLOSE_BTN_SELECTOR);
        const backdrop = document.querySelector(QR_SETUP_BACKDROP_SELECTOR);
        const panel = getQrSetupPanel();

        chrome.runtime.onMessage.addListener((message) => {
            if (message.action === 'qrScanCancelled') {
                handleQrScanCancelled();
            }
        });

        header?.addEventListener('click', handleQrSetupOpenClick);

        closeBtn?.addEventListener('click', (event) => {
            event.stopPropagation();

            if (closeBtn.disabled) {
                return;
            }

            closeQrSetup();
        });

        backdrop?.addEventListener('click', () => {
            if (isAwaitingPageSelection) {
                return;
            }

            closeQrSetup();
        });

        panel?.addEventListener('click', (event) => {
            event.stopPropagation();
        });

    }

    document.addEventListener('DOMContentLoaded', initQrCodeSetup);

    window.QrCodeSetup = {
        open: openQrSetup,
        close: closeQrSetup,
        startScan: startQrScan,
        processPendingScan: processPendingQrScan,
        isActive: isQrSetupActive,
        isRunning: () => isQrSequenceRunning || isAwaitingPageSelection
    };
})();
