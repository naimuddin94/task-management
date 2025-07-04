import { Router } from 'express';
import { auth, validateRequest } from '../../middlewares';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';
import { upload } from '../../lib';
import { validateRequestFromFormData } from '../../middlewares/validateRequest';

const router = Router();

router
  .route('/signup')
  .post(validateRequest(UserValidation.createSchema), UserController.signup);

router
  .route('/verify-signup-otp')
  .post(
    validateRequest(UserValidation.verifyOtpSchema),
    UserController.signupVerification
  );

router
  .route('/resend')
  .post(validateRequest(UserValidation.emailSchema), UserController.resentOtp);

router
  .route('/signin')
  .post(validateRequest(UserValidation.signinSchema), UserController.signin);

router
  .route('/social-signin')
  .post(
    validateRequest(UserValidation.socialSchema),
    UserController.socialSignin
  );

router.route('/signout').post(auth(), UserController.signout);

router
  .route('/update-profile')
  .patch(
    auth(),
    upload.single('file'),
    validateRequestFromFormData(UserValidation.updateSchema),
    UserController.updateProfile
  );

router
  .route('/change-password')
  .patch(
    auth(),
    validateRequest(UserValidation.passwordChangeSchema),
    UserController.changePassword
  );

// For forget password
router
  .route('/forget-password')
  .post(
    validateRequest(UserValidation.emailSchema),
    UserController.forgetPassword
  );

router
  .route('/forget-password-verify')
  .post(
    validateRequest(UserValidation.forgetPasswordVerifySchema),
    UserController.verifyOtpForForgetPassword
  );

router
  .route('/reset-password')
  .patch(
    validateRequest(UserValidation.resetPasswordSchema),
    UserController.resetPassword
  );

router.route('/refresh-token').post(auth(), UserController.refreshToken);

router.route('/profile').get(auth(), UserController.getProfile);

export const UserRoutes = router;
