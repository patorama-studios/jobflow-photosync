
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

// Helper function to get user initials from full name
export function getInitials(name: string): string {
  if (!name) return '';
  
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Helper function to get role badge class based on role
export function getRoleBadgeClass(role: string): string {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'bg-red-100 text-red-800';
    case 'manager':
      return 'bg-blue-100 text-blue-800';
    case 'staff':
      return 'bg-green-100 text-green-800';
    case 'leader':
      return 'bg-purple-100 text-purple-800';
    case 'photographer':
      return 'bg-yellow-100 text-yellow-800';
    case 'editor':
      return 'bg-indigo-100 text-indigo-800';
    case 'client':
      return 'bg-gray-100 text-gray-800';
    case 'agent':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Helper function to get human-readable role label
export function getRoleLabel(role: string): string {
  const option = RoleOptions.find(opt => opt.value === role);
  return option ? option.label : role;
}
