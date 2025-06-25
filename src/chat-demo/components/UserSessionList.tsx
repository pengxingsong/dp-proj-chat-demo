import React, { useEffect } from 'react';
import { List, Tabs, Spin } from 'antd';
import { useSessions } from '../hooks/useSessions';
import SessionItem from './UserSessionItem';
import '../css/UserSessionList.css';

interface SessionListProps {
  onSessionSelect: (sessionId: string) => void;
  selectedSessionId?: string | null;
}

const SessionList: React.FC<SessionListProps> = ({
  onSessionSelect,
  selectedSessionId: externalSelectedSessionId,
}) => {
  const {
    sessions,
    selectedSessionId: internalSelectedSessionId,
    isLoading,
    selectSession,
  } = useSessions();

  // 同步外部选中状态到内部
  useEffect(() => {
    if (
      externalSelectedSessionId &&
      externalSelectedSessionId !== internalSelectedSessionId
    ) {
      selectSession(externalSelectedSessionId);
    }
  }, [externalSelectedSessionId, internalSelectedSessionId, selectSession]);

  // 使用外部传入的selectedSessionId，如果没有则使用内部状态
  const currentSelectedSessionId =
    externalSelectedSessionId || internalSelectedSessionId;

  const handleSessionSelect = (sessionId: string) => {
    selectSession(sessionId);
    onSessionSelect(sessionId);
  };

  return (
    <div className="webchat-session-list-container">
      <div className="webchat-session-header">
        <Tabs
          defaultActiveKey="all"
          size="small"
          tabBarStyle={{ height: '40px', margin: 0 }}
          items={[
            {
              key: 'all',
              label: (
                <span style={{ fontSize: '13px', lineHeight: '24px' }}>
                  全部(16)
                </span>
              ),
            },
            {
              key: 'waiting',
              label: (
                <span style={{ fontSize: '13px', lineHeight: '24px' }}>
                  留言(0)
                </span>
              ),
            },
          ]}
        />
      </div>

      <div className="webchat-session-list">
        {isLoading ? (
          <div className="webchat-session-loading">
            <Spin size="small" />
            <span>加载中...</span>
          </div>
        ) : (
          <List
            dataSource={sessions}
            renderItem={(session) => (
              <SessionItem
                key={session.id}
                session={session}
                isSelected={currentSelectedSessionId === session.id}
                onSelect={handleSessionSelect}
              />
            )}
          />
        )}
      </div>
    </div>
  );
};

export default SessionList;
