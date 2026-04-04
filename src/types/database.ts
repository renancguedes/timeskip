export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface Pillar {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
}

export interface PillarType {
  id: string;
  pillar_id: string;
  name: string;
  description?: string;
  is_default?: boolean;
  user_id?: string;
  pillar?: Pillar;
  themes?: Theme[];
  created_at: string;
}

// Keep old name as alias for compatibility
export type PillarSubtype = PillarType;

export interface Theme {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  is_default?: boolean;
  user_id?: string;
  created_at: string;
}

export interface Objective {
  id: string;
  user_id: string;
  pillar_id?: string;
  pillar_type_id?: string;
  theme_id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'active' | 'completed' | 'archived';
  steps?: ObjectiveStep[];
  pillar?: Pillar;
  pillar_type?: PillarType;
  theme?: Theme;
  user?: Profile;
  created_at: string;
  updated_at: string;
}

export interface ObjectiveStep {
  id: string;
  objective_id: string;
  title: string;
  completed: boolean;
  sort_order: number;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  start_date?: string;
  end_date?: string;
  invite_code: string;
  created_at: string;
  owner?: Profile;
  members?: GroupMember[];
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member' | 'editor' | 'viewer';
  personal_visibility?: string;
  joined_at: string;
  profile?: Profile;
}
