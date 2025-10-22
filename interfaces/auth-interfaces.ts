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

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface User {
  id: string;
  email: string;
  rol: 'admin' | 'empleado' | 'usuario';
  name?: string;
}
