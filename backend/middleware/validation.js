/**
 * ============================================
 * UNIT II - Express: Input Validation
 * ============================================
 * 
 * Validation Middleware:
 * - Uses express-validator for input validation
 * - Demonstrates: Request validation, error handling
 */

import { body, param, validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Validation rules for coupon creation
 */
export const validateCoupon = [
  body('code')
    .trim()
    .isLength({ min: 4, max: 20 })
    .matches(/^[A-Z0-9]+$/)
    .withMessage('Coupon code must be 4-20 characters, uppercase letters and numbers only'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('discountType')
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be either "percentage" or "fixed"'),
  
  body('discountValue')
    .isFloat({ min: 0 })
    .withMessage('Discount value must be a positive number'),
  
  body('minPurchaseAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum purchase amount must be a positive number'),
  
  body('maxDiscountAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum discount amount must be a positive number'),
  
  body('maxUsage')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum usage must be a positive integer'),
  
  body('expiryDate')
    .isISO8601()
    .withMessage('Expiry date must be a valid ISO 8601 date'),
  
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  body('campaignId')
    .isMongoId()
    .withMessage('Campaign ID must be a valid MongoDB ObjectId'),
  
  handleValidationErrors
];

/**
 * Validation rules for campaign creation
 */
export const validateCampaign = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Campaign name must be 1-100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid ISO 8601 date'),
  
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid ISO 8601 date'),
  
  handleValidationErrors
];

/**
 * Validation rules for coupon usage
 */
export const validateCouponUsage = [
  body('couponCode')
    .trim()
    .notEmpty()
    .withMessage('Coupon code is required'),
  
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  
  handleValidationErrors
];

/**
 * Validation for MongoDB ObjectId parameters
 */
export const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

export default {
  validateCoupon,
  validateCampaign,
  validateCouponUsage,
  validateObjectId,
  handleValidationErrors
};


