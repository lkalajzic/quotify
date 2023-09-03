'use client';

import { useUser } from '@clerk/nextjs';
import React from 'react';
import Image from 'next/image';
import { useEffect, useCallback, useState } from 'react';

const Page = () => {
  const { user, isLoaded } = useUser();
  const [images, setImages] = useState(null);

  const deleteImage = async (image) => {
    const response = await fetch(
      `/api/find-user/${user.emailAddresses[0].emailAddress}`,
      {
        method: 'DELETE',
        body: JSON.stringify({
          imagePath: image,
        }),
      },
    );
    if (response.status === 200) {
      setImages(null);
      alert('Image removed successfully!');
    }
  };

  const getImages = useCallback(async () => {
    const response = await fetch(
      `/api/find-user/${user.emailAddresses[0].emailAddress}`,
    );
    const userInfo = await response.json();
    console.log(userInfo);
    setImages(userInfo.images);
  }, [isLoaded, images]);

  async function toDataURL(url) {
    const blob = await fetch(url).then((res) => res.blob());
    return URL.createObjectURL(blob);
  }

  async function downloadImage(url) {
    const a = document.createElement('a');
    a.href = await toDataURL(url);
    a.download = 'myImage.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  useEffect(() => {
    if (isLoaded) {
      getImages();
    }
  }, [isLoaded]);

  return (
    <main className="flex w-full justify-center items-center min-h-screen py-8 px-10">
      <div className="flex flex-wrap gap-x-6 gap-y-10">
        {images &&
          images.map((image, idx) => (
            <div className="flex relative">
              <Image
                key={idx}
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${image}`}
                width={400}
                height={400}
                className="object-contain"
                alt="image"
              />
              <Image
                className="absolute cursor-pointer bg-white p-1 top-4 left-7 rounded-md"
                src="/download.svg"
                width={30}
                height={30}
                onClick={() =>
                  downloadImage(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/${image}`,
                  )
                }
              />
              <Image
                className="absolute cursor-pointer bg-white p-1 top-4 right-7 rounded-md"
                src="/trash.svg"
                width={30}
                height={30}
                onClick={() => deleteImage(image)}
              />
            </div>
          ))}
      </div>
    </main>
  );
};

export default Page;
