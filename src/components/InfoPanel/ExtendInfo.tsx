import React, { useState, useEffect } from 'react';
import { List, Badge, Spin } from 'antd';
import { ExtendInfoItem } from '../../types/chat';
import { ChatAPI } from '../../services/mockData';
import './ExtendInfo.css';

interface ExtendInfoProps {
  sessionId?: string;
}

const ExtendInfo: React.FC<ExtendInfoProps> = ({ sessionId }) => {
  const [extendInfo, setExtendInfo] = useState<ExtendInfoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (sessionId) {
      loadExtendInfo(sessionId);
    }
  }, [sessionId]);

  const loadExtendInfo = async (sessionId: string) => {
    setIsLoading(true);
    try {
      const info = await ChatAPI.getExtendInfo(sessionId);
      setExtendInfo(info);
    } catch (error) {
      console.error('加载扩展信息失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="extend-info-loading">
        <Spin size="small" />
        <span>加载中...</span>
      </div>
    );
  }

  if (extendInfo.length === 0) {
    return (
      <div className="extend-info-empty">
        请选择会话查看扩展信息
      </div>
    );
  }

  return (
    <div className="extend-info">
      <List
        size="small"
        dataSource={extendInfo}
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
};

export default ExtendInfo; 