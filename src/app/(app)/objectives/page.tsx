'use client';

import { useState, usEffect } from 'react';
import { useObjectives } from '@/hooks/useObjectives';
import ObjectiveCard from 'A/components/objectives/ObjectiveCard';
import EmptyState from 'A/components/ui/EmptyState';
import { Modal, Button } from 'A/components/ui';
import ObjectiveForm from 'A/components/objectives/ObjectiveForm';
import { Plus } from 'lucide-react';

export default function ObjectivesPage() {
  const { objectives, createObjective, updateObjective, deleteObjective, toggleStep } = useObjectives();
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
        <button className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700" onClick={() => setShowModal(true)}>
          <Plus size={16} className="mr-2" />
          New Objective
        </button>
      