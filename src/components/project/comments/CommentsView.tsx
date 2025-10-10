import { useParams } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { PhaseColumn } from './PhaseColumn';
import type { Comment } from './CommentCard';

type Phase = {
  id: string;
  title: string;
  comments: Comment[];
};

export default function CommentsView() {
  const { id: _id } = useParams<{ id: string }>();
  
  // Mock data - in a real app, this would come from an API
  const [phases, setPhases] = useState<Phase[]>([
    {
      id: 'urs',
      title: 'URS',
      comments: [
        {
          id: 'c1',
          author: 'Alex Johnson',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          content: 'We need to finalize the requirements by Friday.',
          timestamp: new Date('2025-10-01T10:30:00'),
          taskId: 't1',
          taskTitle: 'Finalize Requirements',
          replies: [
            {
              id: 'c2',
              author: 'Sam Wilson',
              avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
              content: 'I\'ve reviewed the requirements and they look good to me.',
              timestamp: new Date('2025-10-01T11:15:00'),
            },
          ],
        },
      ],
    },
    {
      id: 'iq',
      title: 'IQ',
      comments: [
        {
          id: 'c3',
          author: 'Taylor Swift',
          avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
          content: 'Installation qualification is scheduled for next week.',
          timestamp: new Date('2025-10-02T09:45:00'),
          taskId: 't2',
          taskTitle: 'Schedule IQ',
        },
      ],
    },
    {
      id: 'oq',
      title: 'OQ',
      comments: [],
    },
    {
      id: 'pq',
      title: 'PQ',
      comments: [],
    },
  ]);

  const handleAddComment = useCallback((phaseId: string, content: string) => {
    setPhases(prevPhases => 
      prevPhases.map(phase => {
        if (phase.id === phaseId) {
          const newComment: Comment = {
            id: `comment-${Date.now()}`,
            author: 'Current User',
            avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
            content,
            timestamp: new Date(),
          };
          return {
            ...phase,
            comments: [...phase.comments, newComment],
          };
        }
        return phase;
      })
    );
  }, []);

  const handleReply = useCallback((phaseId: string, commentId: string, content: string) => {
    setPhases(prevPhases =>
      prevPhases.map(phase => {
        if (phase.id === phaseId) {
          const addReply = (comments: Comment[]): Comment[] => {
            return comments.map(comment => {
              if (comment.id === commentId) {
                const newReply: Comment = {
                  id: `reply-${Date.now()}`,
                  author: 'Current User',
                  avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
                  content,
                  timestamp: new Date(),
                };
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newReply],
                };
              }
              if (comment.replies) {
                return {
                  ...comment,
                  replies: addReply(comment.replies),
                };
              }
              return comment;
            });
          };
          return {
            ...phase,
            comments: addReply(phase.comments),
          };
        }
        return phase;
      })
    );
  }, []);

  const handleEditComment = useCallback((phaseId: string, commentId: string, content: string) => {
    setPhases(prevPhases =>
      prevPhases.map(phase => {
        if (phase.id === phaseId) {
          const updateComment = (comments: Comment[]): Comment[] => {
            return comments.map(comment => {
              if (comment.id === commentId) {
                return { ...comment, content };
              }
              if (comment.replies) {
                return {
                  ...comment,
                  replies: updateComment(comment.replies),
                };
              }
              return comment;
            });
          };
          return {
            ...phase,
            comments: updateComment(phase.comments),
          };
        }
        return phase;
      })
    );
  }, []);

  const handleDeleteComment = useCallback((phaseId: string, commentId: string) => {
    setPhases(prevPhases =>
      prevPhases.map(phase => {
        if (phase.id === phaseId) {
          const deleteComment = (comments: Comment[]): Comment[] => {
            return comments.reduce<Comment[]>((acc, comment) => {
              if (comment.id === commentId) {
                return acc;
              }
              if (comment.replies) {
                return [...acc, {
                  ...comment,
                  replies: deleteComment(comment.replies),
                }];
              }
              return [...acc, comment];
            }, []);
          };
          return {
            ...phase,
            comments: deleteComment(phase.comments),
          };
        }
        return phase;
      })
    );
  }, []);

  return (
    <div className="flex-1 p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto pb-4 -mx-6 px-6">
        {phases.map(phase => (
          <PhaseColumn
            key={phase.id}
            phaseId={phase.id}
            title={phase.title}
            comments={phase.comments}
            onAddComment={handleAddComment}
            onReply={(commentId, content) => handleReply(phase.id, commentId, content)}
            onEdit={(commentId, content) => handleEditComment(phase.id, commentId, content)}
            onDelete={(commentId) => handleDeleteComment(phase.id, commentId)}
            className="flex-shrink-0"
          />
        ))}
      </div>
    </div>
  );
}
