/** Injected content-script entry: prevents duplicate load and boots the QR scan modules. */
(function qrScanPingListenersRegister() {
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
    const { qrScanContentInit } = await import(
      chrome.runtime.getURL("js/scan/scan-content/scan-boot.js")
    );

    qrScanContentInit();
    window.pcAuthQrScanReady = true;
  } catch (error) {
    console.error("[qr-scan] content script boot failed", error);
  }
})();
