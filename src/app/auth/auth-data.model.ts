export interface SignInAuthData {
  email: string;
  password: string;
}

export interface SignUpAuthData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
}
