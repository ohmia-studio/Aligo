'use client';

// --- UI Primitives ---
//import { Button } from '@/components/tiptap/tiptap-ui-primitive/button';
import { Button } from '@/components/ui/button';

// --- Icons ---
import { MoonStarIcon } from '@/components/tiptap/tiptap-icons/moon-star-icon';
import { SunIcon } from '@/components/tiptap/tiptap-icons/sun-icon';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  // TODO: Testear si en todas las pc te pone por defecto si o si el modo oscuro...
  /*
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
*/
  useEffect(() => {
    const initialDarkMode =
      !!document.querySelector('meta[name="color-scheme"][content="dark"]') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(initialDarkMode);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((isDark) => !isDark);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="bg-background/5 hover:bg-foreground/5 text-base-color hover:cursor-pointer"
          onClick={toggleDarkMode}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
          {isDarkMode ? (
            <MoonStarIcon className="tiptap-button-icon" />
          ) : (
            <SunIcon className="tiptap-button-icon" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Tema</p>
      </TooltipContent>
    </Tooltip>
  );
}
