export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  code: number;
  is_logged_in: number;
  token: string;
  username?: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
}