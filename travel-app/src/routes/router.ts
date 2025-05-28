import { createBrowserRouter } from "react-router";
import App from "../App.tsx";
import Home from "../pages/Home.tsx";
import About from "../pages/About.tsx";
import NotFound from "../components/NotFound.tsx";
import AuthLayout from "../pages/AuthLayout.tsx";
import ArticleNotFound from "../pages/Article/ArticleNotFound.tsx";
import ArticleForm from "../pages/Article/ArticleForm.tsx";
import Login from "../pages/auth/Login.tsx";
import Register from "../pages/auth/Register.tsx";
import ArticleDetail from "../pages/Article/ArticleDetail.tsx";
import AuthGuard from "../components/auth/AuthGuard.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          { path: "login", Component: Login },
          { path: "signup", Component: Register },
        ],
      },
      {
        path: "articles", // Parent route for articles
        Component: AuthGuard,
        children: [
          { path: "create", Component: ArticleForm }, // articles/create
          { path: ":slug", Component: ArticleDetail }, // articles/:slug
          { path: "update/:slug", Component: ArticleForm }, // articles/update/:slug
          { path: "delete/:slug", Component: ArticleForm }, // articles/delete/:slug
          { path: "*", Component: ArticleNotFound }, // Catch-all for articles not found
        ],
        loader: () => {},
      },
    ],
  },

  {
    path: "*",
    Component: NotFound,
  },
]);

export default router;
