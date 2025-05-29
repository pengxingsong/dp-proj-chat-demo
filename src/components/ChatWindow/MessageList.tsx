import React, { useRef, useEffect, useCallback } from 'react';
import { Spin, Avatar } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import { CustomMessage } from '../../types/chat';
import MessageItem from './MessageItem';
import './MessageList.css';

interface MessageListProps {
  messages: CustomMessage[];
  isLoading?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const height = container.clientHeight;
      const maxScrollTop = scrollHeight - height;
      
      container.scrollTo({
        top: maxScrollTop,
        behavior
      });
    }
  }, []);

  useEffect(() => {
    // 初始加载时立即滚动
    scrollToBottom('auto');
  }, [scrollToBottom]);

  useEffect(() => {
    // 消息更新时平滑滚动
    scrollToBottom('smooth');
  }, [messages, scrollToBottom]);

  const renderAvatar = (from?: 'user' | 'ai') => {
    if (from === 'user') {
      return <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />;
    }
    return <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />;
  };

  return (
    <div className="message-list-container">
      <div className="messages-container" ref={messagesContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message-wrapper ${message.from}`}>
            <div className="message-avatar">
              {renderAvatar(message.from)}
            </div>
            <div className="message-content">
              <MessageItem message={message} />
              <div className="message-time">{message.timestamp}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message-wrapper ai">
            <div className="message-avatar">
              {renderAvatar('ai')}
            </div>
            <div className="message-content">
              <div className="message-loading">
                <Spin size="small" />
                <span>AI正在思考中...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList; 