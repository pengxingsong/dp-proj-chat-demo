import React, { useState, useEffect } from 'react';
import { ConfigProvider, Layout } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { useResize } from './hooks/useResize';
import { useSessions } from './hooks/useSessions';
import UserSessionList from './components/UserSessionList';
import ChatWindow from './components/ChatWindow';
import InfoPanel from './components/InfoPanel';
import FloatingCollapseButton from './components/FloatingCollapseButton';
import './css/Chat.css';
const { Sider, Content } = Layout;

const MIN_LEFT_WIDTH = 180;
const MAX_LEFT_WIDTH = 320;
const INITIAL_LEFT_WIDTH = 280;
const MIN_RIGHT_WIDTH = 400;
const MAX_RIGHT_WIDTH = 600;
const INITIAL_RIGHT_WIDTH = 500;

const DemoChat: React.FC = () => {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null,
  );
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  // 获取会话列表，用于自动选中第一个会话
  const { sessions, isLoading } = useSessions();

  const { width: leftWidth, handleDrag: handleLeftDrag } = useResize({
    initialWidth: INITIAL_LEFT_WIDTH,
    minWidth: MIN_LEFT_WIDTH,
    maxWidth: MAX_LEFT_WIDTH,
    direction: 'left',
  });

  const { width: rightWidth, handleDrag: handleRightDrag } = useResize({
    initialWidth: INITIAL_RIGHT_WIDTH,
    minWidth: MIN_RIGHT_WIDTH,
    maxWidth: MAX_RIGHT_WIDTH,
    direction: 'right',
  });

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  // 自动选中第一个会话
  useEffect(() => {
    if (!isLoading && sessions.length > 0 && !selectedSessionId) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [isLoading, sessions, selectedSessionId]);

  return (
    <ConfigProvider locale={zhCN}>
      <Layout
        className="webchat-app-container"
        style={{ position: 'relative' }}
      >
        <Sider
          width={leftCollapsed ? 0 : leftWidth}
          className={`webchat-left-sider ${leftCollapsed ? 'collapsed' : ''}`}
          trigger={null}
          collapsible
          collapsed={leftCollapsed}
          style={{ position: 'relative', zIndex: 2 }}
        >
          {!leftCollapsed && (
            <UserSessionList
              onSessionSelect={handleSessionSelect}
              selectedSessionId={selectedSessionId}
            />
          )}
        </Sider>

        {/* 拖拽条（左侧） */}
        {!leftCollapsed && (
          <div
            className="webchat-dragger"
            style={{
              left: leftWidth - 3,
              width: 6,
              cursor: 'ew-resize',
              position: 'absolute',
              top: 0,
              bottom: 0,
              zIndex: 10,
            }}
            onMouseDown={handleLeftDrag}
          />
        )}

        {/* 浮窗折叠/展开按钮（左侧） */}
        <FloatingCollapseButton
          side="left"
          collapsed={leftCollapsed}
          onClick={() => setLeftCollapsed(!leftCollapsed)}
        />

        <Content
          className="webchat-main-content"
          style={{ position: 'relative' }}
        >
          <ChatWindow sessionId={selectedSessionId || undefined} />
        </Content>

        <Sider
          width={rightCollapsed ? 0 : rightWidth}
          className={`webchat-right-sider ${rightCollapsed ? 'collapsed' : ''}`}
          trigger={null}
          collapsible
          collapsed={rightCollapsed}
          style={{ position: 'relative', zIndex: 2 }}
        >
          {!rightCollapsed && (
            <InfoPanel sessionId={selectedSessionId || undefined} />
          )}
        </Sider>

        {/* 拖拽条（右侧） */}
        {!rightCollapsed && (
          <div
            className="webchat-dragger"
            style={{
              right: rightWidth - 3,
              width: 6,
              cursor: 'ew-resize',
              position: 'absolute',
              top: 0,
              bottom: 0,
              zIndex: 10,
            }}
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

export default DemoChat;
