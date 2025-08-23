import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const email = process.argv[2];
if (!email) { console.error('Usage: node src/scripts/makeAdmin.js <email>'); process.exit(1); }

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const res = await User.updateOne({ email }, { $set: { isAdmin: true } });
  console.log('Updated:', res);
  await mongoose.disconnect();
};
run();
