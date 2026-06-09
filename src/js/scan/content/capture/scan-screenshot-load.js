/** Loads a screenshot data URL into an Image element. */
function scanScreenshotLoad(dataUrl) {
  const img = new Image();

  return new Promise((resolve) => {
    img.onload = () => resolve(img);
    img.src = dataUrl;
  });
}

export { scanScreenshotLoad };
