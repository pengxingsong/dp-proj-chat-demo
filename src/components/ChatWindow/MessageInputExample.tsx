import React from 'react';
import { Button, Space, Dropdown, Menu } from 'antd';
import { 
  SmileOutlined, 
  PictureOutlined, 
  FileOutlined, 
  GiftOutlined,
  CustomerServiceOutlined,
  MoreOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import MessageInput from './MessageInput';

/**
 * MessageInput使用示例
 * 展示如何自定义快捷按钮
 */
const MessageInputExample: React.FC = () => {
  const handleSend = async (message: string, files?: File[]) => {
    console.log('发送消息:', message, files);
  };

  // 自定义快捷按钮 - 基础版
  const basicQuickActions = (
    <Space size={4}>
      <Button
        type="text"
        size="small"
        icon={<SmileOutlined />}
        className="quick-action-btn"
        title="表情"
      />
      <Button
        type="text"
        size="small"
        icon={<PictureOutlined />}
        className="quick-action-btn"
        title="图片"
      />
    </Space>
  );

  // 自定义快捷按钮 - 客服版
  const customerServiceQuickActions = (
    <Space size={4}>
      <Button
        type="text"
        size="small"
        icon={<SmileOutlined />}
        className="quick-action-btn"
        title="表情"
      />
      <Button
        type="text"
        size="small"
        icon={<PictureOutlined />}
        className="quick-action-btn"
        title="图片"
      />
      <Button
        type="text"
        size="small"
        icon={<FileOutlined />}
        className="quick-action-btn"
        title="文件"
      />
      <Button
        type="text"
        size="small"
        icon={<GiftOutlined />}
        className="quick-action-btn"
        title="发送优惠券"
      />
      <Button
        type="text"
        size="small"
        icon={<CustomerServiceOutlined />}
        className="quick-action-btn"
        title="转人工客服"
      />
    </Space>
  );

  // 自定义快捷按钮 - 增强版
  const advancedQuickActions = (
    <Space size={4}>
      <Button
        type="text"
        size="small"
        icon={<SmileOutlined />}
        className="quick-action-btn"
        title="表情"
      />
      <Button
        type="text"
        size="small"
        icon={<PictureOutlined />}
        className="quick-action-btn"
        title="图片"
      />
      <Button
        type="text"
        size="small"
        icon={<FileOutlined />}
        className="quick-action-btn"
        title="文件"
      />
      <Button
        type="text"
        size="small"
        icon={<ThunderboltOutlined />}
        className="quick-action-btn"
        title="快捷回复"
      />
      <Button
        type="text"
        size="small"
        icon={<ClockCircleOutlined />}
        className="quick-action-btn"
        title="定时发送"
      />
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="1" icon={<GiftOutlined />}>
              发送优惠券
            </Menu.Item>
            <Menu.Item key="2" icon={<CustomerServiceOutlined />}>
              转人工客服
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3">
              更多功能
            </Menu.Item>
          </Menu>
        }
        trigger={['click']}
      >
        <Button
          type="text"
          size="small"
          icon={<MoreOutlined />}
          className="quick-action-btn"
          title="更多"
        />
      </Dropdown>
    </Space>
  );

  return (
    <div style={{ padding: '20px', background: '#f5f5f5' }}>
      <h3>MessageInput 使用示例</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>默认快捷按钮</h4>
        <div style={{ background: '#fff', borderRadius: '8px' }}>
          <MessageInput onSend={handleSend} />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>基础自定义快捷按钮</h4>
        <div style={{ background: '#fff', borderRadius: '8px' }}>
          <MessageInput 
            onSend={handleSend} 
            quickActions={basicQuickActions}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>客服版快捷按钮</h4>
        <div style={{ background: '#fff', borderRadius: '8px' }}>
          <MessageInput 
            onSend={handleSend} 
            quickActions={customerServiceQuickActions}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>增强版快捷按钮（含下拉菜单）</h4>
        <div style={{ background: '#fff', borderRadius: '8px' }}>
          <MessageInput 
            onSend={handleSend} 
            quickActions={advancedQuickActions}
          />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>禁用快捷按钮</h4>
        <div style={{ background: '#fff', borderRadius: '8px' }}>
          <MessageInput 
            onSend={handleSend} 
            showDefaultQuickActions={false}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageInputExample; 