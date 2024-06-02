import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define the car schema
const carSchema = new Schema({
  name: { type: String, required: false },
  desc: { type: String, required: false },
  price: { type: Number, required: false },
  images: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Add a virtual property to get the car's ID as a string
carSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
carSchema.set("toJSON", { virtuals: true });

// Export the car model
export const Car = model("Car", carSchema);
