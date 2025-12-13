import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { Group } from '../../lib/types/shared.types';

interface ChatHeaderProps {
  group: Group;
}

export function ChatHeader({ group }: ChatHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex-none bg-neutral-800/80 backdrop-blur-md border-b border-neutral-700 px-6 py-4 flex justify-between items-center z-10">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-neutral-700 rounded-full transition-colors md:hidden">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            {group.name}
            <span className="bg-neutral-700 text-xs px-2 py-0.5 rounded-full text-neutral-400 font-normal">
              {group.members.length}
            </span>
          </h1>
          <div className="flex -space-x-2 mt-1 overflow-hidden">
            {group.members.slice(0, 5).map(m => (
              <div key={m.user.id} className="w-6 h-6 rounded-full border-2 border-neutral-800 bg-neutral-600 flex items-center justify-center text-[10px] text-white">
                {m.user.avatarUrl ? (
                  <img src={m.user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  (m.user.name?.[0] || m.user.email?.[0] || '?').toUpperCase()
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 hover:bg-neutral-700 rounded-full transition-colors text-neutral-400 hover:text-white">
          <MoreVertical size={20} />
        </button>
      </div>
    </header>
  );
}
