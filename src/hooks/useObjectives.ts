'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Objective, ObjectiveStep, Pillar, Theme, PillarType } from '@/types/database';

export function useObjectives() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const fetchObjectives = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('objectives')
      .select(`
        *,
        steps:objective_steps(*),
        pillar_type:pillar_types(*, pillar:pillars(*)),
        theme:themes(*)
      `)
      .eq('user_id', user.id)
      .is('group_id', null)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setObjectives(data as unknown as Objective[]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchObjectives();
  }, [fetchObjectives]);

  const createObjective = async (objective: Partial<Objective>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('objectives')
      .insert({ ...objective, user_id: user.id })
      .select()
      .single();
    if (!error) {
      await fetchObjectives();
    }
    return { data, error };
  };

  const updateObjective = async (id: string, updates: Partial<Objective>) => {
    const { data, error } = await supabase
      .from('objectives')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (!error) {
      await fetchObjectives();
    }
    return { data, error };
  };

  const deleteObjective = async (id: string) => {
    const { error } = await supabase
      .from('objectives')
      .delete()
      .eq('id', id);
    if (!error) {
      await fetchObjectives();
    }
    return { error };
  };

  const addStep = async (objectiveId: string, step: Partial<ObjectiveStep>) => {
    const { data, error } = await supabase
      .from('objective_steps')
      .insert({ ...step, objective_id: objectiveId })
      .select()
      .single();
    if (!error) {
      await fetchObjectives();
    }
    return { data, error };
  };

  const updateStep = async (stepId: string, updates: Partial<ObjectiveStep>) => {
    const { data, error } = await supabase
      .from('objective_steps')
      .update(updates)
      .eq('id', stepId)
      .select()
      .single();
    if (!error) {
      await fetchObjectives();
    }
    return { data, error };
  };

  const deleteStep = async (stepId: string) => {
    const { error } = await supabase
      .from('objective_steps')
      .delete()
      .eq('id', stepId);
    if (!error) {
      await fetchObjectives();
    }
    return { error };
  };

  const toggleStep = async (stepId: string, isCompleted: boolean) => {
    return updateStep(stepId, { completed: isCompleted } as any);
  };

  return {
    objectives,
    loading,
    refresh: fetchObjectives,
    createObjective,
    updateObjective,
    deleteObjective,
    addStep,
    updateStep,
    deleteStep,
    toggleStep,
  };
}

export function usePillarsAndThemes() {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [subtypes, setSubtypes] = useState<PillarType[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetch = async () => {
      const [pillarsRes, themesRes, typesRes] = await Promise.all([
        supabase.from('pillars').select('*'),
        supabase.from('themes').select('*'),
        supabase.from('pillar_types').select(`
          *,
          pillar:pillars(*),
          themes:pillar_type_themes(theme:themes(*))
        `),
      ]);

      if (pillarsRes.data) setPillars(pillarsRes.data);
      if (themesRes.data) setThemes(themesRes.data);
      if (typesRes.data) {
        const parsed = typesRes.data.map((s: any) => ({
          ...s,
          themes: s.themes?.map((t: any) => t.theme).filter(Boolean) || [],
        }));
        setSubtypes(parsed);
      }
      setLoading(false);
    };
    fetch();
  }, [supabase]);

  return { pillars, themes, subtypes, loading };
}

export function useGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data: memberships } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', user.id);

    if (memberships && memberships.length > 0) {
      const groupIds = memberships.map(m => m.group_id);
      const { data } = await supabase
        .from('groups')
        .select(`
          *,
          owner:profiles!created_by(*),
          members:group_members(*, profile:profiles(*))
        `)
        .in('id', groupIds);
      setGroups(data || []);
    } else {
      setGroups([]);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createGroup = async (group: { name: string; description?: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .rpc('create_group_with_owner', {
        p_name: group.name,
        p_description: group.description || null,
      });

    if (!error) {
      await fetchGroups();
    }

    return { data, error };
  };

  const joinGroup = async (inviteCode: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };

    // Find the group by invite code
    const { data: group, error: findError } = await supabase
      .from('groups')
      .select('id')
      .eq('invite_code', inviteCode)
      .single();

    if (findError || !group) {
      return { data: null, error: findError || new Error('Grupo não encontrado') };
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return { data: null, error: new Error('Você já faz parte deste grupo') };
    }

    // Join the group
    const { data, error } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.id,
        role: 'member',
      })
      .select()
      .single();

    if (!error) {
      await fetchGroups();
    }

    return { data, error };
  };

  return { groups, loading, refresh: fetchGroups, createGroup, joinGroup };
}
