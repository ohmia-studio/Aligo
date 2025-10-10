import { FormState } from '@/interfaces/auth-interfaces';
import { useState } from 'react';

export function useAuthForm() {
  const [state, setState] = useState<FormState>({
    username: '',
    password: '',
    loading: false,
    error: '',
    message: '',
    resetMode: false,
    disabled: false,
  });

  const [resetCooldown, setResetCooldown] = useState(false);

  const updateField = (name: string, value: string) => {
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const toggleResetMode = () => {
    setState((prev) => ({
      ...prev,
      resetMode: !prev.resetMode,
      error: '',
      message: '',
      disabled: false,
      username: '',
    }));
  };

  const setLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  };

  const setMessage = (message: string, isError = false) => {
    setState((prev) => ({
      ...prev,
      error: isError ? message : '',
      message: isError ? '' : message,
    }));
  };

  const clearMessages = () => {
    setState((prev) => ({ ...prev, error: '', message: '' }));
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: '' }));
  };

  const clearSuccessMessage = () => {
    setState((prev) => ({ ...prev, message: '' }));
  };

  const activateResetCooldown = () => {
    setResetCooldown(true);
    setTimeout(() => setResetCooldown(false), 30000);
  };

  return {
    state,
    resetCooldown,
    updateField,
    toggleResetMode,
    setLoading,
    setMessage,
    clearMessages,
    clearError,
    clearSuccessMessage,
    activateResetCooldown,
  };
}
