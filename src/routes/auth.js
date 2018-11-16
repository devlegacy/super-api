import express from 'express';
import { auth, account } from '../controllers';
import val from '../validations';
import validate from 'express-validation';

const router = express.Router();
/**
 * Authorization routes
 */
router
  .post('/login', auth.login)
  .post('/register',
    validate(val.user.register),
    account.register)
  .post('/confirmation',
    validate(val.account.confirmation),
    account.confirmation)
  .post('/forgot_password',
    validate(val.account.forgotPassword),
    account.forgotPassword)
  .get('/forgot_password',
    account.renderForgotPassword)
  .get('/reset_password/:token',
    account.renderResetPassword)
  .get('/confirmation/:token',
    account.renderConfirmation)
  .post('/reset_password',
    validate(val.account.resetPassword),
    account.resetPassword);

module.exports = router;
