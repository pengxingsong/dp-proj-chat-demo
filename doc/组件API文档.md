# 组件API文档

## ChatHeader 聊天头部组件

### 功能描述
显示当前聊天会话的状态信息，包括用户昵称、在线状态指示器以及操作按钮。

### Props接口
```typescript
interface ChatHeaderProps {
  sessionId?: string;           // 会话ID，用于获取用户信息
  statusText?: string;         // 自定义状态文本，默认为"当前对话中"
  showCallButtons?: boolean;   // 是否显示通话按钮，默认false
  showMoreMenu?: boolean;      // 是否显示更多菜单，默认false
  onVoiceCall?: () => void;    // 语音通话回调
  onVideoCall?: () => void;    // 视频通话回调
  onMoreMenuClick?: () => void; // 更多菜单点击回调
  actions?: React.ReactNode;   // 自定义操作按钮区域
}
```

### 使用示例
```tsx
import ChatHeader from './components/ChatWindow/ChatHeader';

// 基础使用
<ChatHeader sessionId="user123" />

// 完整配置
<ChatHeader
  sessionId="user123"
  statusText="与张三对话中"
  showCallButtons={true}
  showMoreMenu={true}
  onVoiceCall={() => console.log('语音通话')}
  onVideoCall={() => console.log('视频通话')}
  onMoreMenuClick={() => console.log('更多菜单')}
  actions={<Button>自定义按钮</Button>}
/>
```

### 样式定制
```css
/* 修改状态指示器颜色 */
.status-indicator {
  --indicator-color: #52c41a;
}

/* 修改标题样式 */
.chat-title {
  font-size: 16px;
  font-weight: 600;
}
```

---

## MessageInput 消息输入组件

### 功能描述
现代化的消息输入组件，支持文本输入、表情选择、文件上传等功能。

### Props接口
```typescript
interface MessageInputProps {
  onSend: (message: string, files?: File[]) => Promise<void>; // 发送消息回调
  isLoading?: boolean;                    // 是否正在发送中
  quickActions?: React.ReactNode;         // 自定义快捷按钮
  showDefaultQuickActions?: boolean;      // 是否显示默认快捷按钮
}
```

### 使用示例
```tsx
import MessageInput from './components/ChatWindow/MessageInput';

// 基础使用
<MessageInput onSend={handleSendMessage} />

// 自定义快捷按钮
<MessageInput
  onSend={handleSendMessage}
  isLoading={isSending}
  showDefaultQuickActions={false}
  quickActions={
    <Space>
      <Button icon={<SmileOutlined />} />
      <Button icon={<PictureOutlined />} />
    </Space>
  }
/>
```

### 事件处理
```typescript
const handleSendMessage = async (message: string, files?: File[]) => {
  try {
    // 处理文本消息
    if (message.trim()) {
      await sendTextMessage(message);
    }
    
    // 处理文件上传
    if (files && files.length > 0) {
      await uploadFiles(files);
    }
  } catch (error) {
    console.error('发送失败:', error);
  }
};
```

### 快捷键说明
- `Enter`: 发送消息
- `Shift + Enter`: 换行
- `Escape`: 关闭表情面板

---

## MessageItem 消息项组件

### 功能描述
渲染单条消息的组件，支持多种消息类型的显示。

### Props接口
```typescript
interface MessageItemProps {
  message: CustomMessage; // 消息数据对象
}

interface CustomMessage {
  id: string;
  type: 'text' | 'image' | 'file' | 'video' | 'office' | 'link';
  content: string;
  timestamp: number;
  sender: 'user' | 'ai';
  // 根据类型的额外字段
  url?: string;
  fileName?: string;
  fileType?: string;
  title?: string;
  description?: string;
  image?: string;
  alt?: string;
}
```

### 使用示例
```tsx
import MessageItem from './components/ChatWindow/MessageItem';

// 文本消息
const textMessage = {
  id: '1',
  type: 'text',
  content: '你好！😊',
  timestamp: Date.now(),
  sender: 'user'
};

// 图片消息
const imageMessage = {
  id: '2',
  type: 'image',
  content: '发送了一张图片',
  url: '/path/to/image.jpg',
  alt: '图片描述',
  timestamp: Date.now(),
  sender: 'user'
};

<MessageItem message={textMessage} />
<MessageItem message={imageMessage} />
```

### 支持的消息类型

#### 文本消息
```typescript
{
  type: 'text',
  content: '消息内容，支持emoji 😊'
}
```

#### 图片消息
```typescript
{
  type: 'image',
  content: '图片描述',
  url: '图片URL',
  alt: '图片替代文本'
}
```

#### 文件消息
```typescript
{
  type: 'file',
  content: '文件描述',
  url: '文件下载URL',
  fileName: '文件名.pdf',
  fileType: 'pdf'
}
```

#### 视频消息
```typescript
{
  type: 'video',
  content: '视频描述',
  url: '视频URL',
  fileName: '视频名称.mp4'
}
```

#### Office文档
```typescript
{
  type: 'office',
  content: '文档描述',
  url: '文档URL',
  fileName: '文档.docx',
  fileType: 'docx'
}
```

#### 链接消息
```typescript
{
  type: 'link',
  content: '链接描述',
  url: '链接URL',
  title: '链接标题',
  description: '链接描述',
  image: '预览图URL'
}
```

---

## MessageList 消息列表组件

### 功能描述
消息列表容器组件，负责渲染消息列表和加载状态。

### Props接口
```typescript
interface MessageListProps {
  messages: CustomMessage[];   // 消息数组
  isLoading?: boolean;        // 是否正在加载
  sessionId?: string;         // 当前会话ID
}
```

### 使用示例
```tsx
import MessageList from './components/ChatWindow/MessageList';

<MessageList
  messages={messages}
  isLoading={isTyping}
  sessionId={currentSessionId}
/>
```

### 样式定制
```css
/* 自定义消息间距 */
.messages-container {
  gap: 16px; /* 默认12px */
}

/* 自定义用户消息样式 */
.message-wrapper.user {
  margin-left: 10%;
}

/* 自定义AI消息样式 */
.message-wrapper.ai {
  margin-right: 10%;
}
```

---

## ChatWindow 聊天窗口主组件

### 功能描述
聊天窗口的主容器组件，集成头部、消息列表和输入框。

### Props接口
```typescript
interface ChatWindowProps {
  sessionId?: string;         // 当前会话ID
  className?: string;         // 自定义样式类名
}
```

### 使用示例
```tsx
import ChatWindow from './components/ChatWindow/ChatWindow';

<ChatWindow sessionId={selectedSessionId} />
```

### 内部组件层次
```
ChatWindow
├── ChatHeader          // 聊天头部
├── MessageList         // 消息列表
│   └── MessageItem[]   // 消息项数组
└── MessageInput        // 消息输入
    ├── QuickActions    // 快捷按钮
    └── SendButton      // 发送按钮
```

---

## 自定义Hooks

### useSessions

#### 功能描述
管理会话列表和当前选中会话的Hook。

#### 使用方法
```typescript
import { useSessions } from './hooks/useSessions';

const {
  sessions,           // 会话列表
  selectedSessionId,  // 当前选中会话ID
  selectedSession,    // 当前选中会话对象
  selectSession,      // 选择会话方法
  getUserName         // 获取用户名方法
} = useSessions(externalSelectedId);
```

#### 参数说明
- `externalSelectedId`: 外部传入的选中会话ID（可选）

### useMessages

#### 功能描述
管理会话消息的Hook。

#### 使用方法
```typescript
import { useMessages } from './hooks/useMessages';

const {
  messages,        // 消息列表
  isLoading,       // 加载状态
  sendMessage,     // 发送消息方法
  clearMessages    // 清空消息方法
} = useMessages(sessionId);
```

---

## 样式系统

### CSS变量
```css
:root {
  --primary-color: #1890ff;
  --border-color: #e8e8e8;
  --background-color: #f8f9fa;
  --text-color: #333;
  --hover-color: rgba(24, 144, 255, 0.1);
  
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  
  --border-radius-sm: 4px;
  --border-radius-md: 6px;
  --border-radius-lg: 8px;
  
  --button-height-sm: 24px;
  --button-height-md: 28px;
  --button-height-lg: 32px;
}
```

### 响应式断点
```css
/* 移动端 */
@media (max-width: 768px) {
  /* 样式调整 */
}

/* 平板端 */
@media (min-width: 769px) and (max-width: 1024px) {
  /* 样式调整 */
}

/* 桌面端 */
@media (min-width: 1025px) {
  /* 样式调整 */
}
```

### 主题定制
```css
/* 暗黑主题示例 */
[data-theme="dark"] {
  --primary-color: #177ddc;
  --border-color: #434343;
  --background-color: #1f1f1f;
  --text-color: #fff;
}
```

---

## 最佳实践

### 1. 组件使用
- 优先使用TypeScript接口定义Props
- 合理使用默认Props值
- 注意组件的生命周期和状态管理

### 2. 样式开发
- 使用CSS变量实现主题系统
- 遵循BEM命名规范
- 注意响应式设计的断点使用

### 3. 性能优化
- 使用React.memo优化渲染性能
- 合理使用useCallback和useMemo
- 注意事件监听器的清理

### 4. 错误处理
- 组件内部添加错误边界
- 网络请求添加异常处理
- 用户操作提供反馈信息

### 5. 可访问性
- 添加适当的ARIA标签
- 支持键盘导航
- 确保色彩对比度符合标准 