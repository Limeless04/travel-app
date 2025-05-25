import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router";
import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

type loginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const [form, setForm] = useState<loginForm>({ email: "", password: "" });
  const { email, password } = form;
  const [zodErrors, setZedErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const navigate = useNavigate();
  const { login, loading, error, message, statusCode, clearMessages} = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setZedErrors(fieldErrors);
      return;
    }
    setZedErrors({});
    const res = await login(email, password);
    if (res.success) {
      navigate("/", { replace: true });
    }
  };

    useEffect(() => {
      clearMessages()
    }, [])
  

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-800 shadow-sm">
          <h2 className="text-base font-semibold">
            Oops! Something went wrong.
          </h2>
          <p className="mt-1 text-sm">{error}</p>
          {message && <p className="mt-1 text-sm italic">{message}</p>}
          {statusCode && (
            <p className="mt-1 text-xs text-red-600">
              Error Code: {statusCode}
            </p>
          )}
          <p className="mt-2 font-medium">
            Please check your email or password and try again.
          </p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={handleChange}
        />
        {zodErrors.email && (
          <p className="text-red-500 text-sm mt-1">{zodErrors.email}</p>
        )}
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={handleChange}
          autoComplete="current-password"
        />
        {zodErrors.password && (
          <p className="text-red-500 text-sm mt-1">{zodErrors.password}</p>
        )}
      </div>
      <button
        type="submit"
        className={`w-full text-white py-2 rounded transition ${
          loading
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="mt-4 text-center">
        <span className="text-gray-600">Don't have an account? </span>
        <NavLink
          to="/auth/signup"
          end
          className={({ isActive }) =>
            `text-gray-700 hover:text-blue-600 font-medium transition ${
              isActive ? "border-b-2 border-blue-600" : ""
            }`
          }
        >
          Sign Up
        </NavLink>
      </div>
    </form>
  );
};

export default Login;
