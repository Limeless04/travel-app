import  { useEffect } from 'react';

type ToastProps = {
    message: string;
    duration?: number; // in ms
    type?: 'success' | 'error' | 'info'; // Optional, can be used for styling
    onClose: () => void;
};

const Toast = ({ message, duration = 3000, onClose, type }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`
            fixed bottom-8 left-1/2 -translate-x-1/2
            ${type === 'success' ? 'bg-green-600' : type === 'info' ? 'bg-blue-600' : 'bg-red-600'}
            text-white px-6 py-3
            rounded-lg shadow-lg z-[9999]
            min-w-[200px] text-center
            `}
        >
            {message}
        </div>
    );
};

export default Toast;
