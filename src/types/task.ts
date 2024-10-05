export type Itask = {
  id: number;
  createdbyId: number;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'; // Assuming these are the possible statuses
  priority: 'LOW' | 'MEDIUM' | 'HIGH'; // Assuming these are the possible priorities
  dueDate: string; // ISO date string
  creationDate: string; // ISO date string
  lastModifiedDate: string; // ISO date string
  assignedToId: number;
  cooperativeId: number;
  taskType: 'GENERAL' | 'MILK_PICK' | 'DELIVERY' | 'INSPECTION' | 'OTHER'; // Assuming these are the possible task types
  farmerId: number;
  farmId: number;
};

export type ItaskNew = {
  title: string;
  description: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'; // Assuming these are the possible statuses
  priority?: 'LOW' | 'MEDIUM' | 'HIGH'; // Assuming these are the possible priorities
  dueDate?: string; // ISO date string
  assignedToId?: any;
  cooperativeId?: number;
  taskType?: 'GENERAL' | 'MILK_PICK' | 'DELIVERY' | 'INSPECTION' | 'OTHER'; // Assuming these are the possible task types
  farmerId: number[];
  farmId?: number;
};
