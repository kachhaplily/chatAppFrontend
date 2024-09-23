export interface userDto {
  firstName: string;
  lastName: string;
  email: string;
  authId: string;
}

export interface userNavigation {
  firstName: string;
  email?: string;
  path: string;
  icon?: string;
  authId?: string;
  isActive?: boolean;
}

export interface messageDto {
  ReceiverUserId?: string;
  MessageText: string;
}

export interface chatHistoryDto {
  id?: number;
  senderUserId: string;
  receiverUserId: string;
  messageText: string;
  sentAt: string;
}
