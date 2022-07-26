import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export default (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in!" });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.MY_SECRET_ACCESS_TOKEN, async (err, payload) => {
    if (err) {
      // console.log(err);
      console.log("Jwt Malformed");
      return res.status(401).send({ error: "You must be logged in!" });
    }
    const { user_id } = payload;

    const user = await User.findOne({ user_id });

    if (user && user.is_deactivated) {
      return res.status(422).send({ error: "User has been deactivated!" });
    }

    req.user = user;
    next();
  });
};
