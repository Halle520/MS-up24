'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { groupsApi } from '../../lib/api/groups.api';
import { Group } from '../../lib/types/shared.types';

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    console.log('GroupsPage: Loading groups...');
    try {
      setLoading(true);
      const data = await groupsApi.getAll();
      console.log('GroupsPage: Groups loaded:', data);
      setGroups(data);
    } catch (err) {
      console.error('GroupsPage: Failed to load groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    try {
      await groupsApi.create(newGroupName);
      setNewGroupName('');
      loadGroups();
    } catch (err) {
      console.error(err);
      alert('Failed to create group');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Groups</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Group</h2>
        <form onSubmit={createGroup} className="flex gap-4">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="GroupName"
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Create
          </button>
        </form>
      </div>

      <div className="grid gap-4">
        {groups.map((group) => (
          <div
            key={group.id}
            onClick={() => router.push(`/groups/${group.id}`)}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer border border-transparent hover:border-blue-200"
          >
            <h3 className="text-xl font-semibold">{group.name}</h3>
            <p className="text-gray-500 text-sm mt-2">
              {group.members.length} members
            </p>
          </div>
        ))}
        {!loading && groups.length === 0 && (
          <p className="text-center text-gray-500">
            No groups yet. Create one!
          </p>
        )}
      </div>
    </div>
  );
}
