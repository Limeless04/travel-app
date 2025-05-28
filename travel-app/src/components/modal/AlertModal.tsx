import { useNavigate } from "react-router";
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiInformationCircle,
  HiXCircle,
} from "react-icons/hi";

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  type: "success" | "failed" | "session" | "login" | "delete" | "error";
  title?: string;
  message?: string;
}

const iconMap = {
  success: {
    icon: <HiCheckCircle className="text-green-500 text-5xl" />,
    color: "text-green-600",
  },
  failed: {
    icon: <HiXCircle className="text-red-500 text-5xl" />,
    color: "text-red-600",
  },
  error: {
    icon: <HiExclamationCircle className="text-red-500 text-5xl" />,
    color: "text-red-600",
  },
  session: {
    icon: <HiExclamationCircle className="text-red-500 text-5xl" />,
    color: "text-red-600",
  },
  login: {
    icon: <HiInformationCircle className="text-blue-500 text-5xl" />,
    color: "text-blue-600",
  },
  delete: {
    icon: <HiInformationCircle className="text-blue-500 text-5xl" />,
    color: "text-blue-600",
  },
};

const titleMap: Record<AlertModalProps["type"], string> = {
  success: "Success",
  failed: "Failed",
  error: "Error",
  session: "Session Expired",
  login: "Login Required",
  delete: "Action Required",
};

const defaultMessageMap: Record<AlertModalProps["type"], string> = {
  success: "Operation completed successfully.",
  failed: "Something went wrong. Please try again.",
  error: "An error occurred. Please check and try again.",
  session: "Your session has expired. Please log in again.",
  login: "You need to log in to access this feature.",
  delete: "Are you sure you want to delete this item?",
};

const AlertModal = ({
  open,
  onClose,
  type,
  message,
  title,
}: AlertModalProps) => {
  const navigate = useNavigate();
  const { icon, color } = iconMap[type];
  const resolvedTitle = title ?? titleMap[type];
  const resolvedMessage = message ?? defaultMessageMap[type];

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 sm:p-8 w-[90%] max-w-md shadow-lg text-center">
        <div className="flex justify-center mb-4">{icon}</div>
        <h2 className={`text-2xl font-semibold mb-2 ${color}`}>
          {resolvedTitle}
        </h2>
        <p className="text-gray-700 mb-6 text-sm">{resolvedMessage}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Close
          </button>
          {type === "session" || type === "login" ? (
            <button
              onClick={() => navigate("/auth/login")}
              className="px-5 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
            >
              Login
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
