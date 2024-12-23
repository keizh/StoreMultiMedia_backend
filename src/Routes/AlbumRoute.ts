import { Request, Response, Router } from "express";
import AlbumModel from "../models/AlbumModel";
import { AlbumDocInterface, AlbumInterface } from "../types";
import ImageModel from "../models/ImageModel";
import { v2 as cloudinary } from "cloudinary";

export const AlbumRouter = Router();

// RESPONSIBLE FOR CREATING NEW ALBUM
AlbumRouter.post(
  "/",
  async (
    req: Request<
      {},
      {},
      { ownerId: string; name: string; description: string },
      {}
    >,
    res: Response<{ message: string; Album?: AlbumDocInterface }>
  ): Promise<void> => {
    try {
      const { name, ownerId, description } = req.body;
      if (!name || !description || !ownerId) {
        res
          .status(400)
          .json({ message: "Need Name & Description to create album" });
      }
      const newAlbum: AlbumDocInterface = new AlbumModel({
        name,
        description,
        ownerId,
      });
      const newAlbumSaved: AlbumDocInterface = await newAlbum.save();
      if (newAlbumSaved) {
        res
          .status(201)
          .json({ message: `${name} Album Created`, Album: newAlbumSaved });
      } else {
        res.status(200).json({ message: `${name} Album Creation Failed` });
      }
      return;
    } catch (err) {
      res.status(500).json({ message: `Failed To Create Album` });
    }
  }
);

// RESPONSIBLE FOR BOTH SHARING & UPDATING DESCRITION
AlbumRouter.post(
  "/:albumId",
  async (
    req: Request<
      { albumId: string; sharedUsers: string[] },
      {},
      { sharedUsers: string[]; description: string },
      {}
    >,
    res: Response<{ message: string }>
  ): Promise<void> => {
    const { description, sharedUsers } = req.body;
    const { albumId } = req.params;
    //@ts-ignore
    const { userId } = req.user;

    try {
      const albumFetched: AlbumDocInterface | null = await AlbumModel.findOne({
        albumId,
      });

      if (
        albumFetched &&
        albumFetched.ownerId.toString() === userId.toString()
      ) {
        const updatedAlbum: AlbumDocInterface | null =
          await AlbumModel.findOneAndUpdate(
            { albumId },
            { $set: { description, sharedUsers } },
            { new: true }
          );
        if (updatedAlbum) {
          res.status(200).json({ message: `Album  updated` });
        }
      } else {
        res.status(404).json({ message: `You are not Album Owner` });
      }
    } catch (err: unknown) {
      res
        .status(500)
        .json({ message: `${err instanceof Error ? err.message : ""}` });
    }
  }
);

// RESPONSIBLE FOR DELETING THE ALBUM
AlbumRouter.delete(
  "/:albumId",
  async (
    req: Request<{ albumId: string }>,
    res: Response<{ message: string }>
  ): Promise<void> => {
    const { albumId } = req.params;

    const { userId } = req.user;
    try {
      const album: AlbumInterface | null = await AlbumModel.findOne({
        albumId,
      }).lean();

      if (album && album?.ownerId.toString() === userId.toString()) {
        const imgLinkedToThisAlbum = await ImageModel.find(
          { albumId },
          { public_id: 1, _id: 0 }
        ).lean();
        const publicIDs = imgLinkedToThisAlbum.map((ele) => ele.public_id);

        const deletedAlbum: AlbumDocInterface | null =
          await AlbumModel.findOneAndDelete({ albumId });
        await cloudinary.api.delete_resources(publicIDs);
        res.status(200).json({ message: "Album Successfully deleted" });
      } else if (album && album?.ownerId.toString() != userId.toString()) {
        res.status(403).json({ message: "Only Album Onwer can Delete" });
      } else {
        res.status(404).json({ message: "Album Not Found" });
      }
    } catch (err: unknown) {
      res
        .status(500)
        .json({ message: err instanceof Error ? err.message : "" });
    }
  }
);

// RESPONSIBLE FOR FETCHING ALL ALBUMS OWNED BY USER
AlbumRouter.get(
  "/owner",
  async (
    req,
    res: Response<{ message: string; albums?: AlbumDocInterface[] | [] }>
  ): Promise<void> => {
    const { userId } = req.user;
    try {
      const fetchAlbums: AlbumDocInterface[] | [] = await AlbumModel.find({
        ownerId: userId,
      });
      res
        .status(200)
        .json({ albums: fetchAlbums, message: "Fetched albums owned by you" });
    } catch (err: unknown) {
      res.status(500).json({
        message: `${
          err instanceof Error ? err.message : "Failed to Fetch Albums"
        }`,
      });
    }
  }
);

// RESPONSIBLE FOR FETCHING ALL ALBUMS SHARE TO USER
AlbumRouter.get(
  "/shared",
  async (
    req: Request,
    res: Response<{ message: string; albums?: AlbumDocInterface[] | [] }>
  ): Promise<void> => {
    const { email } = req.user;
    try {
      const fetchAlbums: AlbumDocInterface[] | [] = await AlbumModel.find({
        sharedUsers: { $in: [email] },
      });

      res.status(200).json({
        albums: fetchAlbums,
        message: "Fetched albums shared with you",
      });
    } catch (err: unknown) {
      res.status(500).json({
        message: `${
          err instanceof Error ? err.message : "Failed to Fetch Albums"
        }`,
      });
    }
  }
);
