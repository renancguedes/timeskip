'use client';

import { Group } from '@/types/database';
import { Users, Calendar, Crown } from 'lucide-react';
import Link from 'next/link';

interface ShareCardProps {
  group: Group;
}

export default function ShareCard({ group }: ShareCardProps) {
  const memberCount = group.members?.length || 0;

  return (
    <Link href={`/groups/${group.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
        {group.description && (
          <p className="text-sm text-gray-500 mb-3">{group.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Users size={14} />
            {memberCount} member{memberCount !== 1 ? 's' : ''}
          </span>
          {group.owner && (
            <span className="flex items-center gap-1">
              <Crown size={14} />
              {group.owner.name}
            </span>
          )}
          {group.deadline && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(group.deadline).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
