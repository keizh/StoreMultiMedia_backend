"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const ImageModel_1 = __importDefault(require("../models/ImageModel"));
const cloudinary_1 = require("cloudinary");
const authorizedAccess_1 = __importDefault(require("../utils/authorizedAccess"));
const uploads = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({}),
    limits: {
        fileSize: 11 * 1024 * 1024,
    },
});
exports.imageRouter = (0, express_1.Router)();
// RESPONSIBLE FOR UPLOADING IMAGE
exports.imageRouter.post("/imgs", authorizedAccess_1.default, uploads.array("images", 10), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const { userId } = req.user;
    const { albumId, name, tags } = req.body;
    try {
        console.log(`-->`, albumId, name, tags);
        const savedImages = [];
        for (const file of files) {
            const uploaded = yield cloudinary_1.v2.uploader.upload(file.path);
            const newImage = new ImageModel_1.default({
                imgURL: uploaded.secure_url,
                public_id: uploaded.public_id,
                imgOwnerId: userId,
                albumId: albumId,
                name,
                tags,
                size: file.size,
                person: "",
                comments: [],
                isFavorite: false,
            });
            const newImageSaved = yield newImage.save();
            savedImages.push(newImageSaved);
        }
        console.log(savedImages);
        res
            .status(200)
            .json({ message: "Image has been uploaded", savedImages, tags });
    }
    catch (err) {
        const mssg = err instanceof Error ? err.message : "Failed to upload image";
        res.status(500).json({ message: mssg });
    }
}));
// RESPONSIBLE FOR MARKING THE STAR FAVORITE
exports.imageRouter.post("/isFavoriteIMG", authorizedAccess_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageId } = req.query;
    const { isFavorite } = req.body;
    try {
        const updateImage = yield ImageModel_1.default.findOneAndUpdate({ imageId }, { $set: { isFavorite } }, { new: true });
    }
    catch (err) {
        const mssg = err instanceof Error ? err.message : "";
        res.status(500).json({ message: mssg });
    }
}));
// RESPONSIBLE FOR ADDING COMMENT
exports.imageRouter.post("/comment/add", authorizedAccess_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment, imageId, commentId } = req.body;
    const { userId } = req.user;
    try {
        const comment_OBJ = {
            comment,
            commentOwnerId: userId,
            commentId,
        };
        const imageWithCommentAdded = yield ImageModel_1.default.findOneAndUpdate({
            imageId,
        }, {
            $addToSet: { comments: comment_OBJ },
        });
        if (imageWithCommentAdded) {
            res.status(200).json({ message: `Comment added`, comment_OBJ });
        }
        else {
            res.status(404).json({ message: `No such Image Exists` });
        }
    }
    catch (err) {
        const mssg = err instanceof Error ? err.message : "Failed to add Comment";
        res.status(500).json({ message: mssg });
    }
}));
// RESPONSIBLE FOR REMOVING COMMENT
exports.imageRouter.post("/comment/remove", authorizedAccess_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId, imageId, imgOwnerId } = req.body;
    const { userId } = req.user;
    try {
        const imageWithCommentRemoved = yield ImageModel_1.default.findOneAndUpdate({
            imageId,
        }, {
            $pull: { comments: { commentId, commentOwnerId: userId } },
        });
        if (imageWithCommentRemoved) {
            res.status(200).json({ message: `Comment removed` });
        }
        else {
            res.status(404).json({ message: `No such Image Exists` });
        }
    }
    catch (err) {
        const mssg = err instanceof Error ? err.message : "Failed to remove Comment";
        res.status(500).json({ message: mssg });
    }
}));
exports.imageRouter.delete(`/delete/:imageId`, authorizedAccess_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const { imageId } = req.params;
        console.log(`imageId`, imageId);
        console.log(`userId`, userId);
        const Img = yield ImageModel_1.default.findOne({
            imageId,
            imgOwnerId: userId,
        });
        console.log(Img);
        const deletedImg = yield ImageModel_1.default.findOneAndDelete({
            imageId,
            imgOwnerId: userId,
        });
        console.log(deletedImg);
        if (deletedImg && Img) {
            yield cloudinary_1.v2.uploader.destroy(Img.public_id);
            res.status(200).json({ message: `Image Successfully deleted` });
        }
        else {
            throw new Error(`Failed to Delete Image`);
        }
    }
    catch (err) {
        const mssg = err instanceof Error ? err.message : "Failed to delete Image";
        res.status(500).json({ message: mssg });
    }
}));
exports.imageRouter.get("/:albumId", authorizedAccess_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`line 202`);
    const { albumId } = req.params;
    console.log(albumId);
    try {
        const images = yield ImageModel_1.default.find({
            albumId,
        });
        console.log(images);
        const tags = Array.isArray(images)
            ? Array.from(new Set(images.reduce((acc, img) => {
                const tagList = Array.isArray(img.tags)
                    ? img.tags
                    : [];
                return [...acc, ...tagList];
            }, [])))
            : [];
        console.log(tags);
        console.log(`line 221`);
        res
            .status(200)
            .json({ message: "Images have been fetched", images, tags });
        console.log(`line 225`);
    }
    catch (err) {
        const mssg = err instanceof Error ? err.message : "Failed to delete Image";
        res.status(500).json({ message: mssg });
        console.log(`line 230`);
    }
}));
exports.imageRouter.get("/:albumId/favorite", authorizedAccess_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { albumId } = req.params;
    try {
        const images = yield ImageModel_1.default.find({
            albumId,
            isFavorite: true,
        });
        res.status(200).json({ message: "Images have been fetched", images });
    }
    catch (err) {
        const mssg = err instanceof Error ? err.message : "Failed to delete Image";
        res.status(500).json({ message: mssg });
    }
}));
exports.imageRouter.get("/:albumId/tags", authorizedAccess_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { albumId } = req.params;
    const { tagName } = req.query;
    try {
        const images = yield ImageModel_1.default.find({
            albumId,
            tags: { $in: [tagName] },
        });
        res.status(200).json({ message: "Images have been fetched", images });
        return;
    }
    catch (err) {
        const mssg = err instanceof Error ? err.message : "Failed to delete Image";
        res.status(500).json({ message: mssg });
        return;
    }
}));
