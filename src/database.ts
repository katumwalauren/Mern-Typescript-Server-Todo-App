import { config } from 'dotenv';
import { MongoClient, MongoClientOptions, ServerApiVersion } from 'mongodb';

config();

const uri: string = process.env.MONGODB_URL || "mongodb://localhost:27017/todos";

const options: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient | undefined;

const connectToMongoDB = async (): Promise<MongoClient> => {
  if (!client) {
    try {
      client = await MongoClient.connect(uri, options);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }
  return client;
};

const getConnectedClient = (): MongoClient | undefined => client;

export { connectToMongoDB, getConnectedClient };