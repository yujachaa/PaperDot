import Main from '../pages/Main';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Mypage from '../pages/Mypage';
import Star from '../pages/Star';
import App from '../App';
import { createBrowserRouter } from 'react-router-dom';
import Radio from '../pages/Radio';
import SearchResult from '../pages/SearchResult';
import Replay from '../pages/Replay';

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
        path: '/login',
        element: <Login />,
      },
      {
        path: '/radio',
        element: <Radio />,
      },
      {
        path: '/replay',
        element: <Replay />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/mypage',
        element: <Mypage />,
      },
      {
        path: '/star',
        element: <Star />,
      },
      {
        path: '/result',
        element: <SearchResult />,
      },
    ],
  },
]);
