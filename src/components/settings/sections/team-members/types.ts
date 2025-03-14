
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
  { value: 'admin', label: 'Administrator' },
  { value: 'manager', label: 'Manager' },
  { value: 'editor', label: 'Editor' },
  { value: 'staff', label: 'Staff' },
  { value: 'user', label: 'User' }
];

export function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getRoleBadgeClass(role: string): string {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'manager':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'editor':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'staff':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getRoleLabel(role: string): string {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'Administrator';
    case 'manager':
      return 'Manager';
    case 'editor':
      return 'Editor';
    case 'staff':
      return 'Staff';
    default:
      return role || 'User';
  }
}
