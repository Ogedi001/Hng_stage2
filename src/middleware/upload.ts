import util from "util";
import path from "path";
import multer from "multer";
import { Request, Response, NextFunction } from "express";
import {
  imageAndVideoFilter,
  uploadType,
} from "../utils";

export const fileUploader = (type: uploadType) => {
  let folder: string = "";
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        folder = "images";
      }
      if (file.mimetype === "video/mp4") {
        folder = "videos";
      }
      const directoryPath = path.join(__dirname, `../resources/uploads/${folder}`);
      cb(null, directoryPath);
    },
    filename: (req, file, cb) => {
      const fileName = `${file.fieldname}_${Date.now()}___${file.originalname}`;
      cb(null, fileName);
    },
  });

   type == uploadType.file;

  const uploadFile = multer({
    storage,
    fileFilter: imageAndVideoFilter
  }).array(type);

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await util.promisify(uploadFile)(req, res);
      next();
    } catch (err) {
      next(err);
    }
  };
};
