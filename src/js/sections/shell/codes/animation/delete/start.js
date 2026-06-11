import { animCssMsGet } from "../../../../../utils/utility-animation.js";
import { authChromeApply } from "../../../../../utils/utility-auth.js";
import { bodyAnimationReset } from "../../../body/body-index.js";
import { bodyAnimationStart } from "../../../body/body-index.js";

import { codesStateStore } from "../../state/store.js";
import { codesTickerStop } from "../../ticker/run.js";
import { codesElementsGet } from "../../util/elements.js";

import { CODES_HIDDEN_CLASS } from "../../codes-const.js";
import { CODES_VAR_DELETE_POOF_MS } from "../../codes-const.js";
import { CODES_VAR_DELETE_POOF_SHRINK_MS } from "../../codes-const.js";
import { CODES_VAR_SLIDE_MS } from "../../codes-const.js";

const DELETE_POOF_PARTICLE_COUNT = 28;
const DELETE_POOF_SHAPES = [
  "circle",
  "squircle",
  "rounded-square",
  "pill-h",
  "pill-v",
  "soft-rect",
  "teardrop",
  "rounded-diamond",
];

/** Runs smoke puff exit animation and updates signed-in chrome. */
async function codesAnimationDeleteStart(card, remainingAccounts) {
  const { list } = codesElementsGet();
  const slideMs = animCssMsGet(card, CODES_VAR_SLIDE_MS);
  const poofMs = animCssMsGet(card, CODES_VAR_DELETE_POOF_MS);
  const poofShrinkMs = animCssMsGet(card, CODES_VAR_DELETE_POOF_SHRINK_MS);

  if (!list) {
    return;
  }

  card.classList.remove("account-block--delete-pending");
  card.classList.add("account-block--poof-exit");

  const cardRect = card.getBoundingClientRect();
  const cardStyles = getComputedStyle(card);

  const palette = [
    card,
    card.querySelector(".account-name"),
    card.querySelector(".account-email"),
    card.querySelector(".otp-code"),
    card.querySelector(".pie-bg"),
    card.querySelector(".pie-fg"),
    card.querySelector(".edit-button"),
  ]
    .filter(Boolean)
    .flatMap((element) => {
      const styles = getComputedStyle(element);

      return [
        styles.backgroundColor,
        styles.color,
        styles.borderColor,
        styles.fill,
        styles.stroke,
      ];
    })
    .filter(
      (value) =>
        value &&
        value !== "transparent" &&
        value !== "none" &&
        value !== "rgba(0, 0, 0, 0)",
    );

  const particleColors = [...new Set(palette)];
  const fillColor = particleColors.length ? particleColors : [cardStyles.backgroundColor];
  const spreadX = Math.max(cardRect.width * 0.75, 48);
  const spreadY = Math.max(cardRect.height * 0.75, 48);
  const particleSize = Math.round(Math.min(cardRect.width, cardRect.height) * 0.18);

  const poof = document.createElement("div");
  poof.className = "account-block__poof";
  poof.setAttribute("aria-hidden", "true");
  poof.style.top = `${cardRect.top}px`;
  poof.style.left = `${cardRect.left}px`;
  poof.style.width = `${cardRect.width}px`;
  poof.style.height = `${cardRect.height}px`;
  document.body.append(poof);

  const animations = [
    card.animate([{ transform: "scale(0)" }], {
      duration: poofShrinkMs,
      easing: "ease",
      fill: "forwards",
    }),
  ];

  for (let index = 0; index < DELETE_POOF_PARTICLE_COUNT; index += 1) {
    const part = document.createElement("span");
    const offsetX = Math.floor(Math.random() * (spreadX * 2 + 1)) - spreadX;
    const offsetY = Math.floor(Math.random() * (spreadY * 2 + 1)) - spreadY;
    const shape =
      DELETE_POOF_SHAPES[Math.floor(Math.random() * DELETE_POOF_SHAPES.length)];

    part.style.backgroundColor = fillColor[index % fillColor.length];
    part.style.clipPath = "none";

    switch (shape) {
      case "circle":
        part.style.width = `${particleSize}px`;
        part.style.height = `${particleSize}px`;
        part.style.borderRadius = "50%";
        break;
      case "squircle":
        part.style.width = `${particleSize}px`;
        part.style.height = `${particleSize}px`;
        part.style.borderRadius = `${Math.round(particleSize * 0.32)}px`;
        break;
      case "rounded-square":
        part.style.width = `${particleSize}px`;
        part.style.height = `${particleSize}px`;
        part.style.borderRadius = `${Math.round(particleSize * 0.22)}px`;
        break;
      case "pill-h":
        part.style.width = `${Math.round(particleSize * 1.35)}px`;
        part.style.height = `${Math.round(particleSize * 0.5)}px`;
        part.style.borderRadius = "999px";
        break;
      case "pill-v":
        part.style.width = `${Math.round(particleSize * 0.5)}px`;
        part.style.height = `${Math.round(particleSize * 1.35)}px`;
        part.style.borderRadius = "999px";
        break;
      case "soft-rect":
        part.style.width = `${Math.round(particleSize * 1.15)}px`;
        part.style.height = `${Math.round(particleSize * 0.72)}px`;
        part.style.borderRadius = `${Math.round(particleSize * 0.24)}px`;
        break;
      case "teardrop":
        part.style.width = `${Math.round(particleSize * 0.72)}px`;
        part.style.height = `${particleSize}px`;
        part.style.borderRadius = "50% 50% 50% 50% / 85% 85% 15% 15%";
        break;
      case "rounded-diamond":
        part.style.width = `${Math.round(particleSize * 0.78)}px`;
        part.style.height = `${Math.round(particleSize * 0.78)}px`;
        part.style.borderRadius = `${Math.round(particleSize * 0.18)}px`;
        part.style.transform = "translate(-50%, -50%) rotate(45deg)";
        break;
      default:
        part.style.width = `${particleSize}px`;
        part.style.height = `${particleSize}px`;
        part.style.borderRadius = "50%";
    }

    poof.append(part);

    animations.push(
      part.animate(
        [
          {
            transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(0.001)`,
            opacity: 0,
          },
        ],
        {
          duration: poofMs,
          easing: "ease",
          fill: "forwards",
        },
      ),
    );
  }

  const midMs = Math.round(poofMs / 2);
  const midPhasePromise = new Promise((resolve) => {
    window.setTimeout(async () => {
      card.getAnimations().forEach((animation) => animation.cancel());
      card.replaceChildren();
      card.classList.remove("account-block--poof-exit");
      card.style.removeProperty("transform");
      card.classList.add("account-block--exit-spacer");

      await new Promise((collapseResolve) => {
        let settled = false;

        const finish = () => {
          if (settled) {
            return;
          }

          settled = true;
          window.clearTimeout(fallbackId);
          card.removeEventListener("transitionend", onTransitionEnd);
          collapseResolve();
        };

        const fallbackId = window.setTimeout(finish, slideMs + 60);

        const onTransitionEnd = (event) => {
          if (event.target !== card) {
            return;
          }

          const { propertyName } = event;

          if (propertyName !== "height" && propertyName !== "max-height") {
            return;
          }

          finish();
        };

        card.addEventListener("transitionend", onTransitionEnd);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            card.classList.add("is-collapsing", "is-collapsed");
          });
        });
      });

      resolve();
    }, midMs);
  });

  await Promise.all([
    Promise.all(animations.map((animation) => animation.finished)),
    midPhasePromise,
  ]);

  poof.remove();

  codesStateStore.cardRoots = codesStateStore.cardRoots.filter((root) => root.card !== card);
  card.remove();

  const safeRemaining = (Array.isArray(remainingAccounts) ? remainingAccounts : []).filter(
    (item) => item?.secret,
  );

  if (!safeRemaining.length) {
    codesTickerStop();
    list.classList.add(CODES_HIDDEN_CLASS);
    await authChromeApply({ isSignedIn: true, hasAccounts: false });
    bodyAnimationReset();
    await bodyAnimationStart();
  } else {
    await authChromeApply({ isSignedIn: true, hasAccounts: true });
  }
}

export { codesAnimationDeleteStart };
