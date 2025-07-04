"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const user_validation_1 = require("./user.validation");
const user_controller_1 = require("./user.controller");
const lib_1 = require("../../lib");
const validateRequest_1 = require("../../middlewares/validateRequest");
const router = (0, express_1.Router)();
router
    .route('/signup')
    .post((0, middlewares_1.validateRequest)(user_validation_1.UserValidation.createSchema), user_controller_1.UserController.signup);
router
    .route('/verify-signup-otp')
    .post((0, middlewares_1.validateRequest)(user_validation_1.UserValidation.verifyOtpSchema), user_controller_1.UserController.signupVerification);
router
    .route('/resend')
    .post((0, middlewares_1.validateRequest)(user_validation_1.UserValidation.emailSchema), user_controller_1.UserController.resentOtp);
router
    .route('/signin')
    .post((0, middlewares_1.validateRequest)(user_validation_1.UserValidation.signinSchema), user_controller_1.UserController.signin);
router
    .route('/social-signin')
    .post((0, middlewares_1.validateRequest)(user_validation_1.UserValidation.socialSchema), user_controller_1.UserController.socialSignin);
router.route('/signout').post((0, middlewares_1.auth)(), user_controller_1.UserController.signout);
router
    .route('/update-profile')
    .patch((0, middlewares_1.auth)(), lib_1.upload.single('file'), (0, validateRequest_1.validateRequestFromFormData)(user_validation_1.UserValidation.updateSchema), user_controller_1.UserController.updateProfile);
router
    .route('/change-password')
    .patch((0, middlewares_1.auth)(), (0, middlewares_1.validateRequest)(user_validation_1.UserValidation.passwordChangeSchema), user_controller_1.UserController.changePassword);
// For forget password
router
    .route('/forget-password')
    .post((0, middlewares_1.validateRequest)(user_validation_1.UserValidation.emailSchema), user_controller_1.UserController.forgetPassword);
router
    .route('/forget-password-verify')
    .post((0, middlewares_1.validateRequest)(user_validation_1.UserValidation.forgetPasswordVerifySchema), user_controller_1.UserController.verifyOtpForForgetPassword);
router
    .route('/reset-password')
    .patch((0, middlewares_1.validateRequest)(user_validation_1.UserValidation.resetPasswordSchema), user_controller_1.UserController.resetPassword);
router.route('/refresh-token').post((0, middlewares_1.auth)(), user_controller_1.UserController.refreshToken);
router.route('/profile').get((0, middlewares_1.auth)(), user_controller_1.UserController.getProfile);
exports.UserRoutes = router;
