import { createBrowserRouter } from 'react-router';
import HomePage from './routes/Home/HomePage';
import MainLayout from './components/layout/MainLayout/MainLayout';
import RegisterPage from './routes/Register/RegisterPage';

export const router = createBrowserRouter([
  {
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      { path: 'register', Component: RegisterPage },
    ],
  },
]);
