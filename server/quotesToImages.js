const { applyQuoteToImage } = require('./quoteImageProcessor');


let i = 0;
for (quote in quotes) {
    if (i > images.size()) i = 0;
    applyQuoteToImage(quote, images[i]);
}