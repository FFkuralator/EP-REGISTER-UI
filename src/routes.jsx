import { createBrowserRouter } from "react-router";
import Home from "./routes/Home/home";

export const router = createBrowserRouter([
  { path: "/", Component: Home },
]);
