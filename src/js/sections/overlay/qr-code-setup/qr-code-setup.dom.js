import { QR_SETUP_BACKDROP_SELECTOR, QR_SETUP_BODY_SELECTOR, QR_SETUP_CLOSE_BTN_SELECTOR, QR_SETUP_CONTENT_SELECTOR, QR_SETUP_GUIDE_SELECTOR, QR_SETUP_GUIDE_TEXT_SELECTOR, QR_SETUP_HEADER_SELECTOR, QR_SETUP_OPEN_BTN_SELECTOR, QR_SETUP_PANEL_SELECTOR, QR_SETUP_ROOT_SELECTOR, QR_SETUP_STATUS_ERROR_SELECTOR, QR_SETUP_STATUS_ICON_CIRCLE_SELECTOR, QR_SETUP_STATUS_ICON_MARK_SELECTOR, QR_SETUP_STATUS_LOADING_SELECTOR, QR_SETUP_STATUS_SUCCESS_SELECTOR } from "../../../const/const.qr-setup.js";


/** Queries and returns references to all QR setup DOM elements. */
function qrSetupDomQuery() {
  return {
    root: document.querySelector(QR_SETUP_ROOT_SELECTOR), // Overlay root container.
    openBtns: [...document.querySelectorAll(QR_SETUP_OPEN_BTN_SELECTOR)], // Header buttons that open the QR setup panel.
    backdrop: document.querySelector(QR_SETUP_BACKDROP_SELECTOR), // Clickable backdrop behind the panel.
    panel: document.querySelector(QR_SETUP_PANEL_SELECTOR), // Sliding QR setup panel.
    header: document.querySelector(QR_SETUP_HEADER_SELECTOR), // Panel header area.
    content: document.querySelector(QR_SETUP_CONTENT_SELECTOR), // Main panel content wrapper.
    body: document.querySelector(QR_SETUP_BODY_SELECTOR), // Panel body content area.
    closeBtn: document.querySelector(QR_SETUP_CLOSE_BTN_SELECTOR), // Panel close button.
    guide: document.querySelector(QR_SETUP_GUIDE_SELECTOR), // Scan guide container.
    guideText: document.querySelector(QR_SETUP_GUIDE_TEXT_SELECTOR), // Scan guide message text node.
    statusLoading: document.querySelector(QR_SETUP_STATUS_LOADING_SELECTOR), // Resume loading status icon.
    statusSuccess: document.querySelector(QR_SETUP_STATUS_SUCCESS_SELECTOR), // Resume success status icon.
    statusError: document.querySelector(QR_SETUP_STATUS_ERROR_SELECTOR), // Resume error status icon.
    statusIconCircle: document.querySelector(QR_SETUP_STATUS_ICON_CIRCLE_SELECTOR), // Shared status icon circle.
    statusIconMark: document.querySelector(QR_SETUP_STATUS_ICON_MARK_SELECTOR), // Shared status icon mark.
  };
}

/** Returns the current QR setup DOM references. */
function qrSetupDomGet() {
  return qrSetupDomQuery(); // Query the current QR setup DOM references.
}


export { qrSetupDomGet };
