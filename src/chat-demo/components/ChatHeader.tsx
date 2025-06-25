import React from 'react';
import { Typography, Space, Button } from 'antd';
import {
  MoreOutlined,
  PhoneOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import '../css/ChatHeader.css';

const { Text } = Typography;

interface ChatHeaderProps {
  /**
   * 当前会话ID
   */
  sessionId?: string;
  /**
   * 用户昵称
   */
  userName?: string;
  /**
   * 对话状态文本（如果提供则覆盖默认的"与 [用户] 对话中"格式）
   */
  statusText?: string;
  /**
   * 是否显示通话按钮
   */
  showCallButtons?: boolean;
  /**
   * 是否显示更多菜单
   */
  showMoreMenu?: boolean;
  /**
   * 自定义操作按钮
   */
  actions?: React.ReactNode;
  /**
   * 点击通话按钮的回调
   */
  onVoiceCall?: () => void;
  /**
   * 点击视频通话按钮的回调
   */
  onVideoCall?: () => void;
  /**
   * 点击更多菜单的回调
   */
  onMoreMenuClick?: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  sessionId,
  userName,
  statusText,
  showCallButtons = false,
  showMoreMenu = true,
  actions,
  onVoiceCall,
  onVideoCall,
  onMoreMenuClick,
}) => {
  // 生成状态文本：优先使用自定义statusText，否则根据userName生成
  const getStatusText = () => {
    if (statusText) {
      return statusText;
    }
    if (userName) {
      return `与 ${userName} 对话中`;
    }
    return '当前对话中';
  };

  return (
    <div className="webchat-chat-header">
      <div className="webchat-chat-header-content">
        <div className="webchat-chat-header-left">
          <div className="webchat-chat-status">
            <div className="webchat-status-indicator" />
            <Text className="webchat-status-text">{getStatusText()}</Text>
          </div>
        </div>

        <div className="webchat-chat-header-right">
          <Space size={8}>
            {/* 自定义操作按钮 */}
            {actions}

            {/* 通话按钮 */}
            {showCallButtons && (
              <>
                <Button
                  type="text"
                  size="small"
                  icon={<PhoneOutlined />}
                  onClick={onVoiceCall}
                  className="webchat-header-action-btn"
                  title="语音通话"
                />
                <Button
                  type="text"
                  size="small"
                  icon={<VideoCameraOutlined />}
                  onClick={onVideoCall}
                  className="webchat-header-action-btn"
                  title="视频通话"
                />
              </>
            )}

            {/* 更多菜单 */}
            {showMoreMenu && (
              <Button
                type="text"
                size="small"
                icon={<MoreOutlined />}
                onClick={onMoreMenuClick}
                className="webchat-header-action-btn"
                title="更多"
              />
            )}
          </Space>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
