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
exports.AlbumRouter = void 0;
const express_1 = require("express");
const AlbumModel_1 = __importDefault(require("../models/AlbumModel"));
const ImageModel_1 = __importDefault(require("../models/ImageModel"));
const cloudinary_1 = require("cloudinary");
const authorizedAccess_1 = __importDefault(require("../utils/authorizedAccess"));
exports.AlbumRouter = (0, express_1.Router)();
const mongoose_1 = __importDefault(require("mongoose"));
// RESPONSIBLE FOR CREATING NEW ALBUM
exports.AlbumRouter.post("/", authorizedAccess_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, ownerId, description } = req.body;
        if (!name || !description || !ownerId) {
            res
                .status(400)
                .json({ message: "Need Name & Description to create album" });
        }
        const newAlbum = new AlbumModel_1.default({
            name,
            description,
            ownerId,
        });
        const newAlbumSaved = yield newAlbum.save();
        if (newAlbumSaved) {
            res
                .status(201)
                .json({ message: `${name} Album Created`, Album: newAlbumSaved });
        }
        else {
            res.status(200).json({ message: `${name} Album Creation Failed` });
        }
        return;
    }
    catch (err) {
        res.status(500).json({ message: `Failed To Create Album` });
    }
}));
// RESPONSIBLE FOR BOTH SHARING & UPDATING DESCRITION
exports.AlbumRouter.post("/:albumId", authorizedAccess_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, sharedUsers } = req.body;
    const { albumId } = req.params;
    console.log(description, sharedUsers);
    console.log(albumId);
    const { userId } = req.user;
    try {
        const albumFetched = yield AlbumModel_1.default.findOne({
            albumId,
            ownerId: new mongoose_1.default.Types.ObjectId(userId),
        });
        console.log(albumFetched);
        if (albumFetched &&
            albumFetched.ownerId.toString() === userId.toString()) {
            const updatedAlbum = yield AlbumModel_1.default.findOneAndUpdate({ albumId }, { $set: { description, sharedUsers } }, { new: true });
            if (updatedAlbum) {
                res.status(200).json({ message: `Album  updated`, updatedAlbum });
            }
        }
        else {
            res.status(404).json({ message: `You are not Album Owner` });
        }
    }
    catch (err) {
        res
            .status(500)
            .json({ message: `${err instanceof Error ? err.message : ""}` });
    }
}));
// RESPONSIBLE FOR DELETING THE ALBUM
exports.AlbumRouter.delete("/:albumId", authorizedAccess_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { albumId } = req.params;
    const { userId } = req.user;
    try {
        const album = yield AlbumModel_1.default.findOne({
            albumId,
        }).lean();
        if (album && (album === null || album === void 0 ? void 0 : album.ownerId.toString()) === userId.toString()) {
            const imgLinkedToThisAlbum = yield ImageModel_1.default.find({ albumId }, { public_id: 1, _id: 0 }).lean();
            const publicIDs = imgLinkedToThisAlbum.map((ele) => ele.public_id);
            // console.log(publicIDs);
            const deletedAlbum = yield AlbumModel_1.default.findOneAndDelete({ albumId });
            yield ImageModel_1.default.deleteMany({ albumId });
            // console.log(acc);
            if (publicIDs.length > 0) {
                yield cloudinary_1.v2.api.delete_resources(publicIDs);
            }
            res.status(200).json({ message: "Album Successfully deleted" });
        }
        else if (album && (album === null || album === void 0 ? void 0 : album.ownerId.toString()) != userId.toString()) {
            res.status(403).json({ message: "Only Album Onwer can Delete" });
        }
        else {
            res.status(404).json({ message: "Album Not Found" });
        }
    }
    catch (err) {
        res
            .status(500)
            .json({ message: err instanceof Error ? err.message : "" });
    }
}));
// RESPONSIBLE FOR FETCHING ALL ALBUMS OWNED BY USER
exports.AlbumRouter.get("/owner", authorizedAccess_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    try {
        const fetchAlbums = yield AlbumModel_1.default.find({
            ownerId: userId,
        });
        res
            .status(200)
            .json({ albums: fetchAlbums, message: "Fetched albums owned by you" });
    }
    catch (err) {
        res.status(500).json({
            message: `${err instanceof Error ? err.message : "Failed to Fetch Albums"}`,
        });
    }
}));
// RESPONSIBLE FOR FETCHING ALL ALBUMS SHARE TO USER
exports.AlbumRouter.get("/shared", authorizedAccess_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    try {
        const fetchAlbums = yield AlbumModel_1.default.find({
            sharedUsers: { $in: [email] },
        });
        res.status(200).json({
            albums: fetchAlbums,
            message: "Fetched albums shared with you",
        });
    }
    catch (err) {
        res.status(500).json({
            message: `${err instanceof Error ? err.message : "Failed to Fetch Albums"}`,
        });
    }
}));
exports.AlbumRouter.get("/details/:albumId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { albumId } = req.params;
        const data = yield AlbumModel_1.default.findOne({ albumId });
        if (data) {
            res.status(200).json({ message: "Fetch Album details", album: data });
        }
        else {
            res.status(400).json({ message: "Failed to Fetch Album Details" });
        }
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Failed to get album Details";
        res.status(500).json({ message });
    }
}));
