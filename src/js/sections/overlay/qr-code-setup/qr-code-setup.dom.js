import { QR_SETUP_ROOT_SELECTOR, QR_SETUP_BACKDROP_SELECTOR, QR_SETUP_PANEL_SELECTOR, QR_SETUP_HEADER_SELECTOR, QR_SETUP_CONTENT_SELECTOR, QR_SETUP_BODY_SELECTOR, QR_SETUP_CLOSE_BTN_SELECTOR, QR_SETUP_OPEN_BTN_SELECTOR, QR_SETUP_GUIDE_SELECTOR, QR_SETUP_GUIDE_TEXT_SELECTOR, QR_SETUP_STATUS_LOADING_SELECTOR, QR_SETUP_STATUS_SUCCESS_SELECTOR, QR_SETUP_STATUS_ERROR_SELECTOR, QR_SETUP_STATUS_ICON_CIRCLE_SELECTOR, QR_SETUP_STATUS_ICON_MARK_SELECTOR } from "../../../const/const.qr-code-setup.js";


// Queries and returns references to all QR setup DOM elements.
function qrSetupDomGet() {
  return {
    root: document.querySelector(QR_SETUP_ROOT_SELECTOR),
    openBtns: [...document.querySelectorAll(QR_SETUP_OPEN_BTN_SELECTOR)],
    backdrop: document.querySelector(QR_SETUP_BACKDROP_SELECTOR),
    panel: document.querySelector(QR_SETUP_PANEL_SELECTOR),
    header: document.querySelector(QR_SETUP_HEADER_SELECTOR),
    content: document.querySelector(QR_SETUP_CONTENT_SELECTOR),
    body: document.querySelector(QR_SETUP_BODY_SELECTOR),
    closeBtn: document.querySelector(QR_SETUP_CLOSE_BTN_SELECTOR),
    guide: document.querySelector(QR_SETUP_GUIDE_SELECTOR),
    guideText: document.querySelector(QR_SETUP_GUIDE_TEXT_SELECTOR),
    statusLoading: document.querySelector(QR_SETUP_STATUS_LOADING_SELECTOR),
    statusSuccess: document.querySelector(QR_SETUP_STATUS_SUCCESS_SELECTOR),
    statusError: document.querySelector(QR_SETUP_STATUS_ERROR_SELECTOR),
    statusIconCircle: document.querySelector(QR_SETUP_STATUS_ICON_CIRCLE_SELECTOR),
    statusIconMark: document.querySelector(QR_SETUP_STATUS_ICON_MARK_SELECTOR),
  };
}

// Updates QR setup DOM element properties based on the provided state object.
function qrSetupDomSet(options) {
  const dom = qrSetupDomGet();

  if (options.guideText !== undefined && dom.guideText) {
    dom.guideText.textContent = options.guideText;
  }

  return dom;
}


export { qrSetupDomGet, qrSetupDomSet };
