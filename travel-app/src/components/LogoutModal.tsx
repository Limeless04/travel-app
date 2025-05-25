
interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogout: () => void;
}

const LogoutModal = ({ isOpen, onClose, onLogout }: LogoutModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Log out</h2>
                <p className="mb-6 text-gray-600">Are you sure you want to log out?</p>
                <div className="flex justify-center space-x-3">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
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