import React from 'react';
import { List, Avatar, Badge, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { SessionItem as SessionItemType } from '../types/chat';
import '../css/UserSessionItem.css';

const { Text } = Typography;

interface SessionItemProps {
  session: SessionItemType;
  isSelected: boolean;
  onSelect: (sessionId: string) => void;
}

const SessionItem: React.FC<SessionItemProps> = ({
  session,
  isSelected,
  onSelect,
}) => {
  const renderLastMessage = () => {
    const { lastMessage } = session;
    switch (lastMessage.type) {
      case 'text':
        return lastMessage.content;
      case 'image':
        return '[图片]';
      case 'file':
        return `[文件] ${lastMessage.fileName}`;
      default:
        return '未知消息';
    }
  };

  return (
    <List.Item
      className={`webchat-session-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(session.id)}
    >
      <List.Item.Meta
        avatar={
          <Badge
            dot={session.status === 'waiting'}
            color={session.status === 'waiting' ? 'red' : 'green'}
          >
            <Avatar icon={<UserOutlined />} />
          </Badge>
        }
        title={
          <div className="webchat-session-title">
            <Text strong>{session.name}</Text>
            <Text type="secondary" className="webchat-session-time">
              {session.time}
            </Text>
          </div>
        }
        description={
          <div className="webchat-session-desc">
            <Text type="secondary" ellipsis>
              {renderLastMessage()}
            </Text>
            <div className="webchat-session-source">{session.source}</div>
          </div>
        }
      />
      {session.unread > 0 && (
        <Badge
          count={session.unread}
          size="small"
          className="webchat-session-unread-badge"
        />
      )}
    </List.Item>
  );
};

export default SessionItem;
