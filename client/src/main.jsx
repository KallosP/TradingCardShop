import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/MarketplacePage";
import "./index.css";
import CreateCardPage from "./pages/CreateCardPage";
import MarketplacePage from "./pages/MarketplacePage";
import MyCardsPage from "./pages/MyCardsPage";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/create-card",
        element: <App />,
        children: [
          {
            path: "/create-card",
            element: <CreateCardPage />,
          },
        ],
      },

      {
        path: "/marketplace",
        element: <App />,
        children: [
          {
            path: "/marketplace",
            element: <MarketplacePage />,
          },
        ],
      },

      {
        path: "/my-cards",
        element: <App />,
        children: [
          {
            path: "/my-cards",
            element: <MyCardsPage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);