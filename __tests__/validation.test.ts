import { describe, it, expect } from '@jest/globals';
import {
  isValidEmail,
  isValidMobile,
  validateRegisterForm,
  validateLoginForm,
} from '../src/utils/validation';
import { RegisterFormData } from '../src/types/auth';

describe('Validation Utility Tests', () => {
  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.name+tag@domain.co.in')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('plainaddress')).toBe(false);
      expect(isValidEmail('missing@domain')).toBe(false);
      expect(isValidEmail('@missinguser.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidMobile', () => {
    it('should return true for valid 10-digit mobile numbers', () => {
      expect(isValidMobile('9876543210')).toBe(true);
      expect(isValidMobile('1234567890')).toBe(true);
    });

    it('should return false for invalid mobile numbers', () => {
      expect(isValidMobile('12345')).toBe(false);
      expect(isValidMobile('12345678901')).toBe(false);
      expect(isValidMobile('98765abcde')).toBe(false);
      expect(isValidMobile('')).toBe(false);
    });
  });

  describe('validateRegisterForm', () => {
    it('should return no errors for a completely valid form', () => {
      const validData: RegisterFormData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        gender: 'Male',
        mobileNumber: '9876543210',
        address: '123 Main Street',
        city: 'Bengaluru',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const errors = validateRegisterForm(validData);
      expect(Object.keys(errors).length).toBe(0);
    });

    it('should catch missing mandatory fields', () => {
      const emptyData: RegisterFormData = {
        fullName: '',
        email: '',
        gender: '',
        mobileNumber: '',
        address: '',
        city: '',
        password: '',
        confirmPassword: '',
      };

      const errors = validateRegisterForm(emptyData);
      expect(errors.fullName).toBeDefined();
      expect(errors.email).toBeDefined();
      expect(errors.gender).toBeDefined();
      expect(errors.mobileNumber).toBeDefined();
      expect(errors.address).toBeDefined();
      expect(errors.city).toBeDefined();
      expect(errors.password).toBeDefined();
      expect(errors.confirmPassword).toBeDefined();
    });

    it('should enforce password minimum length and match', () => {
      const invalidPasswordData: RegisterFormData = {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        gender: 'Female',
        mobileNumber: '9876543210',
        address: '456 Side St',
        city: 'Mumbai',
        password: '123',
        confirmPassword: '456',
      };

      const errors = validateRegisterForm(invalidPasswordData);
      expect(errors.password).toBe('Password must be at least 6 characters long.');
      expect(errors.confirmPassword).toBe('Passwords do not match.');
    });
  });

  describe('validateLoginForm', () => {
    it('should validate email and password presence', () => {
      const errors = validateLoginForm({ email: '', password: '' });
      expect(errors.email).toBeDefined();
      expect(errors.password).toBeDefined();
    });
  });
});
