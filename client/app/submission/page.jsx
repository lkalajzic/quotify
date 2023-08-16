'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Home() {
  const [quote, setQuote] = useState('');
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedQuotes, setSubmittedQuotes] = useState([]);
  const [submittedImages, setSubmittedImages] = useState([]);
  const [resultImage, setResultImage] = useState([]);
  const [uploadInterface, setUploadInterface] = useState(true);
  const [fontFamily, setFontFamily] = useState('serif');
  const [fontSize, setFontSize] = useState(35);
  const [fontColor, setFontColor] = useState('#232626');
  const [customizationChanges, setCustomizationChanges] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetchSubmittedData();
  }, []);

  const fetchSubmittedData = () => {
    fetch(`${backendUrl}/api/submitted-data`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSubmittedQuotes(data.quotes);
          setSubmittedImages(
            data.images.map((imagePath) => `${backendUrl}/${imagePath}`),
          );
        }
      })
      .catch((error) => {
        console.error('Error fetching submitted data:', error);
      });
  };

  const handleQuoteSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/submit-quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quote: quote,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage('');
        setQuote(''); // Clear the quote input field after successful submission
        fetchSubmittedData(); // Fetch updated submitted data
      }
    } catch (error) {
      setErrorMessage('An error occurred while submitting the quote.');
    }
  };

  const handleImageSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    // Loop through the array of selected files and append each to the formData
    for (let i = 0; i < image.length; i++) {
      formData.append('images', image[i]);
    }

    try {
      const response = await fetch(`${backendUrl}/api/submit-images`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!data.success) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage('');
        setImage([]); // Clear the image array after successful submission
        fetchSubmittedData(); // Fetch updated submitted data
      }
    } catch (error) {
      setErrorMessage('An error occurred while uploading the images.');
    }
  };

  const handleQuoteProcessing = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/get-quotes`, {
        method: 'GET',
      });
      const data = await response.json();
      if (!data.success) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage('');
        fetchSubmittedData(); // Fetch updated submitted data
      }
    } catch (error) {
      setErrorMessage('An error occurred while processing quotes.');
    }
  };

  const handleQuotePreview = async () => {
    try {
      const queryParams = new URLSearchParams({
        fontFamily: fontFamily,
        fontSize: fontSize,
        fontColor: fontColor,
      });

      const response = await fetch(
        `${backendUrl}/api/get-previews?${queryParams}`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();
      if (!data.success) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage('');
        setResultImage(data.processedImagePath);
        setUploadInterface(false);
      }
    } catch (error) {
      setErrorMessage('An error occurred while processing quotes.');
    }
  };

  const handleCustomizationUpdate = () => {
    setCustomizationChanges(true);
    handleQuotePreview(); // Trigger the preview update
  };

  return (
    <div className="flex">
      {uploadInterface ? (
        <div className="flex flex-col">
          <div className="flex">
            <div className="w-1/2 p-4">
              <form onSubmit={handleQuoteSubmit}>
                <textarea
                  className="w-[800px] h-[400px]"
                  name="quote"
                  placeholder="Enter your quote"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                />
                <button type="submit">Submit Quote</button>
              </form>

              <form onSubmit={handleImageSubmit} encType="multipart/form-data">
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={(e) => setImage(e.target.files)}
                />
                <button type="submit">Upload Images</button>
              </form>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>

            <div className="w-1/2 p-4">
              {submittedQuotes.length > 0 && (
                <div>
                  <h2>Your submitted quotes:</h2>
                  <ul className="list-disc ml-6">
                    {submittedQuotes.map((quote, index) => (
                      <li className="whitespace-pre-wrap" key={index}>
                        {quote}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {submittedImages.length > 0 && (
                <div>
                  <h2>Submitted Images</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {submittedImages.map((imageUrl, index) => (
                      <Image
                        key={index}
                        src={imageUrl}
                        width={100}
                        height={100}
                        alt={`Image ${index}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button onClick={handleQuotePreview}>Continue</button>
          </div>
        </div>
      ) : (
        <div className="flex">
          <button onClick={handleQuotePreview}>Continue</button>
          <div className="w-1/2 p-4">
            <h2>Customization</h2>
            <label htmlFor="fontFamily">Font Family:</label>
            <select
              id="fontFamily"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="serif">Serif</option>
              <option value="sans-serif">Sans-serif</option>
              <option value="monospace">Monospace</option>
              <option value="cursive">Cursive</option>
              <option value="fantasy">Fantasy</option>
            </select>
            <label htmlFor="fontSize">Font Size:</label>
            <input
              type="number"
              id="fontSize"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
            />
            <label htmlFor="fontColor">Font Color:</label>
            <input
              type="color"
              id="fontColor"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
            />
            <button onClick={handleCustomizationUpdate}>Update Preview</button>
          </div>

          <div>
            {resultImage ? (
              <Image
                src={`${backendUrl}/${resultImage}`}
                width={400}
                height={400}
                alt={`Processed Image`}
              />
            ) : (
              <p>N/A</p>
            )}
          </div>

          <button
            onClick={handleCustomizationUpdate}
            className="border-2 border-gray-300 rounded-md p-2 m-2"
            type="button"
          >
            Generate And Download All Images
          </button>
        </div>
      )}
    </div>
  );
}
