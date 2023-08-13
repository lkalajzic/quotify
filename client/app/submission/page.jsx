'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [quote, setQuote] = useState('');
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedQuotes, setSubmittedQuotes] = useState([]);
  const [submittedImages, setSubmittedImages] = useState([]);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchSubmittedData = () => {
    fetch(`${backendUrl}/api/submitted-data`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSubmittedQuotes(data.quotes);
          setSubmittedImages(data.images.map((imagePath) => `${backendUrl}/${imagePath}`));
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
    formData.append('images', image);

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
        setImage(null); // Clear the image input field after successful submission
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

  return (
    <main>
      <form onSubmit={handleQuoteSubmit}>
        <textarea
          name="quote"
          placeholder="Enter your quote"
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <form onSubmit={handleImageSubmit} encType="multipart/form-data">
        <input type="file" name="images" accept="image/*" multiple onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit">Upload Images</button>
      </form>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="my-12">
        <h2 className="text-2xl font-semibold text-gray-900">Submitted Quotes</h2>
        {submittedQuotes.length === 0 ? (
          <p>No quotes submitted yet.</p>
        ) : (
          <ul className="list-disc ml-6">
            {submittedQuotes.map((quote, index) => (
              <li className="whitespace-pre-wrap" key={index}>{quote}</li>
            ))}
          </ul>
        )}
        <h2 className="text-2xl font-semibold text-gray-900">Submitted Images</h2>
        {submittedImages.length === 0 ? (
          <p>No images submitted yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {submittedImages.map((imageUrl, index) => (
              <Image key={index} src={imageUrl} width={400} height={300} alt={`Image ${index}`} />
            ))}
          </div>
        )}
      </div>
      
      <button onClick={handleQuoteProcessing} className='border-2 border-gray-300 rounded-md p-2 m-2 hover:bg-gray-300 hover:text-gray-900 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500' type='button'>Process Quotes</button>
    </main>
  );
}
