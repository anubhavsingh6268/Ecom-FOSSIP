import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    
    // 1. Replaced username with phoneNumber
    body("phoneNumber")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .isLength({ min: 10 }) // Basic check for a standard phone number
      .withMessage("Phone number must be at least 10 characters"),
      
    // 2. Replaced fullName with name
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),
      
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required"),
  ];
};

const userLoginValidator = () => {
  return [
    // 3. Made email strictly required since we removed username login
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
      
    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ];
};

const useChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [body("newPassword").notEmpty().withMessage("Password is required")];
};

export {
  userRegisterValidator,
  userLoginValidator,
  useChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
};