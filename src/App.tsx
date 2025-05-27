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
import type { CustomMessage } from './components/Chat';
import FloatingCollapseButton from './components/FloatingCollapseButton';
import './App.css';

const { Sider, Content } = Layout;
const { Text } = Typography;

interface SessionItem {
  id: string;
  name: string;
  lastMessage: { type: 'text' | 'image' | 'file'; content: string; fileName?: string };
  time: string;
  unread: number;
  status: 'online' | 'waiting';
  source: string;
}

const MIN_SIDER_WIDTH = 250;
const MAX_LEFT_SIDER_WIDTH = 350;
const MIN_RIGHT_SIDER_WIDTH = 300;
const MAX_RIGHT_SIDER_WIDTH = 550;

const App: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [leftWidth, setLeftWidth] = useState(220);
  const [rightWidth, setRightWidth] = useState(320);

  const mockSessions: SessionItem[] = [
    {
      id: '1',
      name: '裴先生',
      lastMessage: { type: 'text', content: '收到!您的需求，请稍等' },
      time: '16:18',
      unread: 0,
      status: 'waiting',
      source: 'WAP | 我要上天'
    },
    {
      id: '2',
      name: '李先生',
      lastMessage: { type: 'image', content: 'https://via.placeholder.com/40x40.png?text=IMG' },
      time: '16:20',
      unread: 1,
      status: 'online',
      source: 'WAP | 我要上天'
    },
    {
      id: '3',
      name: '李五',
      lastMessage: { type: 'file', content: '', fileName: '合同.pdf' },
      time: '16:22',
      unread: 2,
      status: 'online',
      source: 'WAP | 我要上天'
    },
  ];

  const initialMessages: CustomMessage[] = [
    {
      type: 'text',
      content: '您好！我是智能客服助手。请问有什么可以帮您？',
      timestamp: new Date().toLocaleTimeString(),
      from: 'ai',
    },
    {
      type: 'image',
      url: '/content/img/image.jpg',
      timestamp: new Date().toLocaleTimeString(),
      from: 'ai',
    },
    {
      type: 'file',
      fileType: 'pdf',
      url: '/content/file/[技术] MyBatis 3x.pdf',
      fileName: '[技术] MyBatis 3x.pdf',
      timestamp: new Date().toLocaleTimeString(),
      from: 'ai',
    },
    {
      type: 'file',
      fileType: 'mp3',
      url: '/content/file/huayao.mp3',
      fileName: 'huayao.mp3',
      timestamp: new Date().toLocaleTimeString(),
      from: 'ai',
    },
    {
      type: 'video',
      url: '/content/file/test1.mp4',
      fileName: 'test1.mp4',
      timestamp: new Date().toLocaleTimeString(),
      from: 'ai',
    },
    {
      type: 'office',
      fileType: 'doc',
      url: '/content/file/test1.docx',
      fileName: 'test1.docx',
      timestamp: new Date().toLocaleTimeString(),
      from: 'ai',
    },
    {
      type: 'link',
      url: 'https://www.baidu.com',
      title: '百度',
      description: '百度',
      image: '/content/img/image.jpg',
      timestamp: new Date().toLocaleTimeString(),
      from: 'ai',
    },
  ];

  const handleSendMessage = async (message: string): Promise<void> => {
    console.log('发送消息:', message);
  };

  // 拖拽左侧
  const handleLeftDrag = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = leftWidth;
    let animationFrameId: number | null = null;
    document.body.style.userSelect = 'none';
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (animationFrameId) return;
      animationFrameId = requestAnimationFrame(() => {
        const newWidth = Math.max(MIN_SIDER_WIDTH, Math.min(MAX_LEFT_SIDER_WIDTH, startWidth + (moveEvent.clientX - startX)));
        setLeftWidth(newWidth);
        animationFrameId = null;
      });
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // 拖拽右侧
  const handleRightDrag = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startWidth = rightWidth;
    let animationFrameId: number | null = null;
    document.body.style.userSelect = 'none';
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (animationFrameId) return;
      animationFrameId = requestAnimationFrame(() => {
        const delta = startX - moveEvent.clientX;
        const newWidth = Math.max(MIN_RIGHT_SIDER_WIDTH, Math.min(MAX_RIGHT_SIDER_WIDTH, startWidth + delta));
        setRightWidth(newWidth);
        animationFrameId = null;
      });
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
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
            <Text type="secondary" ellipsis>
              {item.lastMessage.type === 'text' && item.lastMessage.content}
              {item.lastMessage.type === 'image' && '[图片]'}
              {item.lastMessage.type === 'file' && `[文件] ${item.lastMessage.fileName}`}
            </Text>
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
      <Layout className="app-container" style={{ position: 'relative' }}>
        <Sider 
          width={leftCollapsed ? 0 : leftWidth}
          className={`left-sider ${leftCollapsed ? 'collapsed' : ''}`}
          trigger={null}
          collapsible
          collapsed={leftCollapsed}
          style={{ position: 'relative', zIndex: 2 }}
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
        </Sider>
        {/* 拖拽条（左侧） */}
        {!leftCollapsed && (
          <div
            className="dragger"
            style={{ left: leftWidth - 3, width: 6, cursor: 'ew-resize', position: 'absolute', top: 0, bottom: 0, zIndex: 10 }}
            onMouseDown={handleLeftDrag}
          />
        )}
        {/* 浮窗折叠/展开按钮（左侧） */}
        <FloatingCollapseButton
          side="left"
          collapsed={leftCollapsed}
          onClick={() => setLeftCollapsed(!leftCollapsed)}
        />
        <Content className="main-content" style={{ position: 'relative' }}>
          <Chat initialMessages={initialMessages} onSendMessage={handleSendMessage} />
        </Content>
        <Sider
          width={rightCollapsed ? 0 : rightWidth}
          className={`right-sider ${rightCollapsed ? 'collapsed' : ''}`}
          trigger={null}
          collapsible
          collapsed={rightCollapsed}
          style={{ position: 'relative', zIndex: 2 }}
        >
          <Tabs
            defaultActiveKey="1"
            size="small"
            style={{ minWidth: 0 }}
            tabBarGutter={8}
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
        {/* 拖拽条（右侧） */}
        {!rightCollapsed && (
          <div
            className="dragger"
            style={{ right: rightWidth - 3, width: 6, cursor: 'ew-resize', position: 'absolute', top: 0, bottom: 0, zIndex: 10 }}
            onMouseDown={handleRightDrag}
          />
        )}
        {/* 浮窗折叠/展开按钮（右侧） */}
        <FloatingCollapseButton
          side="right"
          collapsed={rightCollapsed}
          onClick={() => setRightCollapsed(!rightCollapsed)}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default App; 