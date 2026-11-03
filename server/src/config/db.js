import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer;

export async function connectMongoDB() {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri) {
      await mongoose.connect(mongoUri);
    } else {
      memoryServer = await MongoMemoryServer.create();
      const uri = memoryServer.getUri();
      await mongoose.connect(uri, {
        dbName: 'gym-fitness-tracker',
      });
    }

    console.log(`MongoDB connected: ${mongoose.connection.host}`);
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
}

export async function disconnectMongoDB() {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
