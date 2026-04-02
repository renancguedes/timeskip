'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Objective, ObjectiveStep, Pillar, Theme, PillarSubtype } from '@/types/database';

export function useObjectives(groupId?: string) {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchObjectives = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('objectives')
      .select(`
        *,
        steps:objective_steps(*),
        subtype:pillar_subtypes(*, pillar:pillars(*)),
        theme:themes(*),
        user:profiles(*)
      `)
      .order('created_at', { ascending: false });

    if (groupId) {
      query = query.eq('group_id', groupId);
    } else {
      query = query.is('group_id', null);
    }

    const { data, error } = await query;
    if (!error && data) {
      setObjectives(data as unknown as Objective[]);
    }
    setLoading(false);
  }, [supabase, groupId]);

  useEffect(() => {
    fetchObjectives();
  }, [fetchObjectives]);

  const createObjective = async (objective: Partial<Objective>) => {
    const { data, error } = await supabase
      .from('objectives')
      .insert(objective)
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
    return updateStep(stepId, { is_completed: isCompleted });
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
  const [subtypes, setSubtypes] = useState<PillarSubtype[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const [pillarsRes, themesRes, subtypesRes] = await Promise.all([
        supabase.from('pillars').select('*'),
        supabase.from('themes').select('*'),
        supabase.from('pillar_subtypes').select(`
          *,
          pillar:pillars(*),
          themes:subtype_themes(theme:themes(*))
        `),
      ]);

      if (pillarsRes.data) setPillars(pillarsRes.data);
      if (themesRes.data) setThemes(themesRes.data);
      if (subtypesRes.data) {
        const parsed = subtypesRes.data.map((s: any) => ({
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
  const supabase = createClient();

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    const { data: memberships } = await supabase
      .from('group_members')
      .select('group_id');

    if (memberships) {
      const groupIds = memberships.map(m => m.group_id);
      if (groupIds.length > 0) {
        const { data } = await supabase
          .from('groups')
          .select(`
            *,
            owner:profiles!groups_owner_id_fkey(*),
            members:group_members(*, profile:profiles(*))
          `)
          .in('id', groupIds);
        setGroups(data || []);
      }
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const createGroup = async (group: { name: string; description?: string; deadline?: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Not authenticated') };

    const { data, error } = await supabase
      .from('groups')
      .insert({ ...group, owner_id: user.id })
      .select()
      .single();

    if (data && !error) {
      await supabase.from('group_members').insert({
        group_id: data.id,
        user_id: user.id,
        role: 'owner',
      });
      await fetchGroups();
    }

    return { data, error };
  };

  const joinGroup = async (inviteCode: string) => {
    const { data, error } = await supabase.rpc('join_group_by_code', { code: inviteCode });
    if (!error) {
      await fetchGroups();
    }
    return { data, error };
  };

  return { groups, loading, refresh: fetchGroups, createGroup, joinGroup };
}
