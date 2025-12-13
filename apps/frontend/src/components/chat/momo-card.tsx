import { CreditCard } from 'lucide-react';
import { Consumption } from '../../lib/types/shared.types';

interface MomoCardProps {
  consumption: Consumption;
  isMe: boolean;
}

export function MomoCard({ consumption, isMe }: MomoCardProps) {
  return (
    <div className={`mb-2 w-72 rounded-3xl overflow-hidden shadow-lg border ${isMe
      ? 'bg-white border-pink-100 shadow-pink-500/10'
      : 'bg-white border-gray-100 shadow-gray-200'
      }`}>
      {/* Momo Header */}
      <div className={`px-4 py-3 flex items-center justify-between ${isMe ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-neutral-100'
        }`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-full ${isMe ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-600'}`}>
            <CreditCard size={16} />
          </div>
          <span className={`text-sm font-bold ${isMe ? 'text-white' : 'text-neutral-700'}`}>
            New Expense
          </span>
        </div>
        <span className={`text-[10px] uppercase tracking-wider font-semibold ${isMe ? 'text-pink-100' : 'text-neutral-400'
          }`}>
          Transaction
        </span>
      </div>

      {/* Momo Body */}
      <div className="p-5 flex flex-col items-center">
        <div className="text-sm text-neutral-400 font-medium mb-1">Total Amount</div>
        <div className="text-3xl font-extrabold text-neutral-800 mb-4 flex items-start">
          <span className="text-lg mt-1 mr-0.5">$</span>
          {Number(consumption.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>

        <div className="w-full bg-neutral-50 rounded-xl p-3 flex items-center gap-3 border border-neutral-100">
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💸</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-neutral-400 mb-0.5">Note</div>
            <div className="text-sm text-neutral-700 font-medium truncate">
              {consumption.description}
            </div>
          </div>
        </div>
      </div>

      {/* Momo Footer (Actions) */}
      <div className="px-4 py-3 bg-neutral-50/50 border-t border-neutral-100 flex gap-2">
        <button className="flex-1 py-1.5 rounded-lg text-sm font-semibold text-pink-600 bg-pink-50 hover:bg-pink-100 transition-colors">
          Details
        </button>
      </div>
    </div>
  );
}
