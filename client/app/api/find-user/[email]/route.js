import { NextRequest, NextResponse } from 'next/server';

import { connectToDB } from '@/utils/database';
import { getUser } from '@/utils/actions';
import User from '@/models/User';

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

export async function POST(request, context) {
  const email = context.params.email;
  const { credits, imagePath } = await request.json();
  await connectToDB();

  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        $push: {
          images: { $each: imagePath },
        },
      },
      { new: true },
    );
    if (user) {
      return NextResponse.json('Image added', { status: 200 });
    }

    return NextResponse.json('Error user not found!', { status: 404 });
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json('An error has occured!', { status: 500 });
  }

  return NextResponse.json('Internal Server Error', { status: 500 });
}

export async function DELETE(request, context) {
  const email = context.params.email;
  const { credits, imagePath } = await request.json();
  await connectToDB();

  try {
    const user = await User.findOneAndUpdate(
      { email: email },
      {
        $pull: {
          images: imagePath,
        },
      },
      { new: true },
    );
    if (user) {
      return NextResponse.json('Image removed', { status: 200 });
    }

    return NextResponse.json('Error user not found!', { status: 404 });
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json('An error has occured!', { status: 500 });
  }

  return NextResponse.json('Internal Server Error', { status: 500 });
}
