
export interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  username?: string;
  avatar_url?: string;
  updated_at?: string;
}

export const RoleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'photographer', label: 'Photographer' },
  { value: 'editor', label: 'Editor' },
  { value: 'finance', label: 'Finance' },
  { value: 'user', label: 'Regular User' }
];

export const getRoleLabel = (role: string): string => {
  const option = RoleOptions.find(opt => opt.value === role);
  return option ? option.label : role.charAt(0).toUpperCase() + role.slice(1);
};

export const getRoleBadgeClass = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'bg-red-100 text-red-800';
    case 'photographer':
      return 'bg-blue-100 text-blue-800';
    case 'editor':
      return 'bg-purple-100 text-purple-800';
    case 'finance':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};
