import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  paid: {
    type: Boolean,
    default: false,
  },
  credits: {
    type: Number,
    default: 30,
  },
  images: {
    type: [String],
    default: [],
  },
});

const User = mongoose.models?.User || mongoose.model('User', UserSchema);

export default User;
