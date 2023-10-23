import mongoose from "mongoose";

const { Schema } = mongoose;

const SampleSchema = new Schema(
  {
    thumbnail: String,
    data1: String,
    data2: String,
    data3: Number,
    data4: Number,
    data5: String,
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userIDs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const model = mongoose.model("Sample", SampleSchema);

export default model;
