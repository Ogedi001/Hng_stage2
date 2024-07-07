import { body, param } from "express-validator";


export const addUserToOrganisationSchema  = () => {
    return [
        body("userId")
      .isString().withMessage('userId must be a string')
      .trim().notEmpty().withMessage('userId is cannot be empty'),
      param('orgId').trim().notEmpty().withMessage('orgId param is required')
    ]
 }

 
export const getUserSchema  = () => {
    return [
      param('id').trim().notEmpty().withMessage('id param is required')
    ]
 }


 export const createOrganisationSchema = () => {
   return [
     body("name")
       .isString().withMessage('Name must be a string')
       .trim().notEmpty().withMessage('Name cannot be empty'),
     body("description")
       .optional()
       .isString().withMessage('Description must be a string')
       .trim()
       .notEmpty().withMessage('Description cannot be empty if provided')
   ];
 };
 

 
export const getOrganisationSchema  = () => {
    return [
      param('orgId').trim().notEmpty().withMessage('orgId param is required')
    ]
 }