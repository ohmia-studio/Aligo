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
import { setTheme, toggleTheme } from '@/store/themeSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function ThemeToggle() {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: any) => state.theme?.theme) as
    | 'light'
    | 'dark';
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
    // On first mount, if theme not set, infer from system; else apply stored theme
    if (!currentTheme) {
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      dispatch(setTheme(systemPrefersDark ? 'dark' : 'light'));
    } else {
      document.documentElement.classList.toggle(
        'dark',
        currentTheme === 'dark'
      );
    }
  }, [currentTheme, dispatch]);

  const toggleDarkMode = () => dispatch(toggleTheme());

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className="bg-background/5 hover:bg-foreground/5 text-base-color hover:cursor-pointer"
          onClick={toggleDarkMode}
          aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {currentTheme === 'dark' ? (
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
