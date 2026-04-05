'use client';

import { useState } from 'react';
import { useObjectives } from '@/hooks/useObjectives';
import ObjectiveCard from '@/components/objectives/ObjectiveCard';
import EmptyState from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import ObjectiveForm from '@/components/objectives/ObjectiveForm';
import { Plus, Target } from 'lucide-react';

const statusLabels: Record<string, string> = {
  active: 'Ativos',
  completed: 'Concluídos',
  archived: 'Arquivados',
};

export default function ObjectivesPage() {
  const { objectives, loading, createObjective, updateObjective, deleteObjective, toggleStep, addStep, deleteStep } = useObjectives();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('active');

  const filteredObjectives = objectives?.filter(o => o.status === filter) || [];

  const handleCreate = async (objectiveData: any) => {
    const { steps, ...objData } = objectiveData;
    if (editingId) {
      await updateObjective(editingId, objData);
      // Handle steps for existing objective
      if (steps) {
        const existingSteps = objectives.find(o => o.id === editingId)?.steps || [];
        const existingStepIds = existingSteps.map(s => s.id);
        const newStepIds = steps.filter((s: any) => s.id).map((s: any) => s.id);

        // Delete removed steps
        for (const es of existingSteps) {
          if (!newStepIds.includes(es.id)) {
            await deleteStep(es.id);
          }
        }
        // Add new steps
        for (const step of steps) {
          if (!step.id) {
            await addStep(editingId, { title: step.title });
          }
        }
      }
    } else {
      const result = await createObjective(objData);
      // Add steps to newly created objective
      if (result.data && steps?.length > 0) {
        for (const step of steps) {
          await addStep(result.data.id, { title: step.title });
        }
      }
    }
    setShowModal(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-display text-gray-100">Objetivos</h1>
        <button
          className="inline-flex items-center bg-violet-600 text-white rounded-lg px-4 py-2 hover:bg-violet-500 transition-all glow-purple font-medium text-sm"
          onClick={() => { setEditingId(null); setShowModal(true); }}
        >
          <Plus size={16} className="mr-2" />
          Novo Objetivo
        </button>
      </div>

      <div className="flex gap-2">
        {['active', 'completed', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === status
                ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                : 'bg-surface-lighter text-gray-500 hover:text-gray-300 border border-transparent'
            }`}
          >
            {statusLabels[status]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando objetivos...</div>
      ) : filteredObjectives.length === 0 ? (
        <EmptyState
          title="Nenhum objetivo ainda"
          description={`Você não tem nenhum objetivo ${statusLabels[filter].toLowerCase()}. Crie um para começar!`}
          icon={Target}
          actionButton={{ label: 'Criar Objetivo', onClick: () => { setEditingId(null); setShowModal(true); } }}
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
              onAddStep={addStep}
              onDeleteStep={deleteStep}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingId(null); }} title={editingId ? 'Editar Objetivo' : 'Novo Objetivo'} size="lg">
        <ObjectiveForm
          initialData={editingId ? objectives.find(o => o.id === editingId) : undefined}
          onSubmit={handleCreate}
          onCancel={() => { setShowModal(false); setEditingId(null); }}
        />
      </Modal>
    </div>
  );
}
