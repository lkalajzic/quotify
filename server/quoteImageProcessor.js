import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { createCanvas, loadImage } from "canvas";
import wrap from "word-wrap";

// Function to apply a quote to an image using canvas
export const applyQuoteToImage = async (
  quote,
  imagePath,
  fontFamily,
  fontSize,
  fontColor,
  textWidth,
  rectangleColor
) => {
  try {
    const img = await loadImage(imagePath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Use fontFamily, fontSize, and fontColor for customization
    ctx.font = `${fontSize}px ${fontFamily}`;

    const maxRectWidth = canvas.width * 0.8;
    const lineHeight = 1.2; // Line height factor

    const wrappedQuote = wrap(quote, { width: textWidth });
    console.log(wrappedQuote);

    let newlineCount = 0;
    if (/[\r\n]{2,}/.test(quote)) newlineCount++;
    for (let i = 0; i < quote.length; i++) {
      if (quote[i] === "\n") {
        newlineCount++;
      }
    }

    const totalHeight =
      (ctx.measureText(wrappedQuote).actualBoundingBoxAscent +
        ctx.measureText(wrappedQuote).actualBoundingBoxDescent) *
      lineHeight;

    // Determine rectangle height and position
    const rectHeight = totalHeight + fontSize * 3;
    const rectX = (canvas.width - maxRectWidth) / 2;
    const rectY = (canvas.height - rectHeight) / 2;

    // Draw rounded rectangle with semi-transparent fill
    ctx.fillStyle = rectangleColor;
    ctx.strokeStyle = rectangleColor;
    const radius = 30;

    ctx.beginPath();
    ctx.moveTo(rectX + radius, rectY);
    ctx.lineTo(rectX + maxRectWidth - radius, rectY);
    ctx.quadraticCurveTo(
      rectX + maxRectWidth,
      rectY,
      rectX + maxRectWidth,
      rectY + radius
    );
    ctx.lineTo(rectX + maxRectWidth, rectY + rectHeight - radius);
    ctx.quadraticCurveTo(
      rectX + maxRectWidth,
      rectY + rectHeight,
      rectX + maxRectWidth - radius,
      rectY + rectHeight
    );
    ctx.lineTo(rectX + radius, rectY + rectHeight);
    ctx.quadraticCurveTo(
      rectX,
      rectY + rectHeight,
      rectX,
      rectY + rectHeight - radius
    );
    ctx.lineTo(rectX, rectY + radius);
    ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);
    ctx.closePath();

    ctx.fillStyle = rectangleColor;
    ctx.fill();
    ctx.strokeStyle = rectangleColor;
    ctx.stroke();

    // Draw text
    ctx.fillStyle = fontColor;

    // Calculate the width of the wrapped text
    const wrappedTextWidth = ctx.measureText(wrappedQuote).width;

    // Draw the centered wrapped text
    const x = (canvas.width - wrappedTextWidth) / 2;
    let y = (canvas.height - totalHeight) / 2 + fontSize * 0.8;

    let lines = wrappedQuote.split("\n");
    console.log("lajne", lines);
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, y);
      y += fontSize * lineHeight;
    }

    // Save the image with the quote applied
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const outputDir = path.join(__dirname, "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const outputImagePath = `output/wallpaper_${Date.now()}.jpg`; // Relative path
    const out = fs.createWriteStream(outputImagePath);
    const stream = canvas.createJPEGStream();
    stream.pipe(out);
    console.log(`Image with quote applied saved at: ${outputImagePath}`);

    return outputImagePath; // Return the relative URL path
  } catch (error) {
    console.error("Error applying quote to image:", error);
  }
};
