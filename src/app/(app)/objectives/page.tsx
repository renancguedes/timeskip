'use client';

import { useState } from 'react';
import { useObjectives } from '@/hooks/useObjectives';
import ObjectiveCard from '@/components/objectives/ObjectiveCard';
import EmptyState from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import ObjectiveForm from '@/components/objectives/ObjectiveForm';
import { Plus, Target } from 'lucide-react';

export default function ObjectivesPage() {
  const { objectives, loading, createObjective, updateObjective, deleteObjective, toggleStep } = useObjectives();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('active');

  const filteredObjectives = objectives?.filter(o => o.status === filter) || [];

  const handleCreate = async (objectiveData: any) => {
    if (editingId) {
      await updateObjective(editingId, objectiveData);
    } else {
      await createObjective(objectiveData);
    }
    setShowModal(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Objectives</h1>
        <button
          className="inline-flex items-center bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition-colors"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} className="mr-2" />
          New Objective
        </button>
      </div>

      <div className="flex gap-2">
        {['active', 'completed', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading objectives...</div>
      ) : filteredObjectives.length === 0 ? (
        <EmptyState
          title="No objectives yet"
          description={`You don't have any ${filter} objectives. Create one to get started!`}
          icon={Target}
          actionButton={{ label: 'Create Objective', onClick: () => setShowModal(true) }}
        />
      ) : (
        <div className="grid gap-4">
          {filteredObjectives.map((objective) => (
            <ObjectiveCard
              key={objective.id}
              objective={objective}
              onToggleStep={toggleStep}
              onEdit={(id) => {
                setEditingId(id);
                setShowModal(true);
              }}
              onDelete={deleteObjective}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingId(null); }} title={editingId ? 'Edit Objective' : 'New Objective'}>
        <ObjectiveForm
          initialData={editingId ? objectives.find(o => o.id === editingId) : undefined}
          onSubmit={handleCreate}
          onCancel={() => { setShowModal(false); setEditingId(null); }}
        />
      </Modal>
    </div>
  );
}
