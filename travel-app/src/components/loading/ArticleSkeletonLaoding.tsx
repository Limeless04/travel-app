
const ArticleCardSkeleton = () => (
    <ul className="space-y-6 sm:space-y-8">
        <li
            className="bg-white p-4 sm:p-6 rounded-lg shadow-md relative overflow-hidden animate-pulse" // Added animate-pulse for loading effect
        >
            {/* Optional: Placeholder for image if it existed in the real card */}
            <div className="w-full h-48 bg-gray-200 rounded-md mb-4"></div> 
            
            <div className="space-y-3">
                {/* Title Placeholder */}
                <div className="h-6 bg-gray-200 rounded w-3/4"></div> 
                {/* Summary Placeholder - multiple lines */}
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                {/* Author Placeholder */}
                <div className="h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
                {/* "Read more" link Placeholder */}
                <div className="h-4 bg-gray-200 rounded w-1/5 mt-4"></div> 
            </div>
        </li>
    </ul>
);

export default ArticleCardSkeleton;