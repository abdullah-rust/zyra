export enum MessageStatus {
  SENDING = "SENDING", // Sirf frontend par (Optimistic UI)
  SENT = "SENT", // Redis/Socket tak pounch gaya
  DELIVERED = "DELIVERED", // Receiver ke socket tak pounch gaya
  READ = "READ", // Receiver ne chat khol li
}

export interface IMessage {
  id: string; // UUID (Generated on Frontend or Backend)
  conversationId: string; // The "Room" ID we discussed
  senderId: string;
  receiverId: string;
  content: string; // The actual text
  status: MessageStatus; // isRead ki jagah ye zyada professional hai
  createdAt: Date | string; // ISO String for transport, Date for DB
}

export interface IConversation {
  id: string;
  user1Id: string;
  user2Id: string;
  lastMessage?: string;
  updatedAt: Date | string;
  unreadCount?: number; // Frontend UI ke liye extra help
}
