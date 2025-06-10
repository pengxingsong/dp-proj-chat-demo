# WebSocket接入方案

## 一、技术选型

### 1. WebSocket客户端库
推荐使用 `socket.io-client` 而不是原生 WebSocket，原因如下：

#### 1.1 Socket.IO支持的协议
- **WebSocket**
  - 主要传输协议
  - 全双工通信
  - 低延迟
  - 实时性好

- **HTTP长轮询**
  - 自动降级选项
  - 兼容性更好
  - 适用于不支持WebSocket的环境
  - 可配置轮询间隔

- **HTTP流式传输**
  - Server-Sent Events (SSE)
  - 单向实时通信
  - 适用于服务器推送场景
  - 自动重连机制

- **传输协议自动协商**
  - 自动选择最佳协议
  - 支持协议降级
  - 可配置传输优先级
  - 动态切换传输方式

#### 1.2 协议选择策略
```typescript
// 配置传输协议
const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling'], // 优先使用WebSocket，降级到轮询
  upgrade: true, // 允许协议升级
  rememberUpgrade: true, // 记住升级状态
  timeout: 10000, // 连接超时时间
});
```

#### 1.3 协议特点对比
| 协议类型 | 优点 | 缺点 | 适用场景 |
|---------|------|------|----------|
| WebSocket | 全双工、低延迟、实时性好 | 需要服务器支持 | 实时通信、双向数据流 |
| HTTP长轮询 | 兼容性好、实现简单 | 延迟较高、服务器压力大 | 兼容性要求高的场景 |
| SSE | 单向实时性好、自动重连 | 仅支持服务器推送 | 实时通知、状态更新 |

#### 1.4 协议选择建议
1. **默认配置**
   - 优先使用WebSocket
   - 自动降级到轮询
   - 保持最佳性能

2. **特殊场景**
   - 移动端：考虑网络切换
   - 弱网环境：优先轮询
   - 实时性要求高：强制WebSocket

3. **性能优化**
   - 合理设置超时时间
   - 配置重连策略
   - 监控协议切换

#### 1.2 原生WebSocket的局限性
- 不支持自动重连
- 需要手动处理心跳检测
- 跨浏览器兼容性问题
- 不支持房间和命名空间
- 需要自行实现消息队列
- 断线重连逻辑复杂

#### 1.3 Socket.IO的优势
- **自动重连机制**
  - 内置断线重连
  - 可配置重连策略
  - 重连状态管理

- **跨平台兼容**
  - 自动降级到长轮询
  - 浏览器兼容性好
  - 移动端支持完善

- **功能丰富**
  - 支持房间和命名空间
  - 内置事件系统
  - 支持二进制数据传输

- **开发效率**
  - API简单易用
  - 减少样板代码
  - 社区资源丰富

#### 1.4 性能对比
- **原生WebSocket**
  - 更轻量级
  - 协议开销小
  - 需要自行优化

- **Socket.IO**
  - 功能更完善
  - 开发效率高
  - 维护成本低

#### 1.4 选择Socket.IO的具体原因
1. **开发效率**
   - 减少重复代码
   - 快速实现功能
   - 降低维护成本

2. **可靠性**
   - 自动重连机制
   - 消息可靠性保证
   - 错误处理完善

3. **扩展性**
   - 支持房间概念
   - 便于功能扩展
   - 适应未来需求

4. **团队协作**
   - 文档完善
   - 社区活跃
   - 问题易解决

### 2. 状态管理
- 使用现有的 `useChat` hook 扩展
- 添加WebSocket连接状态管理
- 实现消息队列和重试机制

## 二、实现步骤

### 1. 安装依赖
```bash
npm install socket.io-client
```

### 2. 创建WebSocket服务
```typescript
// src/services/websocket.ts
import { io, Socket } from 'socket.io-client';
import { CustomMessage } from '../types/chat';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageQueue: CustomMessage[] = [];

  constructor() {
    this.init();
  }

  private init() {
    this.socket = io(process.env.REACT_APP_WS_URL || 'ws://localhost:3000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.processMessageQueue();
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.socket.on('message', (message: CustomMessage) => {
      // 处理接收到的消息
      this.handleMessage(message);
    });
  }

  private handleMessage(message: CustomMessage) {
    // 处理消息逻辑
  }

  private processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  public sendMessage(message: CustomMessage) {
    if (this.socket?.connected) {
      this.socket.emit('message', message);
    } else {
      this.messageQueue.push(message);
    }
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export const wsService = new WebSocketService();
```

### 3. 扩展useChat Hook
```typescript
// src/hooks/useChat.ts
import { useState, useEffect } from 'react';
import { wsService } from '../services/websocket';
import { CustomMessage } from '../types/chat';

export const useChat = (sessionId?: string) => {
  const [messages, setMessages] = useState<CustomMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 监听WebSocket连接状态
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    wsService.socket?.on('connect', handleConnect);
    wsService.socket?.on('disconnect', handleDisconnect);

    return () => {
      wsService.socket?.off('connect', handleConnect);
      wsService.socket?.off('disconnect', handleDisconnect);
    };
  }, []);

  const sendMessage = async (content: string) => {
    const message: CustomMessage = {
      id: Date.now().toString(),
      content,
      from: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    wsService.sendMessage(message);
  };

  return {
    messages,
    sendMessage,
    isConnected
  };
};
```

### 4. 修改MessageInput组件
```typescript
// src/components/ChatWindow/MessageInput.tsx
const MessageInput: React.FC<MessageInputProps> = ({ onSend, isLoading }) => {
  const { isConnected } = useChat();
  
  // 添加连接状态提示
  const renderConnectionStatus = () => {
    if (!isConnected) {
      return (
        <div className="connection-status">
          <span className="status-dot disconnected" />
          正在重连...
        </div>
      );
    }
    return null;
  };

  return (
    <div className="message-input-container">
      {renderConnectionStatus()}
      {/* 现有的输入框代码 */}
    </div>
  );
};
```

## 三、功能特性

### 1. 实时消息
- 消息即时发送和接收
- 支持多种消息类型（文本、图片、文件等）
- 消息状态实时更新

### 2. 连接管理
- 自动重连机制
- 断线重连提示
- 连接状态监控

### 3. 消息可靠性
- 消息队列缓存
- 断线重连后消息重发
- 消息发送状态追踪

### 4. 性能优化
- 消息批量处理
- 心跳检测
- 连接状态缓存

## 四、注意事项

### 1. 安全性
- 使用WSS（WebSocket Secure）
- 实现消息加密
- 添加身份验证机制

### 2. 错误处理
- 网络异常处理
- 消息发送失败重试
- 优雅降级方案

### 3. 性能考虑
- 控制消息大小
- 实现消息压缩
- 优化重连策略

### 4. 用户体验
- 添加连接状态提示
- 实现消息发送状态
- 提供重连反馈

## 五、后续优化

### 1. 消息同步
- 实现消息历史同步
- 添加消息分页加载
- 支持消息搜索

### 2. 高级特性
- 消息已读状态
- 输入状态提示
- 消息撤回功能

### 3. 监控告警
- 连接状态监控
- 消息延迟监控
- 异常情况告警

## 六、测试方案

### 1. 单元测试
- WebSocket服务测试
- 消息处理测试
- 重连机制测试

### 2. 集成测试
- 端到端消息流程
- 异常场景测试
- 性能压力测试

### 3. 监控指标
- 连接成功率
- 消息延迟
- 重连频率 