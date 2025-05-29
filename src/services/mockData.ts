import { SessionItem, CustomMessage, VisitorInfo, ChatInfo, ExtendInfoItem } from '../types/chat';

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock会话数据
export const mockSessions: SessionItem[] = [
  {
    id: '1',
    name: '裴先生',
    lastMessage: { type: 'text', content: '收到!您的需求，请稍等' },
    time: '16:18',
    unread: 0,
    status: 'waiting',
    source: 'WAP | 我要上天'
  },
  {
    id: '2',
    name: '李先生',
    lastMessage: { type: 'image', content: 'https://via.placeholder.com/40x40.png?text=IMG' },
    time: '16:20',
    unread: 1,
    status: 'online',
    source: 'WAP | 我要上天'
  },
  {
    id: '3',
    name: '李五',
    lastMessage: { type: 'file', content: '', fileName: '合同.pdf' },
    time: '16:22',
    unread: 2,
    status: 'online',
    source: 'WAP | 我要上天'
  },
];

// Mock初始消息数据
export const mockInitialMessages: CustomMessage[] = [
  {
    type: 'text',
    content: '您好！我是智能客服助手。请问有什么可以帮您？',
    timestamp: new Date().toLocaleTimeString(),
    from: 'ai',
  },
  {
    type: 'image',
    url: '/content/img/image.jpg',
    timestamp: new Date().toLocaleTimeString(),
    from: 'ai',
  },
  {
    type: 'file',
    fileType: 'pdf',
    url: '/content/file/[技术] MyBatis 3x.pdf',
    fileName: '[技术] MyBatis 3x.pdf',
    timestamp: new Date().toLocaleTimeString(),
    from: 'ai',
  },
  {
    type: 'file',
    fileType: 'mp3',
    url: '/content/file/huayao.mp3',
    fileName: 'huayao.mp3',
    timestamp: new Date().toLocaleTimeString(),
    from: 'ai',
  },
  {
    type: 'video',
    url: '/content/file/test1.mp4',
    fileName: 'test1.mp4',
    timestamp: new Date().toLocaleTimeString(),
    from: 'ai',
  },
  {
    type: 'office',
    fileType: 'doc',
    url: '/content/file/test1.docx',
    fileName: 'test1.docx',
    timestamp: new Date().toLocaleTimeString(),
    from: 'ai',
  },
  {
    type: 'link',
    url: 'https://www.baidu.com',
    title: '百度',
    description: '百度',
    image: '/content/img/image.jpg',
    timestamp: new Date().toLocaleTimeString(),
    from: 'ai',
  },
];

// Mock访客信息
export const mockVisitorInfo: VisitorInfo = {
  sessionId: 'c2ac23e0-1c2e-11f0-8014',
  source: 'WAP',
  chatCount: 4,
  accessTime: new Date().toLocaleString(),
  customerName: '何先生',
  contactInfo: '138****1234'
};

// Mock对话信息
export const mockChatInfo: ChatInfo = {
  status: 'processing',
  waitTime: '2分钟',
  chatDuration: '5分钟',
  visitorMessages: 3,
  serviceMessages: 4,
  rating: 4
};

// Mock扩展信息
export const mockExtendInfo: ExtendInfoItem[] = [
  { title: '历史订单', count: 5 },
  { title: '未完成订单', count: 1 },
  { title: '购物车商品', count: 2 },
  { title: '收藏商品', count: 8 },
];

// 模拟API调用
export class ChatAPI {
  // 获取会话列表
  static async getSessions(): Promise<SessionItem[]> {
    await delay(300);
    return [...mockSessions];
  }

  // 获取消息列表
  static async getMessages(sessionId: string): Promise<CustomMessage[]> {
    await delay(200);
    return [...mockInitialMessages];
  }

  // 发送消息
  static async sendMessage(message: string, files?: File[]): Promise<void> {
    await delay(500);
    console.log('发送消息:', message, files);
  }

  // 获取访客信息
  static async getVisitorInfo(sessionId: string): Promise<VisitorInfo> {
    await delay(200);
    return { ...mockVisitorInfo };
  }

  // 获取对话信息
  static async getChatInfo(sessionId: string): Promise<ChatInfo> {
    await delay(200);
    return { ...mockChatInfo };
  }

  // 获取扩展信息
  static async getExtendInfo(sessionId: string): Promise<ExtendInfoItem[]> {
    await delay(200);
    return [...mockExtendInfo];
  }
} 