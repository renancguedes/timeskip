'use client';

import { Objective } from '@/types/database';
import { CheckCircle2, Circle, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ObjectiveCardProps {
  objective: Objective;
  onToggleStep?: (stepId: string, isCompleted: boolean) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ObjectiveCard({ objective, onToggleStep, onEdit, onDelete }: ObjectiveCardProps) {
  const [expanded, setExpanded] = useState(false);
  const completedSteps = objective.steps?.filter(s => s.is_completed).length || 0;
  const totalSteps = objective.steps?.length || 0;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {objective.theme && (
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: objective.theme.color }}
              />
            )}
            <h3 className="font-semibold text-lg text-gray-900">{objective.title}</h3>
          </div>
          {objective.description && (
            <p className="text-gray-500 text-sm mt-1">{objective.description}</p>
          )}
          {objective.pillar && (
            <span className="inline-block mt-2 px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full">
              {objective.pillar.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 ml-4">
          {onEdit && (
            <button onClick={() => onEdit(objective.id)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded">
              <Edit size={16} />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(objective.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {totalSteps > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">{completedSteps}/{totalSteps} etapas</span>
            <button onClick={() => setExpanded(!expanded)} className="text-gray-400 hover:text-gray-600">
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-purple-600 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          {expanded && (
            <ul className="mt-3 space-y-2">
              {objective.steps?.map(step => (
                <li key={step.id} className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleStep?.(step.id, !step.is_completed)}
                    className="flex-shrink-0"
                  >
                    {step.is_completed ? (
                      <CheckCircle2 size={18} className="text-purple-600" />
                    ) : (
                      <Circle size={18} className="text-gray-300" />
                    )}
                  </button>
                  <span className={`text-sm ${step.is_completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {step.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
