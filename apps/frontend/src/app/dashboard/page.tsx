'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consumptionApi } from '../../lib/api/consumption.api';
import { groupsApi } from '../../lib/api/groups.api';
import { Consumption, Group } from '../../lib/types/shared.types';
import { useState } from 'react';
import { Plus, DollarSign, Calendar, List, TrendingUp, Wallet, Users } from 'lucide-react';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');

  const { data: consumptions = [], isLoading } = useQuery({
    queryKey: ['consumptions'],
    queryFn: consumptionApi.getAll,
  });

  const { data: groups = [] } = useQuery({
    queryKey: ['groups'],
    queryFn: groupsApi.getAll,
  });

  const mutation = useMutation({
    mutationFn: consumptionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consumptions'] });
      setAmount('');
      setDescription('');
      setSelectedGroupId('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    mutation.mutate({
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString(),
      groupId: selectedGroupId || undefined,
    });
  };

  const totalSpent = consumptions.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Financial Dashboard
            </h1>
            <p className="text-neutral-400 mt-1">Track and share your fee consumption.</p>
          </div>
          <div className="bg-neutral-800 p-4 rounded-2xl border border-neutral-700 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Wallet size={24} />
            </div>
            <div>
              <div className="text-sm text-neutral-400">Total Spent</div>
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Add Consumption Form */}
        <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-xl">
          <div className="flex items-center gap-2 mb-6 text-xl font-semibold text-white">
            <Plus className="text-emerald-400" />
            Add New Consumption
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-3 text-neutral-500">
                  <DollarSign size={20} />
                </div>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              <div className="flex-[2]">
                <input
                  type="text"
                  placeholder="Description (e.g., 'Lunch with team')"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-3 text-neutral-500">
                  <Users size={20} />
                </div>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                >
                  <option value="">Personal (Private)</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
              >
                {mutation.isPending ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </form>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2 text-neutral-200">
            <List className="text-blue-400" />
            Recent Activity
          </h2>

          {isLoading ? (
            <div className="text-center py-12 text-neutral-500 animate-pulse">Loading data...</div>
          ) : consumptions.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 bg-neutral-800/50 rounded-2xl border border-neutral-800">
              No consumption records found. Start adding some!
            </div>
          ) : (
            <div className="bg-neutral-800/50 rounded-2xl overflow-hidden border border-neutral-800">
              {consumptions.map((item) => (
                <div key={item.id} className="p-4 border-b border-neutral-800 last:border-0 hover:bg-neutral-800 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-colors ${item.group ? 'bg-purple-500/20 text-purple-400' : 'bg-neutral-700 text-neutral-300'}`}>
                      {item.group ? <Users size={20} /> : <TrendingUp size={20} />}
                    </div>
                    <div>
                      <div className="font-medium text-white">{item.description}</div>
                      <div className="text-sm text-neutral-500 flex items-center gap-2">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(item.date).toLocaleDateString()}</span>
                        {item.group && (
                          <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-0.5 rounded-full">
                            {item.group.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-white">
                    ${Number(item.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
