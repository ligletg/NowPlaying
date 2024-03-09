function getContrastColor(rgbColors, targetColor) {
  // Convert target color to relative luminance
  const targetLuminance = getRelativeLuminance(targetColor);

  // Initialize variables to keep track of maximum contrast and the corresponding color
  let maxContrast = -1;
  let contrastColor;

  // Iterate through each color in the array
  for (let i = 0; i < rgbColors.length; i++) {
    const color = rgbColors[i];

    // Convert color to relative luminance
    const colorLuminance = getRelativeLuminance(color);

    // Calculate the contrast ratio between the target color and the current color
    const contrastRatio = calculateContrastRatio(
      colorLuminance,
      targetLuminance
    );

    // Update maxContrast and contrastColor if the current color has higher contrast
    if (contrastRatio > maxContrast) {
      maxContrast = contrastRatio;
      contrastColor = color;
    }
  }

  return contrastColor;
}

function getRelativeLuminance(rgbColor) {
  const [r, g, b] = rgbColor;
  const RsRGB = r / 255;
  const GsRGB = g / 255;
  const BsRGB = b / 255;

  const RsRGBAdj =
    RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
  const GsRGBAdj =
    GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
  const BsRGBAdj =
    BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * RsRGBAdj + 0.7152 * GsRGBAdj + 0.0722 * BsRGBAdj;
}

function calculateContrastRatio(luminance1, luminance2) {
  const lighterLuminance = Math.max(luminance1, luminance2);
  const darkerLuminance = Math.min(luminance1, luminance2);
  return (lighterLuminance + 0.05) / (darkerLuminance + 0.05);
}
