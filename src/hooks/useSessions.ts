import { useState, useEffect } from 'react';
import { SessionItem } from '../types/chat';
import { ChatAPI } from '../services/mockData';

interface UseSessionsOptions {
  selectedSessionId?: string | null;
}

export const useSessions = (options?: UseSessionsOptions) => {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [internalSelectedSessionId, setInternalSelectedSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 使用外部传入的sessionId，如果没有则使用内部状态
  const selectedSessionId = options?.selectedSessionId ?? internalSelectedSessionId;

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const sessionList = await ChatAPI.getSessions();
      setSessions(sessionList);
    } catch (error) {
      console.error('加载会话列表失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectSession = (sessionId: string) => {
    setInternalSelectedSessionId(sessionId);
  };

  const selectedSession = sessions.find(session => session.id === selectedSessionId);

  return {
    sessions,
    selectedSessionId,
    selectedSession,
    isLoading,
    selectSession,
    refreshSessions: loadSessions
  };
}; 