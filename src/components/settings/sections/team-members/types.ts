
export interface TeamMember {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  role: string;
  avatar_url?: string;
  username?: string;
  updated_at?: string;
}

export const RoleOptions = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Manager" },
  { value: "photographer", label: "Photographer" },
  { value: "editor", label: "Editor" },
  { value: "staff", label: "Staff" }
];

export const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800';
    case 'manager':
      return 'bg-blue-100 text-blue-800';
    case 'photographer':
      return 'bg-green-100 text-green-800';
    case 'editor':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getRoleLabel = (value: string) => {
  const role = RoleOptions.find(r => r.value === value);
  return role ? role.label : value.charAt(0).toUpperCase() + value.slice(1);
};

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};
