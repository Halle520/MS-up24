import { useRef, useEffect } from 'react';
import { Message } from '../../lib/types/shared.types';
import { MessageItem } from './message-item';

interface MessageListProps {
  messages: Message[];
  currentUserEmail: string;
}

export function MessageList({ messages, currentUserEmail }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 scroll-smooth">
      {messages.map((msg) => (
        <MessageItem key={msg.id} msg={msg} currentUserEmail={currentUserEmail} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
