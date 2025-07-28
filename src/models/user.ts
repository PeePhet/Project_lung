import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema({
  symptom: {
    type: String,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,  // automatically set to now when added
  },
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  symptoms: {
    type: [symptomSchema],
    default: [],
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
