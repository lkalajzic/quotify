import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="mt-12">
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="font-semibold text-[48px] text-gray-900">
          Simple, transparent pricing
        </h1>
        <div>Simple, transparent pricing that grows with you.</div>
      </div>
      <div className="flex m-8 justify-evenly">
        <div className="flex flex-col w-[384px] h-[440px] gap-5 items-center shadow-md rounded-xl mt-8">
          <Image
            className="mt-4"
            src="/free.png"
            width={50}
            height={50}
            alt=""
          />
          <div className="text-blue-600">Free plan</div>
          <div className="text-[48px] text-gray-900 flex flex-col">
            €0
            <span className="text-gray-600 text-[14px]">per month</span>
          </div>
          <div>
            <div className="flex flex-row items-center gap-4 text-gray-600">
              <Image
                src="/check.png"
                width={30}
                height={30}
                alt=""
                className="items-left"
              />
              <div>30 free credits</div>
            </div>
            <div className="flex flex-row items-center gap-4 text-gray-600">
              <Image
                src="/check.png"
                width={30}
                height={30}
                alt=""
                className="items-left"
              />
              <div>Basic chat and email support</div>
            </div>
          </div>
          <Link href="sign-up">
            <button className="rounded-md bg-blue-600 px-[18px] py-[10px] text-white  hover:shadow-lg mt-12">
              Get started
            </button>
          </Link>
        </div>
        <div className="flex flex-col w-[384px] h-[520px] gap-5 items-center shadow-md border border-blue-600 rounded-xl">
          <Image
            className="mt-12"
            src="/premium.png"
            width={50}
            height={50}
            alt=""
          />
          <div className="text-blue-600 text-[24px]">Premium plan</div>
          <div className="flex flex-col items-center">
            <div className="text-[48px] text-gray-900 flex flex-col">€7.99</div>
            <span className="text-gray-600 text-[14px]">per month</span>
          </div>
          <div>
            <div className="flex flex-row items-center gap-4 text-gray-600">
              <Image
                src="/check.png"
                width={30}
                height={30}
                alt=""
                className="items-left"
              />
              <div>500 credits</div>
            </div>
            <div className="flex flex-row items-center gap-4 text-gray-600">
              <Image
                src="/check.png"
                width={30}
                height={30}
                alt=""
                className="items-left"
              />
              <div>24 hour chat and email support</div>
            </div>
            <div className="flex flex-row items-center gap-4 text-gray-600">
              <Image
                src="/check.png"
                width={30}
                height={30}
                alt=""
                className="items-left"
              />
              <div>Priority processing</div>
            </div>
          </div>
          <a
            href="/checkout"
            className="rounded-md bg-blue-600 px-[48px] py-[10px] text-white  hover:shadow-lg mt-8 "
          >
            Get started
          </a>
        </div>
      </div>
    </main>
  );
}
