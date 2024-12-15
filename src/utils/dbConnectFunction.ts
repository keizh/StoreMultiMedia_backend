import mongoose from "mongoose";

// Promise denotes  promise is being performed
// void denotes the return type of the function
async function dbConnect(): Promise<void> {
  try {
    const mongoURL: string = process.env.MONGODB ?? "";
    const dbConnectObject = await mongoose.connect(mongoURL);
    if (dbConnectObject) {
      console.log(`Successfully made MONGODB connection`);
    }
  } catch (error: unknown) {
    console.log(
      `Failed to Make DB Connection`,
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}

export default dbConnect;
