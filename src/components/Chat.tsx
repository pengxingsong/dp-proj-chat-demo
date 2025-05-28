import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Input, Button, Avatar, Spin, Image, Upload, message as antdMessage, Row, Col } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../types/chat';
import './Chat.css';
import { Document as PdfDocument, Page as PdfPage, pdfjs } from 'react-pdf';
// 设置 PDF.js worker 路径为 public 目录下的 pdf.worker.min.js，避免 CDN 依赖和加载失败
if (pdfjs.GlobalWorkerOptions.workerSrc !== '/pdf.worker.min.js') {
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

interface FileMessage {
  type: 'file';
  fileType: 'pdf' | 'mp3' | 'other';
  url: string;
  fileName: string;
  timestamp: string;
  from?: 'user' | 'ai';
}
interface ImageMessage {
  type: 'image';
  url: string;
  alt?: string;
  timestamp: string;
  from?: 'user' | 'ai';
}
interface TextMessage {
  type: 'text';
  content: string;
  timestamp: string;
  from?: 'user' | 'ai';
}
interface VideoMessage {
  type: 'video';
  url: string;
  fileName: string;
  timestamp: string;
  from?: 'user' | 'ai';
}
interface OfficeMessage {
  type: 'office';
  fileType: 'doc' | 'xls' | 'ppt';
  url: string;
  fileName: string;
  timestamp: string;
  from?: 'user' | 'ai';
}
interface LinkCardMessage {
  type: 'link';
  url: string;
  title: string;
  description?: string;
  image?: string;
  timestamp: string;
  from?: 'user' | 'ai';
}
type CustomMessage = TextMessage | ImageMessage | FileMessage | VideoMessage | OfficeMessage | LinkCardMessage;

interface ChatProps {
  initialMessages: CustomMessage[];
  onSendMessage: (message: string, files?: File[]) => Promise<void>;
}

const Chat: React.FC<ChatProps> = ({ initialMessages, onSendMessage }) => {
  const [messages, setMessages] = useState<CustomMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const height = container.clientHeight;
      const maxScrollTop = scrollHeight - height;
      
      container.scrollTo({
        top: maxScrollTop,
        behavior
      });
    }
  }, []);

  useEffect(() => {
    // 初始加载时立即滚动
    scrollToBottom('auto');
  }, []);

  useEffect(() => {
    // 消息更新时平滑滚动
    scrollToBottom('smooth');
  }, [messages, scrollToBottom]);

  // 刷新页面前提示用户本地文件会丢失
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pendingFiles.length > 0) {
        e.preventDefault();
        e.returnValue = '本地上传的文件仅当前会话可见，刷新页面后将丢失，是否继续？';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pendingFiles]);

  const handleSend = async () => {
    if (!inputValue.trim() && pendingFiles.length === 0) return;

    const userMessage: TextMessage = {
      type: 'text',
      content: inputValue.trim(),
      timestamp: new Date().toLocaleTimeString(),
      from: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      await onSendMessage(inputValue, pendingFiles);
      
      // 处理文件消息
      const fileMessages = pendingFiles.map(file => {
        const ext = file.name.split('.').pop()?.toLowerCase();
        const url = URL.createObjectURL(file);
        
        if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext!)) {
          return {
            type: 'image',
            url,
            timestamp: new Date().toLocaleTimeString(),
            from: 'user',
          } as ImageMessage;
        } else if (['mp3', 'wav', 'ogg'].includes(ext!)) {
          return {
            type: 'file',
            fileType: 'mp3',
            url,
            fileName: file.name,
            timestamp: new Date().toLocaleTimeString(),
            from: 'user',
          } as FileMessage;
        } else if (['pdf'].includes(ext!)) {
          return {
            type: 'file',
            fileType: 'pdf',
            url,
            fileName: file.name,
            timestamp: new Date().toLocaleTimeString(),
            from: 'user',
          } as FileMessage;
        } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext!)) {
          return {
            type: 'office',
            fileType: ext as any,
            url,
            fileName: file.name,
            timestamp: new Date().toLocaleTimeString(),
            from: 'user',
          } as OfficeMessage;
        } else if (['mp4', 'webm', 'ogg'].includes(ext!)) {
          return {
            type: 'video',
            url,
            fileName: file.name,
            timestamp: new Date().toLocaleTimeString(),
            from: 'user',
          } as VideoMessage;
        } else {
          return {
            type: 'file',
            fileType: 'other',
            url,
            fileName: file.name,
            timestamp: new Date().toLocaleTimeString(),
            from: 'user',
          } as FileMessage;
        }
      });

      setMessages(prev => [...prev, ...fileMessages]);
      setPendingFiles([]);
      
      // 模拟AI回复
      const aiMessage: TextMessage = {
        type: 'text',
        content: '收到您的需求，请稍等',
        timestamp: new Date().toLocaleTimeString(),
        from: 'ai',
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (file: File) => {
    setPendingFiles(prev => [...prev, file]);
    return false; // 阻止自动上传
  };

  const handleRemoveFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderMessage = (message: CustomMessage) => {
    return (
      <div key={message.timestamp} className={`message-wrapper ${message.from === 'user' ? 'user' : 'ai'}`}>
        <div className="message-avatar">
          <Avatar
            icon={message.from === 'user' ? <UserOutlined /> : <RobotOutlined />}
            className={message.from === 'user' ? 'user-avatar' : 'ai-avatar'}
          />
        </div>
        <div className="message-content">
          <div className="message-bubble">
            {message.type === 'text' && (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            )}
            {message.type === 'image' && (
              <ImageThumb url={message.url} alt={message.alt || '图片'} />
            )}
            {message.type === 'file' && (
              <div style={{ width: message.fileType === 'mp3' ? 220 : 300 }}>
                <div style={{ fontSize: 13, marginBottom: 4 }}>
                  <span role="img" aria-label="file" style={{ marginRight: 4 }}>📎</span>
                  {message.fileName}
                </div>
                {message.fileType === 'mp3' ? (
                  <>
                    <audio controls style={{ width: 220, height: 32 }}>
                      <source src={message.url} type="audio/mpeg" />
                      您的浏览器不支持音频播放。
                    </audio>
                    <div>
                      <a href={message.url} download target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
                        下载
                      </a>
                    </div>
                  </>
                ) : (
                  <a href={message.url} download target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
                    下载
                  </a>
                )}
              </div>
            )}
            {message.type === 'video' && (
              <div style={{ width: 220 }}>
                <div style={{ fontSize: 13, marginBottom: 4 }}>
                  <span role="img" aria-label="video" style={{ marginRight: 4 }}>🎬</span>
                  {message.fileName}
                </div>
                <video controls style={{ width: 220, height: 160, objectFit: 'cover', borderRadius: 4 }}>
                  <source src={message.url} type="video/mp4" />
                  您的浏览器不支持视频播放。
                </video>
                <div>
                  <a href={message.url} download target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                    下载
                  </a>
                </div>
              </div>
            )}
            {message.type === 'office' && (
              <div style={{ width: 180 }}>
                <div style={{ fontSize: 13, marginBottom: 4 }}>
                  <span role="img" aria-label={message.fileType} style={{ marginRight: 4 }}>📄</span>
                  {message.fileName}
                </div>
                <a href={message.url} download target="_blank" rel="noopener noreferrer" style={{ fontSize: 12 }}>
                  下载
                </a>
              </div>
            )}
            {message.type === 'link' && (
              <a href={message.url} target="_blank" rel="noopener noreferrer" className="link-card" style={{ display: 'flex', alignItems: 'center', width: 220, textDecoration: 'none', border: '1px solid #eee', borderRadius: 6, padding: 8, margin: '4px 0', background: '#fafbfc' }}>
                {message.image && <img src={message.image} alt={message.title} style={{ width: 40, height: 40, marginRight: 8, borderRadius: 4 }} />}
                <div>
                  <div style={{ fontWeight: 600, color: '#333' }}>{message.title}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{message.description}</div>
                </div>
              </a>
            )}
          </div>
          <div className="message-timestamp">{message.timestamp}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">
          <span className="status-dot online"></span>
          当前对话中
        </div>
      </div>
      
      <div className="messages-container" ref={messagesContainerRef}>
        {messages.map((message, idx) => renderMessage(message))}
        {isLoading && (
          <div className="message-wrapper ai">
            <div className="message-avatar">
              <Avatar icon={<RobotOutlined />} className="ai-avatar" />
            </div>
            <div className="message-content">
              <div className="message-bubble loading">
                <Spin size="small" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="input-area">
          <Row gutter={8} align="middle">
            <Col flex="auto">
              <Input.TextArea
                ref={textAreaRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="按 Enter 发送，Shift + Enter 换行"
                autoSize={{ minRows: 3, maxRows: 8 }}
              />
            </Col>
            <Col>
              <div className="action-buttons">
                <Upload
                  beforeUpload={handleFileUpload}
                  showUploadList={false}
                  multiple={true}
                >
                  <Button icon={<UploadOutlined />} block>上传</Button>
                </Upload>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSend}
                  disabled={(!inputValue.trim() && pendingFiles.length === 0) || isLoading}
                  block
                >
                  发送
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        
        {pendingFiles.length > 0 && (
          <div className="pending-files">
            {pendingFiles.map((file, index) => (
              <div key={index} className="pending-file-item">
                <span className="file-name">{file.name}</span>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveFile(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// 新增图片缩略图自适应组件
const ImageThumb: React.FC<{ url: string; alt?: string }> = ({ url, alt }) => {
  const [ratio, setRatio] = useState<'landscape' | 'portrait'>('landscape');
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setRatio(img.naturalWidth >= img.naturalHeight ? 'landscape' : 'portrait');
      }
    };
    img.src = url;
  }, [url]);
  const style = useMemo(() => ratio === 'landscape'
    ? { width: 240, height: 160 }
    : { width: 120, height: 180 }, [ratio]);
  return (
    <div style={{
      ...style,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
      overflow: 'hidden',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <Image
        src={url}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        preview={{ mask: '点击预览' }}
        fallback="/img/placeholder.png"
      />
    </div>
  );
};

export default Chat;
export type { CustomMessage }; 