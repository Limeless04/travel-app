import { Outlet, Navigate, useLocation } from 'react-router';

interface AuthLayoutProps {
    isAuthenticated?: boolean;
}

const AuthLayout  = ({ isAuthenticated = false }: AuthLayoutProps) => {
    const location = useLocation();

    if (isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
            <div className="w-full max-w-md p-8 shadow-lg rounded-lg bg-white">
            <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;