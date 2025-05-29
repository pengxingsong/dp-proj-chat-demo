import React, { useState, useEffect } from 'react';
import { Descriptions, Badge, Rate, Spin } from 'antd';
import { ChatInfo } from '../../types/chat';
import { ChatAPI } from '../../services/mockData';
import './ChatInfoPanel.css';

interface ChatInfoPanelProps {
  sessionId?: string;
}

const ChatInfoPanel: React.FC<ChatInfoPanelProps> = ({ sessionId }) => {
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (sessionId) {
      loadChatInfo(sessionId);
    }
  }, [sessionId]);

  const loadChatInfo = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const info = await ChatAPI.getChatInfo(sessionId);
      setChatInfo(info);
    } catch (error) {
      console.error('加载对话信息失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge status="processing" text="对话中" />;
      case 'waiting':
        return <Badge status="warning" text="等待中" />;
      case 'ended':
        return <Badge status="default" text="已结束" />;
      default:
        return <Badge status="default" text="未知状态" />;
    }
  };

  if (isLoading) {
    return (
      <div className="chat-info-loading">
        <Spin size="small" />
        <span>加载中...</span>
      </div>
    );
  }

  if (!chatInfo) {
    return (
      <div className="chat-info-empty">
        请选择会话查看对话信息
      </div>
    );
  }

  return (
    <div className="chat-info">
      <Descriptions column={1} size="small">
        <Descriptions.Item label="当前状态">
          {getStatusBadge(chatInfo.status)}
        </Descriptions.Item>
        <Descriptions.Item label="等待时长">
          {chatInfo.waitTime}
        </Descriptions.Item>
        <Descriptions.Item label="会话时长">
          {chatInfo.chatDuration}
        </Descriptions.Item>
        <Descriptions.Item label="消息数">
          <div className="message-count">
            <span>访客消息：{chatInfo.visitorMessages}条</span>
            <span>客服消息：{chatInfo.serviceMessages}条</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="对话质量">
          <Rate disabled defaultValue={chatInfo.rating} />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ChatInfoPanel; 