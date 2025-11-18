import { createBrowserRouter, useParams } from "react-router";
import Home from "./routes/Home/HomePage";
import MainLayout from "./components/layout/MainLayout/MainLayout";
import RegisterPage from './routes/Register/RegisterPage';
import ProgramCardPage from "./routes/ProgramCard/ProgramCardPage";
export const router = createBrowserRouter([
  {
    Component: MainLayout,
    children: [
      { index: true, Component: Home},
      { path: "register", Component: RegisterPage},
      { path: "program/:programID", Component: ProgramCardPage},
    ]
  }
]);
