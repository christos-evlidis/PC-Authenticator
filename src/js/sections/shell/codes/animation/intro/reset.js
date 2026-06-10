/** Assigns random slide direction before card intro animation. */
function codesAnimationIntroReset(card) {
  const fromLeft = Math.random() < 0.5;

  card.classList.add("is-slide-pending");
  card.classList.remove("is-slide-from-left", "is-slide-from-right");
  card.classList.add(fromLeft ? "is-slide-from-left" : "is-slide-from-right");
}

export { codesAnimationIntroReset };
