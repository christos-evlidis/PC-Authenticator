/** Sends an action message from the service worker to a tab content script. */
async function messageContent(tabId, action) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, { action });

    return { ok: true, response };
  } catch (error) {
    console.warn("[scan-message] messageContent failed", error);

    const message =
      error instanceof Error ? error.message : String(error ?? "");

    return {
      ok: false,
      error,
      receivingEndMissing: message.includes("Receiving end does not exist"),
    };
  }
}

export { messageContent };
