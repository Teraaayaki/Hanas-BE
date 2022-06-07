import { body, validationResult } from "express-validator";

export const validate = (method) => {
  switch (method) {
    case "login":
      return [
        body("email", "Invalid Email").isEmail(),
        body("password", "Password must be atleast 8 characters").isLength({
          min: 8,
        }),
      ];
    case "register":
      return [
        body("email", "Invalid Email").isEmail(),
        body("password", "Password must be atleast 8 characters").isLength({
          min: 8,
        }),
        body("mobileNo", "Incomplete Data Inputted").exists(),
        body("firstName", "Incomplete Data Inputted").exists(),
        body("lastName", "Incomplete Data Inputted").exists(),
        body("middleName", "Incomplete Data Inputted").exists(),
        body("dob", "Incomplete Data Inputted").exists(),
        body("sex", "Incomplete Data Inputted").exists(),
        body("address", "Incomplete Data Inputted").exists(),
        body("isWorker", "Incomplete Data Inputted").exists(),
      ];
    case "number":
      return [body("number", "Invalid Number").isInt().exists()];
    case "otp-number":
      return [
        body("number", "Invalid Number").isInt().exists(),
        body("otp", "Invalid OTP").isInt().exists(),
      ];
    case "edit-password":
      return [
        body("old_pass", "Password must be at least 8 characters").isLength({ min: 8,}),
        body("new_pass", "Password must be at least 8 characters").isLength({ min: 8,}),
        body("confirm_pass", "Password must be at least 8 characters").isLength({ min: 8,}),
      ];
  }
};

export const validationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send({ error: errors.array()[0].msg });
  }

  next();
};
