'use client';

import { useState } from 'react';
import { useGroups } from '@/hooks/useObjectives';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import ShareCard from '@/components/share/ShareCard';
import EmptyState from '@/components/ui/EmptyState';

export default function GroupsPage() {
  const { groups, createGroup, joinGroup } = useGroups();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    await createGroup({ name: newGroupName, description: newGroupDesc });
    setShowCreateModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    await joinGroup(joinCode);
    setShowJoinModal(false);
    setJoinCode('');
  };

  if (groups.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Groups</h1>
        <EmptyState
          title="No groups yet"
          description="Create a new group or join an existing one to collaborate with others."
          icon={Users}
          actionButton={{ label: 'Create Group', onClick: () => setShowCreateModal(true) }}
        />
        <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Group">
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={newGroupDesc} onChange={(e) => setNewGroupDesc(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={3} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Groups</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowJoinModal(true)}>Join Group</Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={16} className="mr-2" />
            New Group
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <ShareCard key={group.id} group={group} />
        ))}
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create Group">
        <form onSubmit={handleCreateGroup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={newGroupDesc} onChange={(e) => setNewGroupDesc(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={3} />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title="Join Group">
        <form onSubmit={handleJoinGroup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Invite Code</label>
            <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Enter invite code" required />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setShowJoinModal(false)}>Cancel</Button>
            <Button type="submit">Join</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
