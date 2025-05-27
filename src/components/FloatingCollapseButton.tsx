import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import './FloatingCollapseButton.css';

interface FloatingCollapseButtonProps {
  side: 'left' | 'right';
  collapsed: boolean;
  onClick: () => void;
}

const FloatingCollapseButton: React.FC<FloatingCollapseButtonProps> = ({ side, collapsed, onClick }) => {
  return (
    <div
      className={`floating-collapse-btn ${side}`}
      onClick={onClick}
      style={{
        position: 'fixed',
        [side]: 0,
        bottom: 40,
        zIndex: 10000,
      }}
    >
      {side === 'left'
        ? (collapsed ? <RightOutlined /> : <LeftOutlined />)
        : (collapsed ? <LeftOutlined /> : <RightOutlined />)
      }
    </div>
  );
};

export default FloatingCollapseButton; 