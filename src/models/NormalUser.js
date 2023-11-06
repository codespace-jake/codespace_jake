import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    userID: String, // 아이디 (E-mail 형식)
    name: String, // 이름
    role: { type: String, default: "normal" },
    addressInfo: {
      address: String,
      detailAddress: String,
    },
    phoneNum: String,
    sosial: {
      isSosial: { type: Boolean, default: false },
      snsType: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose, { usernameField: "userID" });

const model = mongoose.model("normal-user", UserSchema);

export default model;
