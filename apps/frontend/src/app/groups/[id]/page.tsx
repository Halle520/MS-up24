'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { groupsApi } from '../../../lib/api/groups.api';
import { Group, Message } from '../../../lib/types/shared.types';
import { getSupabaseClient } from '../../../lib/supabase/supabase-client';
import { ChatHeader } from '../../../components/chat/chat-header';
import { MessageList } from '../../../components/chat/message-list';
import { ChatInput } from '../../../components/chat/chat-input';

export default function ChatPage() {
  const { id } = useParams() as { id: string };
  const [group, setGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  useEffect(() => {
    getSupabaseClient()
      .auth.getUser()
      .then(({ data }) => {
        if (data.user?.email) setCurrentUserEmail(data.user.email);
      });

    loadGroup();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const loadGroup = async () => {
    try {
      const g = await groupsApi.getOne(id);
      setGroup(g);
      loadMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const loadMessages = async () => {
    try {
      const msgs = await groupsApi.getMessages(id);
      setMessages(msgs);
    } catch (err) {
      console.error(err);
    }
  };

  if (!group) return (
    <div className="flex h-screen items-center justify-center bg-neutral-900 text-white">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );

  return (
    <div className="flex h-full flex-col bg-neutral-900 text-neutral-100 font-sans overflow-hidden">
      <ChatHeader group={group} />

      <div className="flex-1 flex flex-col min-h-0 relative">
        <MessageList messages={messages} currentUserEmail={currentUserEmail} />
        <ChatInput groupId={id} onMessageSent={loadMessages} />
      </div>
    </div>
  );
}
