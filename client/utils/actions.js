import mongoose from 'mongoose';
import User from '../models/User';

export async function createNewUser(email) {
  try {
    const newUser = new User({
      email: email,
      paid: true,
      images: [],
    });

    const savedUser = await newUser.save();
    console.log('New user created:', savedUser);

    return savedUser;
  } catch (error) {
    console.error('Error creating user:', error);

    throw error;
  }
}

export async function checkIfUserExists(email) {
  try {
    const existingUser = await User.findOne({ email: email });
    return !!existingUser; // Returns true if user exists, false if not
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw error;
  }
}
