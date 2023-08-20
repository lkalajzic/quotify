import { applyQuoteToImage } from "./quoteImageProcessor.js";

const testQuote =
  "The more I listen to this - the better my life gets:\n\n If they don’t have what you want, don’t listen to what they say.\nAlex Hormozi";
const testQuote2 =
  "Things either get us closer to our goal or they don’t. \nSimple as that. And if they don’t, they’re taking up the time and effort that could’ve gone towards something that does. That is the real loss. What we could’ve done but didn’t.";
const testQuote3 = `How do you win a game of chicken?
  Where two cars go full speed towards each other…
  And one has to pull away?
  Here’s how:You rip out the wheel.And make sure the other guy sees it.
  Same method Napoleon Bonaparte used to win wars.
  Same mindset you need to win in business.
  
  - George Ten`;
const testQuote4 = `“Instruction does much, but encouragement, everything.”\n —Johann Wolfgang von Goethe`;
const testImagePath =
  "/Users/luka/Desktop/quotify/server/uploads/1692549113640-1690060016118-logo.jpeg"; // Replace with the path to the test image you want to use

applyQuoteToImage(testQuote, testImagePath, "serif", 40, "#000");
applyQuoteToImage(testQuote2, testImagePath, "serif", 40, "#000");
applyQuoteToImage(testQuote3, testImagePath, "serif", 40, "#000");
applyQuoteToImage(testQuote4, testImagePath, "serif", 40, "#000");
