/** Resolves after the given number of milliseconds. */
export function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** Waits until the next paint so layout changes can apply before continuing. */
export function waitForNextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

/** Reads a duration custom property on an element as milliseconds. */
export function cssMs(element, varName) {
  if (!element) {
    return 0;
  }

  return Number.parseFloat(getComputedStyle(element).getPropertyValue(varName)) || 0;
}

/** Reads a length custom property on an element as pixels. */
export function cssPx(element, varName) {
  if (!element) {
    return 0;
  }

  return Number.parseFloat(getComputedStyle(element).getPropertyValue(varName)) || 0;
}

/** Reads extension frame padding and gap from root CSS custom properties. */
export function frameMetrics(frame) {
  const root = document.documentElement;
  const padTop = cssPx(root, "--frame-padding-top");
  const padRight = cssPx(root, "--frame-padding-right");
  const padBottom = cssPx(root, "--frame-padding-bottom");
  const padLeft = cssPx(root, "--frame-padding-left");
  const gap = cssPx(root, "--frame-gap");

  return {
    padTop,
    padRight,
    padBottom,
    padLeft,
    gap,
    bottomAnchor: frame ? frame.offsetHeight - padBottom : 0,
    insetWidth: frame ? frame.offsetWidth - padLeft - padRight : 0,
  };
}

/** Resolves when an element finishes transitioning a property, or after a timeout. */
export function waitForTransitionEnd(element, propertyName, timeoutMs) {
  if (!element) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let timeoutId = 0;

    const finish = () => {
      window.clearTimeout(timeoutId);
      element.removeEventListener("transitionend", onTransitionEnd);
      resolve();
    };

    const onTransitionEnd = (event) => {
      if (event.target === element && event.propertyName === propertyName) {
        finish();
      }
    };

    element.addEventListener("transitionend", onTransitionEnd);
    timeoutId = window.setTimeout(finish, timeoutMs);
  });
}

/** Resolves when an element finishes a CSS animation, or after a timeout. */
export function waitForAnimationEnd(element, animationName, timeoutMs) {
  if (!element) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let timeoutId = 0;

    const finish = () => {
      window.clearTimeout(timeoutId);
      element.removeEventListener("animationend", onAnimationEnd);
      resolve();
    };

    const onAnimationEnd = (event) => {
      if (event.target !== element) {
        return;
      }

      if (!animationName || event.animationName === animationName) {
        finish();
      }
    };

    element.addEventListener("animationend", onAnimationEnd);
    timeoutId = window.setTimeout(finish, timeoutMs);
  });
}

/** Removes one-shot phase classes from an element. */
export function cssPhaseReset(element, ...phaseClasses) {
  if (!element) {
    return;
  }

  element.classList.remove(...phaseClasses);
}

/** Adds a one-shot phase class, waits for CSS motion, then removes the class. */
export async function cssPhasePlay(
  element,
  activeClass,
  timeoutMs,
  mode = "animation",
  animationName = "",
) {
  if (!element) {
    return;
  }

  element.classList.add(activeClass);
  await waitForNextFrame();

  if (mode === "transition") {
    await waitForTransitionEnd(element, animationName, timeoutMs);
  } else {
    await waitForAnimationEnd(element, animationName, timeoutMs);
  }

  element.classList.remove(activeClass);
}
