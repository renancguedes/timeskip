'use client';

import { Package } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ title, description, icon: Icon = Package, actionButton }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
      <Icon className="h-12 w-12 text-gray-600 mb-4" />
      <h3 className="text-xl font-semibold text-gray-200 mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-center max-w-sm mb-6">{description}</p>}
      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-500 transition-all glow-purple"
        >
          {actionButton.label}
        </button>
      )}
    </div>
  );
}
