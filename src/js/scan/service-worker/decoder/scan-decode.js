import jsQR from "../../../../libs/jsqr.esm.js";

/** Decodes QR data from raw RGBA pixel data. */
function scanRegionDecode(imageData, width, height) {
  const pixels = new Uint8ClampedArray(imageData);

  return jsQR(pixels, width, height);
}

export { scanRegionDecode };
