import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  // If there are no errors, move on to the controller!
  if (errors.isEmpty()) {
    return next();
  }

  // Extract the specific error details
  const extractedErrors = errors.array().map((err) => ({
    [err.path]: err.msg,
  }));

  // Grab the very first, most relevant error message 
  // (e.g., "Phone number must be at least 10 characters")
  const firstErrorMessage = errors.array()[0].msg;

  // Send a clean JSON response directly to the frontend. 
  // This prevents the server from crashing!
  return res.status(422).json({
    success: false,
    message: firstErrorMessage,
    errors: extractedErrors
  });
};