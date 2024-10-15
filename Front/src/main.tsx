import { createRoot } from 'react-dom/client';
import { router } from './router/router';
import { RouterProvider } from 'react-router-dom';
import './App.scss';
import '../src/assets/font/_font.scss';
import { WebSocketProvider } from './context/WebSocketContext';

createRoot(document.getElementById('root')!).render(
  <WebSocketProvider>
    <RouterProvider router={router} />
  </WebSocketProvider>,
);
