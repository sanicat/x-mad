import { useState, useMemo } from 'react';
import { MoreVertical, MessageSquare, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  replies?: Comment[];
  taskId?: string;
  taskTitle?: string;
}

interface CommentCardProps {
  comment: Comment;
  onReply?: (commentId: string, content: string) => void;
  onEdit?: (commentId: string, newContent: string) => void;
  onDelete?: (commentId: string) => void;
  isReply?: boolean;
  level?: number;
}

export function CommentCard({ 
  comment, 
  onReply, 
  onEdit, 
  onDelete, 
  isReply = false, 
  level = 0 
}: CommentCardProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const navigate = useNavigate();

  const timestampText = useMemo(() => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(comment.timestamp)), [comment.timestamp]);

  const handleReply = () => {
    if (replyContent.trim()) {
      // In a real app, this would call an API
      onReply?.(comment.id, replyContent.trim());
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const handleEdit = () => {
    onEdit?.(comment.id, editedContent);
    setIsEditing(false);
  };

  return (
    <div 
      className={`relative ${isReply ? 'ml-6 pl-4 border-l-2 border-gray-200' : ''}`}
      style={{ marginLeft: isReply ? `${level * 1.5}rem` : 0 }}
    >
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow mb-4 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={comment.avatar} 
                alt={comment.author} 
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900">{comment.author}</div>
                <div className="text-xs text-[#1f3a9d]">
                  {timestampText}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => onDelete?.(comment.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-3 text-gray-700">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  autoFocus
                />
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleEdit}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p>{comment.content}</p>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            {comment.taskId && (
              <button 
                className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700"
                onClick={() => navigate(`/tasks/${comment.taskId}`)}
              >
                <ArrowRight className="h-3 w-3 mr-1" />
                {comment.taskTitle || 'Task'}
              </button>
            )}
            
            <button 
              className="text-sm font-medium text-[#1f3a9d] hover:text-[#19307d] flex items-center"
              onClick={() => {
                setIsReplying(!isReplying);
                if (!isReplying) {
                  // Scroll to the reply input when opening
                  setTimeout(() => {
                    document.getElementById(`reply-${comment.id}`)?.focus();
                  }, 0);
                }
              }}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              {comment.replies?.length ? `Reply (${comment.replies.length})` : 'Reply'}
            </button>
          </div>
        </div>

        {/* Reply input */}
        {isReplying && (
          <div className="border-t border-gray-100 p-4 bg-gray-50">
            <div className="flex space-x-2">
              <input
                id={`reply-${comment.id}`}
                type="text"
                placeholder="Write a reply..."
                className="flex-1 p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1f3a9d] focus:border-transparent"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleReply();
                  }
                }}
              />
              <Button 
                size="sm" 
                className="bg-[#1f3a9d] hover:bg-[#19307d]"
                onClick={handleReply}
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Nested replies */}
      {comment.replies?.map((reply) => (
        <CommentCard 
          key={reply.id} 
          comment={reply} 
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          isReply={true}
          level={level + 1}
        />
      ))}
    </div>
  );
}
