import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    userID: String, // 아이디
    name: String, // 이름
    role: String, // general 관리자 승인 대기, admin 일반 관리자, master 마스터 관리자, normal: 일반 회원
  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose, { usernameField: "userID" });

const model = mongoose.model("User", UserSchema);

export default model;
