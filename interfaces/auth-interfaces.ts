export interface LoginParams {
  email: string;
  password: string;
}

export interface FormState {
  username: string;
  password: string;
  loading: boolean;
  error: string;
  message: string;
  resetMode: boolean;
  disabled: boolean;
}
