import { NextRequest, NextResponse } from 'next/server';

import { connectToDB } from '@/utils/database';
import { createNewUser, checkIfUserExists } from '@/utils/actions';

export async function POST(request) {
  const { email } = await request.json();
  await connectToDB();

  try {
    const userExists = await checkIfUserExists(email);
    if (!userExists) {
      const response = await createNewUser(email);
      //   if (response) {
      //     const res = await fetch('https://api.clerk.com/v1/invitations', {
      //       method: 'POST',
      //       headers: {
      //         Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      //       },
      //       body: JSON.stringify({
      //         email_address: email,
      //         public_metadata: {},
      //         redirect_url: 'https://localhost:3000/sign-up',
      //       }),
      //     });
      //   }
    }

    return NextResponse.json('Hello', { status: 200 });
  } catch (err) {
    console.log(err);
    await fetch('https://api.clerk.com/v1/invitations', {
      method: 'POST',
      body: JSON.stringify({
        email_address: email,
        public_metadata: {},
        redirect_url: 'https://localhost:3000/sign-up',
      }),
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });
    return NextResponse.json('An error has occured!', { status: 404 });
  }

  return NextResponse.json('Internal server error', { status: 500 });
}
