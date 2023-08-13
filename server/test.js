import { applyQuoteToImage } from './quoteImageProcessor.js';

const testQuote = "The more I listen to this - the better my life gets:\n If they don’t have what you want, don’t listen to what they say.\n -Alex Hormozi";
const testQuote2 = "Things either get us closer to our goal or they don’t. Simple as that. And if they don’t, they’re taking up the time and effort that could’ve gone towards something that does. That is the real loss. What we could’ve done but didn’t.";
const testImagePath = '/Users/luka/Desktop/quotify/server/uploads/1691930324182-background.png'; // Replace with the path to the test image you want to use

applyQuoteToImage(testQuote, testImagePath);
applyQuoteToImage(testQuote2, testImagePath);