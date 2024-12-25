// Типы и интерфейсы для схемы Auth
export interface AuthDetails {
  accessToken: string;
  refreshToken: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegRequest extends AuthRequest {
  shopName: string;
}

export interface AuthResponse {
  success: boolean;
  details: AuthDetails;
}
