import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { createCanvas, loadImage } from "canvas";

// Function to apply a quote to an image using canvas
export const applyQuoteToImage = async (
  quote,
  imagePath,
  fontFamily,
  fontSize,
  fontColor
) => {
  try {
    const img = await loadImage(imagePath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Use fontFamily, fontSize, and fontColor for customization
    ctx.font = `${fontSize}px ${fontFamily}`;

    const maxRectWidth = canvas.width * 0.85;
    const lineHeight = 1.3; // Line height factor
    let newlineCount = 0;

    for (let i = 0; i < quote.length; i++) {
      if (quote[i] === "\n") {
        newlineCount++;
      }
    }

    const paragraphs = quote.split("\n"); // Split the quote into paragraphs

    // Measure text size
    const wrappedLines = [];
    const words = quote.split(" ");
    let line = "";
    for (const word of words) {
      const testLine = `${line} ${word}`;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxRectWidth) {
        wrappedLines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    }
    wrappedLines.push(line);

    const totalHeight =
      (wrappedLines.length + newlineCount) * fontSize * lineHeight;

    // Determine rectangle height and position
    const rectHeight = totalHeight + fontSize * 2;
    const rectX = (canvas.width - maxRectWidth) / 2;
    const rectY = (canvas.height - rectHeight) / 2;

    // Draw rounded rectangle with semi-transparent fill
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.lineWidth = 10;
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

    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.stroke();

    // Draw text
    ctx.fillStyle = fontColor;
    let y = rectY * 1.12;
    for (const paragraph of paragraphs) {
      const lines = paragraph.split("\n"); // Split each paragraph into lines

      let paragraphHeight = 0;

      for (const rawLine of lines) {
        const words = rawLine.split(" ");
        let line = ""; // Build the wrapped line

        for (const word of words) {
          const testLine = line ? `${line} ${word}` : word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxRectWidth - 50) {
            // Draw the previous wrapped line
            ctx.fillText(
              line,
              (canvas.width - ctx.measureText(line).width) / 2,
              y + paragraphHeight + fontSize
            );

            // Start a new wrapped line
            line = word;
            paragraphHeight += fontSize * lineHeight;
          } else {
            line = testLine;
          }
        }

        if (line) {
          // Draw the remaining wrapped line
          ctx.fillText(
            line,
            (canvas.width - ctx.measureText(line).width) / 2,
            y + paragraphHeight + fontSize
          );
          paragraphHeight += fontSize * lineHeight;
        }
      }

      y += paragraphHeight + fontSize * lineHeight * 0.5; // Add extra spacing between paragraphs
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
