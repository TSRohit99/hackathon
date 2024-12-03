import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState) {
    console.log('Already connected to the database');
    return;
  }
  await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URI + '/hackathon-practice');
  console.log('Connected to MongoDB');
};

export default connectDB;