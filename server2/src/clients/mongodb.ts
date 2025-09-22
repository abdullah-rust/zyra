// db.js
import { MongoClient } from "mongodb";

const uri = "mongodb://admin:226622@localhost:27017/?authSource=admin";

const client = new MongoClient(uri, {
  maxPoolSize: 20, // max active connections
  minPoolSize: 5, // idle connections ready
  connectTimeoutMS: 10000,
});

let db: any;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("zyradb"); // apni DB ka naam
    console.log("✅ Connected to MongoDB with connection pool");
  }
  return db;
}

export async function getDB() {
  if (!db) {
    throw new Error("DB not connected! Call connectDB() first.");
  }
  return db;
}
