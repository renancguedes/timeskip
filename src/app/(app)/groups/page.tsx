'use client';

import { useState } from 'react';
import { useGroups } from '@/hooks/useObjectives';
import { Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import ShareCard from '@/components/share/ShareCard';
import EmptyState from '@/components/ui/EmptyState';

export default function GroupsPage() {
  const { groups, createGroup, joinGroup } = useGroups();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await createGroup({ name: newGroupName, description: newGroupDesc });
    if (result.error) {
      setError(result.error.message);
    } else {
      setShowCreateModal(false);
      setNewGroupName('');
      setNewGroupDesc('');
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await joinGroup(joinCode);
    if (result.error) {
      setError(result.error.message);
    } else {
      setShowJoinModal(false);
      setJoinCode('');
    }
  };

  const inputClasses = "w-full bg-surface-lighter border border-surface-lighter rounded-lg px-3 py-2.5 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all";

  const CreateGroupForm = () => (
    <form onSubmit={handleCreateGroup} className="space-y-4">
      {error && <div className="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">{error}</div>}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
        <input type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className={inputClasses} placeholder="Nome do grupo" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Descrição</label>
        <textarea value={newGroupDesc} onChange={(e) => setNewGroupDesc(e.target.value)} className={inputClasses} rows={3} placeholder="Descreva o objetivo do grupo..." />
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => { setShowCreateModal(false); setError(''); }}>Cancelar</Button>
        <Button type="submit">Criar</Button>
      </div>
    </form>
  );

  if (groups.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-display text-gray-100">Grupos</h1>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={16} className="mr-2" />
            Criar Grupo
          </Button>
          <Button variant="outline" onClick={() => setShowJoinModal(true)}>Entrar em Grupo</Button>
        </div>
        <EmptyState
          title="Nenhum grupo ainda"
          description="Crie um novo grupo ou entre em um existente para colaborar com outros."
          icon={Users}
        />
        <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); setError(''); }} title="Criar Grupo">
          <CreateGroupForm />
        </Modal>
        <Modal isOpen={showJoinModal} onClose={() => { setShowJoinModal(false); setError(''); }} title="Entrar em Grupo">
          <form onSubmit={handleJoinGroup} className="space-y-4">
            {error && <div className="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Código de Convite</label>
              <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} className={inputClasses} placeholder="Digite o código de convite" required />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => { setShowJoinModal(false); setError(''); }}>Cancelar</Button>
              <Button type="submit">Entrar</Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-display text-gray-100">Grupos</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowJoinModal(true)}>Entrar em Grupo</Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={16} className="mr-2" />
            Novo Grupo
          </Button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <ShareCard key={group.id} group={group} />
        ))}
      </div>

      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); setError(''); }} title="Criar Grupo">
        <CreateGroupForm />
      </Modal>

      <Modal isOpen={showJoinModal} onClose={() => { setShowJoinModal(false); setError(''); }} title="Entrar em Grupo">
        <form onSubmit={handleJoinGroup} className="space-y-4">
          {error && <div className="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Código de Convite</label>
            <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} className={inputClasses} placeholder="Digite o código de convite" required />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => { setShowJoinModal(false); setError(''); }}>Cancelar</Button>
            <Button type="submit">Entrar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
