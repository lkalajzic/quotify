'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDropzone } from 'react-dropzone';
import { useUser } from '@clerk/nextjs';

import { getUser } from '@/utils/actions';

export default function Home() {
  const { user, isLoaded } = useUser();
  const [userCredits, setUserCredits] = useState(undefined);
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
  const [textWidth, setTextWidth] = useState(50); // Default to font size
  const [rectangleColor, setRectangleColor] = useState('#ffffffcc'); // Default off white
  const [firstDownload, setfirstDownload] = useState(true);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (isLoaded) {
      getLocalUserInfo();
    }
    fetchSubmittedData();
  }, [isLoaded]);

  const getLocalUserInfo = async () => {
    const response = await fetch(
      `/api/find-user/${user.emailAddresses[0].emailAddress}`,
    );
    const userInfo = await response.json();

    if (!userInfo) {
      if (!localStorage.getItem('quotify_user')) {
        localStorage.setItem(
          'quotify_user',
          JSON.stringify({
            credits: 30,
          }),
        );
      }
      setUserCredits(JSON.parse(localStorage.getItem('quotify_user')).credits);
    } else {
      localStorage.setItem(
        'quotify_user',
        JSON.stringify({
          credits: -1,
        }),
      );
    }
  };

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

  const handleQuotePreview = async () => {
    try {
      const queryParams = new URLSearchParams({
        fontFamily: fontFamily,
        fontSize: fontSize,
        fontColor: fontColor,
        textWidth: textWidth,
        rectangleColor: rectangleColor,
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

  const handleQuoteProcessing = async () => {
    if (userCredits === 0) {
      alert('Insufficient credits! Please buy a premium plan.');
      return;
    }

    if (userCredits !== -1) {
      setUserCredits(userCredits - submittedQuotes.length);
      localStorage.setItem(
        'quotify_user',
        JSON.stringify({
          credits: userCredits - submittedQuotes.length,
        }),
      );
    }

    try {
      const queryParams = new URLSearchParams({
        fontFamily: fontFamily,
        fontSize: fontSize,
        fontColor: fontColor,
        textWidth: textWidth,
        rectangleColor: rectangleColor,
      });

      const response = await fetch(
        `${backendUrl}/api/get-quotes?${queryParams}`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();
      console.log('data', data.generatedImagePaths);

      for (let i = 0; i < data.generatedImagePaths.length; i++) {
        await download(`${backendUrl}/${data.generatedImagePaths[i]}`);
      }

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

  const handleCustomizationUpdate = () => {
    setCustomizationChanges(true);
    new Promise((resolve) => setTimeout(resolve, 3000)); // 3 sec
    handleQuotePreview(true); // Trigger the preview update
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setImage(acceptedFiles);
    },
  });

  async function toDataURL(url) {
    const blob = await fetch(url).then((res) => res.blob());
    return URL.createObjectURL(blob);
  }

  async function download(url) {
    if (firstDownload) {
      setfirstDownload(false);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 sec
    }
    const a = document.createElement('a');
    a.href = await toDataURL(url);
    a.download = 'myImage.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

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
          <div className="w-1/2 m-12 flex flex-col gap-4 font-semibold">
            <h2 className="text-[30px] font-semibold">Customization</h2>
            <label htmlFor="fontFamily">Font Family:</label>
            <select
              className="border-[3px] border-blue-600 border-dotted max-w-[100px]"
              id="fontFamily"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="serif">Serif</option>
              <option value="sans-serif">Sans-serif</option>
              <option value="cursive">Cursive</option>
            </select>
            <label htmlFor="fontSize">Font Size:</label>
            <input
              className="border-[3px] border-blue-600 border-dotted max-w-[100px]"
              type="number"
              id="fontSize"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
            />
            <label htmlFor="textWidth">Text Width:</label>
            <input
              className="border-[3px] border-blue-600 border-dotted max-w-[100px]"
              type="number"
              id="textWidth"
              value={textWidth}
              onChange={(e) => setTextWidth(parseInt(e.target.value))}
            />
            <label className="underline underline-offset-3" htmlFor="fontColor">
              Font Color:
            </label>
            <input
              type="color"
              id="fontColor"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
            />
            <label
              className="underline underline-offset-3"
              htmlFor="rectangleColor"
            >
              Rectangle Color:
            </label>
            <input
              type="color"
              id="rectangleColor"
              value={rectangleColor}
              onChange={(e) => setRectangleColor(e.target.value)}
            />
            <div className="flex gap-4 mt-6">
              <button
                className="rounded-md border border-dashed border-blue-600 px-[14px] py-[6px] w-[200px] text-gray-600 hover:shadow-lg"
                onClick={handleCustomizationUpdate}
              >
                Update Preview
              </button>
              <button
                className="rounded-md bg-blue-600 px-[14px] py-[14px] w-[350px] text-white hover:shadow-lg "
                onClick={handleQuoteProcessing}
              >
                Generate And Download All Images
              </button>
            </div>
          </div>

          <div className="flex items-center">
            {resultImage ? (
              <Image
                className="shadow-xl"
                src={`${backendUrl}/${resultImage}`}
                width={400}
                height={400}
                alt={`Processed Image`}
              />
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
