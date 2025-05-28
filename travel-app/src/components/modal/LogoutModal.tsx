import { FaSignOutAlt } from "react-icons/fa";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const LogoutModal = ({ isOpen, onClose, onLogout }: LogoutModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.4)] backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 transform transition-all scale-100 animate-fadeIn">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-red-100 rounded-full p-4 mb-3">
            <FaSignOutAlt className="text-red-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Log out</h2>
        </div>
        <p className="mb-6 text-center text-gray-700">
          Are you sure you want to log out? We’ll miss you!
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="px-5 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
            onClick={onLogout}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
