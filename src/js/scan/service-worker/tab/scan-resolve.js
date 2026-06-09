/** Returns the tab URL or pending URL string. */
function scanTabUrlGet(tab) {
  return tab?.url || tab?.pendingUrl || "";
}

/** Builds an unsupported-page error message for a URL. */
function scanUnsupportedPageErrorGet(url) {
  const display = url?.trim() || "(unknown)";

  return `QR scanning cannot run on this page: ${display}. Open a normal website tab and try again.`;
}

/** Logs tab metadata for scan target debugging. */
function scanTabContextLog(tab, source) {
  console.debug("[scan-tab] scan tab candidate", {
    source,
    id: tab?.id ?? null,
    url: tab?.url ?? null,
    pendingUrl: tab?.pendingUrl ?? null,
    active: tab?.active ?? null,
    windowId: tab?.windowId ?? null,
  });
}

/** Returns whether a URL can host the QR selection overlay. */
function scanUrlScannableIs(url) {
  if (!url) {
    return false;
  }

  const lower = url.toLowerCase();

  if (lower.startsWith("file://")) {
    return false;
  }

  return lower.startsWith("http://") || lower.startsWith("https://");
}

/** Returns whether file:// URLs are allowed for scanning. */
function scanFileSchemeAccessAllowedIs() {
  return new Promise((resolve) => {
    if (!chrome.extension?.isAllowedFileSchemeAccess) {
      resolve(false);
      return;
    }

    chrome.extension.isAllowedFileSchemeAccess(resolve);
  });
}

/** Returns whether the tab URL can host the QR selection content script. */
async function scanTabScannableIs(tab) {
  if (!tab?.id || tab.id < 0) {
    return false;
  }

  const url = scanTabUrlGet(tab);

  if (!url) {
    return false;
  }

  if (url.toLowerCase().startsWith("file://")) {
    return scanFileSchemeAccessAllowedIs();
  }

  return scanUrlScannableIs(url);
}

/** Returns the tab if scannable, otherwise undefined. */
async function scanTabScannablePick(tab, source) {
  scanTabContextLog(tab, source);

  if (await scanTabScannableIs(tab)) {
    return tab;
  }

  return undefined;
}

/** Resolves the browser tab to scan (not the extension popup). */
async function scanTargetTabResolve() {
  let detectedUrl = "(no tab found)";

  const accept = (tab, source) => {
    const url = scanTabUrlGet(tab);
    if (url) {
      detectedUrl = url;
    }

    return scanTabScannablePick(tab, source);
  };

  try {
    const normalWindow = await chrome.windows.getLastFocused({
      windowTypes: ["normal"],
    });

    if (normalWindow?.id != null) {
      const [normalActive] = await chrome.tabs.query({
        active: true,
        windowId: normalWindow.id,
      });
      const tab = await accept(normalActive, "lastFocusedNormalWindow");

      if (tab) {
        return { tab, detectedUrl: scanTabUrlGet(tab) };
      }
    }
  } catch (error) {
    console.warn("[scan-tab] getLastFocused(normal) failed", error);
  }

  const [lastFocusedTab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  let tab = await accept(lastFocusedTab, "lastFocusedWindow");

  if (tab) {
    return { tab, detectedUrl: scanTabUrlGet(tab) };
  }

  const normalActiveTabs = await chrome.tabs.query({
    active: true,
    windowType: "normal",
  });

  for (const candidate of normalActiveTabs) {
    tab = await accept(candidate, "normalWindowActive");

    if (tab) {
      return { tab, detectedUrl: scanTabUrlGet(tab) };
    }
  }

  const normalTabs = await chrome.tabs.query({ windowType: "normal" });
  const byRecency = [...normalTabs].sort(
    (a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0),
  );

  for (const candidate of byRecency) {
    if (await scanTabScannableIs(candidate)) {
      scanTabContextLog(candidate, "mostRecentScannableNormal");
      return { tab: candidate, detectedUrl: scanTabUrlGet(candidate) };
    }
  }

  console.warn("[scan-tab] no scannable tab; last detected URL:", detectedUrl);

  return {
    error: scanUnsupportedPageErrorGet(detectedUrl),
    detectedUrl,
  };
}

export { scanTabUrlGet };
export { scanUnsupportedPageErrorGet };
export { scanTabScannableIs };
export { scanTargetTabResolve };
