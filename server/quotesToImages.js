import { applyQuoteToImage } from "./quoteImageProcessor";
import { quotes, images } from "./server";

export const processImagesWithQuotes = async () => {
  try {
    // Loop through each submitted quote
    for (let i = 0; i < quotes.length; i++) {
      const quote = quotes[i];
      const imagePath = images[i % images.length]; // Use modulo to cycle through images

      // Apply the quote to the image
      await applyQuoteToImage(quote, imagePath);
    }
  } catch (error) {
    console.error("Error applying quotes to images:", error);
  }
};
