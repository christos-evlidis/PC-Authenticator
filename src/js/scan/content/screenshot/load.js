function contentScreenshotLoad(dataUrl) {
  const img = new Image();

  return new Promise((resolve) => {
    img.onload = () => resolve(img);
    img.src = dataUrl;
  });
}

export { contentScreenshotLoad };
