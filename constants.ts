import { InventoryItem } from './types';

export const INITIAL_ITEMS: InventoryItem[] = [
  { id: 'M-001', name: 'Ball Bearing 6205', category: 'Mechanic', stock: 45, minStock: 10, unit: 'pcs' },
  { id: 'M-002', name: 'V-Belt B-52', category: 'Mechanic', stock: 5, minStock: 8, unit: 'pcs' },
  { id: 'E-101', name: 'Proximity Sensor PNP', category: 'Electric', stock: 12, minStock: 5, unit: 'unit' },
  { id: 'E-102', name: 'Contactor 220V 32A', category: 'Electric', stock: 3, minStock: 5, unit: 'unit' },
  { id: 'T-201', name: 'Wrench Set Metric', category: 'Tools', stock: 8, minStock: 2, unit: 'set' },
  { id: 'M-003', name: 'Hydraulic Oil ISO 68', category: 'Mechanic', stock: 150, minStock: 50, unit: 'liter' },
  { id: 'E-103', name: 'Limit Switch Roller', category: 'Electric', stock: 20, minStock: 10, unit: 'pcs' },
  { id: 'T-202', name: 'Digital Multimeter', category: 'Tools', stock: 4, minStock: 3, unit: 'unit' },
  { id: 'M-004', name: 'Grease Lithium EP2', category: 'Mechanic', stock: 12, minStock: 15, unit: 'pail' },
  { id: 'E-104', name: 'PLC Module Input', category: 'Electric', stock: 2, minStock: 2, unit: 'unit' },
];

export const PASSWORD_SECRET = "MAINTENANCE2026";
