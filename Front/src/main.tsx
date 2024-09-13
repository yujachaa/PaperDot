import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from './router/router';
import { RouterProvider } from 'react-router-dom';
import './App.scss';
import '../src/assets/font/_font.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
