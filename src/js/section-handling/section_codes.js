(function () {
    const PIE_CENTER = 16;
    const PIE_ARC_RADIUS = 15;
    const TIMER_INVERTED_KEY = 'timerInverted';

    const SELECTORS = {
        section: '.codes-section',
        empty: '.codes-section__empty',
        list: '.codes-section__list',
        template: '.code-card-template'
    };

    const EMAIL_PLACEHOLDER = 'placeholder@example.com';
    const DEFAULT_CONTACT = 'user@example.com';
    const DELETE_SLIDE_MS = 280;
    const CODE_CARD_SLIDE_MS = 150;
    const CODE_INTRO_SLIDE_MS = 250;
    const CODE_INTRO_STAGGER_MS = 225;
    const EMPTY_ICON_POP_MS = 250;
    const EMPTY_TYPE_MS = 1000;
    const LIST_WHEEL_COOLDOWN_MS = 380;

    let shouldPlayCodesIntro = true;
    let pendingPostLoginReveal = null;

    let tickIntervalId = null;
    let cardRoots = [];
    let globalTimerInverted = false;
    let globalLastTimerPeriod = null;
    let headerLockedForEdit = false;
    let headerLockedForDelete = false;

    function updateHeaderActionsLock() {
        const locked = headerLockedForEdit || headerLockedForDelete;
        window.Header?.setActionsEnabled?.(!locked);
    }

    function setEditHeaderLock(locked) {
        headerLockedForEdit = locked;
        updateHeaderActionsLock();
    }

    function setDeleteHeaderLock(locked) {
        headerLockedForDelete = locked;
        updateHeaderActionsLock();
    }

    const otpauth = () => window.AccountsOtpauth;

    function buildPiePath(angle) {
        if (angle <= 0) {
            return '';
        }

        if (angle >= 360) {
            return `M${PIE_CENTER} ${PIE_CENTER} L${PIE_CENTER} ${PIE_CENTER - PIE_ARC_RADIUS} A${PIE_ARC_RADIUS} ${PIE_ARC_RADIUS} 0 1 1 ${PIE_CENTER} ${PIE_CENTER + PIE_ARC_RADIUS} A${PIE_ARC_RADIUS} ${PIE_ARC_RADIUS} 0 1 1 ${PIE_CENTER} ${PIE_CENTER - PIE_ARC_RADIUS} Z`;
        }

        const startAngle = -90;
        const endAngle = startAngle + angle;
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const startX = PIE_CENTER + Math.cos(startRad) * PIE_ARC_RADIUS;
        const startY = PIE_CENTER + Math.sin(startRad) * PIE_ARC_RADIUS;
        const endX = PIE_CENTER + Math.cos(endRad) * PIE_ARC_RADIUS;
        const endY = PIE_CENTER + Math.sin(endRad) * PIE_ARC_RADIUS;

        if (angle < 180) {
            return `M${PIE_CENTER} ${PIE_CENTER} L${startX} ${startY} A${PIE_ARC_RADIUS} ${PIE_ARC_RADIUS} 0 0 1 ${endX} ${endY} Z`;
        }

        if (angle === 180) {
            return `M${PIE_CENTER} ${PIE_CENTER} L${startX} ${startY} A${PIE_ARC_RADIUS} ${PIE_ARC_RADIUS} 0 0 1 ${endX} ${endY} Z`;
        }

        const midAngle = startAngle + 180;
        const midRad = (midAngle * Math.PI) / 180;
        const midX = PIE_CENTER + Math.cos(midRad) * PIE_ARC_RADIUS;
        const midY = PIE_CENTER + Math.sin(midRad) * PIE_ARC_RADIUS;

        return `M${PIE_CENTER} ${PIE_CENTER} L${startX} ${startY} A${PIE_ARC_RADIUS} ${PIE_ARC_RADIUS} 0 1 1 ${midX} ${midY} A${PIE_ARC_RADIUS} ${PIE_ARC_RADIUS} 0 0 1 ${endX} ${endY} Z`;
    }

    function applyTimerInvertedClass(timerEl, inverted) {
        timerEl?.classList.toggle('inverted', Boolean(inverted));
    }

    async function loadTimerInvertedPreference() {
        try {
            const stored = await chrome.storage.local.get([TIMER_INVERTED_KEY]);
            globalTimerInverted = Boolean(stored[TIMER_INVERTED_KEY]);
        } catch {
            globalTimerInverted = false;
        }
    }

    async function saveTimerInvertedPreference(inverted) {
        globalTimerInverted = inverted;

        try {
            await chrome.storage.local.set({ [TIMER_INVERTED_KEY]: inverted });
        } catch {
            // ignore persistence errors
        }
    }

    function getElements() {
        return {
            empty: document.querySelector(SELECTORS.empty),
            list: document.querySelector(SELECTORS.list),
            template: document.querySelector(SELECTORS.template)
        };
    }

    function clearTickers() {
        if (tickIntervalId != null) {
            clearInterval(tickIntervalId);
            tickIntervalId = null;
        }

    }

    function stopTicker() {
        clearTickers();
        cardRoots = [];
    }

    function hasTotpCards() {
        return cardRoots.some((root) => otpauth().isTotpAccount(root.account));
    }

    function getFirstTotpRoot() {
        return cardRoots.find((root) => otpauth().isTotpAccount(root.account)) ?? null;
    }

    function updateAccountCode(root) {
        const { account, els, card } = root;
        const otpOptions = otpauth().getAccountOtpOptions(account);
        const otp = otpauth().generateOTP(account.secret, otpOptions);

        if (els.code) {
            const digits = otpOptions.digits;
            els.code.textContent = (otp && otp.length === digits)
                ? otp
                : '-'.repeat(digits);
            card.classList.toggle('account-block--invalid', !otp);
        }
    }

    function runSecondTick() {
        let rolloverClock = null;

        for (const root of cardRoots) {
            if (otpauth().isHotpAccount(root.account)) {
                continue;
            }

            const clock = otpauth().getTotpClock(otpauth().getAccountOtpOptions(root.account));

            if (!rolloverClock) {
                rolloverClock = clock;
            }

            updateCardSecondTick(root, clock);
            updateTimerVisuals(root, clock);
        }

        if (rolloverClock) {
            handlePeriodRollover(rolloverClock);
        }
    }

    function startTicker() {
        clearTickers();

        if (!cardRoots.length) {
            return;
        }

        for (const root of cardRoots) {
            if (otpauth().isHotpAccount(root.account)) {
                updateAccountCode(root);
            }
        }

        if (!hasTotpCards()) {
            return;
        }

        globalLastTimerPeriod = null;

        syncAllTimersInverted();

        const firstTotp = getFirstTotpRoot();

        handlePeriodRollover(otpauth().getTotpClock(
            firstTotp ? otpauth().getAccountOtpOptions(firstTotp.account) : {}
        ));

        for (const root of cardRoots) {
            if (otpauth().isHotpAccount(root.account)) {
                continue;
            }

            const clock = otpauth().getTotpClock(otpauth().getAccountOtpOptions(root.account));

            updateCardSecondTick(root, clock);
            updateTimerVisuals(root, clock);
        }

        const msUntilNextSecond = 1000 - (Date.now() % 1000);

        window.setTimeout(() => {
            runSecondTick();
            tickIntervalId = window.setInterval(runSecondTick, 1000);
        }, msUntilNextSecond);
    }

    function clearPieWedge(piePath, lastPathRef) {
        if (!piePath) return;

        lastPathRef.value = '';
        piePath.setAttribute('d', '');
        piePath.style.display = 'none';
    }

    function updatePiePath(piePath, angle, lastPathRef) {
        if (!piePath) return lastPathRef;

        const path = buildPiePath(angle);

        if (path !== lastPathRef.value) {
            piePath.setAttribute('d', path);
            piePath.style.display = path ? '' : 'none';
            lastPathRef.value = path;
        }

        return lastPathRef;
    }

    function syncAllTimersInverted() {
        for (const root of cardRoots) {
            applyTimerInvertedClass(root.els.timer, globalTimerInverted);
        }
    }

    function handlePeriodRollover(clock) {
        if (globalLastTimerPeriod === null) {
            globalLastTimerPeriod = clock.period;
            return;
        }

        if (clock.period === globalLastTimerPeriod) {
            return;
        }

        // Remove the completed wedge before swapping colors so it is not
        // repainted as a full circle in the new fill/background roles.
        for (const root of cardRoots) {
            clearPieWedge(root.els.pieFg, root.lastPiePath);
        }

        globalTimerInverted = !globalTimerInverted;
        saveTimerInvertedPreference(globalTimerInverted);
        syncAllTimersInverted();
        globalLastTimerPeriod = clock.period;
    }

    function updateTimerVisuals(root, clock) {
        const pieFg = root.els.pieFg;

        if (!pieFg) {
            return;
        }

        pieFg.style.display = '';
        updatePiePath(pieFg, clock.angle, root.lastPiePath);
    }

    function updateAllTimerVisuals(clock) {
        handlePeriodRollover(clock);

        for (const root of cardRoots) {
            updateTimerVisuals(root, clock);
        }
    }

    function updateCardSecondTick(root, _clock) {
        updateAccountCode(root);
    }

    function getHotpCounterValue(account) {
        return Number.isInteger(account?.counter)
            ? account.counter
            : otpauth().HOTP_DEFAULT_COUNTER;
    }

    function formatHotpCounterDisplay(account) {
        return String(getHotpCounterValue(account));
    }

    function parseHotpCounterInput(text) {
        const trimmed = String(text ?? '').trim();

        if (!/^\d+$/.test(trimmed)) {
            return null;
        }

        const counter = Number.parseInt(trimmed, 10);

        if (!Number.isInteger(counter) || counter < otpauth().MIN_COUNTER) {
            return null;
        }

        return counter;
    }

    const COPY_FILL_EXPAND_MS = 1000;
    const COPY_FILL_CONTRACT_MS = 480;
    const COPY_CHECK_DRAW_MS = 280;
    const COPY_CHECK_LEAD_MS = 320;
    const COPY_CHECK_HOLD_MS = 180;
    const COPY_FADE_MS = 250;

    function delayCopy(ms) {
        return new Promise((resolve) => {
            window.setTimeout(resolve, ms);
        });
    }

    function resetCopyFeedbackElements(card, fill, check) {
        fill.classList.remove('is-expanding', 'is-contracting');
        check.classList.remove('is-visible', 'is-animating', 'is-drawn', 'is-hiding');
        fill.getAnimations?.().forEach((animation) => animation.cancel());
        check.getAnimations?.().forEach((animation) => animation.cancel());
        const circle = check.querySelector('.copy-check__circle');
        const mark = check.querySelector('.copy-check__mark');

        circle?.getAnimations?.().forEach((animation) => animation.cancel());
        mark?.getAnimations?.().forEach((animation) => animation.cancel());
    }

    function finishCopyFeedback(card, fill, check) {
        resetCopyFeedbackElements(card, fill, check);
        card.classList.remove('is-copy-feedback-active');
        delete card.dataset.copyFeedbackActive;
    }

    function waitForAnimation(element, animationName, timeoutMs) {
        return new Promise((resolve) => {
            if (!element) {
                resolve();
                return;
            }

            const timer = window.setTimeout(resolve, timeoutMs);
            const onEnd = (event) => {
                if (event.target !== element || event.animationName !== animationName) {
                    return;
                }

                window.clearTimeout(timer);
                element.removeEventListener('animationend', onEnd);
                resolve();
            };

            element.addEventListener('animationend', onEnd);
        });
    }

    function applyHotpAdvanceUI(root) {
        root.account.counter = getHotpCounterValue(root.account) + 1;
        updateAccountCode(root);

        if (root.els?.counter) {
            root.els.counter.textContent = formatHotpCounterDisplay(root.account);
        }
    }

    function persistHotpAdvance(root) {
        chrome.storage.local.get(['accountNumber'], async ({ accountNumber }) => {
            if (!accountNumber || !otpauth().isHotpAccount(root.account)) {
                return;
            }

            try {
                root.account.counter = await window.AccountsStorage.incrementHotpCounter(
                    accountNumber,
                    root.account.id
                );
                updateAccountCode(root);

                if (root.els?.counter) {
                    root.els.counter.textContent = formatHotpCounterDisplay(root.account);
                }
            } catch (error) {
                console.error('Failed to advance HOTP counter after copy:', error);
            }
        });
    }

    function advanceHotpOnCopyCheckmarkStart(root) {
        applyHotpAdvanceUI(root);
        persistHotpAdvance(root);
    }

    async function showCopiedFeedback(card, options = {}) {
        if (card.dataset.copyFeedbackActive === '1') {
            return;
        }

        const { onCheckmarkStart } = options;
        const fill = card.querySelector('.account-block__copy-fill');
        const check = card.querySelector('.account-block__copy-check');

        if (!fill || !check) {
            return;
        }

        card.dataset.copyFeedbackActive = '1';
        card.classList.add('is-copy-feedback-active');
        resetCopyFeedbackElements(card, fill, check);

        fill.classList.add('is-expanding');
        const expandDone = waitForAnimation(fill, 'copy-fill-expand', COPY_FILL_EXPAND_MS + 40);

        await delayCopy(Math.max(0, COPY_FILL_EXPAND_MS - COPY_CHECK_LEAD_MS));
        check.classList.add('is-visible', 'is-animating');
        onCheckmarkStart?.();

        await Promise.all([
            expandDone,
            waitForAnimation(
                check.querySelector('.copy-check__mark'),
                'copy-check-mark-draw',
                COPY_CHECK_DRAW_MS + 60
            )
        ]);

        check.classList.remove('is-animating');
        check.classList.add('is-drawn');
        await delayCopy(COPY_CHECK_HOLD_MS);

        check.classList.add('is-hiding');
        fill.classList.remove('is-expanding');
        fill.classList.add('is-contracting');

        await Promise.all([
            waitForAnimation(fill, 'copy-fill-contract', COPY_FILL_CONTRACT_MS + 40),
            waitForAnimation(check, 'copy-check-fade', COPY_FADE_MS + 40)
        ]);

        finishCopyFeedback(card, fill, check);
    }

    function isValidEmail(email) {
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
    }

    function normalizeContactLine(text) {
        const trimmed = text.trim();

        if (!trimmed || trimmed === EMAIL_PLACEHOLDER) {
            return '';
        }

        return trimmed;
    }

    function getAccountContactDisplay(account) {
        if (account.email) {
            return account.email;
        }

        if (account.username) {
            return account.username;
        }

        return EMAIL_PLACEHOLDER;
    }

    function finishEditing(card, els, editBtn, deleteBtn, buttonContainer, onCardClick) {
        els.name.contentEditable = false;
        els.email.contentEditable = false;

        if (els.counter) {
            els.counter.contentEditable = false;
        }

        buttonContainer.remove();
        editBtn.classList.remove('hidden');
        deleteBtn.classList.remove('hidden');
        card.classList.remove('editing');
        card.addEventListener('click', onCardClick);
        setEditHeaderLock(false);
    }

    function findCardRoot(card) {
        return cardRoots.find((root) => root.card === card);
    }

    function applyAccountEditLocally(account, els, patch, root) {
        account.name = patch.name;

        if (patch.email !== undefined) {
            account.email = patch.email;
        }

        if (patch.username !== undefined) {
            account.username = patch.username;
        }

        if (patch.counter != null) {
            account.counter = patch.counter;
        }

        if (els.name) {
            els.name.textContent = account.name || 'Account';
        }

        if (els.email) {
            els.email.textContent = getAccountContactDisplay(account);
        }

        if (els.counter) {
            els.counter.textContent = formatHotpCounterDisplay(account);
        }

        if (root) {
            updateAccountCode(root);
        }
    }

    function persistAccountEditInBackground(accountNumber, accountId, patch) {
        window.AccountsStorage.handleUpdate(accountNumber, accountId, patch).catch((error) => {
            console.error('Failed to update account:', error);
            window.alert('Could not save changes. Please try again.');
        });
    }

    function saveAccountEdit(account, card, els, editBtn, deleteBtn, buttonContainer, onCardClick, snapshot) {
        const newName = els.name.textContent.trim();
        const contactLine = els.email.textContent.trim();
        let newEmail = '';
        let newUsername = '';

        if (account.email) {
            newEmail = normalizeContactLine(contactLine);
        } else {
            newUsername = normalizeContactLine(contactLine);
        }

        if (!newName) {
            window.alert('Account name cannot be empty');
            return;
        }

        const isHotp = otpauth().isHotpAccount(account);
        let newCounter = null;

        if (isHotp && els.counter) {
            newCounter = parseHotpCounterInput(els.counter.textContent);

            if (newCounter == null) {
                window.alert('Enter a valid counter (0 or greater).');
                return;
            }
        }

        const counterUnchanged = !isHotp || String(newCounter) === snapshot.counter;

        if (newName === snapshot.name && contactLine === snapshot.contact && counterUnchanged) {
            finishEditing(card, els, editBtn, deleteBtn, buttonContainer, onCardClick);
            return;
        }

        if (!newEmail && !newUsername) {
            if (account.email) {
                newEmail = DEFAULT_CONTACT;
            } else {
                newUsername = DEFAULT_CONTACT;
            }
        }

        if (account.email && newEmail && !isValidEmail(newEmail)) {
            window.alert('Please enter a valid email address');
            return;
        }

        const patch = { name: newName };

        if (account.email) {
            patch.email = newEmail;
        } else {
            patch.username = newUsername;
        }

        if (isHotp && !counterUnchanged) {
            patch.counter = newCounter;
        }

        const root = findCardRoot(card);
        const targetAccount = root?.account ?? account;
        applyAccountEditLocally(targetAccount, els, patch, root);
        finishEditing(card, els, editBtn, deleteBtn, buttonContainer, onCardClick);

        chrome.storage.local.get(['accountNumber'], ({ accountNumber }) => {
            if (!accountNumber) {
                return;
            }

            persistAccountEditInBackground(accountNumber, account.id, patch);
        });
    }

    function startAccountEdit(card, account, els, onCardClick) {
        const editBtn = card.querySelector('.edit-button');
        const deleteBtn = card.querySelector('.delete-button');
        const actions = card.querySelector('.account-block__actions');

        if (!editBtn || !deleteBtn || !actions) {
            return;
        }

        editBtn.classList.add('hidden');
        deleteBtn.classList.add('hidden');
        card.classList.add('editing');
        card.removeEventListener('click', onCardClick);

        const isHotp = otpauth().isHotpAccount(account);

        els.name.contentEditable = true;
        els.email.contentEditable = true;

        if (isHotp && els.counter) {
            els.counter.contentEditable = true;
            els.counter.focus();
        } else {
            els.email.focus();
        }

        setEditHeaderLock(true);

        const snapshot = {
            name: (account.name || 'Account').trim(),
            contact: getAccountContactDisplay(account).trim(),
            counter: isHotp ? formatHotpCounterDisplay(account) : null
        };

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'edit-buttons-container';

        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.className = 'save-edit-button';
        saveButton.title = 'Save changes';
        saveButton.setAttribute('aria-label', 'Save changes');
        saveButton.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'cancel-edit-button';
        cancelButton.title = 'Cancel';
        cancelButton.setAttribute('aria-label', 'Cancel edit');
        cancelButton.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';

        buttonContainer.appendChild(saveButton);
        buttonContainer.appendChild(cancelButton);
        actions.appendChild(buttonContainer);

        saveButton.addEventListener('click', (event) => {
            event.stopPropagation();
            saveAccountEdit(
                account,
                card,
                els,
                editBtn,
                deleteBtn,
                buttonContainer,
                onCardClick,
                snapshot
            );
        });

        cancelButton.addEventListener('click', (event) => {
            event.stopPropagation();
            els.name.textContent = snapshot.name;
            els.email.textContent = snapshot.contact;

            if (els.counter && snapshot.counter != null) {
                els.counter.textContent = snapshot.counter;
            }

            finishEditing(card, els, editBtn, deleteBtn, buttonContainer, onCardClick);
        });
    }

    function dismissDeleteConfirmation() {
        document.querySelectorAll('.delete-confirmation').forEach((dialog) => {
            dialog.remove();
        });
        document.querySelectorAll('.account-block--delete-pending').forEach((pendingCard) => {
            pendingCard.classList.remove('account-block--delete-pending');
        });
        setDeleteHeaderLock(false);
    }

    function positionDeleteConfirmation(dialog, deleteBtn) {
        const rect = deleteBtn.getBoundingClientRect();
        dialog.style.top = `${Math.max(4, rect.top - 6)}px`;
        dialog.style.right = `${Math.max(4, window.innerWidth - rect.right - 6)}px`;
    }

    function showDeleteConfirmation(account, card, deleteBtn) {
        if (document.querySelector('.delete-confirmation')) {
            dismissDeleteConfirmation();
        }

        card.classList.add('account-block--delete-pending');

        const dialog = document.createElement('div');
        dialog.className = 'delete-confirmation';
        dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-label', 'Confirm delete');
        dialog.innerHTML = `
            <span class="delete-confirmation-text">Are you sure?</span>
            <button type="button" class="delete-confirmation-button confirm">Yes</button>
            <button type="button" class="delete-confirmation-button cancel">No</button>
        `;

        const confirmBtn = dialog.querySelector('.confirm');
        const cancelBtn = dialog.querySelector('.cancel');

        const dismiss = () => {
            dismissDeleteConfirmation();
        };

        cancelBtn?.addEventListener('click', (event) => {
            event.stopPropagation();
            dismiss();
        });

        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                dismiss();
            }
        });

        confirmBtn?.addEventListener('click', async (event) => {
            event.stopPropagation();
            dismiss();
            await performDeleteAccount(account, card);
        });

        document.body.appendChild(dialog);
        positionDeleteConfirmation(dialog, deleteBtn);
        setDeleteHeaderLock(true);
    }

    function wrapCardForExit(card) {
        let layer = card.querySelector('.account-block__exit-layer');

        if (!layer) {
            layer = document.createElement('div');
            layer.className = 'account-block__exit-layer';

            while (card.firstChild) {
                layer.appendChild(card.firstChild);
            }

            card.appendChild(layer);
        }

        card.classList.add('account-block--exit-spacer');
        return layer;
    }

    function waitForDashExit(layer) {
        return new Promise((resolve) => {
            let settled = false;

            const done = () => {
                if (settled) {
                    return;
                }

                settled = true;
                resolve();
            };

            const fallbackId = window.setTimeout(done, CODE_CARD_SLIDE_MS + 40);

            layer.addEventListener('transitionend', (event) => {
                if (event.target !== layer || event.propertyName !== 'transform') {
                    return;
                }

                window.clearTimeout(fallbackId);
                done();
            }, { once: true });
        });
    }

    function collapseExitSpacer(card, durationMs = DELETE_SLIDE_MS) {
        return new Promise((resolve) => {
            let settled = false;

            const finish = () => {
                if (settled) {
                    return;
                }

                settled = true;
                window.clearTimeout(fallbackId);
                card.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            };

            const fallbackId = window.setTimeout(finish, durationMs + 60);

            const onTransitionEnd = (event) => {
                if (event.target !== card) {
                    return;
                }

                const { propertyName } = event;

                if (propertyName !== 'height' && propertyName !== 'max-height') {
                    return;
                }

                finish();
            };

            card.addEventListener('transitionend', onTransitionEnd);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    card.classList.add('is-collapsing', 'is-collapsed');
                });
            });
        });
    }

    function primeAccountCard(card) {
        const root = cardRoots.find((item) => item.card === card);

        if (!root) {
            return;
        }

        if (otpauth().isHotpAccount(root.account)) {
            updateAccountCode(root);
            return;
        }

        const clock = otpauth().getTotpClock(otpauth().getAccountOtpOptions(root.account));

        updateCardSecondTick(root, clock);
        updateTimerVisuals(root, clock);
    }

    async function animateCardDelete(card, remainingAccounts) {
        const { empty, list } = getElements();
        const direction = Math.random() < 0.5 ? 'left' : 'right';

        card.classList.remove('account-block--delete-pending');

        const layer = wrapCardForExit(card);

        await new Promise((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    layer.classList.add(`account-block__exit-layer--dash-${direction}`);
                    waitForDashExit(layer).then(resolve);
                });
            });
        });

        layer.remove();
        await collapseExitSpacer(card);

        cardRoots = cardRoots.filter((root) => root.card !== card);
        card.remove();

        const safeRemaining = (Array.isArray(remainingAccounts) ? remainingAccounts : [])
            .filter((item) => item?.secret);

        if (!safeRemaining.length) {
            stopTicker();
            setEmptyVisible(empty, list, true);
            await playCodesEmptyIntro();
        }
    }

    async function performDeleteAccount(account, card) {
        const { accountNumber } = await chrome.storage.local.get(['accountNumber']);

        if (!accountNumber) {
            return;
        }

        const deleteBtn = card.querySelector('.delete-button');
        if (deleteBtn) {
            deleteBtn.disabled = true;
        }

        try {
            const accounts = await window.AccountsStorage.handleDelete(accountNumber, account.id);
            await animateCardDelete(card, accounts);
        } catch (error) {
            console.error('Failed to delete account:', error);
            if (deleteBtn) {
                deleteBtn.disabled = false;
            }
        }
    }

    function handleDeleteClick(account, card, deleteBtn) {
        showDeleteConfirmation(account, card, deleteBtn);
    }

    async function copyCode(card, codeText) {
        const raw = String(codeText ?? '').replace(/\s+/g, '');
        const root = cardRoots.find((item) => item.card === card);
        const expectedDigits = root
            ? otpauth().getAccountOtpOptions(root.account).digits
            : otpauth().TOTP_DIGITS;
        const codePattern = new RegExp(`^\\d{${expectedDigits}}$`);

        if (!codePattern.test(raw)) {
            return;
        }

        try {
            await navigator.clipboard.writeText(raw);

            const onCheckmarkStart = root && otpauth().isHotpAccount(root.account)
                ? () => advanceHotpOnCopyCheckmarkStart(root)
                : undefined;

            await showCopiedFeedback(card, { onCheckmarkStart });
        } catch {
            // Clipboard unavailable
        }
    }

    function bindCard(card, account) {
        const isHotp = otpauth().isHotpAccount(account);
        const els = {
            name: card.querySelector('.account-name'),
            email: card.querySelector('.account-email'),
            code: card.querySelector('.otp-code'),
            timer: card.querySelector('.timer-wrapper'),
            pieFg: card.querySelector('.pie-fg'),
            counter: card.querySelector('.account-hotp-counter')
        };

        if (isHotp) {
            card.classList.add('account-block--hotp');

            if (els.counter) {
                els.counter.textContent = formatHotpCounterDisplay(account);
                els.counter.classList.remove('hidden');
            }
        }

        if (els.name) {
            els.name.textContent = account.name || 'Account';
        }

        if (els.email) {
            els.email.textContent = getAccountContactDisplay(account);
            els.email.classList.remove('hidden');
        }

        card.dataset.accountId = String(account.id);
        card.title = 'Copy code';

        const onCardClick = () => {
            copyCode(card, els.code?.textContent ?? '');
        };

        const editBtn = card.querySelector('.edit-button');
        editBtn?.addEventListener('click', (event) => {
            event.stopPropagation();
            startAccountEdit(card, account, els, onCardClick);
        });

        const deleteBtn = card.querySelector('.delete-button');
        deleteBtn?.addEventListener('click', (event) => {
            event.stopPropagation();
            handleDeleteClick(account, card, deleteBtn);
        });

        card.addEventListener('click', onCardClick);

        const root = {
            account,
            els,
            card,
            lastPiePath: { value: '' }
        };

        cardRoots.push(root);

        return root;
    }

    function createManualAddSpacer() {
        const spacer = document.createElement('li');

        spacer.className = 'account-block account-block--manual-add-spacer';
        spacer.setAttribute('aria-hidden', 'true');
        return spacer;
    }

    function expandManualAddSpacer(spacer, durationMs = DELETE_SLIDE_MS) {
        return new Promise((resolve) => {
            let settled = false;

            const finish = () => {
                if (settled) {
                    return;
                }

                settled = true;
                window.clearTimeout(fallbackId);
                spacer.removeEventListener('transitionend', onTransitionEnd);
                resolve();
            };

            const fallbackId = window.setTimeout(finish, durationMs + 60);

            const onTransitionEnd = (event) => {
                if (event.target !== spacer) {
                    return;
                }

                const { propertyName } = event;

                if (propertyName !== 'height' && propertyName !== 'max-height') {
                    return;
                }

                finish();
            };

            spacer.addEventListener('transitionend', onTransitionEnd);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    spacer.classList.add('is-expanding');
                });
            });
        });
    }

    function createCardFromTemplate(template, account) {
        const fragment = template.content.cloneNode(true);
        const card = fragment.querySelector('.account-block');

        if (!card) {
            return null;
        }

        bindCard(card, account);
        return card;
    }

    function setEmptyVisible(empty, list, isEmpty) {
        empty?.classList.toggle('hidden', !isEmpty);
        list?.classList.toggle('hidden', isEmpty);
    }

    function finishAppBodyIntro() {
        const frame = document.querySelector('.extension-frame');
        const section = document.querySelector(SELECTORS.section);

        frame?.classList.remove('is-app-intro-pending');
        section?.classList.remove('is-card-intro-pending');
    }

    function prepareCardSlideIn(card) {
        const fromLeft = Math.random() < 0.5;

        card.classList.add('is-slide-pending');
        card.classList.remove('is-slide-from-left', 'is-slide-from-right');
        card.classList.add(fromLeft ? 'is-slide-from-left' : 'is-slide-from-right');
    }

    function runCardSlideIn(card) {
        return new Promise((resolve) => {
            card.classList.remove('is-slide-pending');
            card.classList.add('is-slide-active');

            let settled = false;

            const finish = () => {
                if (settled) {
                    return;
                }

                settled = true;
                card.classList.remove(
                    'is-slide-active',
                    'is-slide-from-left',
                    'is-slide-from-right',
                    'is-manual-add-slide'
                );
                resolve();
            };

            const slideAnimationName = card.classList.contains('is-manual-add-slide')
                ? 'account-block-slide-in-manual'
                : 'account-block-slide-in';

            card.addEventListener('animationend', (event) => {
                if (event.target === card && event.animationName === slideAnimationName) {
                    finish();
                }
            }, { once: true });

            const slideMs = card.classList.contains('is-manual-add-slide')
                ? CODE_CARD_SLIDE_MS
                : CODE_INTRO_SLIDE_MS;

            window.setTimeout(finish, slideMs + 32);
        });
    }

    function slideInCodeCards(cards) {
        return new Promise((resolve) => {
            if (!cards.length) {
                resolve();
                return;
            }

            let completed = 0;
            const total = cards.length;

            const onCardFinished = () => {
                completed += 1;

                if (completed >= total) {
                    resolve();
                }
            };

            cards.forEach((card, index) => {
                window.setTimeout(() => {
                    runCardSlideIn(card).then(onCardFinished);
                }, index * CODE_INTRO_STAGGER_MS);
            });
        });
    }

    async function animateManualAccountAdd(account) {
        const { empty, list, template } = getElements();

        if (!list || !template || !account?.secret) {
            return;
        }

        const existingCards = [...list.querySelectorAll('.account-block')];
        const alreadyVisible = existingCards.some(
            (card) => card.dataset.accountId === String(account.id)
        );

        if (alreadyVisible) {
            return;
        }

        setEmptyVisible(empty, list, false);

        const card = createCardFromTemplate(template, account);

        if (!card) {
            return;
        }

        if (!tickIntervalId) {
            startTicker();
        }

        primeAccountCard(card);
        card.classList.add('is-manual-add-slide');
        prepareCardSlideIn(card);

        if (existingCards.length) {
            const spacer = createManualAddSpacer();

            list.prepend(spacer);
            await expandManualAddSpacer(spacer);

            spacer.replaceWith(card);
            await runCardSlideIn(card);

            return;
        }

        list.prepend(card);
        primeAccountCard(card);
        await runCardSlideIn(card);
    }

    function renderAccounts(accounts, options = {}) {
        const { empty, list, template } = getElements();
        const playIntro = Boolean(options.playIntro);

        stopTicker();

        if (!list || !template) {
            return [];
        }

        list.replaceChildren([]);

        const safeAccounts = Array.isArray(accounts) ? accounts : [];
        const renderableAccounts = safeAccounts.filter((account) => account?.secret);
        const isEmpty = renderableAccounts.length === 0;
        setEmptyVisible(empty, list, isEmpty);

        if (isEmpty) {
            if (!playIntro) {
                revealCodesEmptyStatic();
            }

            return [];
        }

        const cards = [];

        for (const account of renderableAccounts) {
            const card = createCardFromTemplate(template, account);

            if (card) {
                if (playIntro) {
                    prepareCardSlideIn(card);
                }

                list.appendChild(card);
                cards.push(card);
            }
        }

        startTicker();

        return cards;
    }

    async function playCodesIntroIfNeeded(cards) {
        if (!cards.length) {
            return;
        }

        const section = document.querySelector(SELECTORS.section);
        section?.classList.add('is-card-intro-pending');

        await window.Header?.waitForIntroComplete?.();
        await slideInCodeCards(cards);
    }

    function stagePostLoginReveal(accounts) {
        pendingPostLoginReveal = Array.isArray(accounts) ? accounts : [];
    }

    function cancelPendingPostLoginReveal() {
        pendingPostLoginReveal = null;
    }

    function hasPendingPostLoginReveal() {
        return pendingPostLoginReveal != null;
    }

    function dismissPostLoginBlank() {
        document.querySelector('.extension-frame')?.classList.remove('is-post-login-blank');
    }

    function getLogoutBlankBodyFadeTargets() {
        const signedInView = document.querySelector('.app-body > .signed-in-view:not(.hidden)');

        if (!signedInView) {
            return window.BodyIntro?.getSignedOutLoginFadeTargets?.() ?? [];
        }

        const targets = [];
        const list = signedInView.querySelector('.codes-section__list');
        const empty = signedInView.querySelector('.codes-section__empty');

        if (list && !list.classList.contains('hidden')) {
            targets.push(...list.querySelectorAll('.account-block'));
        }

        if (empty && !empty.classList.contains('hidden')) {
            const icon = empty.querySelector('.codes-section__empty-icon');
            const stack = empty.querySelector('.codes-section__message-stack');

            if (icon) {
                targets.push(icon);
            }

            if (stack) {
                targets.push(stack);
            }
        }

        return targets;
    }

    async function fadeOutAppChromeForLogout() {
        window.Header?.prepareLogoutBlankHeaderFade?.();

        const targets = [
            ...window.Header.getLogoutBlankFadeTargets(),
            ...getLogoutBlankBodyFadeTargets()
        ];

        await window.Header.fadeOutChromeElements(targets);
        window.Header.afterLoginBlankHeaderFade();
    }

    async function enterPostLogoutBlankState() {
        dismissPostLoginBlank();
        cancelPendingPostLoginReveal();

        const { accountNumber } = await chrome.storage.local.get(['accountNumber']);

        if (!accountNumber) {
            window.Header?.setAuthState?.(false, { skipSignedOutReveal: true });
        }

        await fadeOutAppChromeForLogout();
        document.querySelector('.extension-frame')?.classList.add('is-post-logout-blank');
    }

    async function playPostLogoutReveal() {
        const frame = document.querySelector('.extension-frame');

        if (!frame?.classList.contains('is-post-logout-blank')) {
            return;
        }

        dismissPostLoginBlank();
        cancelPendingPostLoginReveal();
        window.BodyIntro?.prepareSignedOutIntro?.();
        frame.classList.remove('is-post-logout-blank');
        frame.classList.add('is-app-intro-pending');
        window.Header?.clearHeaderChromeFadeState?.();
        await window.Header?.refresh?.({ skipSignedOutReveal: true });
        await window.Header?.playSignedOutHeaderIntro?.();
        await window.BodyIntro?.playSignedOutBodyIntro?.({ skipPrepare: true });
        frame.classList.remove('is-app-intro-pending');
    }

    function hasPostLogoutBlank() {
        return document.querySelector('.extension-frame')?.classList.contains('is-post-logout-blank') ?? false;
    }

    function dismissPostLogoutBlank() {
        document.querySelector('.extension-frame')?.classList.remove('is-post-logout-blank');
    }

    async function enterPostLoginBlankState() {
        const frame = document.querySelector('.extension-frame');

        window.BodyIntro?.prepareSignedOutForLoginBlank?.();
        frame?.classList.add('is-post-login-blank');
        dismissPostLogoutBlank();

        const targets = [
            ...window.Header.getLoginBlankFadeTargets(),
            ...window.BodyIntro.getSignedOutLoginFadeTargets()
        ];

        await window.Header.fadeOutChromeElements(targets);
        window.Header.afterLoginBlankHeaderFade();
    }

    function hideCodesSectionContent() {
        const { empty, list } = getElements();
        empty?.classList.add('hidden');
        list?.classList.add('hidden');
    }

    function getEmptyMessageElements(empty = document.querySelector(SELECTORS.empty)) {
        const stack = empty?.querySelector('.codes-section__message-stack');

        if (!stack) {
            return null;
        }

        return {
            stack,
            spacer: stack.querySelector('.codes-section__message--spacer'),
            display: stack.querySelector('.codes-section__message--display')
        };
    }

    function getEmptyFullText(stackEl) {
        const stored = stackEl?.dataset.fullText;

        if (stored) {
            return stored.replace(/\\n/g, '\n');
        }

        return 'No accounts yet.\nUse + or scan a QR code to add one.';
    }

    function setEmptyMessageHtml(message, fullText) {
        const lines = fullText.split('\n').map((line) => line.trim()).filter(Boolean);

        if (lines.length > 1) {
            message.innerHTML = `${lines[0]}<br>Use <strong>+</strong> or scan a QR code to add one.`;
        } else {
            message.textContent = fullText.trim();
        }
    }

    function reserveEmptyMessageSpace(spacer, display, fullText) {
        setEmptyMessageHtml(spacer, fullText);
        display.textContent = '';
        display.classList.remove('is-intro-typing');
    }

    function getEmptyIcon(empty = document.querySelector(SELECTORS.empty)) {
        return empty?.querySelector('.codes-section__empty-icon');
    }

    function prepareCodesEmptyIntro() {
        const empty = document.querySelector(SELECTORS.empty);
        const icon = getEmptyIcon(empty);
        const messages = getEmptyMessageElements(empty);

        if (!icon || !messages?.spacer || !messages.display) {
            return null;
        }

        const { stack, spacer, display } = messages;
        const fullText = getEmptyFullText(stack);
        stack.dataset.fullText = fullText;
        reserveEmptyMessageSpace(spacer, display, fullText);
        icon.classList.remove('is-pop-active', 'is-pop-revealed');
        icon.classList.add('is-pop-pending');

        return { icon, display, fullText };
    }

    function revealCodesEmptyStatic() {
        const empty = document.querySelector(SELECTORS.empty);
        const icon = getEmptyIcon(empty);
        const messages = getEmptyMessageElements(empty);

        if (!messages?.spacer || !messages.display) {
            return;
        }

        const { stack, spacer, display } = messages;
        const fullText = getEmptyFullText(stack);
        setEmptyMessageHtml(spacer, fullText);
        setEmptyMessageHtml(display, fullText);
        icon?.classList.remove('is-pop-pending', 'is-pop-active');
        icon?.classList.add('is-pop-revealed');
        display.classList.remove('is-intro-typing');
    }

    function waitForNextFrame() {
        return new Promise((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(resolve));
        });
    }

    function popCodesEmptyIcon(icon) {
        return new Promise((resolve) => {
            let settled = false;

            const finish = () => {
                if (settled) {
                    return;
                }

                settled = true;
                icon.classList.remove('is-pop-pending', 'is-pop-active');
                icon.classList.add('is-pop-revealed');
                resolve();
            };

            icon.classList.remove('is-pop-revealed');
            icon.classList.remove('is-pop-pending');
            void icon.offsetWidth;
            icon.classList.add('is-pop-active');

            icon.addEventListener('animationend', (event) => {
                if (event.target === icon && event.animationName === 'codes-empty-icon-pop') {
                    finish();
                }
            }, { once: true });

            window.setTimeout(finish, EMPTY_ICON_POP_MS + 32);
        });
    }

    function typeCodesEmptyMessage(display, fullText) {
        return new Promise((resolve) => {
            const characters = [...fullText];

            if (!characters.length) {
                resolve();
                return;
            }

            display.textContent = '';
            display.classList.add('is-intro-typing');

            const stepMs = EMPTY_TYPE_MS / characters.length;
            let index = 0;

            const tick = () => {
                display.textContent += characters[index];
                index += 1;

                if (index < characters.length) {
                    window.setTimeout(tick, stepMs);
                } else {
                    display.classList.remove('is-intro-typing');
                    setEmptyMessageHtml(display, fullText);
                    resolve();
                }
            };

            tick();
        });
    }

    async function playCodesEmptyIntro(options = {}) {
        const { skipPrepare = false } = options;
        const prepared = skipPrepare
            ? (() => {
                const empty = document.querySelector(SELECTORS.empty);
                const icon = getEmptyIcon(empty);
                const messages = getEmptyMessageElements(empty);

                if (!icon || !messages?.display) {
                    return null;
                }

                return {
                    icon,
                    display: messages.display,
                    fullText: getEmptyFullText(messages.stack)
                };
            })()
            : prepareCodesEmptyIntro();

        if (!prepared) {
            return;
        }

        const { icon, display, fullText } = prepared;

        await waitForNextFrame();
        await popCodesEmptyIcon(icon);
        await typeCodesEmptyMessage(display, fullText);
    }

    async function playPostLoginReveal() {
        if (pendingPostLoginReveal == null) {
            return;
        }

        const accounts = pendingPostLoginReveal;
        pendingPostLoginReveal = null;

        const frame = document.querySelector('.extension-frame');
        const renderableAccounts = accounts.filter((account) => account?.secret);

        dismissPostLogoutBlank();
        frame?.classList.remove('is-post-login-blank');

        if (!renderableAccounts.length) {
            const { empty, list } = getElements();
            list?.classList.add('hidden');
            empty?.classList.remove('hidden');
            prepareCodesEmptyIntro();
            await window.Header?.playSignedInHeaderIntro?.();
            await playCodesEmptyIntro({ skipPrepare: true });
            finishAppBodyIntro();
            return;
        }

        frame?.classList.add('is-app-intro-pending');
        document.querySelector(SELECTORS.section)?.classList.add('is-card-intro-pending');
        await window.Header?.playSignedInHeaderIntro?.();
        const cards = renderAccounts(accounts, { playIntro: true });
        await slideInCodeCards(cards);
        finishAppBodyIntro();
    }

    async function renderFromStorage() {
        const accounts = await window.AccountsStorage?.getAccountsAll?.() ?? [];
        renderAccounts(accounts);
        return accounts;
    }

    async function restore() {
        const { accountNumber } = await chrome.storage.local.get(['accountNumber']);

        if (!accountNumber) {
            renderAccounts([]);
            return [];
        }

        await loadTimerInvertedPreference();
        const accounts = await window.AccountsStorage.setAccountsAll(accountNumber);
        renderAccounts(accounts);
        return accounts;
    }

    function clear() {
        stopTicker();
        cancelPendingPostLoginReveal();
        dismissPostLoginBlank();
        renderAccounts([]);
    }

    function getCardScrollIndex(list) {
        const cards = list.querySelectorAll('.account-block');

        if (!cards.length) {
            return 0;
        }

        const scrollTop = list.scrollTop;
        let index = 0;
        let bestDistance = Infinity;

        cards.forEach((card, cardIndex) => {
            const distance = Math.abs(card.offsetTop - scrollTop);

            if (distance < bestDistance) {
                bestDistance = distance;
                index = cardIndex;
            }
        });

        return index;
    }

    function scrollListToCardIndex(list, index) {
        const cards = list.querySelectorAll('.account-block');

        if (index < 0 || index >= cards.length) {
            return;
        }

        list.scrollTo({
            top: cards[index].offsetTop,
            behavior: 'smooth'
        });
    }

    function initCodesListWheelSnap() {
        const list = document.querySelector(SELECTORS.list);

        if (!list || list.dataset.wheelSnapBound === '1') {
            return;
        }

        list.dataset.wheelSnapBound = '1';

        let snapLocked = false;

        const releaseSnapLock = () => {
            snapLocked = false;
        };

        list.addEventListener('scrollend', releaseSnapLock, { passive: true });

        list.addEventListener(
            'wheel',
            (event) => {
                const cards = list.querySelectorAll('.account-block');

                if (cards.length < 2 || event.deltaY === 0) {
                    return;
                }

                if (snapLocked) {
                    event.preventDefault();
                    return;
                }

                const currentIndex = getCardScrollIndex(list);
                const nextIndex = currentIndex + (event.deltaY > 0 ? 1 : -1);

                if (nextIndex < 0 || nextIndex >= cards.length) {
                    event.preventDefault();
                    return;
                }

                event.preventDefault();
                snapLocked = true;
                scrollListToCardIndex(list, nextIndex);
                window.setTimeout(releaseSnapLock, LIST_WHEEL_COOLDOWN_MS);
            },
            { passive: false }
        );
    }

    async function initOnLoad() {
        const skipIntroForQrResume = await window.PopupResume?.whenReady?.();
        const playIntro = shouldPlayCodesIntro && !skipIntroForQrResume;

        shouldPlayCodesIntro = false;

        try {
            const { accountNumber } = await chrome.storage.local.get(['accountNumber']);

            if (!accountNumber) {
                renderAccounts([]);

                if (playIntro) {
                    await window.BodyIntro?.playSignedOutIntro?.();
                } else {
                    await window.Header?.waitForIntroComplete?.();
                    window.BodyIntro?.revealSignedOutContentStatic?.();
                }

                return;
            }

            if (hasPendingPostLoginReveal()) {
                await window.Header?.waitForIntroComplete?.();
                return;
            }

            await loadTimerInvertedPreference();
            const accounts = await window.AccountsStorage.setAccountsAll(accountNumber);
            const cards = renderAccounts(accounts, { playIntro });

            if (playIntro && cards.length) {
                await playCodesIntroIfNeeded(cards);
            } else if (playIntro) {
                prepareCodesEmptyIntro();
                await window.Header?.waitForIntroComplete?.();
                await playCodesEmptyIntro({ skipPrepare: true });
            } else if (!cards.length) {
                await window.Header?.waitForIntroComplete?.();
                revealCodesEmptyStatic();
            } else if (skipIntroForQrResume) {
                await window.Header?.waitForIntroComplete?.();
            } else {
                await window.Header?.waitForIntroComplete?.();
            }
        } finally {
            finishAppBodyIntro();

            if (skipIntroForQrResume) {
                await window.QrCodeSetup?.processPendingScan?.({ instantOpen: true });
            } else if (!hasPendingPostLoginReveal()) {
                await window.ReviewPrompt?.maybeShowOnInit?.();
            }
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        initCodesListWheelSnap();
        void initOnLoad();
    });

    loadTimerInvertedPreference();

    window.Codes = {
        restore,
        render: renderFromStorage,
        clear,
        renderAccounts,
        animateManualAccountAdd,
        initOnLoad,
        stagePostLoginReveal,
        hasPendingPostLoginReveal,
        enterPostLoginBlankState,
        playPostLoginReveal,
        fadeOutAppChromeForLogout,
        enterPostLogoutBlankState,
        hasPostLogoutBlank,
        playPostLogoutReveal
    };
})();
