import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
      <div className="mx-[40px] my-[18px] flex items-center justify-between gap-8 sm:flex-row sm:gap-0">
        <div className="h-[40px] w-[145px]">
          <Link href="/">
            <Image
              src="/logo.png"
              className=""
              width={316}
              height={100}
              alt="logo"
            />
          </Link>
        </div>
        <div className="flex items-center gap-8">
          <Link href="/">
            <p className="text-blue-600 hover:underline">Home</p>
          </Link>
          <Link href="/pricing">
            <p className="text-gray-600 hover:underline">Pricing</p>
          </Link>
        </div>
        <div className="hidden items-center gap-4 sm:flex">
          <button
            className="rounded-md px-[18px] py-[10px] text-gray-600  hover:shadow-lg"
            onClick={{}}
          >
            Log in
          </button>
          <button
            className="rounded-md bg-blue-600 px-[18px] py-[10px] text-white  hover:shadow-lg"
            onClick={{}}
          >
            Sign up
          </button>
        </div>
      </div>
      <hr className="border-gray-100" />
    </nav>
  );
};

export default Navbar;
