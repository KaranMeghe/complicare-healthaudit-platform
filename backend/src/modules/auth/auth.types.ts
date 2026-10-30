/**
 * AUTH-002 Type Definitions
 *
 * Defines API contracts for authentication endpoints:
 * - POST /api/auth/signup
 * - POST /api/auth/login
 * - POST /api/auth/refresh
 * - POST /api/auth/logout
 * - GET /api/auth/me
 *
 * @format
 */

// ============================================================================
// REQUEST TYPES (What client sends)
// ============================================================================
export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
// ============================================================================
// RESPONSE TYPES (What client recives)
// ============================================================================

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}
export interface SignupResponse {
  user: UserResponse;
  message: string;
}

export interface LoginResponse {
  status: 'success';
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
  };
  message: string;
}

export interface RefreshResponse {
  status: 'success';
  message: string;
}
