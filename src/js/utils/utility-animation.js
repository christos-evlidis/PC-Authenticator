function animDelay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** Waits until the next paint so layout changes can apply before continuing. */
function animFrameWait() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

/** Reads a duration custom property on an element as milliseconds. */
function animCssMsGet(element, varName) {
  if (!element) {
    return 0;
  }

  return Number.parseFloat(getComputedStyle(element).getPropertyValue(varName)) || 0;
}

/** Reads a length custom property on an element as pixels. */
function animCssPxGet(element, varName) {
  if (!element) {
    return 0;
  }

  return Number.parseFloat(getComputedStyle(element).getPropertyValue(varName)) || 0;
}

/** Reads extension frame padding and gap from root CSS custom properties. */
function animFrameMetricsGet(frame) {
  const root = document.documentElement;
  const pad = animCssPxGet(root, "--frame-padding");
  const gap = animCssPxGet(root, "--gap-l");

  return {
    padTop: pad,
    padRight: pad,
    padBottom: pad,
    padLeft: pad,
    gap,
    bottomAnchor: frame ? frame.offsetHeight - pad : 0,
    insetWidth: frame ? frame.offsetWidth - pad * 2 : 0,
  };
}

/** Resolves when an element finishes transitioning a property, or after a timeout. */
function animTransitionEndWait(element, propertyName, timeoutMs) {
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
function animAnimationEndWait(element, animationName, timeoutMs) {
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
function animPhaseReset(element, ...phaseClasses) {
  if (!element) {
    return;
  }

  element.classList.remove(...phaseClasses);
}

/** Adds a one-shot phase class, waits for CSS motion, then removes the class. */
async function animPhasePlay(
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
  await animFrameWait();

  if (mode === "transition") {
    await animTransitionEndWait(element, animationName, timeoutMs);
  } else {
    await animAnimationEndWait(element, animationName, timeoutMs);
  }

  element.classList.remove(activeClass);
}

export { animAnimationEndWait };
export { animCssMsGet };
export { animDelay };
export { animFrameMetricsGet };
export { animFrameWait };
export { animPhasePlay };
export { animPhaseReset };
export { animTransitionEndWait };
