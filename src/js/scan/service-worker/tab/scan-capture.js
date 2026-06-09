/** Captures the visible area of a browser window as a PNG data URL. */
function scanTabCapture(windowId) {
  return new Promise((resolve) => {
    chrome.tabs.captureVisibleTab(windowId ?? null, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        resolve(undefined);
        return;
      }

      resolve(dataUrl);
    });
  });
}

export { scanTabCapture };
