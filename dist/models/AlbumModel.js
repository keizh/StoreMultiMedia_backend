"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const AlbumSchema = new mongoose_1.default.Schema({
    albumId: {
        type: String,
        default: uuid_1.v4,
        index: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    ownerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sharedUsers: [
        {
            type: String,
        },
    ],
}, { timestamps: true });
const AlbumModel = mongoose_1.default.model("Album", AlbumSchema);
exports.default = AlbumModel;
