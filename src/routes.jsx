import { createBrowserRouter, useParams } from "react-router";
import MainLayout from "./components/layout/MainLayout/MainLayout";
import RegisterPage from './routes/Register/RegisterPage';
import ProgramCardPage from "./routes/ProgramCard/ProgramCardPage";
import HomePage from './routes/Home/HomePage';
import ProgramActionPage from "./routes/ProgramEdit/ProgramActionPage";

export const router = createBrowserRouter([
  {
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage},
      { path: "register", Component: RegisterPage},
      { path: "program/:programID", Component: ProgramCardPage},
      { path: "program/:programID?/:action", Component: ProgramActionPage },
    ]
  }
]);
