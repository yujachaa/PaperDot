import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import useTheme from './zustand/theme';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

function App() {
  const isDarkMode = useTheme((state) => state.isDarkMode);
  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);

    return () => {
      document.body.classList.remove('dark');
    };
  }, [isDarkMode]);

  return (
    <>
      <AnimatePresence mode="wait">
        <Outlet />
      </AnimatePresence>
      <ToastContainer />
    </>
  );
}

export default App;
