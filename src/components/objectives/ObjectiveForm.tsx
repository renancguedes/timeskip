'use client';

import { useState } from 'react';
import { Objective } from '@/types/database';
import { Button } from '@/components/ui/button';

interface ObjectiveFormProps {
  initialData?: Partial<Objective>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function ObjectiveForm({ initialData, onSubmit, onCancel }: ObjectiveFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState(initialData?.status || 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="O que você quer alcançar?"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={3}
          placeholder="Descreva seu objetivo..."
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{initialData ? 'Atualizar' : 'Criar'}</Button>
      </div>
    </form>
  );
}
