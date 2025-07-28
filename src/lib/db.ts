import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}



async function connect() {
  await mongoose.connect(MONGODB_URI)

}
export default connect;
