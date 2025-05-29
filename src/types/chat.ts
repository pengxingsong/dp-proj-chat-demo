export type MessageType = 'user' | 'ai';

export interface Message {
  type: MessageType;
  content: string;
  timestamp: string;
}

export interface ChatProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => Promise<void>;
}

// 消息类型定义
export interface TextMessage {
  type: 'text';
  content: string;
  timestamp: string;
  from?: 'user' | 'ai';
}

export interface ImageMessage {
  type: 'image';
  url: string;
  alt?: string;
  timestamp: string;
  from?: 'user' | 'ai';
}

export interface FileMessage {
  type: 'file';
  fileType: 'pdf' | 'mp3' | 'other';
  url: string;
  fileName: string;
  timestamp: string;
  from?: 'user' | 'ai';
}

export interface VideoMessage {
  type: 'video';
  url: string;
  fileName: string;
  timestamp: string;
  from?: 'user' | 'ai';
}

export interface OfficeMessage {
  type: 'office';
  fileType: 'doc' | 'xls' | 'ppt';
  url: string;
  fileName: string;
  timestamp: string;
  from?: 'user' | 'ai';
}

export interface LinkCardMessage {
  type: 'link';
  url: string;
  title: string;
  description?: string;
  image?: string;
  timestamp: string;
  from?: 'user' | 'ai';
}

export type CustomMessage = TextMessage | ImageMessage | FileMessage | VideoMessage | OfficeMessage | LinkCardMessage;

// 会话相关类型
export interface SessionItem {
  id: string;
  name: string;
  lastMessage: { type: 'text' | 'image' | 'file'; content: string; fileName?: string };
  time: string;
  unread: number;
  status: 'online' | 'waiting';
  source: string;
}

// 访客信息类型
export interface VisitorInfo {
  sessionId: string;
  source: string;
  chatCount: number;
  accessTime: string;
  customerName: string;
  contactInfo: string;
}

// 对话信息类型
export interface ChatInfo {
  status: 'processing' | 'waiting' | 'ended';
  waitTime: string;
  chatDuration: string;
  visitorMessages: number;
  serviceMessages: number;
  rating: number;
}

// 扩展信息类型
export interface ExtendInfoItem {
  title: string;
  count: number;
} 