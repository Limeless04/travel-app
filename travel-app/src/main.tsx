import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import router from "./routes/router.ts";
import ErrorBoundary from "./components/ErrorBoundry.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router}/>
    </ErrorBoundary>
  </StrictMode>
);
