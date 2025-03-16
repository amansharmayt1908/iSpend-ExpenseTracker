import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI || 'your_local_mongodb_uri';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log(`MongoDB Connected: ✅`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB; 