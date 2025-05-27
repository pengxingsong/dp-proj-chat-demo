import React from 'react';
import { Tabs, List, Badge } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './SessionList.css';

interface SessionListProps {
  collapsed: boolean;
  onCollapse: () => void;
}

interface SessionItem {
  id: string;
  title: string;
  time: string;
  description: string;
  source: string;
  unread: number;
}

const SessionList: React.FC<SessionListProps> = ({ collapsed, onCollapse }) => {
  const sessions: SessionItem[] = [
    {
      id: '1',
      title: '张三的咨询',
      time: '10:30',
      description: '关于产品使用的问题咨询',
      source: '来自首页',
      unread: 2,
    },
    {
      id: '2',
      title: '李四的咨询',
      time: '11:20',
      description: '售后服务相关问题',
      source: '来自产品页',
      unread: 0,
    },
  ];

  return (
    <div className={`left-sider ${collapsed ? 'collapsed' : ''}`}>
      <div className="collapse-trigger left-trigger" onClick={onCollapse}>
        {collapsed ? <RightOutlined /> : <LeftOutlined />}
      </div>
      <div className="session-header">
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: '全部会话',
            },
            {
              key: '2',
              label: '未读会话',
            },
          ]}
        />
      </div>
      <div className="session-list">
        <List
          dataSource={sessions}
          renderItem={(item) => (
            <div className="session-item">
              <div className="session-title">
                <span>{item.title}</span>
                <span className="session-time">{item.time}</span>
              </div>
              <div className="session-desc">{item.description}</div>
              <div className="session-source">{item.source}</div>
              {item.unread > 0 && (
                <Badge count={item.unread} style={{ marginTop: 8 }} />
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default SessionList; 