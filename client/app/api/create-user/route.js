import { NextRequest, NextResponse } from 'next/server';

import { connectToDB } from '@/utils/database';
import { createNewUser, checkIfUserExists } from '@/utils/actions';

export async function POST(request) {
  const { email } = await request.json();
  await connectToDB();

  try {
    const userExists = await checkIfUserExists(email);
    if (!userExists) {
      await createNewUser(email);
    }

    return NextResponse.json('User created!', { status: 200 });
  } catch (err) {
    console.log(err);

    return NextResponse.json('An error has occured!', { status: 404 });
  }

  return NextResponse.json('Internal server error', { status: 500 });
}
