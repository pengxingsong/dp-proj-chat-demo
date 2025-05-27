import React from 'react';
import { Tabs, Descriptions, Badge, Rate, List, Typography, Button } from 'antd';
import { InfoCircleOutlined, CommentOutlined, AppstoreOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import './InfoPanel.css';

const { Text } = Typography;

interface InfoPanelProps {
  rightCollapsed: boolean;
  onCollapse: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  rightCollapsed,
  onCollapse,
}) => {
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
    <div className={`right-sider ${rightCollapsed ? 'collapsed' : ''}`}>
      <Button 
        type="text"
        className="collapse-trigger right-trigger"
        onClick={onCollapse}
        icon={rightCollapsed ? <LeftOutlined /> : <RightOutlined />}
      />
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
    </div>
  );
};

export default InfoPanel; 