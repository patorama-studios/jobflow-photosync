
/**
 * Returns the initials from a person's name
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Maps a company response from the API to the Company type
 */
export const mapCompanyResponse = (companyResponse: any) => {
  return {
    id: companyResponse.id,
    name: companyResponse.name,
    email: companyResponse.email,
    phone: companyResponse.phone,
    address: companyResponse.address,
    city: companyResponse.city,
    state: companyResponse.state,
    zip: companyResponse.zip,
    country: companyResponse.country,
    website: companyResponse.website,
    logo: companyResponse.logo,
    created_at: companyResponse.created_at,
    status: companyResponse.status,
    notes: companyResponse.notes,
    // Add any other properties needed
  };
};
