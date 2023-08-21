'use client';

import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

import { createNewUser } from '@/utils/actions';
import { connectToDB } from '@/utils/database';

const CheckoutLoader = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded)
    return (
      <div className="h-screen w-screen flex flex-row items-center justify-center text-blue-600 text-[20px]">
        Loading...
      </div>
    );

  if (isLoaded) {
    return (
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        onLoad={() => {
          if (process.env.NEXT_PUBLIC_NODE_ENV !== 'production') {
            Paddle.Environment.set('sandbox');
          }

          Paddle.Setup({
            seller: Number(process.env.NEXT_PUBLIC_PADDLE_VENDORID),
            eventCallback: async (data) => {
              if (data.name === 'checkout.error') {
                console.log('paddle checkout error');
                alert('An error has occured! Please try agin!');
                router.push('/pricing');
              }

              if (data.name === 'checkout.completed') {
                console.log('Checkout completed!');

                const response = await fetch('/api/create-user', {
                  method: 'POST',
                  body: JSON.stringify({
                    email: user.emailAddresses[0].emailAddress,
                  }),
                });
              }

              if (data.name === 'checkout.closed') {
                router.push('/pricing');
              }
            },
          });

          Paddle.Checkout.open({
            items: [
              {
                priceId: 'pri_01h8aaq7m3zagfs1p7ybcjzrdf',
                quantity: 1,
              },
            ],
            frameInitialHeight: 1000,
            frameStyle:
              'width:100%; min-width:312px; background-color: transparent; border: none; min-height: 100vh; height: 100%; ',
            displayModeTheme: 'light',
          });
        }}
      />
    );
  }
};

export default CheckoutLoader;
