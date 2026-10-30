/** @format */

// User
export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

// Sign-up request type
export interface ISignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Login request type
export interface ILoginRequest {
  email: string;
  password: string;
}

// Auth Response
export interface IAuthResponse {
  status: string;
  user: IUser;
  message: string;
}
