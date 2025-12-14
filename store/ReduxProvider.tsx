'use client';
import { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';

function ThemeGate({ children }: { children: React.ReactNode }) {
  const theme = useSelector((state: any) => state.theme?.theme) as
    | 'light'
    | 'dark'
    | undefined;

  useEffect(() => {
    if (!theme) return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Render children immediately; PersistGate ensures theme is hydrated first
  return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeGate>{children}</ThemeGate>
      </PersistGate>
    </Provider>
  );
}
