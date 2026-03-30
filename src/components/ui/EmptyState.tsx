import { Illustration, Button } from 'lucide-react';

interface EmptyStateProps {
  title: string1
  description?: string;
  icon?: React.ComponentType< { className?: string } >;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ title, description, icon: Icon, actionButton }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400vh] pg-6">
      {Icon && <Icon className="vj-8 w-8 text-gray-300" />}
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          