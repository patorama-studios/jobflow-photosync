export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  photoUrl: string;
  totalJobs: number;
  outstandingJobs: number;
  outstandingPayment: number;
  createdDate: string;
  notes?: string;
  billingInfo?: {
    cardType: string;
    lastFour: string;
    expiryDate: string;
  };
  team?: TeamMember[];
  orders?: Order[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  role: 'Leader' | 'Admin' | 'Finance';
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  address: string;
  propertyType: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  amount: number;
  isPaid: boolean;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  logoUrl: string;
  openJobs: number;
  totalJobs: number;
  outstandingAmount: number;
  totalRevenue: number;
  // Adding missing properties
  phone?: string;
  email?: string;
  website?: string;
  location?: string;
  description?: string;
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  activeOrders?: number;
  totalOrders?: number;
  invoiceCount?: number;
}

export const mockCompanies: Company[] = [
  {
    id: 'comp-1',
    name: 'Urban Living Properties',
    industry: 'Real Estate',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
    openJobs: 3,
    totalJobs: 15,
    outstandingAmount: 2450,
    totalRevenue: 18750,
    phone: '(555) 123-4567',
    email: 'info@urbanliving.com',
    website: 'www.urbanliving.com',
    location: 'San Francisco, CA',
    description: 'Urban Living Properties specializes in high-end residential and commercial properties in metropolitan areas.',
    social: {
      facebook: 'https://facebook.com/urbanlivingproperties',
      twitter: 'https://twitter.com/urbanlivingprop',
      instagram: 'https://instagram.com/urbanlivingproperties',
      linkedin: 'https://linkedin.com/company/urbanlivingproperties'
    },
    activeOrders: 3,
    totalOrders: 15,
    invoiceCount: 12
  },
  {
    id: 'comp-2',
    name: 'Ocean View Realty',
    industry: 'Real Estate',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
    openJobs: 5,
    totalJobs: 22,
    outstandingAmount: 3750,
    totalRevenue: 27800,
    phone: '(555) 987-6543',
    email: 'contact@oceanview.com',
    website: 'www.oceanviewrealty.com',
    location: 'Miami, FL',
    description: 'Ocean View Realty focuses on luxury beachfront properties and vacation rentals.',
    social: {
      facebook: 'https://facebook.com/oceanviewrealty',
      twitter: 'https://twitter.com/oceanviewr',
      instagram: 'https://instagram.com/oceanviewrealty',
      linkedin: 'https://linkedin.com/company/oceanviewrealty'
    },
    activeOrders: 5,
    totalOrders: 22,
    invoiceCount: 18
  },
  {
    id: 'comp-3',
    name: 'Hometown Realty',
    industry: 'Real Estate',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
    openJobs: 2,
    totalJobs: 8,
    outstandingAmount: 1200,
    totalRevenue: 7200,
    phone: '(555) 234-5678',
    email: 'info@hometown.com',
    website: 'www.hometownrealty.com',
    location: 'Chicago, IL',
    description: 'Hometown Realty specializes in residential properties in suburban areas.',
    social: {
      facebook: 'https://facebook.com/hometownrealty',
      twitter: 'https://twitter.com/hometownr',
      instagram: 'https://instagram.com/hometownrealty',
      linkedin: 'https://linkedin.com/company/hometownrealty'
    },
    activeOrders: 2,
    totalOrders: 8,
    invoiceCount: 7
  },
  {
    id: 'comp-4',
    name: 'Metropolitan Housing',
    industry: 'Property Management',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
    openJobs: 0,
    totalJobs: 18,
    outstandingAmount: 0,
    totalRevenue: 22500,
    phone: '(555) 876-5432',
    email: 'info@metropolitan.com',
    website: 'www.metropolitanhousing.com',
    location: 'New York, NY',
    description: 'Metropolitan Housing manages high-end luxury condos and apartments in urban centers.',
    social: {
      facebook: 'https://facebook.com/metropolitanhousing',
      twitter: 'https://twitter.com/metrohousing',
      instagram: 'https://instagram.com/metropolitanhousing',
      linkedin: 'https://linkedin.com/company/metropolitanhousing'
    },
    activeOrders: 0,
    totalOrders: 18,
    invoiceCount: 15
  },
  {
    id: 'comp-5',
    name: 'Sunlight Properties',
    industry: 'Real Estate',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
    openJobs: 1,
    totalJobs: 10,
    outstandingAmount: 850,
    totalRevenue: 12650,
    phone: '(555) 345-6789',
    email: 'info@sunlight.com',
    website: 'www.sunlightproperties.com',
    location: 'Los Angeles, CA',
    description: 'Sunlight Properties focuses on properties with natural lighting and modern design.',
    social: {
      facebook: 'https://facebook.com/sunlightproperties',
      twitter: 'https://twitter.com/sunlightprop',
      instagram: 'https://instagram.com/sunlightproperties',
      linkedin: 'https://linkedin.com/company/sunlightproperties'
    },
    activeOrders: 1,
    totalOrders: 10,
    invoiceCount: 9
  },
  {
    id: 'comp-6',
    name: 'Skyline Developers',
    industry: 'Construction',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623',
    openJobs: 7,
    totalJobs: 25,
    outstandingAmount: 5200,
    totalRevenue: 37500,
    phone: '(555) 456-7890',
    email: 'info@skyline.com',
    website: 'www.skylinedevelopers.com',
    location: 'Austin, TX',
    description: 'Skyline Developers specializes in constructing high-rise buildings and modern architectural designs.',
    social: {
      facebook: 'https://facebook.com/skylinedevelopers',
      twitter: 'https://twitter.com/skylinedev',
      instagram: 'https://instagram.com/skylinedevelopers',
      linkedin: 'https://linkedin.com/company/skylinedevelopers'
    },
    activeOrders: 7,
    totalOrders: 25,
    invoiceCount: 20
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'Urban Living Properties',
    email: 'sarah@urbanliving.com',
    phone: '(555) 123-4567',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    totalJobs: 15,
    outstandingJobs: 3,
    outstandingPayment: 2450,
    createdDate: 'Jan 10, 2023',
    notes: 'Prefers communication via email. Always pays invoices promptly.',
    billingInfo: {
      cardType: 'Visa',
      lastFour: '4242',
      expiryDate: '09/26'
    },
    team: [
      {
        id: '101',
        name: 'Sarah Johnson',
        email: 'sarah@urbanliving.com',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        role: 'Leader'
      },
      {
        id: '102',
        name: 'Michael Smith',
        email: 'michael@urbanliving.com',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
        role: 'Admin'
      },
      {
        id: '103',
        name: 'Jessica Williams',
        email: 'jessica@urbanliving.com',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        role: 'Finance'
      }
    ],
    orders: [
      {
        id: '1001',
        orderNumber: 'ORD-2023-001',
        date: 'Mar 15, 2023',
        address: '123 Market St, San Francisco, CA',
        propertyType: 'Apartment',
        status: 'Completed',
        amount: 1200,
        isPaid: true
      },
      {
        id: '1002',
        orderNumber: 'ORD-2023-025',
        date: 'Apr 22, 2023',
        address: '456 Main Ave, San Francisco, CA',
        propertyType: 'Condo',
        status: 'Completed',
        amount: 950,
        isPaid: true
      },
      {
        id: '1003',
        orderNumber: 'ORD-2023-078',
        date: 'Jul 10, 2023',
        address: '789 Valencia St, San Francisco, CA',
        propertyType: 'Apartment',
        status: 'In Progress',
        amount: 1500,
        isPaid: false
      },
      {
        id: '1004',
        orderNumber: 'ORD-2023-094',
        date: 'Aug 5, 2023',
        address: '101 Howard St, San Francisco, CA',
        propertyType: 'Penthouse',
        status: 'Scheduled',
        amount: 2200,
        isPaid: false
      }
    ]
  },
  {
    id: '2',
    name: 'David Rodriguez',
    company: 'Ocean View Realty',
    email: 'david@oceanview.com',
    phone: '(555) 987-6543',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    totalJobs: 22,
    outstandingJobs: 5,
    outstandingPayment: 3750,
    createdDate: 'Nov 15, 2022',
    notes: 'Prefers morning shoots. Has specific requirements for beachfront properties.',
    billingInfo: {
      cardType: 'Mastercard',
      lastFour: '8765',
      expiryDate: '04/25'
    },
    team: [
      {
        id: '201',
        name: 'David Rodriguez',
        email: 'david@oceanview.com',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        role: 'Leader'
      },
      {
        id: '202',
        name: 'Amanda Perez',
        email: 'amanda@oceanview.com',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        role: 'Admin'
      }
    ],
    orders: [
      {
        id: '2001',
        orderNumber: 'ORD-2023-032',
        date: 'Feb 28, 2023',
        address: '555 Beach Blvd, Miami, FL',
        propertyType: 'Beachfront Villa',
        status: 'Completed',
        amount: 2500,
        isPaid: true
      },
      {
        id: '2002',
        orderNumber: 'ORD-2023-067',
        date: 'May 17, 2023',
        address: '222 Ocean Dr, Miami, FL',
        propertyType: 'Condo',
        status: 'Completed',
        amount: 1100,
        isPaid: true
      },
      {
        id: '2003',
        orderNumber: 'ORD-2023-088',
        date: 'Jul 30, 2023',
        address: '333 Bayfront Ln, Miami, FL',
        propertyType: 'Penthouse',
        status: 'In Progress',
        amount: 3000,
        isPaid: false
      }
    ]
  },
  {
    id: '3',
    name: 'Emily Chang',
    company: 'Hometown Realty',
    email: 'emily@hometown.com',
    phone: '(555) 234-5678',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    totalJobs: 8,
    outstandingJobs: 2,
    outstandingPayment: 1200,
    createdDate: 'Mar 22, 2023',
    notes: 'New client, focusing on suburban family homes.',
    billingInfo: {
      cardType: 'Amex',
      lastFour: '1234',
      expiryDate: '11/25'
    },
    team: [
      {
        id: '301',
        name: 'Emily Chang',
        email: 'emily@hometown.com',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
        role: 'Leader'
      }
    ],
    orders: [
      {
        id: '3001',
        orderNumber: 'ORD-2023-055',
        date: 'Apr 10, 2023',
        address: '123 Maple St, Chicago, IL',
        propertyType: 'Single Family Home',
        status: 'Completed',
        amount: 900,
        isPaid: true
      },
      {
        id: '3002',
        orderNumber: 'ORD-2023-089',
        date: 'Jul 28, 2023',
        address: '456 Oak Ln, Chicago, IL',
        propertyType: 'Townhouse',
        status: 'In Progress',
        amount: 1200,
        isPaid: false
      }
    ]
  },
  {
    id: '4',
    name: 'James Wilson',
    company: 'Metropolitan Housing',
    email: 'james@metropolitan.com',
    phone: '(555) 876-5432',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    totalJobs: 18,
    outstandingJobs: 0,
    outstandingPayment: 0,
    createdDate: 'Sep 5, 2022',
    notes: 'Specializes in high-end luxury condos and apartments.',
    billingInfo: {
      cardType: 'Visa',
      lastFour: '9876',
      expiryDate: '08/24'
    },
    team: [
      {
        id: '401',
        name: 'James Wilson',
        email: 'james@metropolitan.com',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
        role: 'Leader'
      },
      {
        id: '402',
        name: 'Lisa Johnson',
        email: 'lisa@metropolitan.com',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        role: 'Admin'
      },
      {
        id: '403',
        name: 'Robert Chen',
        email: 'robert@metropolitan.com',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        role: 'Finance'
      }
    ],
    orders: [
      {
        id: '4001',
        orderNumber: 'ORD-2023-012',
        date: 'Jan 25, 2023',
        address: '789 5th Ave, New York, NY',
        propertyType: 'Luxury Condo',
        status: 'Completed',
        amount: 3500,
        isPaid: true
      },
      {
        id: '4002',
        orderNumber: 'ORD-2023-045',
        date: 'Mar 30, 2023',
        address: '101 Park Ave, New York, NY',
        propertyType: 'Penthouse',
        status: 'Completed',
        amount: 4200,
        isPaid: true
      }
    ]
  },
  {
    id: '5',
    name: 'Maria Garcia',
    company: 'Sunlight Properties',
    email: 'maria@sunlight.com',
    phone: '(555) 345-6789',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
    totalJobs: 10,
    outstandingJobs: 1,
    outstandingPayment: 850,
    createdDate: 'Apr 12, 2023',
    notes: 'Focuses on properties with natural lighting. Provides very detailed specification documents.',
    billingInfo: {
      cardType: 'Mastercard',
      lastFour: '5432',
      expiryDate: '12/26'
    },
    team: [
      {
        id: '501',
        name: 'Maria Garcia',
        email: 'maria@sunlight.com',
        photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
        role: 'Leader'
      },
      {
        id: '502',
        name: 'Carlos Rodriguez',
        email: 'carlos@sunlight.com',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
        role: 'Admin'
      }
    ],
    orders: [
      {
        id: '5001',
        orderNumber: 'ORD-2023-056',
        date: 'Apr 15, 2023',
        address: '555 Sunshine Blvd, Los Angeles, CA',
        propertyType: 'Modern Villa',
        status: 'Completed',
        amount: 1950,
        isPaid: true
      },
      {
        id: '5002',
        orderNumber: 'ORD-2023-097',
        date: 'Aug 12, 2023',
        address: '333 Hillside Dr, Los Angeles, CA',
        propertyType: 'Contemporary Home',
        status: 'In Progress',
        amount: 850,
        isPaid: false
      }
    ]
  }
];
