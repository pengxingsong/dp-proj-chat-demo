import React from 'react';
import { Tabs } from 'antd';
import { InfoCircleOutlined, CommentOutlined, AppstoreOutlined } from '@ant-design/icons';
import VisitorInfo from './InfoPanel/VisitorInfo';
import ChatInfoPanel from './InfoPanel/ChatInfoPanel';
import ExtendInfo from './InfoPanel/ExtendInfo';
import './InfoPanel.css';

interface InfoPanelProps {
  sessionId?: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ sessionId }) => {
  return (
    <div className="info-panel-container">
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
            children: <VisitorInfo sessionId={sessionId} />,
          },
          {
            key: '2',
            label: (
              <span style={{ fontSize: '13px', lineHeight: '24px' }}>
                <CommentOutlined />
                对话信息
              </span>
            ),
            children: <ChatInfoPanel sessionId={sessionId} />,
          },
          {
            key: '3',
            label: (
              <span style={{ fontSize: '13px', lineHeight: '24px' }}>
                <AppstoreOutlined />
                扩展信息
              </span>
            ),
            children: <ExtendInfo sessionId={sessionId} />,
          },
        ]}
      />
    </div>
  );
};

export default InfoPanel; 