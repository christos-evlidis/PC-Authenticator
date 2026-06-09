/** Returns whether a messaging error means the content script is missing. */
function scanReceivingEndMissing(error) {
  const message =
    error instanceof Error ? error.message : String(error ?? "");

  return message.includes("Receiving end does not exist");
}

/** Sends an action message to a tab's content script. */
async function scanTabMessage(tabId, action) {
  try {
    const response = await chrome.tabs.sendMessage(tabId, { action });

    return { ok: true, response };
  } catch (error) {
    return {
      ok: false,
      error,
      receivingEndMissing: scanReceivingEndMissing(error),
    };
  }
}

export { scanTabMessage };
