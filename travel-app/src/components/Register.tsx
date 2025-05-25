import React, { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { z } from "zod";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";
import AlertModal from "./AlertModal";

const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, {
      message: "Confirm Password must be at least 8 characters long",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;
const Register = () => {
  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { username, email, password, confirmPassword } = form;
  const [zodErrors, setZodErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const navigate = useNavigate();
  const { register, loading, error, message, statusCode, clearMessages } = useAuthStore();
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse({
      username,
      email,
      password,
      confirmPassword,
    });
    if (!result.success) {
      const fieldErrors: {
        username?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
      } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "username") fieldErrors.username = err.message;
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
        if (err.path[0] === "confirmPassword")
          fieldErrors.confirmPassword = err.message;
      });
      setZodErrors(fieldErrors);
      return;
    }
    setZodErrors({});
    const res = await register(username, email, password);
    if (res.success) {
      setShowAlert(true);
      setTimeout(() => {
      setShowAlert(false);
      navigate("/auth/login", { replace: true });
      }, 2000);
    }else{
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
    }
  };

  useEffect(() => {
    clearMessages()
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      {showAlert && (
        <AlertModal
          message={message || "Registration successful!"}
          type={error ? "failed" : "success"}
          open={showAlert}
          onClose={() => setShowAlert(false)}
        />
      )}
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-800 shadow-sm">
          <h2 className="text-base font-semibold">Registration Failed</h2>

          <p className="mt-1 text-sm">{error}</p>

          {message && <p className="mt-1 text-sm italic">{message}</p>}

          {statusCode && (
            <p className="mt-1 text-xs text-red-600">
              Error Code: {statusCode}
            </p>
          )}

          <p className="mt-2 font-medium">
            Please make sure all fields are filled correctly, and the email is
            not already in use.
          </p>
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          name="username"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          onChange={handleChange}
          autoComplete="username"
        />
        {zodErrors.username && (
          <p className="text-red-500 text-sm mt-1">{zodErrors.username}</p>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={handleChange}
          required
          autoComplete="email"
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
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={handleChange}
          required
          autoComplete="current-password"
        />
        {zodErrors.password && (
          <p className="text-red-500 text-sm mt-1">{zodErrors.password}</p>
        )}
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />
        {zodErrors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {zodErrors.confirmPassword}
          </p>
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
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      <div className="mt-4 text-center">
        <span className="text-gray-600">Already have an account? </span>
        <NavLink
          to="/auth/login"
          end
          className={({ isActive }) =>
            `text-gray-700 hover:text-blue-600 font-medium transition ${
              isActive ? "border-b-2 border-blue-600" : ""
            }`
          }
        >
          Sign In
        </NavLink>
      </div>
    </form>
  );
};

export default Register;
