import "./jsQR.js";

const jsQR = globalThis.jsQR;

if (typeof jsQR !== "function") {
  throw new Error("[jsqr.esm] jsQR did not load from jsQR.js");
}

export default jsQR;
