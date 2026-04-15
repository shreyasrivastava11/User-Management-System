import mongoose from 'mongoose';

export async function connectDB(mongoUri) {
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
}
