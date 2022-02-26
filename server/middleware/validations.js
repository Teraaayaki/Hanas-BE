import { body } from 'express-validator';
import { validationResult } from 'express-validator';

export const validate = (method) => {
  switch (method) {
    case 'loginClient': {
      return [
        body('email', 'Email is required.').exists(),
        body('password', 'Password is required.').exists()
      ];
    }
  }
};

export const validationErrors = (res, req) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  }
};
