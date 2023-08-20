'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';

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
  const [fontColor, setFontColor] = useState('#000');
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

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles);
    },
  });

  return (
    <div>
      {uploadInterface ? (
        <div className="flex flex-col">
          <h1 className="pt-8 pl-8 text-[30px] font-semibold">
            Generate quote images
          </h1>
          <div className="flex flex-col lg:flex-row w-full">
            <div className="w-1/2 p-8  flex flex-col gap-4">
              <div className="m-2 text-[20px] font-semibold">
                Paste your quotes
              </div>
              <form onSubmit={handleQuoteSubmit}>
                <textarea
                  className="w-[628px] h-[128px] border border-[#D0D5DD] shadow-sm rounded-lg text-[15px]"
                  name="quote"
                  placeholder="We make our fortunes and we call them fate. -Benjamin Disraeli. ;;; Named must your fear be before banish it you can. - Yoda"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                />
                <div className="text-blue-600 mt-4">
                  Each quote should be separated by three semicolons (;;;).
                </div>
                <button
                  className="rounded-md border border-dashed border-blue-600 px-[14px] py-[6px] text-gray-600 hover:shadow-lg mt-4"
                  type="submit"
                >
                  Submit Quote
                </button>
              </form>

              <div className="mt-8 text-[20px] font-semibold">
                Upload your images
              </div>
              <form className="mt-4" onSubmit={handleImageSubmit}>
                <div
                  {...getRootProps()}
                  className="text-sm cursor-pointer border-[1.2px] border-dashed border-blue-600 w-[628px] h-[128px] rounded-xl flex items-center justify-center"
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col justify-center items-center gap-1">
                    <Image src="/../public/upload.png" width={40} height={40} />
                    <div>
                      <span className="text-blue-600">Click to upload </span> or
                      drag and drop images here
                    </div>
                    <div>SVG, PNG, JPG or JPEG</div>
                  </div>
                </div>
                <div>
                  <button
                    className="rounded-md border border-dashed border-blue-600 px-[14px] py-[6px] text-gray-600 hover:shadow-lg mt-6"
                    type="submit"
                  >
                    Upload Images
                  </button>
                </div>
              </form>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>

            <div className="w-1/2 p-4">
              {submittedQuotes.length > 0 && (
                <div>
                  <h2 className="m-2 text-[20px] font-semibold">
                    Submitted quotes:
                  </h2>
                  <ul className="list-disc mx-2">
                    {submittedQuotes.map((quote, index) => (
                      <ul
                        className="whitespace-pre-wrap border border-blue-600 mb-4 p-2 rounded-lg hover:shadow-lg"
                        key={index}
                      >
                        {quote}
                      </ul>
                    ))}
                  </ul>
                </div>
              )}

              {submittedImages.length > 0 && (
                <div>
                  <h2 className="m-2 text-[20px] font-semibold">
                    Submitted Images
                  </h2>
                  <div className="grid grid-cols-5 gap-1 mx-2">
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

          <div className="flex justify-center m-8">
            <button
              className="rounded-md bg-blue-600 px-[60px] py-[14px] text-white hover:shadow-lg"
              onClick={handleQuotePreview}
            >
              Continue
            </button>
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
