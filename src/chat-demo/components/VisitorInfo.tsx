import React, { useState, useEffect } from 'react';
import { Descriptions, Typography, Spin } from 'antd';
import { VisitorInfo as VisitorInfoType } from '../types/chat';
import { ChatAPI } from '../mockData';
import '../css/VisitorInfo.css';

const { Text } = Typography;

interface VisitorInfoProps {
  sessionId?: string;
}

const VisitorInfo: React.FC<VisitorInfoProps> = ({ sessionId }) => {
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfoType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (sessionId) {
      loadVisitorInfo(sessionId);
    }
  }, [sessionId]);

  const loadVisitorInfo = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const info = await ChatAPI.getVisitorInfo(sessionId);
      setVisitorInfo(info);
    } catch (error) {
      console.error('加载访客信息失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="webchat-visitor-info-loading">
        <Spin size="small" />
        <span>加载中...</span>
      </div>
    );
  }

  if (!visitorInfo) {
    return (
      <div className="webchat-visitor-info-empty">请选择会话查看访客信息</div>
    );
  }

  return (
    <div className="webchat-visitor-info">
      <Descriptions column={1} size="small">
        <Descriptions.Item label="会话ID">
          <Text copyable>{visitorInfo.sessionId}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="访客来源">
          {visitorInfo.source}
        </Descriptions.Item>
        <Descriptions.Item label="对话次数">
          {visitorInfo.chatCount}
        </Descriptions.Item>
        <Descriptions.Item label="接入时间">
          {visitorInfo.accessTime}
        </Descriptions.Item>
        <Descriptions.Item label="客户姓名">
          {visitorInfo.customerName}
        </Descriptions.Item>
        <Descriptions.Item label="联系方式">
          {visitorInfo.contactInfo}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default VisitorInfo;
