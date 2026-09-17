import { RegisterFormData, LoginFormData, ValidationErrors } from '../types/auth';

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidMobile = (mobile: string): boolean => {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(mobile.trim());
};

export const validateRegisterForm = (data: RegisterFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Full Name
  if (!data.fullName.trim()) {
    errors.fullName = 'Full Name is required.';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Full Name must be at least 2 characters.';
  }

  // Email
  if (!data.email.trim()) {
    errors.email = 'Email Address is required.';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  // Gender
  if (!data.gender) {
    errors.gender = 'Please select a gender.';
  }

  // Mobile Number
  if (!data.mobileNumber.trim()) {
    errors.mobileNumber = 'Mobile Number is required.';
  } else if (!/^\d+$/.test(data.mobileNumber.trim())) {
    errors.mobileNumber = 'Mobile Number must contain digits only.';
  } else if (!isValidMobile(data.mobileNumber)) {
    errors.mobileNumber = 'Mobile Number must be exactly 10 digits.';
  }

  // Address
  if (!data.address.trim()) {
    errors.address = 'Address is required.';
  }

  // City
  if (!data.city.trim()) {
    errors.city = 'City selection is required.';
  }

  // Password
  if (!data.password) {
    errors.password = 'Password is required.';
  } else if (data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  // Confirm Password
  if (!data.confirmPassword) {
    errors.confirmPassword = 'Confirm Password is required.';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};

export const validateLoginForm = (data: LoginFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.email.trim()) {
    errors.email = 'Email Address is required.';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!data.password) {
    errors.password = 'Password is required.';
  }

  return errors;
};
