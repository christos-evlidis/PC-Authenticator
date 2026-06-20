/** Clears copy feedback animation classes and cancels animations. */
function _codesAnimationCopyReset(fill, check) {
  fill.classList.remove("is-expanding", "is-contracting");
  fill.style.removeProperty("clip-path");
  check.classList.remove("is-visible", "is-animating", "is-drawn", "is-hiding");
  fill.getAnimations?.().forEach((animation) => animation.cancel());
  check.getAnimations?.().forEach((animation) => animation.cancel());
  const circle = check.querySelector(".copy-check__circle");
  const mark = check.querySelector(".copy-check__mark");

  circle?.getAnimations?.().forEach((animation) => animation.cancel());
  mark?.getAnimations?.().forEach((animation) => animation.cancel());
}

export { _codesAnimationCopyReset as codesAnimationCopyReset };
