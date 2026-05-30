(() => {
    const STORE_REVIEWS_URL =
        'https://chromewebstore.google.com/detail/authenticator-for-pc/ppkkcfblhfgmdmefkmkoomenhgecbemi/reviews';
    const SLIDE_MS = 320;
    const STAR_POP_MS = 220;
    const TYPE_TITLE_MS = 700;
    const TYPE_MESSAGE_MS = 2400;
    const MARKER_DRAW_MS = 520;
    const RATE_POP_MS = 200;
    const DISMISS_DELAY_MS = 5000;
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    const STORAGE_KEYS = {
        firstPopupAt: 'reviewPromptFirstPopupAt',
        openedAt: 'reviewPromptOpenedAt',
        dismissedAt: 'reviewPromptDismissedAt',
        lastShownAt: 'reviewPromptLastShownAt'
    };

    let isOpen = false;
    let closeTimerId = null;
    let sequenceGeneration = 0;
    let dismissTimerId = null;

    function getSection() {
        return document.querySelector('.review-prompt');
    }

    function waitForNextFrame() {
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });
    }

    function waitMs(ms) {
        return new Promise((resolve) => {
            window.setTimeout(resolve, ms);
        });
    }

    function getFullText(element) {
        return element?.dataset?.fullText ?? element?.textContent ?? '';
    }

    function readStorageTimestamp(value) {
        const parsed = Number(value);
        return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }

    async function getReviewPromptTimestamps() {
        if (typeof chrome === 'undefined' || !chrome.storage?.local) {
            return {
                firstPopupAt: null,
                openedAt: null,
                dismissedAt: null,
                lastShownAt: null
            };
        }

        const stored = await chrome.storage.local.get(Object.values(STORAGE_KEYS));

        return {
            firstPopupAt: readStorageTimestamp(stored[STORAGE_KEYS.firstPopupAt]),
            openedAt: readStorageTimestamp(stored[STORAGE_KEYS.openedAt]),
            dismissedAt: readStorageTimestamp(stored[STORAGE_KEYS.dismissedAt]),
            lastShownAt: readStorageTimestamp(stored[STORAGE_KEYS.lastShownAt])
        };
    }

    async function recordFirstPopupOpen() {
        if (typeof chrome === 'undefined' || !chrome.storage?.local) {
            return;
        }

        const stored = await chrome.storage.local.get([STORAGE_KEYS.firstPopupAt]);

        if (readStorageTimestamp(stored[STORAGE_KEYS.firstPopupAt])) {
            return;
        }

        await chrome.storage.local.set({
            [STORAGE_KEYS.firstPopupAt]: Date.now()
        });
    }

    async function markLastShownAt() {
        if (typeof chrome === 'undefined' || !chrome.storage?.local) {
            return;
        }

        await chrome.storage.local.set({
            [STORAGE_KEYS.lastShownAt]: Date.now()
        });
    }

    async function markOpenedAt() {
        if (typeof chrome === 'undefined' || !chrome.storage?.local) {
            return;
        }

        await chrome.storage.local.set({
            [STORAGE_KEYS.openedAt]: Date.now()
        });
    }

    async function markDismissedAt() {
        if (typeof chrome === 'undefined' || !chrome.storage?.local) {
            return;
        }

        await chrome.storage.local.set({
            [STORAGE_KEYS.dismissedAt]: Date.now()
        });
    }

    function hasElapsedSince(timestamp, ms) {
        return timestamp != null && Date.now() - timestamp >= ms;
    }

    async function hasSavedAccount() {
        const accounts = await window.AccountsStorage?.getAccountsAll?.() ?? [];
        return accounts.some((account) => account?.secret);
    }

    async function shouldShowReviewPrompt() {
        const timestamps = await getReviewPromptTimestamps();

        if (timestamps.openedAt != null) {
            return false;
        }

        await window.PopupResume?.whenReady?.();

        if (window.PopupResume?.getPending?.()) {
            return false;
        }

        if (typeof chrome === 'undefined' || !chrome.storage?.local) {
            return false;
        }

        const { accountNumber } = await chrome.storage.local.get(['accountNumber']);

        if (!accountNumber) {
            return false;
        }

        if (!(await hasSavedAccount())) {
            return false;
        }

        if (!hasElapsedSince(timestamps.firstPopupAt, SEVEN_DAYS_MS)) {
            return false;
        }

        if (timestamps.dismissedAt != null && !hasElapsedSince(timestamps.dismissedAt, SEVEN_DAYS_MS)) {
            return false;
        }

        return true;
    }

    function typeText(element, fullText, durationMs) {
        return new Promise((resolve) => {
            const characters = [...fullText];

            if (!element || !characters.length) {
                resolve();
                return;
            }

            element.textContent = '';
            element.classList.add('is-intro-typing');

            const stepMs = Math.max(12, durationMs / characters.length);
            let index = 0;

            const tick = () => {
                element.textContent += characters[index];
                index += 1;

                if (index < characters.length) {
                    window.setTimeout(tick, stepMs);
                } else {
                    element.classList.remove('is-intro-typing');
                    resolve();
                }
            };

            tick();
        });
    }

    async function popElement(element, popMs) {
        if (!element) {
            return;
        }

        element.classList.remove('is-seq-hidden');
        element.classList.add('is-pop-pending');
        await waitForNextFrame();
        element.classList.remove('is-pop-pending');
        element.classList.add('is-pop-active', 'is-seq-visible');
        await waitMs(popMs);
        element.classList.remove('is-pop-active');
    }

    async function popStarsInSequence(section) {
        const stars = section.querySelectorAll('.review-prompt__star');

        for (const star of stars) {
            await popElement(star, STAR_POP_MS);
        }
    }

    function revealElement(element) {
        if (!element) {
            return;
        }

        element.classList.remove('is-seq-hidden');
        element.classList.add('is-seq-visible');
    }

    function resetIntroSequence(section) {
        if (dismissTimerId != null) {
            window.clearTimeout(dismissTimerId);
            dismissTimerId = null;
        }

        section.classList.remove('is-sequence-running');

        const stars = section.querySelectorAll('.review-prompt__star');
        const titleLive = section.querySelector('.review-prompt__title-live');
        const messageLive = section.querySelector('.review-prompt__message-live');
        const parts = section.querySelectorAll('.review-prompt__message-part');
        const mark = section.querySelector('.review-prompt__mark');
        const markText = section.querySelector('.review-prompt__mark-text');
        const rate = section.querySelector('.review-prompt__rate');
        const dismiss = section.querySelector('.review-prompt__dismiss');

        stars.forEach((star) => {
            star.classList.add('is-seq-hidden');
            star.classList.remove('is-seq-visible', 'is-pop-pending', 'is-pop-active');
        });

        [titleLive, messageLive, rate, dismiss].forEach((node) => {
            if (!node) {
                return;
            }

            node.classList.add('is-seq-hidden');
            node.classList.remove(
                'is-seq-visible',
                'is-pop-pending',
                'is-pop-active',
                'is-intro-typing',
                'is-fade-in'
            );
        });

        parts.forEach((part) => {
            part.classList.remove('is-intro-typing');
            part.textContent = '';
        });

        if (titleLive) {
            titleLive.classList.remove('is-intro-typing');
            titleLive.textContent = '';
        }

        if (mark) {
            mark.classList.remove('is-marker-drawing', 'is-marker-drawn');
        }

        if (markText) {
            markText.textContent = '';
        }

        if (rate) {
            rate.classList.remove('is-pop-pending', 'is-pop-active');
        }
    }

    async function runIntroSequence(section) {
        const generation = ++sequenceGeneration;
        const isCurrent = () => generation === sequenceGeneration && isOpen;

        section.classList.add('is-sequence-running');
        resetIntroSequence(section);

        await waitMs(SLIDE_MS + 40);

        if (!isCurrent()) {
            return;
        }

        await popStarsInSequence(section);

        if (!isCurrent()) {
            return;
        }

        const titleLive = section.querySelector('.review-prompt__title-live');
        revealElement(titleLive);
        await typeText(titleLive, getFullText(titleLive), TYPE_TITLE_MS);

        if (!isCurrent()) {
            return;
        }

        const messageLive = section.querySelector('.review-prompt__message-live');
        const messageParts = messageLive?.querySelectorAll('.review-prompt__message-part') ?? [];
        const partBefore = messageParts[0];
        const partAfter = messageParts[1];
        const mark = section.querySelector('.review-prompt__mark');
        const markText = section.querySelector('.review-prompt__mark-text');

        revealElement(messageLive);
        messageLive.classList.add('is-intro-typing');

        if (partBefore) {
            partBefore.classList.add('is-intro-typing');
            await typeText(partBefore, getFullText(partBefore), TYPE_MESSAGE_MS * 0.12);
            partBefore.classList.remove('is-intro-typing');
        }

        if (!isCurrent()) {
            return;
        }

        if (markText) {
            markText.classList.add('is-intro-typing');
            await typeText(markText, getFullText(markText), TYPE_MESSAGE_MS * 0.38);
            markText.classList.remove('is-intro-typing');
        }

        if (!isCurrent()) {
            return;
        }

        if (partAfter) {
            partAfter.classList.add('is-intro-typing');
            await typeText(partAfter, getFullText(partAfter), TYPE_MESSAGE_MS * 0.5);
            partAfter.classList.remove('is-intro-typing');
        }

        messageLive.classList.remove('is-intro-typing');

        if (!isCurrent()) {
            return;
        }

        if (mark) {
            mark.classList.add('is-marker-drawing');
            await waitMs(MARKER_DRAW_MS);
            mark.classList.remove('is-marker-drawing');
            mark.classList.add('is-marker-drawn');
        }

        if (!isCurrent()) {
            return;
        }

        const rate = section.querySelector('.review-prompt__rate');
        await popElement(rate, RATE_POP_MS);

        if (!isCurrent()) {
            return;
        }

        dismissTimerId = window.setTimeout(() => {
            dismissTimerId = null;

            if (!isCurrent()) {
                return;
            }

            const dismiss = section.querySelector('.review-prompt__dismiss');

            if (!dismiss) {
                return;
            }

            dismiss.classList.remove('is-seq-hidden');
            dismiss.classList.add('is-fade-in');
        }, DISMISS_DELAY_MS);
    }

    async function openReviewPrompt() {
        const section = getSection();

        if (!section || isOpen) {
            return;
        }

        await markLastShownAt();

        isOpen = true;
        sequenceGeneration += 1;
        section.classList.remove('is-open', 'is-close-visible');
        section.setAttribute('aria-hidden', 'false');
        section.classList.add('is-active');
        resetIntroSequence(section);

        await waitForNextFrame();
        section.classList.add('is-open');

        void runIntroSequence(section);
    }

    function closeReviewPrompt() {
        const section = getSection();

        if (!section || !isOpen) {
            return;
        }

        isOpen = false;
        sequenceGeneration += 1;
        section.classList.remove('is-open', 'is-sequence-running');
        section.setAttribute('aria-hidden', 'true');
        resetIntroSequence(section);

        if (closeTimerId != null) {
            window.clearTimeout(closeTimerId);
        }

        closeTimerId = window.setTimeout(() => {
            section.classList.remove('is-active');
            closeTimerId = null;
        }, SLIDE_MS);
    }

    async function openStoreListing() {
        await markOpenedAt();
        window.open(STORE_REVIEWS_URL, '_blank', 'noopener,noreferrer');
        closeReviewPrompt();
    }

    async function dismissReviewPrompt() {
        await markDismissedAt();
        closeReviewPrompt();
    }

    function bindReviewPrompt() {
        const section = getSection();

        if (!section) {
            return;
        }

        const rateBtn = section.querySelector('.review-prompt__rate');
        const dismissBtn = section.querySelector('.review-prompt__dismiss');

        dismissBtn?.addEventListener('click', () => {
            void dismissReviewPrompt();
        });
        rateBtn?.addEventListener('click', () => {
            void openStoreListing();
        });
    }

    async function maybeShowOnInit() {
        await recordFirstPopupOpen();

        if (!(await shouldShowReviewPrompt())) {
            return;
        }

        await waitMs(80);
        await openReviewPrompt();
    }

    function initReviewPrompt() {
        bindReviewPrompt();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initReviewPrompt);
    } else {
        initReviewPrompt();
    }

    window.ReviewPrompt = {
        open: openReviewPrompt,
        close: closeReviewPrompt,
        maybeShowOnInit,
        shouldShowReviewPrompt,
        getStoreUrl() {
            return STORE_REVIEWS_URL;
        },
        STORAGE_KEYS
    };
})();
