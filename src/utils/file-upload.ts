
import { Request } from "express";


  
  export const imageAndVideoFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: any
  ) => {
    const acceptedTypes = file.mimetype.split("/");
  
    if (acceptedTypes[0] === "image" || acceptedTypes[0] === "video") {
      cb(null, true);
    } else {
      cb(new Error("Only images and videos formats allowed!"), false);
    }
  };
  
  export enum uploadType {
    image = "image",
    video = "video",
    file = "file",
  }
  