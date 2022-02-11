const { body } = require('express-validator/check');

exports.validate = (method) => {
  switch (method) {
    case 'registerClient': {
      return [
        body('firstname', 'First name is required.').exists(),
        body('middlename', 'Middle name is required.').exists(),
        body('lastname', 'Last name is required.').exists(),
        body('email', 'Invalid email address.').isEmail(),
        body('password', 'Password must contain at least 8 characters.').isLength({
          min: 8
        })
      ];
    }

    case 'loginClient': {
      return [
        body('email', 'Email is required.').exists(),
        body('password', 'Password is required.').exists()
      ];
    }
  }
};
