import React from 'react';
import { useChat } from '../../hooks/useChat';
import { useSessions } from '../../hooks/useSessions';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import './ChatWindow.css';

interface ChatWindowProps {
  sessionId?: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ sessionId }) => {
  const { messages, isLoading, sendMessage } = useChat(sessionId);
  const { selectedSession } = useSessions({ selectedSessionId: sessionId });

  // 获取当前会话的用户昵称
  const userName = selectedSession?.name;

  const handleVoiceCall = () => {
    console.log('发起语音通话');
    // TODO: 实现语音通话功能
  };

  const handleVideoCall = () => {
    console.log('发起视频通话');
    // TODO: 实现视频通话功能
  };

  const handleMoreMenu = () => {
    console.log('打开更多菜单');
    // TODO: 实现更多菜单功能
  };

  return (
    <div className="chat-window-container">
      <ChatHeader
        sessionId={sessionId}
        userName={userName}
        showCallButtons={true}
        showMoreMenu={true}
        onVoiceCall={handleVoiceCall}
        onVideoCall={handleVideoCall}
        onMoreMenuClick={handleMoreMenu}
      />
      <MessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow; 