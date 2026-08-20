import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/Home";
import Contact from "./pages/Contact/Contact";
import Events from "./pages/Events/Events";
import Placeholder from "./pages/Placeholder";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "/products",
        element: (
          <Placeholder
            title="Products & Services"
            description="Wholesale, retail, import/export, and distribution page content coming soon."
          />
        ),
      },
      {
        path: "/about",
        element: (
          <Placeholder
            title="About"
            description="Our story, values, and team page content coming soon."
          />
        ),
      },
      { path: "/events", element: <Events /> },
      { path: "/contact", element: <Contact /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
