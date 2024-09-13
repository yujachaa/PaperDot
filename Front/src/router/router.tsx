import Main from '../pages/Main';
import App from '../App';
import { createBrowserRouter } from 'react-router-dom';
import Test from '../pages/Test';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Main />,
      },
      {
        path: '/test',
        element: <Test />,
      },
    ],
  },
]);
