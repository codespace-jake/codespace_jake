import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * @typedef {Object} ProductSchema
 * @property {string} title - 매거진 제목
 * @property {string} body - 본문 
//  * @property {mongoose.Types.ObjectId} userID - 사용자 ID 참조 (User 모델과 연결된 ObjectId)
//  * @property {mongoose.Types.ObjectId[]} userIDs - 사용자 ID 배열 참조 (User 모델과 연결된 ObjectId 배열)
 */

const magazineDataSchema = new Schema(
  {
    title: String,
    body: String,
  },
  { timestamps: true }
);

const model = mongoose.model("magazine_jake", magazineDataSchema);

export default model;
