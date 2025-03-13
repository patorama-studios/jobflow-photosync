
export interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  avatar_url?: string;
  username?: string;
  updated_at?: string;
}

export const RoleOptions = [
  { value: 'admin', label: 'Administrator' },
  { value: 'manager', label: 'Manager' },
  { value: 'staff', label: 'Staff Member' },
  { value: 'photographer', label: 'Photographer' },
  { value: 'editor', label: 'Editor' },
  { value: 'client', label: 'Client' },
  { value: 'agent', label: 'Real Estate Agent' }
];
