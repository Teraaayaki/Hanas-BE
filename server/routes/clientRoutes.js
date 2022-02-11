const express = require('express');
const router = express.Router();

const { validate } = require('../middleware/validations');

const {
  loginClient,
  registerClient,
  logoutClient
} = require('../controllers/authController');

//AUTH ROUTES
router.post('/login', validate('loginClient'), loginClient);
router.post('/register', validate('registerClient'), registerClient);
router.delete('/logout', logoutClient);

module.exports = router;
