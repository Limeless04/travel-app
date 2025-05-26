interface DeleteModalProps {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteModal = ({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone. Do you want to delete this item?",
  onCancel,
  onConfirm,
}: DeleteModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4 sm:mx-0 shadow-lg text-center">
        <span className="text-red-500 text-4xl mb-2">⚠️</span>
        <h2 className="text-2xl font-semibold mb-2 text-red-600">{title}</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded bg-gray-300 text-gray-800 font-bold hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded bg-red-600 text-white font-bold hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
