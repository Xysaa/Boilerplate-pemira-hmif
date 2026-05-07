export type Role = 'admin' | 'petugas' | 'voter';
export type SessionStatus = 'draft' | 'active' | 'closed';
export type ParticipationStatus = 'registered' | 'present' | 'voted';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  is_active: boolean;
  created_at?: string;
}

export interface ElectionSession {
  id: number;
  name: string;
  description?: string;
  status: SessionStatus;
  started_at?: string;
  ended_at?: string;
  created_by?: number;
  total_voters?: number;
  total_present?: number;
  total_voted?: number;
}

export interface Candidate {
  id: number;
  election_session_id: number;
  number: number;
  name: string;
  vice_name?: string;
  photo?: string;
  vice_photo?: string;
  vision?: string;
  mission?: string;
  is_active: boolean;
  votes?: number;
  percentage?: number;
}

export interface Participation {
  status: ParticipationStatus;
  present_at?: string;
  voted_at?: string;
}

export interface PageProps {
  auth: { user: User };
  flash?: { success?: string; error?: string; info?: string };
}
