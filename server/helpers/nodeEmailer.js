import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

export default nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: "hanas.app.services@gmail.com",
    pass: process.env.NODE_EMAILER_PASS,
  },
  secure: true,
});
