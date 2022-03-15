import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export default (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in!" });
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, process.env.MY_SECRET_ACCESS_KEY, async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in!" });
    }
    const { user_id } = payload;

    const user = await User.findOne(user_id);
    req.user = user;
    next();
  });
};
