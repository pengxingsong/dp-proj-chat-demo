import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Input, Button, Avatar, Spin } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../types/chat';
import './Chat.css';

interface ChatProps {
  initialMessages: Message[];
  onSendMessage: (message: string) => Promise<void>;
}

const Chat: React.FC<ChatProps> = ({ initialMessages, onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

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
  }, []);

  useEffect(() => {
    // 消息更新时平滑滚动
    scrollToBottom('smooth');
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      await onSendMessage(inputValue);
      
      // 模拟AI回复
      const aiMessage: Message = {
        type: 'ai',
        content: '收到您的需求，请稍等',
        timestamp: new Date().toLocaleTimeString(),
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">
          <span className="status-dot online"></span>
          当前对话中
        </div>
      </div>
      
      <div className="messages-container" ref={messagesContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-wrapper ${message.type === 'user' ? 'user' : 'ai'}`}
          >
            <div className="message-avatar">
              <Avatar
                icon={message.type === 'user' ? <UserOutlined /> : <RobotOutlined />}
                className={message.type === 'user' ? 'user-avatar' : 'ai-avatar'}
              />
            </div>
            <div className="message-content">
              <div className="message-bubble">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
              <div className="message-timestamp">{message.timestamp}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper ai">
            <div className="message-avatar">
              <Avatar icon={<RobotOutlined />} className="ai-avatar" />
            </div>
            <div className="message-content">
              <div className="message-bubble loading">
                <Spin size="small" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <Input.TextArea
          ref={textAreaRef}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="按 Enter 发送，Shift + Enter 换行"
          autoSize={{ minRows: 2, maxRows: 6 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!inputValue.trim() || isLoading}
        >
          发送
        </Button>
      </div>
    </div>
  );
};

export default Chat; 