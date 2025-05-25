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