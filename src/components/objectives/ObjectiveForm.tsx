'use client';

import { useState, useEffect } from 'react';
import { Objective, Pillar, PillarType, Theme } from '@/types/database';
import { Button } from '@/components/ui/button';
import { usePillarsAndThemes } from '@/hooks/useObjectives';
import { Shield, TrendingUp, Plus, X, GripVertical } from 'lucide-react';

interface ObjectiveFormProps {
  initialData?: Partial<Objective>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function ObjectiveForm({ initialData, onSubmit, onCancel }: ObjectiveFormProps) {
  const { pillars, themes, subtypes, loading: loadingMeta } = usePillarsAndThemes();

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState(initialData?.status || 'active');
  const [selectedPillarId, setSelectedPillarId] = useState(initialData?.pillar_id || '');
  const [selectedTypeId, setSelectedTypeId] = useState(initialData?.pillar_type_id || '');
  const [selectedThemeId, setSelectedThemeId] = useState(initialData?.theme_id || '');
  const [steps, setSteps] = useState<{ title: string; id?: string }[]>(
    initialData?.steps?.map(s => ({ title: s.title, id: s.id })) || []
  );
  const [newStepTitle, setNewStepTitle] = useState('');

  // Derived: filter pillar types by selected pillar
  const filteredTypes = subtypes.filter(t => !selectedPillarId || t.pillar_id === selectedPillarId);

  // Derived: filter themes by selected pillar type's themes
  const selectedType = subtypes.find(t => t.id === selectedTypeId);
  const filteredThemes = selectedTypeId && selectedType?.themes?.length
    ? selectedType.themes
    : themes;

  // When pillar changes, reset type and theme
  useEffect(() => {
    if (!initialData) {
      setSelectedTypeId('');
      setSelectedThemeId('');
    }
  }, [selectedPillarId]);

  // When type changes, reset theme if not available
  useEffect(() => {
    if (selectedTypeId && selectedType?.themes?.length) {
      const themeAvailable = selectedType.themes.some(t => t.id === selectedThemeId);
      if (!themeAvailable && !initialData) {
        setSelectedThemeId('');
      }
    }
  }, [selectedTypeId]);

  const handleAddStep = () => {
    if (newStepTitle.trim()) {
      setSteps([...steps, { title: newStepTitle.trim() }]);
      setNewStepTitle('');
    }
  };

  const handleRemoveStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      status,
      pillar_id: selectedPillarId || null,
      pillar_type_id: selectedTypeId || null,
      theme_id: selectedThemeId || null,
      steps: steps,
    });
  };

  const pillarIcons: Record<string, any> = {};
  pillars.forEach(p => {
    if (p.name.toLowerCase().includes('estabilidade')) {
      pillarIcons[p.id] = { icon: Shield, color: 'text-indigo-400', bg: 'bg-indigo-500/15 border-indigo-500/25', activeBg: 'bg-indigo-500/25 border-indigo-400' };
    } else {
      pillarIcons[p.id] = { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/25', activeBg: 'bg-emerald-500/25 border-emerald-400' };
    }
  });

  if (loadingMeta) {
    return <div className="text-center py-8 text-gray-500">Carregando dados...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Pilar Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Pilar</label>
        <div className="flex gap-3">
          {pillars.map((pillar) => {
            const meta = pillarIcons[pillar.id] || { icon: Shield, color: 'text-gray-400', bg: 'bg-surface-lighter border-surface-lighter', activeBg: 'bg-violet-500/25 border-violet-400' };
            const Icon = meta.icon;
            const isSelected = selectedPillarId === pillar.id;
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setSelectedPillarId(isSelected ? '' : pillar.id)}
                className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border transition-all text-sm font-medium ${
                  isSelected ? meta.activeBg : `${meta.bg} hover:bg-surface-lighter`
                }`}
              >
                <Icon size={18} className={meta.color} />
                <span className={isSelected ? meta.color : 'text-gray-400'}>{pillar.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tipo do Pilar */}
      {filteredTypes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tipo do Pilar</label>
          <select
            value={selectedTypeId}
            onChange={(e) => setSelectedTypeId(e.target.value)}
            className="w-full bg-surface-lighter border border-surface-lighter rounded-lg px-3 py-2.5 text-gray-200 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
          >
            <option value="">Selecione o tipo...</option>
            {filteredTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Tema */}
      {filteredThemes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Tema</label>
          <div className="flex flex-wrap gap-2">
            {filteredThemes.map(theme => {
              const isSelected = selectedThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setSelectedThemeId(isSelected ? '' : theme.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    isSelected
                      ? 'badge-theme'
                      : 'bg-surface-lighter border-surface-lighter text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {theme.icon && <span className="mr-1">{theme.icon}</span>}
                  {theme.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-surface-lighter border border-surface-lighter rounded-lg px-3 py-2.5 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
          placeholder="O que você quer alcançar?"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-surface-lighter border border-surface-lighter rounded-lg px-3 py-2.5 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
          rows={3}
          placeholder="Descreva seu objetivo..."
        />
      </div>

      {/* Steps */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Etapas</label>
        {steps.length > 0 && (
          <ul className="space-y-2 mb-3">
            {steps.map((step, index) => (
              <li key={index} className="flex items-center gap-2 bg-surface-lighter rounded-lg px-3 py-2">
                <GripVertical size={14} className="text-gray-600 flex-shrink-0" />
                <span className="text-sm text-gray-300 flex-1">{step.title}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveStep(index)}
                  className="text-gray-500 hover:text-red-400 flex-shrink-0 transition-colors"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={newStepTitle}
            onChange={(e) => setNewStepTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddStep(); } }}
            className="flex-1 bg-surface-lighter border border-surface-lighter rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
            placeholder="Adicionar etapa..."
          />
          <Button type="button" variant="secondary" size="sm" onClick={handleAddStep}>
            <Plus size={14} />
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">{initialData?.id ? 'Atualizar' : 'Criar'}</Button>
      </div>
    </form>
  );
}
