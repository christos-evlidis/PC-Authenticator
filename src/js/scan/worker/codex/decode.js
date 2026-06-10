import jsQR from "../../../../libs/jsqr.esm.js";

function workerCodexDecode(imageData, width, height) {
  try {
    const pixels = new Uint8ClampedArray(imageData);

    return jsQR(pixels, width, height);
  } catch (error) {
    console.warn("[scan-codex] workerCodexDecode failed", error);
    return null;
  }
}

export { workerCodexDecode };
