import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  type: "success" | "failed" | "session" | "login" | "delete" | "error";
  title?: string;
  message?: string;
}

const AlertModal = ({
  open,
  onClose,
  type,
  message,
  title,
}: AlertModalProps) => {
  const navigate = useNavigate();

  const { isSessionExpiredModalOpen, hideSessionExpiredModal, logout } =
    useAuthStore();

  if (!open) return null;

  if (type === "session" && !isSessionExpiredModalOpen) return null;

  const icon =
    type === "success" ? (
      <span className="text-green-500 text-4xl mb-2">✔️</span>
    ) : (
      <span className="text-red-500 text-4xl mb-2">❌</span>
    );

  if (type === "session") {
    const handleLogin = () => {
      logout();
      hideSessionExpiredModal();
      navigate("/login");
    };

    const handleCancel = () => {
      hideSessionExpiredModal();
      navigate("/");
    };

    return (
      <div className="fixed inset-0 bg-transparent bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-0 sm:w-[400px]">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Session Expired
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Your session has expired. Please log in again to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLogin}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Log In Again
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "login") {
    return (
      <div className="fixed inset-0 bg-transparent bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4 sm:mx-0 sm:w-[400px] shadow-lg text-center">
          <span className="text-blue-500 text-4xl mb-2">ℹ️</span>
          <h2 className="text-2xl font-semibold mb-2 text-blue-600">
            Login Required
          </h2>
          <p className="mb-6">
            You need to log in to access this feature. Please log in to
            continue.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (type === "delete") {
    return (
      <div className="fixed inset-0 bg-transparent bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4 sm:mx-0 sm:w-[400px] shadow-lg text-center">
          <span className="text-blue-500 text-4xl mb-2">ℹ️</span>
          <h2 className="text-2xl font-semibold mb-2 text-blue-600">
            Login Required
          </h2>
          <p className="mb-6">
            You need to log in to access this feature. Please log in to
            continue.
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 min-w-[300px] shadow-lg text-center">
        {icon}
        <h2
          className={`text-2xl font-semibold mb-2 ${
            type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {title}
        </h2>
        <p className="mb-6">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 px-6 py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
