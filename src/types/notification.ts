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
