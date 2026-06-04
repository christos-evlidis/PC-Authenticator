(() => {
    const SIGNED_OUT_CONTENT_SELECTOR = '.signed-out-view__content';
    const SIGNED_OUT_MESSAGE_STACK_SELECTOR = '.signed-out-view__message-stack';
    const SIGNED_OUT_ICON_POP_MS = 250;
    const SIGNED_OUT_TYPE_MS = 1000;

    let signedOutIntroRunning = false;

    function getSignedOutContent() {
        return document.querySelector(SIGNED_OUT_CONTENT_SELECTOR);
    }

    function getSignedOutIcon(content = getSignedOutContent()) {
        return content?.querySelector('.signed-out-view__icon');
    }

    function getSignedOutMessageElements(content = getSignedOutContent()) {
        const stack = content?.querySelector(SIGNED_OUT_MESSAGE_STACK_SELECTOR);

        if (!stack) {
            return null;
        }

        return {
            stack,
            spacer: stack.querySelector('.signed-out-view__message--spacer'),
            display: stack.querySelector('.signed-out-view__message--display')
        };
    }

    function getSignedOutFullText(stackEl) {
        const stored = stackEl?.dataset.fullText;

        if (stored) {
            return stored.replace(/\\n/g, '\n');
        }

        return 'To use the authenticator\nsign in or sign up.';
    }

    function setSignedOutMessageHtml(message, fullText) {
        const lines = fullText.split('\n').map((line) => line.trim()).filter(Boolean);

        if (lines.length > 1) {
            message.innerHTML = `${lines[0]}<br>${lines.slice(1).join('<br>')}`;
        } else {
            message.textContent = fullText.trim();
        }
    }

    function reserveSignedOutMessageSpace(spacer, display, fullText) {
        setSignedOutMessageHtml(spacer, fullText);
        display.textContent = '';
        display.classList.remove('is-intro-typing');
    }

    function clearSignedOutIntroFadeOnly(element) {
        if (!element) {
            return;
        }

        element.getAnimations?.().forEach((animation) => animation.cancel());
        element.classList.remove('is-login-fade-out', 'is-login-fade-out--active');
    }

    function prepareSignedOutIntro() {
        const content = getSignedOutContent();
        const icon = getSignedOutIcon(content);
        const messages = getSignedOutMessageElements(content);

        if (!icon || !messages?.spacer || !messages.display) {
            return null;
        }

        const { stack, spacer, display } = messages;
        const fullText = getSignedOutFullText(stack);
        stack.dataset.fullText = fullText;
        reserveSignedOutMessageSpace(spacer, display, fullText);

        clearSignedOutIntroFadeOnly(icon);
        clearSignedOutIntroFadeOnly(stack);
        clearSignedOutIntroFadeOnly(display);

        icon.classList.remove('is-pop-active', 'is-pop-revealed');
        icon.classList.add('is-pop-pending');

        return { icon, spacer, display, fullText };
    }

    function revealSignedOutContentStatic() {
        if (signedOutIntroRunning) {
            return;
        }

        const content = getSignedOutContent();
        const icon = getSignedOutIcon(content);
        const messages = getSignedOutMessageElements(content);

        if (!messages?.spacer || !messages.display) {
            return;
        }

        const { stack, spacer, display } = messages;
        const fullText = getSignedOutFullText(stack);
        setSignedOutMessageHtml(spacer, fullText);
        setSignedOutMessageHtml(display, fullText);
        icon?.classList.remove('is-pop-pending', 'is-pop-active');
        icon?.classList.add('is-pop-revealed');
        display.classList.remove('is-intro-typing');
    }

    function waitForNextFrame() {
        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });
    }

    function popSignedOutIcon(icon) {
        return new Promise((resolve) => {
            let settled = false;

            const finish = () => {
                if (settled) {
                    return;
                }

                settled = true;
                icon.classList.remove('is-pop-active');
                icon.classList.add('is-pop-revealed');
                resolve();
            };

            icon.classList.remove('is-pop-revealed');
            icon.classList.remove('is-pop-pending');
            void icon.offsetWidth;
            icon.classList.add('is-pop-active');

            icon.addEventListener('animationend', (event) => {
                if (event.target === icon && event.animationName === 'signed-out-icon-pop') {
                    finish();
                }
            }, { once: true });

            window.setTimeout(finish, SIGNED_OUT_ICON_POP_MS + 32);
        });
    }

    function typeSignedOutMessage(display, fullText) {
        return new Promise((resolve) => {
            const characters = [...fullText];

            if (!characters.length) {
                resolve();
                return;
            }

            display.textContent = '';
            display.classList.add('is-intro-typing');

            const stepMs = SIGNED_OUT_TYPE_MS / characters.length;
            let index = 0;

            const tick = () => {
                display.textContent += characters[index];
                index += 1;

                if (index < characters.length) {
                    window.setTimeout(tick, stepMs);
                } else {
                    display.classList.remove('is-intro-typing');
                    setSignedOutMessageHtml(display, fullText);
                    resolve();
                }
            };

            tick();
        });
    }

    function getSignedOutIntroState() {
        const content = getSignedOutContent();
        const icon = getSignedOutIcon(content);
        const messages = getSignedOutMessageElements(content);

        if (!icon || !messages?.spacer || !messages.display) {
            return null;
        }

        return {
            icon,
            display: messages.display,
            fullText: getSignedOutFullText(messages.stack)
        };
    }

    async function playSignedOutBodyIntro(options = {}) {
        const { skipPrepare = false } = options;
        const prepared = skipPrepare ? getSignedOutIntroState() : prepareSignedOutIntro();

        if (!prepared) {
            return;
        }

        const { icon, display, fullText } = prepared;

        await waitForNextFrame();
        await popSignedOutIcon(icon);
        await typeSignedOutMessage(display, fullText);
    }

    async function playSignedOutIntro() {
        if (signedOutIntroRunning) {
            return;
        }

        signedOutIntroRunning = true;

        try {
            prepareSignedOutIntro();
            await window.Header?.waitForIntroComplete?.();
            await playSignedOutBodyIntro({ skipPrepare: true });
        } finally {
            signedOutIntroRunning = false;
        }
    }

    function isSignedOutIntroRunning() {
        return signedOutIntroRunning;
    }

    function prepareSignedOutForLoginBlank() {
        const content = getSignedOutContent();

        if (!content) {
            return;
        }

        const icon = getSignedOutIcon(content);
        const messages = getSignedOutMessageElements(content);

        content.classList.remove('is-login-fade-out', 'is-login-fade-out--active');

        if (icon) {
            clearSignedOutIntroFadeOnly(icon);
            icon.classList.remove('is-pop-active', 'is-pop-revealed');
            icon.classList.add('is-pop-pending');
        }

        if (messages?.stack) {
            clearSignedOutIntroFadeOnly(messages.stack);
        }

        if (messages?.display) {
            clearSignedOutIntroFadeOnly(messages.display);
        }
    }

    function getSignedOutLoginFadeTargets() {
        const content = getSignedOutContent();

        return content ? [content] : [];
    }

    async function fadeOutSignedOutForLogin() {
        await window.Header?.fadeOutChromeElements?.(getSignedOutLoginFadeTargets());
    }

    window.BodyIntro = {
        playSignedOutIntro,
        playSignedOutBodyIntro,
        prepareSignedOutIntro,
        revealSignedOutContentStatic,
        isSignedOutIntroRunning,
        prepareSignedOutForLoginBlank,
        getSignedOutLoginFadeTargets,
        fadeOutSignedOutForLogin
    };
})();
