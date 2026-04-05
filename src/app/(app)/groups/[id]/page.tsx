'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePillarsAndThemes } from '@/hooks/useObjectives';
import { Group, GroupMember, Objective, ObjectiveStep } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import ObjectiveForm from '@/components/objectives/ObjectiveForm';
import ObjectiveCard from '@/components/objectives/ObjectiveCard';
import EmptyState from '@/components/ui/EmptyState';
import {
  ArrowLeft, Copy, Check, Users, Crown, Calendar, Target,
  Eye, EyeOff, Shield, Share2, Plus, Settings, Zap
} from 'lucide-react';
import Link from 'next/link';

type VisibilityOption = 'all' | 'objectives_only' | 'none';

export default function GroupDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const groupId = params?.id as string;

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [sharedObjectives, setSharedObjectives] = useState<Objective[]>([]);
  const [personalObjectives, setPersonalObjectives] = useState<Record<string, Objective[]>>({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [objectiveType, setObjectiveType] = useState<'shared' | 'personal'>('shared');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [myVisibility, setMyVisibility] = useState<VisibilityOption>('all');

  const currentMember = members.find(m => m.user_id === user?.id);
  const isOwner = currentMember?.role === 'owner';

  const fetchGroupDetail = useCallback(async () => {
    if (!groupId || !user) return;
    setLoading(true);

    // Fetch group with members
    const { data: groupData } = await supabase
      .from('groups')
      .select(`
        *,
        owner:profiles!created_by(*),
        members:group_members(*, profile:profiles(*))
      `)
      .eq('id', groupId)
      .single();

    if (groupData) {
      setGroup(groupData as unknown as Group);
      setMembers((groupData as any).members || []);
      const me = (groupData as any).members?.find((m: any) => m.user_id === user.id);
      if (me) setMyVisibility(me.personal_visibility || 'all');
    }

    // Fetch shared objectives (group_id set)
    const { data: sharedData } = await supabase
      .from('objectives')
      .select(`
        *,
        steps:objective_steps(*),
        pillar_type:pillar_types(*, pillar:pillars(*)),
        theme:themes(*),
        user:profiles!user_id(*)
      `)
      .eq('group_id', groupId)
      .is('is_personal', false)
      .order('created_at', { ascending: false });

    if (sharedData) {
      setSharedObjectives(sharedData as unknown as Objective[]);
    }

    // Fetch personal objectives for all members (respecting visibility)
    const memberIds = (groupData as any)?.members?.map((m: any) => m.user_id) || [];
    if (memberIds.length > 0) {
      const { data: personalData } = await supabase
        .from('objectives')
        .select(`
          *,
          steps:objective_steps(*),
          pillar_type:pillar_types(*, pillar:pillars(*)),
          theme:themes(*),
          user:profiles!user_id(*)
        `)
        .eq('group_id', groupId)
        .is('is_personal', true)
        .in('user_id', memberIds)
        .order('created_at', { ascending: false });

      if (personalData) {
        const grouped: Record<string, Objective[]> = {};
        (personalData as unknown as Objective[]).forEach(obj => {
          if (!grouped[obj.user_id]) grouped[obj.user_id] = [];
          grouped[obj.user_id].push(obj);
        });
        setPersonalObjectives(grouped);
      }
    }

    setLoading(false);
  }, [groupId, user, supabase]);

  useEffect(() => {
    fetchGroupDetail();
  }, [fetchGroupDetail]);

  const copyInviteCode = async () => {
    if (group?.invite_code) {
      await navigator.clipboard.writeText(group.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyInviteLink = async () => {
    if (group?.invite_code) {
      const link = `${window.location.origin}/join/${group.invite_code}`;
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreateObjective = async (data: any) => {
    const { steps, ...objData } = data;
    const { data: newObj, error } = await supabase
      .from('objectives')
      .insert({
        ...objData,
        user_id: user!.id,
        group_id: groupId,
        is_personal: objectiveType === 'personal',
      })
      .select()
      .single();

    if (!error && newObj && steps?.length > 0) {
      for (const step of steps) {
        await supabase
          .from('objective_steps')
          .insert({ title: step.title, objective_id: newObj.id });
      }
    }
    setShowObjectiveModal(false);
    fetchGroupDetail();
  };

  const handleToggleStep = async (stepId: string, completed: boolean) => {
    await supabase
      .from('objective_steps')
      .update({ completed })
      .eq('id', stepId);
    fetchGroupDetail();
  };

  const handleAddStep = async (objectiveId: string, step: { title: string }) => {
    await supabase
      .from('objective_steps')
      .insert({ title: step.title, objective_id: objectiveId });
    fetchGroupDetail();
  };

  const handleDeleteStep = async (stepId: string) => {
    await supabase
      .from('objective_steps')
      .delete()
      .eq('id', stepId);
    fetchGroupDetail();
  };

  const handleDeleteObjective = async (id: string) => {
    await supabase.from('objectives').delete().eq('id', id);
    fetchGroupDetail();
  };

  const handleUpdateVisibility = async (visibility: VisibilityOption) => {
    if (!currentMember) return;
    await supabase
      .from('group_members')
      .update({ personal_visibility: visibility })
      .eq('id', currentMember.id);
    setMyVisibility(visibility);
  };

  const handleShareWhatsApp = () => {
    if (!group) return;
    let text = `*${group.name}* - TimeSkip\n\n`;

    if (sharedObjectives.length > 0) {
      text += `*Objetivos Compartilhados:*\n`;
      sharedObjectives.forEach(obj => {
        const completedSteps = obj.steps?.filter(s => s.completed).length || 0;
        const totalSteps = obj.steps?.length || 0;
        const check = obj.status === 'completed' ? '✅' : '🎯';
        text += `${check} ${obj.title}`;
        if (totalSteps > 0) text += ` (${completedSteps}/${totalSteps})`;
        text += `\n`;
      });
    }

    text += `\n📎 Entre no grupo: ${window.location.origin}/join/${group.invite_code}`;

    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Determine which personal objectives to show based on visibility
  const getVisiblePersonalObjectives = (memberId: string): Objective[] | null => {
    const member = members.find(m => m.user_id === memberId);
    if (!member) return null;

    // Own objectives are always visible
    if (memberId === user?.id) return personalObjectives[memberId] || [];

    const vis = (member.personal_visibility || 'all') as VisibilityOption;
    if (vis === 'none') return null;
    if (vis === 'objectives_only') {
      // Show only objective titles, no steps
      return (personalObjectives[memberId] || []).map(obj => ({
        ...obj,
        steps: undefined as any,
      }));
    }
    return personalObjectives[memberId] || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <Zap size={32} className="text-violet-500 animate-pulse" />
          <span className="text-gray-500">Carregando grupo...</span>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="space-y-4">
        <Link href="/groups" className="text-violet-400 hover:text-violet-300 inline-flex items-center gap-1">
          <ArrowLeft size={16} /> Voltar
        </Link>
        <EmptyState title="Grupo não encontrado" description="Este grupo não existe ou você não tem acesso." icon={Users} />
      </div>
    );
  }

  const visibilityOptions: { value: VisibilityOption; label: string; desc: string; icon: any }[] = [
    { value: 'all', label: 'Tudo visível', desc: 'Todos veem seus objetivos e etapas', icon: Eye },
    { value: 'objectives_only', label: 'Apenas objetivos', desc: 'Apenas títulos dos objetivos visíveis', icon: Target },
    { value: 'none', label: 'Nada visível', desc: 'Seus objetivos pessoais ficam ocultos', icon: EyeOff },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/groups" className="text-gray-500 hover:text-gray-300 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-display text-gray-100">{group.name}</h1>
          {group.description && <p className="text-gray-500 mt-1">{group.description}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleShareWhatsApp}>
            <Share2 size={14} className="mr-1" /> WhatsApp
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowSettingsModal(true)}>
            <Settings size={14} />
          </Button>
        </div>
      </div>

      {/* Invite Code Card */}
      <div className="bg-surface-card rounded-xl border border-surface-lighter p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Código de Convite</span>
            <div className="flex items-center gap-3 mt-1">
              <span className="font-mono text-lg text-violet-400 font-bold tracking-widest">{group.invite_code}</span>
              <button
                onClick={copyInviteCode}
                className="text-gray-500 hover:text-violet-400 transition-colors"
                title="Copiar código"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={copyInviteLink}>
            Copiar Link
          </Button>
        </div>
      </div>

      {/* Members */}
      <div className="bg-surface-card rounded-xl border border-surface-lighter p-4">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
          Membros ({members.length})
        </h2>
        <div className="flex flex-wrap gap-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-2 bg-surface-lighter rounded-lg px-3 py-2"
            >
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-sm font-bold">
                {(member.profile?.username || '?')[0].toUpperCase()}
              </div>
              <div>
                <span className="text-sm text-gray-300">{member.profile?.username || 'Usuário'}</span>
                {member.role === 'owner' && (
                  <Crown size={12} className="text-amber-400 inline ml-1" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Objectives */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-200">Objetivos Compartilhados</h2>
          <Button size="sm" onClick={() => { setObjectiveType('shared'); setShowObjectiveModal(true); }}>
            <Plus size={14} className="mr-1" /> Adicionar
          </Button>
        </div>
        {sharedObjectives.length === 0 ? (
          <div className="bg-surface-card rounded-xl border border-surface-lighter p-6 text-center text-gray-500">
            Nenhum objetivo compartilhado ainda. Crie o primeiro!
          </div>
        ) : (
          <div className="grid gap-3">
            {sharedObjectives.map(obj => (
              <div key={obj.id} className="relative">
                {obj.user && (
                  <span className="absolute top-2 right-12 text-xs text-gray-600">
                    por {(obj.user as any).username}
                  </span>
                )}
                <ObjectiveCard
                  objective={obj}
                  onToggleStep={handleToggleStep}
                  onAddStep={handleAddStep}
                  onDeleteStep={handleDeleteStep}
                  onDelete={obj.user_id === user?.id ? handleDeleteObjective : undefined}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Personal Objectives per Member */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-200">Objetivos Pessoais</h2>
          <Button size="sm" variant="secondary" onClick={() => { setObjectiveType('personal'); setShowObjectiveModal(true); }}>
            <Plus size={14} className="mr-1" /> Meu Objetivo
          </Button>
        </div>
        <div className="space-y-6">
          {members.map(member => {
            const objectives = getVisiblePersonalObjectives(member.user_id);
            const isMe = member.user_id === user?.id;

            if (objectives === null && !isMe) {
              return (
                <div key={member.user_id} className="bg-surface-card rounded-xl border border-surface-lighter p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-surface-lighter flex items-center justify-center text-gray-500 text-xs font-bold">
                      {(member.profile?.username || '?')[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-400">{member.profile?.username}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <EyeOff size={14} />
                    <span>Objetivos pessoais ocultos</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={member.user_id}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold">
                    {(member.profile?.username || '?')[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    {isMe ? 'Meus Objetivos Pessoais' : member.profile?.username}
                  </span>
                  {isMe && (
                    <span className="text-xs text-gray-600 ml-2">
                      ({visibilityOptions.find(v => v.value === myVisibility)?.label})
                    </span>
                  )}
                </div>
                {objectives && objectives.length > 0 ? (
                  <div className="grid gap-3 pl-8">
                    {objectives.map(obj => (
                      <ObjectiveCard
                        key={obj.id}
                        objective={obj}
                        onToggleStep={isMe ? handleToggleStep : undefined}
                        onAddStep={isMe ? handleAddStep : undefined}
                        onDeleteStep={isMe ? handleDeleteStep : undefined}
                        onDelete={isMe ? handleDeleteObjective : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="pl-8 text-sm text-gray-600">
                    {isMe ? 'Você ainda não adicionou objetivos pessoais neste grupo.' : 'Nenhum objetivo pessoal.'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Objective Modal */}
      <Modal
        isOpen={showObjectiveModal}
        onClose={() => setShowObjectiveModal(false)}
        title={objectiveType === 'shared' ? 'Novo Objetivo Compartilhado' : 'Novo Objetivo Pessoal'}
        size="lg"
      >
        <ObjectiveForm
          onSubmit={handleCreateObjective}
          onCancel={() => setShowObjectiveModal(false)}
        />
      </Modal>

      {/* Settings Modal */}
      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Configurações do Grupo">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Visibilidade dos seus objetivos pessoais</h3>
            <div className="space-y-2">
              {visibilityOptions.map(opt => {
                const Icon = opt.icon;
                const isSelected = myVisibility === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleUpdateVisibility(opt.value)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-left ${
                      isSelected
                        ? 'bg-violet-500/15 border-violet-500/30 text-violet-400'
                        : 'bg-surface-lighter border-surface-lighter text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    <div>
                      <div className="text-sm font-medium">{opt.label}</div>
                      <div className="text-xs text-gray-500">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {group.end_date && (
            <div className="pt-4 border-t border-surface-lighter">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar size={14} />
                <span>Data limite: {new Date(group.end_date).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
