# ChatHeader 聊天头部组件

## 组件说明

`ChatHeader` 是一个可扩展的聊天头部组件，用于显示当前对话状态和提供快捷操作按钮。支持显示用户昵称，自动格式化为"与 [用户昵称] 对话中"的形式。

## 功能特性

- ✅ 显示对话状态（带绿色指示器动画）
- ✅ 自动显示用户昵称（"与 [用户] 对话中"格式）
- ✅ 支持自定义状态文本
- ✅ 可选的语音/视频通话按钮
- ✅ 可选的更多菜单按钮
- ✅ 支持自定义操作按钮
- ✅ 响应式设计
- ✅ TypeScript 类型安全

## Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `sessionId` | `string` | - | 当前会话ID |
| `userName` | `string` | - | 用户昵称，显示为"与 [用户昵称] 对话中" |
| `statusText` | `string` | - | 自定义状态文本（覆盖默认的用户昵称格式） |
| `showCallButtons` | `boolean` | `false` | 是否显示通话按钮 |
| `showMoreMenu` | `boolean` | `true` | 是否显示更多菜单 |
| `actions` | `React.ReactNode` | - | 自定义操作按钮 |
| `onVoiceCall` | `() => void` | - | 语音通话回调 |
| `onVideoCall` | `() => void` | - | 视频通话回调 |
| `onMoreMenuClick` | `() => void` | - | 更多菜单回调 |

## 状态文本优先级

组件会按以下优先级显示状态文本：
1. `statusText`（最高优先级）- 如果提供，直接显示
2. `userName` - 如果提供，显示为"与 [用户昵称] 对话中"
3. "当前对话中"（默认）- 没有提供任何参数时的fallback

## 基础用法

```tsx
import ChatHeader from './ChatHeader';

// 最简用法 - 显示"当前对话中"
<ChatHeader />

// 显示用户昵称 - "与 张先生 对话中"
<ChatHeader userName="张先生" />

// 自定义状态文本（覆盖用户昵称格式）
<ChatHeader 
  userName="李先生" 
  statusText="客服在线" 
/>

// 完整配置
<ChatHeader
  sessionId="session-123"
  userName="王先生"
  showCallButtons={true}
  showMoreMenu={true}
  onVoiceCall={() => console.log('语音通话')}
  onVideoCall={() => console.log('视频通话')}
  onMoreMenuClick={() => console.log('更多菜单')}
/>
```

## 在ChatWindow中的集成

```tsx
import { useSessions } from '../../hooks/useSessions';

const ChatWindow: React.FC<ChatWindowProps> = ({ sessionId }) => {
  const { selectedSession } = useSessions();
  
  return (
    <div className="chat-window-container">
      <ChatHeader
        sessionId={sessionId}
        userName={selectedSession?.name} // 自动从会话信息获取用户昵称
        showCallButtons={true}
        showMoreMenu={true}
      />
      {/* 其他组件 */}
    </div>
  );
};
```

## 自定义操作按钮

```tsx
import { Button, Dropdown, Menu } from 'antd';
import { SettingOutlined, BellOutlined } from '@ant-design/icons';

const customActions = (
  <>
    <Button
      type="text"
      size="small"
      icon={<BellOutlined />}
      className="header-action-btn"
      title="消息提醒"
    />
    <Button
      type="text"
      size="small"
      icon={<SettingOutlined />}
      className="header-action-btn"
      title="设置"
    />
  </>
);

<ChatHeader 
  userName="张先生"
  actions={customActions} 
/>
```

## 样式定制

组件使用 CSS Modules，主要的 CSS 类名：

- `.chat-header` - 头部容器
- `.chat-status` - 状态区域
- `.status-indicator` - 状态指示器（绿色圆点）
- `.status-text` - 状态文本
- `.header-action-btn` - 操作按钮

### 自定义按钮样式

```css
.header-action-btn {
  color: #8c8c8c;
  border: none;
  padding: 4px 8px;
  height: 32px;
  width: 32px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.header-action-btn:hover {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
}
```

## 扩展示例

### 添加下拉菜单

```tsx
const moreMenu = (
  <Menu>
    <Menu.Item key="1" icon={<UserOutlined />}>
      查看用户信息
    </Menu.Item>
    <Menu.Item key="2" icon={<SettingOutlined />}>
      对话设置
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3" danger>
      结束对话
    </Menu.Item>
  </Menu>
);

const customActions = (
  <Dropdown overlay={moreMenu} trigger={['click']}>
    <Button
      type="text"
      size="small"
      icon={<SettingOutlined />}
      className="header-action-btn"
    />
  </Dropdown>
);

<ChatHeader 
  userName="李先生"
  actions={customActions} 
  showMoreMenu={false} 
/>
```

### 动态状态更新

```tsx
const [userName, setUserName] = useState('');
const [status, setStatus] = useState('');

// 根据业务逻辑更新状态
useEffect(() => {
  if (isOnline) {
    setStatus(''); // 清空自定义状态，显示用户昵称格式
  } else {
    setStatus('客服离线'); // 设置自定义状态
  }
}, [isOnline]);

<ChatHeader 
  userName={userName}
  statusText={status} 
/>
```

### 不同场景的状态显示

```tsx
// 正常对话中 - "与 张先生 对话中"
<ChatHeader userName="张先生" />

// 等待接入 - 自定义状态覆盖
<ChatHeader userName="李先生" statusText="等待接入..." />

// 对话结束 - 自定义状态覆盖
<ChatHeader userName="王先生" statusText="对话已结束" />

// 客服离线 - 自定义状态覆盖
<ChatHeader userName="赵先生" statusText="客服离线" />
```

## 注意事项

1. 确保在父容器中正确引入 CSS 文件
2. 自定义按钮建议使用 `header-action-btn` 类名保持样式一致
3. 状态指示器会自动播放脉冲动画
4. 组件已适配移动端响应式设计
5. `statusText` 参数会覆盖基于 `userName` 的默认格式
6. 建议在ChatWindow中通过useSessions hook自动获取用户昵称 