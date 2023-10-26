import mongoose from "mongoose";

const { Schema } = mongoose;

/**
 * @typedef {Object} ProductSchema
 * @property {string} thumbnail - 썸네일 이미지 URL
 * @property {string} category - 카테고리
 * @property {string} brand - 브랜드
 * @property {string} name - 상품 제목
 * @property {string} description - 상품 설명
 * @property {number} price - 원래 가격
 * @property {number} saleRatio - 할인률
//  * @property {string} inOnly - '오직 여기에서만 살 수있는 단독 상품'인가의 유무 , 추가예정
 * @property {mongoose.Types.ObjectId} userID - 사용자 ID 참조 (User 모델과 연결된 ObjectId)
 * @property {mongoose.Types.ObjectId[]} userIDs - 사용자 ID 배열 참조 (User 모델과 연결된 ObjectId 배열)
 */

const sampleDataSchema = new Schema(
  {
    thumbnail: String,
    category: String,
    brand: String,
    name: String,
    description: String,
    price: Number,
    saleRatio: Number,
    // inOnly: String,
  },
  { timestamps: true }
);

const model = mongoose.model("Product_jake", sampleDataSchema);

export default model;
