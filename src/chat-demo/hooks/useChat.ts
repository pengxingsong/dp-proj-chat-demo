import { useState, useEffect } from 'react';
import { CustomMessage } from '../types/chat';
import { ChatAPI } from '../mockData';

export const useChat = (sessionId?: string) => {
  const [messages, setMessages] = useState<CustomMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 加载消息
  useEffect(() => {
    if (sessionId) {
      loadMessages(sessionId);
    }
  }, [sessionId]);

  const loadMessages = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const messages = await ChatAPI.getMessages(sessionId);
      setMessages(messages);
    } catch (error) {
      console.error('加载消息失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (message: string, files?: File[]) => {
    if (!message.trim() && (!files || files.length === 0)) return;

    const allMessages: CustomMessage[] = [];

    // 添加用户文本消息（如果有内容）
    if (message.trim()) {
      const userMessage: CustomMessage = {
        type: 'text',
        content: message.trim(),
        timestamp: new Date().toLocaleTimeString(),
        from: 'user',
      };
      allMessages.push(userMessage);
    }

    // 处理文件消息
    if (files && files.length > 0) {
      const fileMessages = files.map((file) => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        const url = URL.createObjectURL(file);

        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext!)) {
          return {
            type: 'image',
            url,
            alt: file.name,
            timestamp: new Date().toLocaleTimeString(),
            from: 'user',
          } as CustomMessage;
        } else if (['mp3', 'wav', 'ogg'].includes(ext!)) {
          return {
            type: 'file',
            fileType: 'mp3',
            url,
            fileName: file.name,
            timestamp: new Date().toLocaleTimeString(),
            from: 'user',
          } as CustomMessage;
        } else if (['pdf'].includes(ext!)) {
          return {
            type: 'file',
            fileType: 'pdf',
            url,
            fileName: file.name,
            timestamp: new Date().toLocaleTimeString(),
            from: 'user',
          } as CustomMessage;
        } else if (
          ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext!)
        ) {
          return {
            type: 'office',
            fileType: ext as any,
            url,
            fileName: file.name,
            timestamp: new Date().toLocaleTimeString(),
            from: 'user',
          } as CustomMessage;
        } else if (['mp4', 'webm', 'ogg'].includes(ext!)) {
          return {
            type: 'video',
            url,
            fileName: file.name,
            timestamp: new Date().toLocaleTimeString(),
            from: 'user',
          } as CustomMessage;
        } else {
          return {
            type: 'file',
            fileType: 'other',
            url,
            fileName: file.name,
            timestamp: new Date().toLocaleTimeString(),
            from: 'user',
          } as CustomMessage;
        }
      });

      allMessages.push(...fileMessages);
    }

    setMessages((prev) => [...prev, ...allMessages]);
    setIsLoading(true);

    try {
      if (sessionId) {
        await ChatAPI.sendMessage(sessionId, message, files);

        // 模拟AI回复
        const aiMessage: CustomMessage = {
          type: 'text',
          content: '收到您的需求，请稍等',
          timestamp: new Date().toLocaleTimeString(),
          from: 'ai',
        };

        setTimeout(() => {
          setMessages((prev) => [...prev, aiMessage]);
          setIsLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    setMessages,
  };
};
