const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100 text-slate-800 font-sans">
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-8"
    >
      <circle cx="60" cy="60" r="60" fill="#6366f1" opacity="0.1" />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".35em"
        fontSize="48"
        fill="#6366f1"
        fontWeight="bold"
      >
        404
      </text>
    </svg>
    <h1 className="text-4xl font-bold mb-0">Page Not Found</h1>
    <p className="text-lg text-slate-500 mt-4 mb-8">
      Sorry, the page you are looking for does not exist.
    </p>
    <a
      href="/"
      className="px-8 py-3 bg-indigo-500 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-600 transition"
    >
      Go Home
    </a>
  </div>
);

export default NotFound;
