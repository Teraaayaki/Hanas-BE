import dotenv from "dotenv";

import bucket from "./googleCloudStorage.js";

dotenv.config();

export default (file, filePath) =>
  new Promise((resolve, reject) => {
    const blob = bucket.file(filePath + file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true,
    });

    blobStream
      .on("finish", () => {
        resolve(
          `https://storage.googleapis.com/${process.env.GCLOUD_BUCKET}/${blob.name}`
        );
      })
      .on("error", (error) => {
        console.log(error);
        reject("Unable to upload image");
      })
      .end(file.buffer);
  });
