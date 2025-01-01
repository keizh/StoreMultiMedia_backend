"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const ImageSchema = new mongoose_1.default.Schema({
    imageId: {
        type: String,
        default: uuid_1.v4,
        index: true,
    },
    imgURL: {
        type: String,
        require: true,
    },
    imgOwnerId: {
        type: String,
        required: true,
    },
    public_id: {
        type: String,
        required: true,
    },
    albumId: {
        type: String,
        index: true,
        required: true,
    },
    name: String,
    tags: [String],
    person: String,
    isFavorite: {
        type: Boolean,
        default: false,
    },
    comments: [
        {
            comment: String,
            commentOwnerId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            },
            commentId: {
                type: String,
                default: uuid_1.v4,
            },
        },
    ],
    size: String,
}, { timestamps: true });
const ImageModel = mongoose_1.default.model("Image", ImageSchema);
exports.default = ImageModel;
