const HEADER_SIGNED_OUT_VIEW_SELECTOR = '.app-header .signed-out-view';
const HEADER_SIGNED_IN_VIEW_SELECTOR = '.app-header .signed-in-view';
const BODY_SIGNED_OUT_VIEW_SELECTOR = '.app-body > .signed-out-view';
const BODY_SIGNED_IN_VIEW_SELECTOR = '.app-body > .signed-in-view';

function setBodyAuthState(isLoggedIn) {
    const signedOutView = document.querySelector(BODY_SIGNED_OUT_VIEW_SELECTOR);
    const signedInView = document.querySelector(BODY_SIGNED_IN_VIEW_SELECTOR);

    if (signedOutView) {
        signedOutView.classList.toggle('hidden', isLoggedIn);
    }

    if (signedInView) {
        signedInView.classList.toggle('hidden', !isLoggedIn);
    }
}

function setHeaderAuthState(isLoggedIn) {
    const signedOutView = document.querySelector(HEADER_SIGNED_OUT_VIEW_SELECTOR);
    const signedInView = document.querySelector(HEADER_SIGNED_IN_VIEW_SELECTOR);

    if (signedOutView) {
        signedOutView.classList.toggle('hidden', isLoggedIn);
    }

    if (signedInView) {
        signedInView.classList.toggle('hidden', !isLoggedIn);
    }

    setBodyAuthState(isLoggedIn);

    if (isLoggedIn) {
        window.ManualSetup?.refreshBindings?.();
    }
}

async function refreshHeaderAuthState() {
    const { accountNumber } = await chrome.storage.local.get(['accountNumber']);
    setHeaderAuthState(Boolean(accountNumber));
}

function initHeader() {
    refreshHeaderAuthState();
}

document.addEventListener('DOMContentLoaded', initHeader);

window.Header = {
    setAuthState: setHeaderAuthState,
    refresh: refreshHeaderAuthState
};
