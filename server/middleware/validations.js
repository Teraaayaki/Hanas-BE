import { body, validationResult } from "express-validator";

export const validate = (method) => {
  switch (method) {
    case "loginClient": {
      return [
        body("email", "Invalid Email").isEmail(),
        body("password", "Password must be atleast 8 characters").isLength({
          min: 8,
        }),
      ];
    }
  }
};

export const validationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ error: errors.array()[0].msg });
  }

  next();
};
