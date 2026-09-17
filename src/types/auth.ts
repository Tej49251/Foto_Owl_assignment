export type Gender = 'Male' | 'Female' | 'Other';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  gender: Gender;
  mobileNumber: string;
  address: string;
  city: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface UserAccount extends UserProfile {
  passwordHash: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  gender: Gender | '';
  mobileNumber: string;
  address: string;
  city: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ValidationErrors {
  fullName?: string;
  email?: string;
  gender?: string;
  mobileNumber?: string;
  address?: string;
  city?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}
