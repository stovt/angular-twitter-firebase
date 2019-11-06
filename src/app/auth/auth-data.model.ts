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

export interface ProfileSettingsData {
  userId: string;
  name: string;
  phone?: string;
}
