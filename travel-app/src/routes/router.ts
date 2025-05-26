import { createBrowserRouter } from "react-router";
import App from "../App.tsx";
import Home from "../pages/Home.tsx";
import About from "../pages/About.tsx";
import NotFound from "../components/NotFound.tsx";
import AuthLayout from "../pages/AuthLayout.tsx";
import Login from "../components/Login.tsx";
import Register from "../components/Register.tsx";
import ArticleDetail from "../pages/Article/ArticleDetail.tsx";
import ArticleNotFound from "../pages/Article/ArticleNotFound.tsx";
import ArticleForm from "../pages/Article/ArticleForm.tsx";

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
        path: "articles/*",
        Component: ArticleNotFound,
      },
      {
        path: "articles/:slug",
        Component: ArticleDetail,
      },
      {
        path: "articles/create",
        Component: ArticleForm,
      },
      {
        path: "articles/delete/:slug",
        Component: ArticleForm,
      },
      {
        path: "articles/update/:slug",
        Component: ArticleForm,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);

export default router;
