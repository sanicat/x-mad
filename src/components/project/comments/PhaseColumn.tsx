import type { Comment } from './CommentCard';
import { CommentInput } from './CommentInput';
import { CommentCard } from './CommentCard';

interface PhaseColumnProps {
  title: string;
  phaseId: string;
  comments: Comment[];
  onAddComment: (phaseId: string, content: string) => void;
  onReply: (commentId: string, content: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  className?: string;
}

export function PhaseColumn({
  title,
  phaseId,
  comments,
  onAddComment,
  onReply,
  onEdit,
  onDelete,
  className = '',
}: PhaseColumnProps) {
  const handleAddComment = (content: string) => {
    onAddComment(phaseId, content);
  };

  return (
    <div 
      className={`flex flex-col bg-gray-50 rounded-lg overflow-hidden border border-gray-200 ${className}`}
      style={{ minWidth: '320px', maxWidth: '400px' }}
    >
      {/* Phase Header */}
      <div className="bg-[#1f3a9d] text-white px-4 py-3 font-medium rounded-t-lg">
        {title}
      </div>

      {/* Comments List */}
      <div className="p-4 space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              onReply={(commentId, content) => onReply(commentId, content)}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No comments yet. Add the first one!
          </div>
        )}
      </div>

      {/* Comment Input */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <CommentInput 
          onSubmit={handleAddComment} 
          placeholder={`Add a comment to ${title}...`}
        />
      </div>
    </div>
  );
}
