import { createBrowserRouter } from "react-router";
import Home from "./routes/home/home";

export const router = createBrowserRouter([
  { path: "/", Component: Home },
]);
