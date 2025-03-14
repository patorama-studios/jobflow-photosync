
export interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  username?: string;
  avatar_url?: string;
}

export const RoleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
  { value: 'finance', label: 'Finance' },
  { value: 'photographer', label: 'Photographer' },
  { value: 'editor', label: 'Editor' }
];
