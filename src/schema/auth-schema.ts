import { body } from "express-validator";

export const registerUserSchema = () => {
  return [
    body("firstname")
      .isString().withMessage('firstname must be a string')
      .trim().notEmpty().withMessage("firstname cannot be empty"),
    body("lastname")
      .isString().withMessage('lastname must be a string')
      .trim().notEmpty().withMessage("lastname cannot be empty"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("phone")
      .isString().withMessage('Phone_number must be a string')
      .trim().notEmpty().withMessage("Phone_number cannot be empty"),
    body("password")
      .notEmpty()
      .trim()
      .isLength({ min: 6, max: 25 })
      .withMessage("Password must be between 6 to 25 characters")
  ];
};

export const loginUserSchema = () => {
  return [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .isString().withMessage('Password must be a string')
      .trim().notEmpty().withMessage('Password is cannot be empty')
  ]
}