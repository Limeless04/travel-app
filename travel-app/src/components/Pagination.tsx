interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ current, total, onPageChange }: PaginationProps) => {
  // Example: < 1 2 ... 4 >
  // Always show first, current, last, and ellipsis if needed

  const pages: (number | string)[] = [];

  if (total <= 3) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 4) {
      pages.push("...");
    }
    if (current !== 1 && current !== total) {
      pages.push(current);
    }
    if (current < total - 1) {
      pages.push("...");
    }
    if (total !== 1) {
      pages.push(total);
    }
  }

  return (
    <nav className="flex items-center justify-center space-x-2">
      <button
        className="px-2 py-1 rounded hover:bg-gray-200"
        disabled={current === 1}
        onClick={() => onPageChange(current - 1)}
      >
        &lt;
      </button>
      {pages.map((p, i) =>
        typeof p === "number" ? (
          <button
            key={p}
            className={`px-3 py-1 rounded ${
              p === current
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 text-gray-700"
            }`}
            onClick={() => onPageChange(p)}
            disabled={p === current}
          >
            {p}
          </button>
        ) : (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
            {p}
          </span>
        )
      )}
      <button
        className="px-2 py-1 rounded hover:bg-gray-200"
        disabled={current === total}
        onClick={() => onPageChange(current + 1)}
      >
        &gt;
      </button>
    </nav>
  );
};

export default Pagination;
