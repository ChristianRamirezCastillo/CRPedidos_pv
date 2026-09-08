export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
}
