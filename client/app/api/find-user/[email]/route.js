import { NextRequest, NextResponse } from 'next/server';

import { connectToDB } from '@/utils/database';
import { getUser } from '@/utils/actions';

export async function GET(NextRequest, context) {
  const email = context.params.email;
  await connectToDB();

  try {
    const user = await getUser(email);
    if (!user) {
      return NextResponse.json(null, { status: 203 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.log(err);

    return NextResponse.json('An error has occured!', { status: 403 });
  }

  return NextResponse.json('Internal server error', { status: 500 });
}
