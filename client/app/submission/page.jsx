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
      const response = await fetch(`${backendUrl}/api/get-previews`, {
        method: 'GET',
      });
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

  return (
    <div className="flex">
      {uploadInterface ? (
        <div className="flex flex-col">
          <div className="flex">
            <div className="w-1/2 p-4">
              <form onSubmit={handleQuoteSubmit}>
                <textarea
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
        <div>Edit quotes</div>
      )}
    </div>
  );
}
