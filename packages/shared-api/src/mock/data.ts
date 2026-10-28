import type { Product, User } from '@company/shared-types';

/** Demo accounts. REPLACE with a real backend — never ship credentials in client code. */
export const MOCK_CREDENTIALS: Record<string, { password: string; userId: string }> = {
  'admin@company.com': { password: 'Admin@123', userId: 'u-1' },
  'user@company.com': { password: 'User@1234', userId: 'u-2' },
};

const names = [
  'Ava Thompson',
  'Noah Patel',
  'Mia Nguyen',
  'Liam Okafor',
  'Zoe Martins',
  'Ethan Rossi',
  'Isla Kowalski',
  'Lucas Haddad',
  'Nora Lindqvist',
  'Omar Rahman',
];

export function createUsers(): User[] {
  const base: User[] = [
    {
      id: 'u-1',
      name: 'Priya Raman',
      email: 'admin@company.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-08T09:00:00Z',
    },
    {
      id: 'u-2',
      name: 'Daniel Brooks',
      email: 'user@company.com',
      role: 'user',
      status: 'active',
      createdAt: '2024-02-14T11:30:00Z',
    },
  ];
  const statuses: User['status'][] = ['active', 'active', 'inactive', 'suspended'];
  names.forEach((name, index) => {
    base.push({
      id: `u-${index + 3}`,
      name,
      email: `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`,
      role: index % 5 === 0 ? 'admin' : 'user',
      status: statuses[index % statuses.length] ?? 'active',
      createdAt: new Date(Date.UTC(2024, 2 + (index % 9), 3 + index)).toISOString(),
    });
  });
  return base;
}

const catalog: [string, string, string, number][] = [
  [
    'Walnut Standing Desk',
    'Furniture',
    'Electric height-adjustable desk with a solid walnut top and cable tray.',
    649,
  ],
  [
    'Mesh Task Chair',
    'Furniture',
    'Breathable mesh back with lumbar support and 4D armrests.',
    289,
  ],
  ['Ceramic Pour-Over Set', 'Kitchen', 'Hand-glazed dripper, carafe and two cups.', 74],
  [
    'Merino Travel Blanket',
    'Travel',
    'Packable merino wool blanket with a water-resistant sleeve.',
    98,
  ],
  [
    'Mechanical Keyboard 75%',
    'Electronics',
    'Hot-swappable switches, aluminium case, wired and Bluetooth.',
    159,
  ],
  ['27" 4K Monitor', 'Electronics', 'IPS panel, 99% sRGB, USB-C with 65W power delivery.', 429],
  [
    'Cast Iron Skillet',
    'Kitchen',
    'Pre-seasoned 12-inch skillet that goes from stove to oven.',
    52,
  ],
  [
    'Trail Daypack 24L',
    'Travel',
    'Ripstop daypack with a ventilated back panel and rain cover.',
    119,
  ],
  ['Desk Lamp Pro', 'Furniture', 'Dimmable LED lamp with adjustable colour temperature.', 89],
  [
    'Noise-Cancelling Headphones',
    'Electronics',
    'Over-ear, 40-hour battery, multipoint Bluetooth.',
    249,
  ],
  ['Linen Apron', 'Kitchen', 'Stonewashed linen with deep pockets and adjustable straps.', 38],
  ['Compact Tripod', 'Travel', 'Carbon-fibre travel tripod folding to 32 cm.', 139],
];

export function createProducts(): Product[] {
  return catalog.map(([name, category, description, price], index) => ({
    id: `p-${index + 1}`,
    name,
    category,
    description,
    price,
    currency: 'USD',
    stock: (index * 7 + 3) % 40,
    rating: Math.round((3.8 + ((index * 3) % 12) / 10) * 10) / 10,
    createdAt: new Date(Date.UTC(2024, 5, 1 + index)).toISOString(),
  }));
}
