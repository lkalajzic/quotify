import express from 'express';
const app = express();
const port = 8000;
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import {fileURLToPath} from 'url';

import { applyQuoteToImage } from './quoteImageProcessor.js';


// Allow requests from http://localhost:3000
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET route for the root path
app.get('/', (req, res) => {
  res.send('Hello!');
});

// Array to store user-submitted quotes
let quotes = [];

// Array to store submitted image paths
let images = [];

// Custom trim function to remove leading spaces and spaces between the last character and the delimiter
const customTrim = (str, delimiter) => {
  let trimmed = str.trim(); // Remove leading and trailing spaces
  if (delimiter) {
    const delimiterIndex = trimmed.lastIndexOf(delimiter);
    if (delimiterIndex !== -1) {
      const lastNonSpaceIndex = trimmed.length - 1;
      if (delimiterIndex === lastNonSpaceIndex) {
        // If the delimiter is at the last non-space character, remove any spaces before it
        trimmed = trimmed.substring(0, delimiterIndex).trim();
      } else {
        // If the delimiter is not at the last non-space character, keep the string as is
        trimmed = trimmed;
      }
    }
  }
  return trimmed;
};

// Route for submitting quotes
app.post('/api/submit-quotes', (req, res) => {
  const { quote } = req.body;

  if (quote) {
    if (Array.isArray(quote)) {
      // If multiple quotes are submitted as an array
      quote.forEach((individualQuote) => {
        const quotesArray = individualQuote.split(';;;');
        quotes.push(...quotesArray.map((q) => customTrim(q, ';;;')).filter((q) => q !== '')); // Trim and filter out empty strings
      });
    } else {
      // If a single quote is submitted
      const quotesArray = quote.split(';;;');
      quotes.push(...quotesArray.map((q) => customTrim(q, ';;;')).filter((q) => q !== '')); // Trim and filter out empty strings
    }

    console.log('Submitted Quotes:', quotes);
    res.json({ success: true, message: 'Quotes submitted successfully.' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid input.' });
  }
});

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // The directory where uploaded images will be stored
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Set the file name to be unique
    },
  });
  
  const upload = multer({ storage: storage }); // Set up the multer middleware

// Route for submitting images
app.post('/api/submit-images', upload.array('images'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded.' });
    }

    // Update the images array with the new image paths
    images.push(...req.files.map((file) => file.path));

    // Access the array of uploaded files using req.files
    console.log('Submitted Images:', images);

    res.json({ success: true, message: 'Images submitted successfully.', images: images });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ success: false, message: 'An error occurred while uploading the images.' });
  }
});


// Route for fetching submitted data (quotes and images)
app.get('/api/submitted-data', (req, res) => {
  res.json({ success: true, quotes, images });
});


app.get('/api/get-quotes', async (req, res) => {
  try {
    // Loop through each submitted quote
    for (let i = 0; i < quotes.length; i++) {
      const quote = quotes[i];
      const imagePath = images[i % images.length]; // Use modulo to cycle through images

      // Apply the quote to the image
      await applyQuoteToImage(quote, imagePath);
    }
  } catch (error) {
    console.error('Error applying quotes to images:', error);
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});