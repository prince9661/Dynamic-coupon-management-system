import { body } from 'express-validator';

/**
 * Validation rules for user registration.
 * Ensures username, email, and password meet requirements.
 */
export const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email')
    .trim()
    .isEmail().withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

/**
 * Validation rules for creating a coupon.
 * Ensures code, discount rules, and expiry dates are valid.
 */
export const couponValidation = [
  body('code')
    .trim()
    .notEmpty().withMessage('Coupon code is required')
    .isLength({ min: 4 }).withMessage('Code must be at least 4 characters')
    .toUpperCase(),
  body('discountType')
    .isIn(['percentage', 'fixed']).withMessage('Discount type must be percentage or fixed'),
  body('discountValue')
    .isFloat({ min: 0.01 }).withMessage('Discount value must be greater than 0'),
  body('expiryDate')
    .isISO8601().withMessage('Valid expiry date is required')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Expiry date must be in the future');
      }
      return true;
    }),
  body('campaignId')
    .notEmpty().withMessage('Campaign ID is required')
];

/**
 * Validation rules for validating a coupon code (during checkout).
 */
export const validateCouponRules = [
  body('code').notEmpty().withMessage('Coupon code is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Purchase amount is required')
];
