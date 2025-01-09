import type { UserAccount } from './user';

export type INotification = {
  id: number;
  targetUserId: number;
  to: string;
  fromUserId: number;
  from: string;
  title: string;
  message: string;
  creationDate: string;
  lastModifiedDate: string;
  profileUrl?: string;
  isRead: boolean;
};

export type ITicket = {
  id: any;
  ownerId: number;
  status: 'New' | 'Inprogress' | 'Resolved' | 'Closed';
  approvalState:
    | 'PENDING_COOP_APPROVAL'
    | 'APPROVED_BY_COOP'
    | 'REJECTED_BY_COOP'
    | 'PENDING_PRICE_ACCEPTANCE'
    | 'PRICE_ACCEPTED'
    | 'ACTIVE'
    | 'PENDING_COMPLETION'
    | 'COMPLETED'
    | 'CANCELLED';
  imageUrls: string[];
  source: 'Web' | 'Mobile' | 'Other';
  issueSummary: string;
  description: string;
  locationName: string;
  phoneNumber: string;
  latitude: string;
  longitude: string;
  agentId: number;
  pestOrDiseaseName: string;
  farmType: 'CROP' | 'LIVESTOCK';
  cropAnimalName: string;
  firstName: string;
  lastName: string;
  coopId: number;
  whoPays: 'FARMER' | 'GOVERNMENT' | 'OTHER';
  assignedToId: number;
  agent: UserAccount;
};

export interface IcartItem {
  id: string;
  name: string;
  coverUrl: string;
  price: number;
  quantity: number;
  unit: string;
  colors: string[];
}
