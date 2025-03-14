
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

// Utility functions for team members
export const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

export const getRoleLabel = (role: string): string => {
  const roleOption = RoleOptions.find(option => option.value.toLowerCase() === role.toLowerCase());
  return roleOption ? roleOption.label : role;
};

export const getRoleBadgeClass = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'bg-blue-100 text-blue-800';
    case 'staff':
      return 'bg-green-100 text-green-800';
    case 'finance':
      return 'bg-purple-100 text-purple-800';
    case 'photographer':
      return 'bg-amber-100 text-amber-800';
    case 'editor':
      return 'bg-cyan-100 text-cyan-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
