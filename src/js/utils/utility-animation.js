export function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function parseDurationMs(value, fallback) {
  if (!value) {
    return fallback;
  }

  const trimmed = String(value).trim();

  if (trimmed.endsWith("ms")) {
    return Number.parseFloat(trimmed);
  }

  if (trimmed.endsWith("s")) {
    return Number.parseFloat(trimmed) * 1000;
  }

  const parsed = Number.parseFloat(trimmed);

  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getCssDurationMs(
  variableName,
  fallback,
  root = document.documentElement,
) {
  const value = getComputedStyle(root).getPropertyValue(variableName);

  return parseDurationMs(value, fallback);
}

export function waitForNextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

export function waitForTransitionEnd(element, propertyName, timeoutMs = 400) {
  return new Promise((resolve) => {
    if (!element) {
      resolve();
      return;
    }

    let settled = false;

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;
      element.removeEventListener("transitionend", onEnd);
      resolve();
    };

    const onEnd = (event) => {
      if (event.target !== element) {
        return;
      }

      if (propertyName && event.propertyName !== propertyName) {
        return;
      }

      finish();
    };

    element.addEventListener("transitionend", onEnd);
    window.setTimeout(finish, timeoutMs);
  });
}

export function forceReflow(element) {
  void (element ?? document.documentElement).offsetWidth;
}

/** @deprecated Prefer named imports; kept for gradual migration. */
export const UtilsAnimation = {
  delay,
  parseDurationMs,
  getCssDurationMs,
  waitForNextFrame,
  waitForTransitionEnd,
  forceReflow,
};
