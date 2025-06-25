import React, { useState } from 'react';
import { Image, Button, Card, Row, Col } from 'antd';
import {
  PlayCircleOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FilePptOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { CustomMessage } from '../types/chat';
import '../css/MessageItem.css';

interface MessageItemProps {
  message: CustomMessage;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#f40' }} />;
      case 'doc':
      case 'docx':
        return <FileWordOutlined style={{ color: '#2f54eb' }} />;
      case 'xls':
      case 'xlsx':
        return <FileExcelOutlined style={{ color: '#52c41a' }} />;
      case 'ppt':
      case 'pptx':
        return <FilePptOutlined style={{ color: '#fa8c16' }} />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <PlayCircleOutlined style={{ color: '#722ed1' }} />;
      default:
        return <FileTextOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    switch (message.type) {
      case 'text':
        return <div className="webchat-text-message">{message.content}</div>;

      case 'image':
        return (
          <div className="webchat-image-message">
            <div className="webchat-image-content">
              {!imageError ? (
                <Image
                  src={message.url}
                  alt={message.alt}
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    borderRadius: '8px',
                  }}
                  onError={handleImageError}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+5Jw4EdQFIBzCQlMdAhbUCgaQNlC1C1AC1iwl5FGhbBQsWgAOcwKGTWgCC3QC1kwl5lqt1yNpNJVvpVYXz1rq84L17RZMjYQNf++j56iMaM30"
                />
              ) : (
                <div className="webchat-image-error">图片加载失败</div>
              )}
            </div>
          </div>
        );

      case 'file':
        return (
          <div
            className="webchat-file-message"
            style={{
              width: message.fileType === 'mp3' ? 240 : 260,
              maxWidth: '100%',
            }}
          >
            <div className="webchat-file-content">
              <div className="webchat-file-header">
                {getFileIcon(message.fileType)}
                <div className="webchat-file-name">{message.fileName}</div>
              </div>
              {message.fileType === 'mp3' && (
                <audio
                  controls
                  className="webchat-file-audio"
                  style={{ width: '100%', maxWidth: '100%', height: 32 }}
                >
                  <source src={message.url} type="audio/mpeg" />
                  您的浏览器不支持音频播放。
                </audio>
              )}
              <div className="webchat-file-actions">
                <Button
                  type="link"
                  size="small"
                  onClick={() => handleDownload(message.url, message.fileName)}
                  className="webchat-download-link"
                >
                  下载
                </Button>
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div
            className="webchat-video-message"
            style={{ width: 240, maxWidth: '100%' }}
          >
            <div className="webchat-video-content">
              <div className="webchat-video-header">
                <PlayCircleOutlined
                  style={{
                    color: '#722ed1',
                    fontSize: '16px',
                    marginRight: '8px',
                  }}
                />
                <span className="webchat-video-name">{message.fileName}</span>
              </div>
              <video
                controls
                className="webchat-video-player"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  height: 160,
                  objectFit: 'cover',
                  borderRadius: '4px',
                }}
              >
                <source src={message.url} type="video/mp4" />
                您的浏览器不支持视频播放。
              </video>
              <div className="webchat-video-actions">
                <Button
                  type="link"
                  size="small"
                  onClick={() => handleDownload(message.url, message.fileName)}
                  className="webchat-download-link"
                >
                  下载
                </Button>
              </div>
            </div>
          </div>
        );

      case 'office':
        return (
          <div className="webchat-office-message" style={{ width: 180 }}>
            <div className="webchat-office-content">
              <div className="webchat-office-header">
                {getFileIcon(message.fileType)}
                <div className="webchat-office-name">{message.fileName}</div>
              </div>
              <div className="webchat-office-actions">
                <Button
                  type="link"
                  size="small"
                  onClick={() => handleDownload(message.url, message.fileName)}
                  className="webchat-download-link"
                >
                  下载
                </Button>
              </div>
            </div>
          </div>
        );

      case 'link':
        return (
          <div className="webchat-link-message">
            <Card
              size="small"
              style={{ cursor: 'pointer', width: 300, maxWidth: '100%' }}
              onClick={() => window.open(message.url, '_blank')}
              hoverable
            >
              <Row gutter={12}>
                {message.image && (
                  <Col span={6}>
                    <Image
                      src={message.image}
                      alt={message.title}
                      width={60}
                      height={60}
                      style={{ objectFit: 'cover' }}
                    />
                  </Col>
                )}
                <Col span={message.image ? 18 : 24}>
                  <div className="webchat-link-content">
                    <div className="webchat-link-title">
                      <LinkOutlined style={{ marginRight: '4px' }} />
                      {message.title}
                    </div>
                    {message.description && (
                      <div className="webchat-link-description">
                        {message.description}
                      </div>
                    )}
                    {/* <div className="link-url">{message.url}</div> */}
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        );

      default:
        return <div className="webchat-unknown-message">未知消息类型</div>;
    }
  };

  return <div className="webchat-message-item">{renderContent()}</div>;
};

export default MessageItem;
