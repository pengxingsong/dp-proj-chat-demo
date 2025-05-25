import React, { useState } from 'react';
import { ConfigProvider, Layout, List, Avatar, Badge, Tabs, Card, Typography, Button, Descriptions, Rate } from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  MessageOutlined, 
  InfoCircleOutlined, 
  CommentOutlined, 
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import Chat from './components/Chat';
import type { Message } from './types/chat';
import './App.css';

const { Sider, Content } = Layout;
const { Text } = Typography;

interface SessionItem {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'online' | 'waiting';
  source: string;
}

const App: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const mockSessions: SessionItem[] = [
    {
      id: '1',
      name: '裴先生',
      lastMessage: '收到!您的需求，请稍等',
      time: '16:18',
      unread: 0,
      status: 'waiting',
      source: 'WAP | 晨光科力普办公用品'
    },
    {
      id: '2',
      name: '李先生',
      lastMessage: '您好，收到，请稍等！',
      time: '16:20',
      unread: 1,
      status: 'online',
      source: 'WAP | 晨光科力普办公用品'
    },
    // 可以添加更多模拟会话
  ];

  const initialMessages: Message[] = [
    {
      type: 'ai',
      content: '您好！我是智能客服助手。请问有什么可以帮您？',
      timestamp: new Date().toLocaleTimeString(),
    },
  ];

  const handleSendMessage = async (message: string): Promise<void> => {
    console.log('发送消息:', message);
  };

  const renderSessionItem = (item: SessionItem) => (
    <List.Item 
      key={item.id}
      className={`session-item ${selectedSession === item.id ? 'selected' : ''}`}
      onClick={() => setSelectedSession(item.id)}
    >
      <List.Item.Meta
        avatar={
          <Badge dot={item.status === 'waiting'} color={item.status === 'waiting' ? 'red' : 'green'}>
            <Avatar icon={<UserOutlined />} />
          </Badge>
        }
        title={
          <div className="session-title">
            <Text strong>{item.name}</Text>
            <Text type="secondary" className="session-time">{item.time}</Text>
          </div>
        }
        description={
          <div className="session-desc">
            <Text type="secondary" ellipsis>{item.lastMessage}</Text>
            <div className="session-source">{item.source}</div>
          </div>
        }
      />
    </List.Item>
  );

  const renderVisitorInfo = () => (
    <div className="visitor-info">
      <Descriptions column={1} size="small">
        <Descriptions.Item label="会话ID">
          <Text copyable>c2ac23e0-1c2e-11f0-8014</Text>
        </Descriptions.Item>
        <Descriptions.Item label="访客来源">WAP</Descriptions.Item>
        <Descriptions.Item label="对话次数">4</Descriptions.Item>
        <Descriptions.Item label="接入时间">{new Date().toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="客户姓名">何先生</Descriptions.Item>
        <Descriptions.Item label="联系方式">138****1234</Descriptions.Item>
      </Descriptions>
    </div>
  );

  const renderChatInfo = () => (
    <div className="chat-info">
      <Descriptions column={1} size="small">
        <Descriptions.Item label="当前状态">
          <Badge status="processing" text="对话中" />
        </Descriptions.Item>
        <Descriptions.Item label="等待时长">2分钟</Descriptions.Item>
        <Descriptions.Item label="会话时长">5分钟</Descriptions.Item>
        <Descriptions.Item label="消息数">
          <div className="message-count">
            <span>访客消息：3条</span>
            <span>客服消息：4条</span>
          </div>
        </Descriptions.Item>
        <Descriptions.Item label="对话质量">
          <Rate disabled defaultValue={4} />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  const renderExtendInfo = () => (
    <div className="extend-info">
      <List
        size="small"
        dataSource={[
          { title: '历史订单', count: 5 },
          { title: '未完成订单', count: 1 },
          { title: '购物车商品', count: 2 },
          { title: '收藏商品', count: 8 },
        ]}
        renderItem={item => (
          <List.Item>
            <div className="extend-item">
              <span>{item.title}</span>
              <Badge count={item.count} style={{ backgroundColor: '#52c41a' }} />
            </div>
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <ConfigProvider locale={zhCN}>
      <Layout className="app-container">
        <Sider 
          width={leftCollapsed ? 80 : 320} 
          className={`left-sider ${leftCollapsed ? 'collapsed' : ''}`}
          trigger={null}
          collapsible
          collapsed={leftCollapsed}
        >
          {!leftCollapsed && (
            <>
              <div className="session-header">
                <Tabs
                  defaultActiveKey="all"
                  size="small"
                  tabBarStyle={{ height: '40px', margin: 0 }}
                  items={[
                    { 
                      key: 'all', 
                      label: (
                        <span style={{ fontSize: '13px', lineHeight: '24px' }}>全部(16)</span>
                      )
                    },
                    { 
                      key: 'waiting', 
                      label: (
                        <span style={{ fontSize: '13px', lineHeight: '24px' }}>留言(0)</span>
                      )
                    },
                  ]}
                />
              </div>
              <div className="session-list">
                <List
                  dataSource={mockSessions}
                  renderItem={renderSessionItem}
                />
              </div>
            </>
          )}
          {leftCollapsed && (
            <div className="collapsed-menu">
              <Button type="text" icon={<UserOutlined />} />
              <Button type="text" icon={<CommentOutlined />} />
              <Button type="text" icon={<AppstoreOutlined />} />
            </div>
          )}
          <Button 
            type="text"
            className="collapse-trigger left-trigger"
            onClick={() => setLeftCollapsed(!leftCollapsed)}
            icon={leftCollapsed ? <RightOutlined /> : <LeftOutlined />}
          />
        </Sider>
        <Content className="chat-content">
          <Chat 
            initialMessages={initialMessages}
            onSendMessage={handleSendMessage}
          />
        </Content>
        <Sider 
          width={rightCollapsed ? 0 : "35%"} 
          className={`right-sider ${rightCollapsed ? 'collapsed' : ''}`}
          trigger={null}
          collapsible
          collapsed={rightCollapsed}
        >
          <Button 
            type="text"
            className="collapse-trigger right-trigger"
            onClick={() => setRightCollapsed(!rightCollapsed)}
            icon={rightCollapsed ? <LeftOutlined /> : <RightOutlined />}
          />
          <Tabs
            defaultActiveKey="1"
            size="small"
            tabBarStyle={{ height: '40px', margin: 0 }}
            items={[
              {
                key: '1',
                label: (
                  <span style={{ fontSize: '13px', lineHeight: '24px' }}>
                    <InfoCircleOutlined />
                    访客信息
                  </span>
                ),
                children: renderVisitorInfo(),
              },
              {
                key: '2',
                label: (
                  <span style={{ fontSize: '13px', lineHeight: '24px' }}>
                    <CommentOutlined />
                    对话信息
                  </span>
                ),
                children: renderChatInfo(),
              },
              {
                key: '3',
                label: (
                  <span style={{ fontSize: '13px', lineHeight: '24px' }}>
                    <AppstoreOutlined />
                    扩展信息
                  </span>
                ),
                children: renderExtendInfo(),
              },
            ]}
          />
        </Sider>
      </Layout>
    </ConfigProvider>
  );
};

export default App; 