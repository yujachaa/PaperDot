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
import PaperDetail from '../pages/PaperDetail';
import ErrorBoundary from '../components/common/ErrorBoundary';
import TestComponent from '../components/common/TestComponent';
import NotFound from '../components/common/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    ),
    children: [
      {
        path: '/',
        element: <Main />,
      },
      {
        path: '/login',
        element: (
          <ErrorBoundary>
            <Login />
          </ErrorBoundary>
        ),
      },
      {
        path: '/radio/:id',
        element: (
          <ErrorBoundary>
            <Radio />
          </ErrorBoundary>
        ),
      },
      {
        path: '/replay/:id',
        element: (
          <ErrorBoundary>
            <Replay />
          </ErrorBoundary>
        ),
      },
      {
        path: '/signup',
        element: (
          <ErrorBoundary>
            <Signup />
          </ErrorBoundary>
        ),
      },
      {
        path: '/mypage',
        element: (
          <ErrorBoundary>
            <Mypage />
          </ErrorBoundary>
        ),
      },
      {
        path: '/star',
        element: (
          <ErrorBoundary>
            <Star />
          </ErrorBoundary>
        ),
      },
      {
        path: '/search',
        element: (
          <ErrorBoundary>
            <SearchResult />
          </ErrorBoundary>
        ),
      },
      {
        path: '/paper/:id',
        element: (
          <ErrorBoundary>
            <PaperDetail />
          </ErrorBoundary>
        ),
      },
      {
        path: '/e',
        element: (
          <ErrorBoundary>
            <TestComponent />
          </ErrorBoundary>
        ),
      },
      {
        path: '*',
        element: (
          <ErrorBoundary>
            <NotFound />
          </ErrorBoundary>
        ),
      },
    ],
  },
]);
