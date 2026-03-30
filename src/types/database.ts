export interface Profile {
  id: string;
  email: string;
  name: string;
  profession?: string;
  bio?: string;
  avatar_url?: string;
  updated_at: string;
  created_at: string;
}

export interface Pillar {
  id: string;
  creator_id: string;
  name: string;
  scripture?: string;
  created_at: string;
}

export interface PillarSubtype {
  id: string;
  pillar_id: string;
  name: string;
  themes: Theme[];
}

export interface Theme {
  id: string;
  name: string;
  color: string;
}

export interface Objective {
  id: string;
  creator_id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  deadline?: Date;
  group_id?: string;
  pillar?: Pillar;
  steps?: ObjectiveStep[];
  theme?: Theme;
  user?: Profile;
  created_at: Date;
  updated_at: Date;
}

export interface ObjectiveStep {
  id: string;
  objective_id: string;
  title: string;
  is_completed: boolean;
  created_at: Date;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  deadline?: Date;
  created_at: Date;
  updated_at: Date;
  owner?: Profile;
  members?: GroupMember[];
}

export interface GroupMember {
  id: string;Š  group_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  joined_at: Date;
  profile?: Profile;
}
