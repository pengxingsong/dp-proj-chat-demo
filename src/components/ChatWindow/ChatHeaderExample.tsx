import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { SettingOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';
import ChatHeader from './ChatHeader';

/**
 * ChatHeader使用示例
 * 展示如何添加自定义操作按钮和扩展功能
 */
const ChatHeaderExample: React.FC = () => {
  // 更多菜单配置
  const moreMenu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        查看用户信息
      </Menu.Item>
      <Menu.Item key="2" icon={<BellOutlined />}>
        消息提醒设置
      </Menu.Item>
      <Menu.Item key="3" icon={<SettingOutlined />}>
        对话设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="4" danger>
        结束对话
      </Menu.Item>
    </Menu>
  );

  // 自定义操作按钮
  const customActions = (
    <>
      <Button
        type="text"
        size="small"
        icon={<BellOutlined />}
        className="header-action-btn"
        title="消息提醒"
      />
      <Dropdown overlay={moreMenu} trigger={['click']}>
        <Button
          type="text"
          size="small"
          icon={<SettingOutlined />}
          className="header-action-btn"
          title="设置"
        />
      </Dropdown>
    </>
  );

  const handleVoiceCall = () => {
    console.log('发起语音通话');
  };

  const handleVideoCall = () => {
    console.log('发起视频通话');
  };

  const handleMoreMenu = () => {
    console.log('打开更多菜单');
  };

  return (
    <div>
      {/* 基础用法 */}
      <ChatHeader />
      
      {/* 显示用户昵称 */}
      <ChatHeader userName="张先生" />
      
      {/* 完整配置用法 */}
      <ChatHeader
        sessionId="session-123"
        userName="李先生"
        showCallButtons={true}
        showMoreMenu={false}
        actions={customActions}
        onVoiceCall={handleVoiceCall}
        onVideoCall={handleVideoCall}
        onMoreMenuClick={handleMoreMenu}
      />
      
      {/* 自定义状态文本（覆盖用户昵称格式） */}
      <ChatHeader
        userName="王先生"
        statusText="客服在线"
        showCallButtons={false}
        showMoreMenu={false}
      />
      
      {/* 简化用法 - 对话已结束 */}
      <ChatHeader
        userName="赵先生"
        statusText="对话已结束"
        showCallButtons={false}
        showMoreMenu={false}
      />
    </div>
  );
};

export default ChatHeaderExample; 