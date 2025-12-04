import { createBrowserRouter, useParams } from "react-router";
import MainLayout from "./components/layout/MainLayout/MainLayout";
import RegisterPage from './routes/Register/RegisterPage';
import ProgramCardPage from "./routes/ProgramCard/ProgramCardPage";
import ProgramActionPage from "./routes/ProgramAction/ProgramActionPage";
import HomePage from './routes/Home/HomePage';
import AboutPage from "./routes/About/AboutPage"

export const router = createBrowserRouter([
  {
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage},
      { path: "register", Component: RegisterPage},
      { path: "program/:programID", Component: ProgramCardPage},
      { path: "program/:programID?/:action", Component: ProgramActionPage },
      { path: "about", Component: AboutPage }
    ]
  }
]);
  