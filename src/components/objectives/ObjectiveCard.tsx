'use client';

import { Objective, ObjectiveStep } from '@/types/database';
import { CheckCircle2, Circle, Trash2, Edit, ChevronDown, ChevronUp, Plus, X, Shield, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface ObjectiveCardProps {
  objective: Objective;
  onToggleStep?: (stepId: string, completed: boolean) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onAddStep?: (objectiveId: string, step: { title: string }) => void;
  onDeleteStep?: (stepId: string) => void;
}

export default function ObjectiveCard({ objective, onToggleStep, onEdit, onDelete, onAddStep, onDeleteStep }: ObjectiveCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [newStep, setNewStep] = useState('');
  const completedSteps = objective.steps?.filter(s => s.completed).length || 0;
  const totalSteps = objective.steps?.length || 0;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const isEstabilidade = objective.pillar_type?.pillar?.name?.toLowerCase().includes('estabilidade');
  const pillarColor = isEstabilidade ? 'indigo' : 'emerald';

  const handleAddStep = () => {
    if (newStep.trim() && onAddStep) {
      onAddStep(objective.id, { title: newStep.trim() });
      setNewStep('');
    }
  };

  return (
    <div className="bg-surface-card rounded-xl border border-surface-lighter p-5 card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Hierarchy badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {objective.pillar_type?.pillar && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full font-medium ${
                isEstabilidade ? 'badge-stability' : 'badge-growth'
              }`}>
                {isEstabilidade ? <Shield size={12} /> : <TrendingUp size={12} />}
                {objective.pillar_type.pillar.name}
              </span>
            )}
            {objective.pillar_type && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full font-medium badge-type">
                {objective.pillar_type.name}
              </span>
            )}
            {objective.theme && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full font-medium badge-theme">
                {objective.theme.icon && <span className="mr-1">{objective.theme.icon}</span>}
                {objective.theme.name}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-lg text-gray-100">{objective.title}</h3>
          {objective.description && (
            <p className="text-gray-500 text-sm mt-1">{objective.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-4">
          {onEdit && (
            <button onClick={() => onEdit(objective.id)} className="p-1.5 text-gray-500 hover:text-violet-400 rounded transition-colors">
              <Edit size={16} />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(objective.id)} className="p-1.5 text-gray-500 hover:text-red-400 rounded transition-colors">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">
            {totalSteps > 0 ? `${completedSteps}/${totalSteps} etapas` : 'Nenhuma etapa'}
          </span>
          {totalSteps > 0 && (
            <button onClick={() => setExpanded(!expanded)} className="text-gray-500 hover:text-gray-300 transition-colors">
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
          {totalSteps === 0 && onAddStep && (
            <button onClick={() => setExpanded(!expanded)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              + Adicionar etapas
            </button>
          )}
        </div>
        {totalSteps > 0 && (
          <div className="w-full bg-surface-lighter rounded-full h-1.5">
            <div className="progress-bar h-1.5 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* Expanded steps */}
        {expanded && (
          <div className="mt-3 space-y-2">
            {objective.steps?.map(step => (
              <div key={step.id} className="flex items-center gap-2 group">
                <button
                  onClick={() => onToggleStep?.(step.id, !step.completed)}
                  className="flex-shrink-0"
                >
                  {step.completed ? (
                    <CheckCircle2 size={18} className="text-violet-500" />
                  ) : (
                    <Circle size={18} className="text-gray-600 hover:text-gray-400 transition-colors" />
                  )}
                </button>
                <span className={`text-sm flex-1 ${step.completed ? 'line-through text-gray-600' : 'text-gray-300'}`}>
                  {step.title}
                </span>
                {onDeleteStep && (
                  <button
                    onClick={() => onDeleteStep(step.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}

            {/* Add step inline */}
            {onAddStep && (
              <div className="flex gap-2 mt-2 pt-2 border-t border-surface-lighter">
                <input
                  type="text"
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddStep(); } }}
                  className="flex-1 bg-surface-lighter border border-surface-lighter rounded px-2.5 py-1.5 text-sm text-gray-300 placeholder-gray-600 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                  placeholder="Nova etapa..."
                />
                <button
                  onClick={handleAddStep}
                  className="text-violet-400 hover:text-violet-300 px-2 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
