const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');

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

// Route for submitting quotes
app.post('/api/submit-quote', (req, res) => {
  const { quote } = req.body;
  if (quote) {
    if (Array.isArray(quote)) {
      // If multiple quotes are submitted as an array
      quotes.push(...quote);
    } else {
      // If a single quote is submitted
      quotes.push(quote);
    }
    res.json({ success: true, message: 'Quotes submitted successfully.' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid input.' });
  }
});

// Multer configuration for handling file uploads
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // The directory where uploaded images will be stored
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Set the file name to be unique
    },
  });
  
  const upload = multer({ storage: storage }); // Set up the multer middleware

// Route for submitting multiple images
app.post('/api/submit-images', upload.array('images'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, message: 'No images uploaded.' });
  }

  // You can access the array of uploaded files using req.files
  const imagePaths = req.files.map((file) => file.path);

  res.json({ success: true, message: 'Images submitted successfully.', images: imagePaths });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
