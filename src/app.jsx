import './global.css';

import { useState, useEffect } from 'react';

import Fab from '@mui/material/Fab';

import { Router } from './routes/sections';
import { Iconify } from './components/iconify';
import { ThemeProvider } from './theme/theme-provider';
import { useScrollToTop } from './hooks/use-scroll-to-top';

export default function App() {
  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  };
  useScrollToTop();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  const githubButton = (
    <Fab
      size="medium"
      aria-label="Github"
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        display: visible ? 'flex' : 'none !important',
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        position: 'fixed',
        bgcolor: 'grey.800',
        color: 'common.white',
      }}
      onClick={goToTop}

    >
      <Iconify width={24} icon="mdi:arrow-up-bold-circle" />
    </Fab>
  );

  return (
    <ThemeProvider>
      <Router />
      {githubButton}
    </ThemeProvider>
  );
}
