
export type Comment = {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
};

export type CommentSectionProps = {
    comments: Comment[];
};

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

const CommentSection = ({ comments }: CommentSectionProps) => (
    <div className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        <ul className="space-y-4">
            {comments.map((comment) => (
                <li key={comment.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="text-gray-800">{comment.content}</div>
                    <div className="text-xs text-gray-500 mt-2">
                        Posted on {formatDate(comment.createdAt)}
                        {comment.updatedAt !== comment.createdAt && (
                            <span> • Edited</span>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

export default CommentSection;