# 原生WebSocket接入方案

## 一、技术选型

### 1. 原生WebSocket优势
- 更轻量级，无额外依赖
- 协议开销小
- 性能更好
- 完全控制连接生命周期

### 2. 需要自行实现的功能
- 断线重连机制
- 心跳检测
- 消息队列
- 错误处理

## 二、实现步骤

### 1. 创建WebSocket服务
```typescript
// src/services/websocket.ts
export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageQueue: any[] = [];
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private readonly HEARTBEAT_INTERVAL = 30000; // 30秒

  constructor(private url: string) {
    this.init();
  }

  private init() {
    try {
      this.ws = new WebSocket(this.url);
      this.setupEventListeners();
      this.startHeartbeat();
    } catch (error) {
      console.error('WebSocket初始化失败:', error);
      this.handleReconnect();
    }
  }

  private setupEventListeners() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log('WebSocket连接成功');
      this.reconnectAttempts = 0;
      this.processMessageQueue();
    };

    this.ws.onclose = () => {
      console.log('WebSocket连接关闭');
      this.stopHeartbeat();
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket错误:', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('消息解析错误:', error);
      }
    };
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.sendMessage({ type: 'ping' });
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      setTimeout(() => this.init(), this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('达到最大重连次数');
    }
  }

  private processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }

  public sendMessage(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.messageQueue.push(message);
    }
  }

  public disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const wsService = new WebSocketService(process.env.REACT_APP_WS_URL || 'ws://localhost:3000');
```

### 2. 扩展useChat Hook
```typescript
// src/hooks/useChat.ts
import { useState, useEffect } from 'react';
import { wsService } from '../services/websocket';
import { CustomMessage } from '../types/chat';

export const useChat = (sessionId?: string) => {
  const [messages, setMessages] = useState<CustomMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const handleMessage = (message: CustomMessage) => {
      setMessages(prev => [...prev, message]);
    };

    // 监听连接状态
    const checkConnection = () => {
      setIsConnected(wsService.isConnected());
    };

    // 定期检查连接状态
    const interval = setInterval(checkConnection, 5000);

    return () => {
      clearInterval(interval);
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

## 三、功能特性

### 1. 连接管理
- 自动重连机制
- 心跳检测
- 连接状态监控
- 错误处理

### 2. 消息处理
- 消息队列
- 消息重发
- 消息解析
- 错误处理

### 3. 性能优化
- 心跳间隔优化
- 重连策略优化
- 消息队列管理
- 内存管理

## 四、注意事项

### 1. 安全性
- 使用WSS（WebSocket Secure）
- 实现消息加密
- 添加身份验证
- 防止重放攻击

### 2. 错误处理
- 网络异常处理
- 消息发送失败重试
- 连接超时处理
- 心跳超时处理

### 3. 性能考虑
- 控制消息大小
- 实现消息压缩
- 优化重连策略
- 内存泄漏防护

### 4. 用户体验
- 连接状态提示
- 重连状态提示
- 消息发送状态
- 错误提示

## 五、测试方案

### 1. 单元测试
- 连接管理测试
- 消息处理测试
- 重连机制测试
- 心跳检测测试

### 2. 集成测试
- 端到端消息流程
- 异常场景测试
- 性能压力测试
- 网络切换测试

### 3. 监控指标
- 连接成功率
- 消息延迟
- 重连频率
- 心跳响应时间

## 六、后续优化

### 1. 功能扩展
- 消息历史同步
- 消息分页加载
- 消息搜索
- 消息撤回

### 2. 性能优化
- 消息压缩
- 批量处理
- 连接池管理
- 内存优化

### 3. 监控告警
- 连接状态监控
- 消息延迟监控
- 异常情况告警
- 性能指标监控 