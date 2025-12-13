import { useState, useRef } from 'react';
import { Send, Image as ImageIcon, DollarSign, X } from 'lucide-react';
import { useUploadImage } from '../../lib/hooks/use-images';
import { groupsApi } from '../../lib/api/groups.api';
import { consumptionApi } from '../../lib/api/consumption.api';

interface ChatInputProps {
  groupId: string;
  onMessageSent: () => void;
}

export function ChatInput({ groupId, onMessageSent }: ChatInputProps) {
  const [newMessage, setNewMessage] = useState('');
  const [showConsumptionForm, setShowConsumptionForm] = useState(false);
  const [consumptionAmount, setConsumptionAmount] = useState('');
  const [consumptionDesc, setConsumptionDesc] = useState('');
  const [isSubmittingConsumption, setIsSubmittingConsumption] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadImage();

  const sendMessage = async (e?: React.FormEvent, consumptionId?: string, contentOverride?: string) => {
    e?.preventDefault();
    const contentToSend = contentOverride ?? newMessage;

    if (!contentToSend.trim() && !consumptionId) return;

    try {
      await groupsApi.sendMessage(groupId, contentToSend, consumptionId);
      setNewMessage('');
      onMessageSent();
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadMutation.mutateAsync({ file });
      // Send image URL as message
      await sendMessage(undefined, undefined, result.urlOriginal);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image');
    }

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConsumptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumptionAmount || !consumptionDesc) return;

    setIsSubmittingConsumption(true);
    try {
      const consumption = await consumptionApi.create({
        amount: parseFloat(consumptionAmount),
        description: consumptionDesc,
        groupId: groupId,
        date: new Date().toISOString(),
      });

      // Send message with consumption attachment
      await sendMessage(undefined, consumption.id, `💸 Added expense: ${consumptionDesc}`);

      setShowConsumptionForm(false);
      setConsumptionAmount('');
      setConsumptionDesc('');
    } catch (error) {
      console.error(error);
      alert('Failed to add consumption');
    } finally {
      setIsSubmittingConsumption(false);
    }
  };

  return (
    <div className="flex-none p-4 bg-neutral-800/50 backdrop-blur border-t border-neutral-700 z-10">
      {/* Action Buttons (Attachments) */}
      {showConsumptionForm ? (
        <div className="mb-4 bg-neutral-800 border border-neutral-600 rounded-xl p-4 animate-slideUp">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
              <DollarSign size={18} /> Add Fee
            </h3>
            <button onClick={() => setShowConsumptionForm(false)} className="text-neutral-400 hover:text-white">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleConsumptionSubmit} className="space-y-3">
            <input
              placeholder="Amount"
              type="number"
              step="0.01"
              className="w-full bg-neutral-900 border border-neutral-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={consumptionAmount}
              onChange={e => setConsumptionAmount(e.target.value)}
              autoFocus
            />
            <input
              placeholder="What for?"
              className="w-full bg-neutral-900 border border-neutral-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              value={consumptionDesc}
              onChange={e => setConsumptionDesc(e.target.value)}
            />
            <button
              disabled={isSubmittingConsumption}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmittingConsumption ? 'Adding...' : 'Add Fee to Chat'}
            </button>
          </form>
        </div>
      ) : null}

      <form onSubmit={(e) => sendMessage(e)} className="flex items-end gap-2">
        <div className="flex gap-1 mb-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-neutral-700 rounded-full transition-colors"
            title="Upload Image"
          >
            <ImageIcon size={20} />
          </button>
          <button
            type="button"
            onClick={() => setShowConsumptionForm(!showConsumptionForm)}
            className={`p-2 rounded-full transition-colors ${showConsumptionForm ? 'text-emerald-400 bg-neutral-700' : 'text-neutral-400 hover:text-emerald-400 hover:bg-neutral-700'}`}
            title="Add Expense"
          >
            <DollarSign size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        <div className="flex-1 bg-neutral-900 rounded-2xl border border-neutral-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
          <input
            className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none max-h-32"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 transition-all mb-0.5"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
