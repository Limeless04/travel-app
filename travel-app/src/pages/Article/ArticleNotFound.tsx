import { Link } from 'react-router';

const ArticleNotFound = () => (
    <div className="flex flex-col items-center justify-center mt-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="mb-6 text-gray-600">The article you are looking for does not exist or has been removed.</p>
        <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
            Go back to Home
        </Link>
    </div>
);

export default ArticleNotFound;