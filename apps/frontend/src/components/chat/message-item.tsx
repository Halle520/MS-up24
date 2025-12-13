import { Message } from '../../lib/types/shared.types';
import { MomoCard } from './momo-card';

interface MessageItemProps {
  msg: Message;
  currentUserEmail: string;
}

const isImageUrl = (content: string) => {
  return content.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null || (content.startsWith('http') && content.includes('supabase'));
};

export function MessageItem({ msg, currentUserEmail }: MessageItemProps) {
  const isMe = msg.user.email === currentUserEmail;
  const isImage = isImageUrl(msg.content);

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} group items-end gap-2`}>
      {!isMe && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mb-1 shadow-lg">
          {(msg.user.name?.[0] || msg.user.email?.[0] || '?').toUpperCase()}
        </div>
      )}

      <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && <span className="text-xs text-neutral-500 ml-1 mb-1">{msg.user.name || msg.user.email}</span>}

        {/* Consumption Card (Momo Style) */}
        {msg.consumption && (
          <MomoCard consumption={msg.consumption} isMe={isMe} />
        )}

        {/* Message Content (Hidden if purely a fee notification) */}
        {(!msg.consumption || (msg.content && msg.content !== 'sent a fee')) && (
          <div
            className={`rounded-2xl px-4 py-2 shadow-sm relative overflow-hidden ${isImage ? 'p-0 bg-transparent' :
                isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-neutral-800 text-neutral-200 rounded-bl-none'
              }`}
          >
            {isImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-neutral-700/50">
                <img src={msg.content} alt="Sent image" className="max-w-full max-h-[300px] object-cover" />
              </div>
            ) : (
              <span>{msg.content}</span>
            )}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-[10px] text-neutral-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity px-1">
          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
