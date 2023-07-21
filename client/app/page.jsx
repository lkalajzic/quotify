import Image from 'next/image';

export default function Home() {
  return (
    <main>
      <div className="mx-6 my-12 flex flex-col items-center gap-12 md:mx-32 lg:flex-row lg:gap-4">
        <div className="mx-auto flex flex-1 flex-col items-start gap-6">
          <h1 className="text-[36px] font-semibold text-gray-900 md:text-[56px] md:leading-[72px]">
            Combine Hundreds of <span className="text-blue-600">Quotes</span> &{' '}
            <span className="text-blue-600">Images</span> into Posts in Seconds
          </h1>
          <div className="text-gray-600">
            Transform your favorite quotes into captivating visuals. Create 50
            quote images for free.
          </div>
          <div className="mt-6 flex items-center gap-6">
            <button
              className="rounded-md border border-r-[#D0D5DD] px-[32px] py-[10px] text-gray-600 hover:shadow-lg"
              onClick={{}}
            >
              Demo
            </button>
            <button
              className="rounded-md bg-blue-600 px-[18px] py-[10px] text-white hover:shadow-lg"
              onClick={{}}
            >
              Try it now!
            </button>
          </div>
        </div>
        <div className="flex-1">
          <Image
            src="/demo.webp"
            className="relative"
            width={1200}
            height={900}
            alt="demo images"
          />
        </div>
      </div>

      <form action="/api/submit-image" method="post" enctype="multipart/form-data">
        <input type="file" name="images" accept="image/*" multiple />
        <button type="submit">Upload Images</button>
      </form>

    </main>
  );
}
