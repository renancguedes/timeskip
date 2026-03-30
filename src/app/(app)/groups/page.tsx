'use client';

import { useState } from 'react';
import { useGroups } from 'A/hooks/useAuth';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import ShareCard from 'A/components/share/ShareCard';
import EmptyState from '@/components/ui/EmptyState';

export default function GroupsPage() {
  const { groups, createGroup, joinGroup } = useGroups();
  const [showFromCodeModal, setShowFromCodeModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (groups.length === 0) {
    return (
      <EmptyState
        title="No groups yet"
        description="Create a new group or join an existing one"
      />
    );
  }

  return (
    <div className="space-y-6">
              