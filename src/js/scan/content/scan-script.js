/** Injected content-script entry: prevents duplicate load and boots the QR scan modules. */
(function scanPingListenersRegister() {
  if (window.pcAuthQrScanPingListener) {
    return;
  }

  window.pcAuthQrScanPingListener = true;

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === "ping") {
      sendResponse({ loaded: Boolean(window.pcAuthQrScanReady) });
      return false;
    }
  });
})();

(async () => {
  if (window.pcAuthQrScanLoaded) {
    return;
  }

  window.pcAuthQrScanLoaded = true;

  try {
    const { scanContentInit } = await import(
      chrome.runtime.getURL("js/scan/content/index.js")
    );

    scanContentInit();
    window.pcAuthQrScanReady = true;
  } catch (error) {
    console.error("[scan] content script boot failed", error);
  }
})();
