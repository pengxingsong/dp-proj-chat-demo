import React, { useState, useRef, useEffect } from 'react';
import {
  Input,
  Button,
  Upload,
  message as antdMessage,
  Space,
  Popover,
} from 'antd';
import {
  SendOutlined,
  DeleteOutlined,
  SmileOutlined,
  PictureOutlined,
  FileOutlined,
  ClearOutlined,
} from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';
import '../css/MessageInput.css';

const { TextArea } = Input;

interface MessageInputProps {
  onSend: (message: string, files?: File[]) => Promise<void>;
  isLoading?: boolean;
  /**
   * 快捷按钮组件
   */
  quickActions?: React.ReactNode;
  /**
   * 是否显示默认快捷按钮
   */
  showDefaultQuickActions?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  isLoading = false,
  quickActions,
  showDefaultQuickActions = true,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [shouldFocusAtEnd, setShouldFocusAtEnd] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pendingFiles.length > 0) {
        e.preventDefault();
        e.returnValue =
          '本地上传的文件仅当前会话可见，刷新页面后将丢失，是否继续？';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pendingFiles]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && emojiPickerVisible) {
        setEmojiPickerVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [emojiPickerVisible]);

  // 处理光标定位到最后
  useEffect(() => {
    if (shouldFocusAtEnd && textAreaRef.current) {
      const textarea = textAreaRef.current;
      textarea.selectionStart = textarea.selectionEnd = inputValue.length;
      textarea.focus();
      setShouldFocusAtEnd(false);
    }
  }, [inputValue, shouldFocusAtEnd]);

  const handleSend = async () => {
    if (!inputValue.trim() && pendingFiles.length === 0) return;

    try {
      await onSend(inputValue, pendingFiles);
      setInputValue('');
      setPendingFiles([]);
      // 发送消息后关闭表情面板
      setEmojiPickerVisible(false);
    } catch (error) {
      console.error('发送消息失败:', error);
      antdMessage.error('发送失败，请重试');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (file: File) => {
    setPendingFiles((prev) => [...prev, file]);
    return false; // 阻止默认上传行为
  };

  const handleRemoveFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 处理表情选择
  const handleEmojiSelect = (emojiData: any) => {
    if (!emojiData || !emojiData.emoji) {
      return;
    }

    const emoji = emojiData.emoji;

    // 始终添加到末尾，确保光标在最后
    setInputValue((prev) => prev + emoji);
    setShouldFocusAtEnd(true);
  };

  const handleClearInput = () => {
    setInputValue('');
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  };

  // 默认快捷按钮
  const defaultQuickActions = (
    <Space size={4}>
      <Popover
        content={
          <EmojiPicker
            onEmojiClick={handleEmojiSelect}
            width={320}
            height={400}
            searchDisabled={false}
            skinTonesDisabled={true}
            previewConfig={{
              showPreview: false,
            }}
          />
        }
        trigger="click"
        placement="topLeft"
        open={emojiPickerVisible}
        onOpenChange={setEmojiPickerVisible}
        destroyTooltipOnHide={true}
        overlayStyle={{ zIndex: 1050 }}
      >
        <Button
          type="text"
          size="small"
          icon={<SmileOutlined />}
          className="webchat-quick-action-btn"
          title="表情"
        />
      </Popover>
      <Button
        type="text"
        size="small"
        icon={<ClearOutlined />}
        className="webchat-quick-action-btn"
        title="清空输入框"
        onClick={handleClearInput}
        disabled={!inputValue.trim()}
      />
      <Upload
        beforeUpload={handleFileUpload}
        showUploadList={false}
        accept="image/*"
      >
        <Button
          type="text"
          size="small"
          icon={<PictureOutlined />}
          className="webchat-quick-action-btn"
          title="图片"
          disabled={isLoading}
        />
      </Upload>
      <Upload beforeUpload={handleFileUpload} showUploadList={false} multiple>
        <Button
          type="text"
          size="small"
          icon={<FileOutlined />}
          className="webchat-quick-action-btn"
          title="文件"
          disabled={isLoading}
        />
      </Upload>
    </Space>
  );

  return (
    <div className="webchat-message-input-container">
      {pendingFiles.length > 0 && (
        <div className="webchat-pending-files">
          {pendingFiles.map((file, index) => (
            <div key={index} className="webchat-pending-file">
              <span className="webchat-file-name">{file.name}</span>
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveFile(index)}
              />
            </div>
          ))}
        </div>
      )}

      {/* 快捷按钮区域 */}
      {(quickActions || showDefaultQuickActions) && (
        <div className="webchat-quick-actions-area">
          {quickActions || defaultQuickActions}
        </div>
      )}

      <div className="webchat-input-area">
        <div className="webchat-input-wrapper">
          <TextArea
            ref={textAreaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="按 Enter 发送，Shift + Enter 换行"
            autoSize={{ minRows: 3, maxRows: 5 }}
            disabled={isLoading}
            className="webchat-message-textarea"
          />

          <div className="webchat-send-button-area">
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              loading={isLoading}
              disabled={!inputValue.trim() && pendingFiles.length === 0}
              className="webchat-send-button"
              size="small"
            />
          </div>
        </div>

        <div className="webchat-input-hint">
          <span className="webchat-hint-text">
            按 Enter 发送，Shift + Enter 换行
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
