# 聊天应用项目

这是一个基于 React + TypeScript + Ant Design 的现代化聊天应用，采用了高级前端公司的标准架构设计。

## 🏗️ 项目架构

### 📁 目录结构

```
src/
├── components/           # 组件目录
│   ├── ChatWindow/      # 聊天窗口相关组件
│   │   ├── ChatWindow.tsx      # 聊天窗口主组件
│   │   ├── MessageList.tsx     # 消息列表组件
│   │   ├── MessageItem.tsx     # 消息项组件
│   │   ├── MessageInput.tsx    # 消息输入组件
│   │   └── *.css              # 对应样式文件
│   ├── SessionList/     # 会话列表相关组件
│   │   ├── SessionItem.tsx     # 会话项组件
│   │   └── *.css              # 对应样式文件
│   ├── InfoPanel/       # 信息面板相关组件
│   │   ├── VisitorInfo.tsx     # 访客信息组件
│   │   ├── ChatInfoPanel.tsx   # 对话信息组件
│   │   ├── ExtendInfo.tsx      # 扩展信息组件
│   │   └── *.css              # 对应样式文件
│   ├── SessionList.tsx  # 会话列表主组件
│   ├── InfoPanel.tsx    # 信息面板主组件
│   └── FloatingCollapseButton.tsx # 浮窗折叠按钮
├── hooks/               # 自定义Hooks
│   ├── useChat.ts       # 聊天相关状态管理
│   ├── useSessions.ts   # 会话列表状态管理
│   └── useResize.ts     # 拖拽调整大小逻辑
├── services/            # 服务层
│   └── mockData.ts      # Mock数据和API模拟
├── types/               # TypeScript类型定义
│   └── chat.ts          # 聊天相关类型
├── App.tsx              # 主应用组件
└── App.css              # 主应用样式
```

## 🎯 核心特性

### 1. 组件化架构
- **高度模块化**: 每个功能都拆分为独立的组件
- **可复用性**: 组件设计遵循单一职责原则
- **易维护性**: 清晰的组件层次结构

### 2. 状态管理
- **自定义Hooks**: 使用React Hooks管理状态逻辑
- **数据分离**: 业务逻辑与UI组件分离
- **类型安全**: 完整的TypeScript类型定义

### 3. 样式管理
- **CSS模块化**: 每个组件都有对应的CSS文件
- **响应式设计**: 支持移动端适配
- **主题一致性**: 统一的设计语言

### 4. 交互功能
- **拖拽调整**: 支持左右面板宽度拖拽调整
- **折叠展开**: 浮窗按钮控制面板显示/隐藏
- **实时通信**: 模拟的消息发送和接收

## 🔧 技术栈

- **React 18**: 现代化的React框架
- **TypeScript**: 类型安全的JavaScript
- **Ant Design**: 企业级UI组件库
- **React Hooks**: 函数式组件状态管理
- **CSS3**: 现代化样式解决方案

## 📱 功能模块

### 会话管理
- 会话列表展示
- 会话状态管理（在线/等待）
- 未读消息提醒
- 会话切换

### 消息系统
- 多种消息类型支持（文本、图片、文件、视频、Office文档、链接卡片）
- 消息发送和接收
- 文件上传和预览
- Markdown格式支持

### 信息面板
- 访客信息展示
- 对话统计信息
- 扩展业务信息
- 实时数据更新

## 🚀 开发指南

### 启动项目
```bash
npm install
npm start
```

### 构建项目
```bash
npm run build
```

### 类型检查
```bash
npx tsc --noEmit
```

## 📋 代码规范

### 组件设计原则
1. **单一职责**: 每个组件只负责一个功能
2. **Props接口**: 明确定义组件的输入输出
3. **样式分离**: CSS文件与组件文件一一对应
4. **类型安全**: 所有Props和State都有类型定义

### 文件命名规范
- 组件文件: PascalCase (如: `MessageList.tsx`)
- 样式文件: PascalCase (如: `MessageList.css`)
- Hook文件: camelCase with use前缀 (如: `useChat.ts`)
- 类型文件: camelCase (如: `chat.ts`)

### 目录组织原则
- 按功能模块组织组件
- 相关文件就近放置
- 公共组件放在根components目录
- 业务逻辑抽取到hooks和services

## 🎨 设计特点

- **现代化UI**: 基于Ant Design的现代化界面
- **响应式布局**: 适配不同屏幕尺寸
- **交互友好**: 流畅的动画和过渡效果
- **可访问性**: 支持键盘导航和屏幕阅读器

## 📈 性能优化

- **组件懒加载**: 按需加载组件
- **状态优化**: 避免不必要的重渲染
- **内存管理**: 及时清理事件监听器
- **请求优化**: 模拟网络延迟和错误处理 