import { Outlet } from 'react-router-dom';
import useTheme from './zustand/theme';
import { useEffect } from 'react';

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
      <Outlet />
    </>
  );
}

export default App;
