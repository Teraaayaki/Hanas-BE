import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";

dotenv.config();
const gcloud_private_key = process.env.GCLOUD_PRIVATE_KEY.replace(/\\n/g, "\n");

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    private_key: process.env.gcloud_private_key,
  },
});

const bucket = storage.bucket(process.env.GCLOUD_BUCKET);

export default bucket;
