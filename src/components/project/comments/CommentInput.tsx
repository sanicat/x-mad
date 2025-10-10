import { useState, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../../ui/button';

interface CommentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export function CommentInput({ 
  onSubmit, 
  placeholder = 'Add a comment...',
  autoFocus = false,
  className = ''
}: CommentInputProps) {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-end space-x-2">
        <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-[#1f3a9d] focus-within:border-transparent">
          <textarea
            className="w-full p-3 text-sm border-0 focus:ring-0 focus:outline-none resize-none"
            rows={1}
            placeholder={placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ minHeight: '44px', maxHeight: '120px' }}
            autoFocus={autoFocus}
            aria-label={placeholder}
          />
          <div className="flex justify-end p-2 bg-gray-50 border-t">
            <Button 
              type="button"
              size="sm"
              className="h-8 px-3 bg-[#1f3a9d] hover:bg-[#19307d] text-white"
              onClick={handleSubmit}
              disabled={!content.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
