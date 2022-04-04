import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

export default twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_ACCOUNT_TOKEN,
  {
    lazyLoading: true,
  }
);
