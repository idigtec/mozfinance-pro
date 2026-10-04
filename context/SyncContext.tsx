import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SyncQueueItem, SyncLogEntry, SyncStatus, SyncOperation } from '../types';

interface SyncContextType {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  setSimulatedOffline: (val: boolean) => void;
  effectiveOnline: boolean;
  queue: SyncQueueItem[];
  logs: SyncLogEntry[];
  isSyncing: boolean;
  lastSyncTime: string | null;
  pendingCount: number;
  enqueueChange: (entity: string, entityId: string, operation: SyncOperation, payload: any, companyId?: string) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  syncNow: () => Promise<{ success: boolean; syncedCount: number; failedCount: number }>;
  resolveConflict: (itemId: string, strategy: 'KEEP_LOCAL' | 'KEEP_SERVER') => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

const safeParse = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

export const SyncProvider = ({ children }: { children?: ReactNode }) => {
  const [realOnline, setRealOnline] = useState<boolean>(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSimulatedOffline, setSimulatedOffline] = useState<boolean>(() => {
    return safeParse('idigtec_simulated_offline', false);
  });

  const [queue, setQueue] = useState<SyncQueueItem[]>(() => {
    const saved = safeParse('idigtec_sync_queue', null);
    if (saved && Array.isArray(saved)) return saved;
    // Sample initial items to demonstrate pending queue immediately if empty
    return [
      {
        id: 'sync_seed_1',
        entity: 'Transação',
        entityId: 'tx_seed_offline_1',
        operation: 'CREATE',
        payload: { description: 'Abastecimento Frota Mota TVS', amount: 1500, category: 'Combustível', type: 'Despesa' },
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
        status: 'PENDING',
        retryCount: 0,
        companyId: 'comp_express'
      },
      {
        id: 'sync_seed_2',
        entity: 'Receita POS',
        entityId: 'sale_pos_seed_2',
        operation: 'CREATE',
        payload: { description: 'Venda de Balcão #1089', amount: 4850, category: 'Vendas', type: 'Receita' },
        timestamp: new Date(Date.now() - 42 * 60000).toISOString(),
        status: 'PENDING',
        retryCount: 0,
        companyId: 'comp_costasol'
      }
    ];
  });

  const [logs, setLogs] = useState<SyncLogEntry[]>(() => {
    const saved = safeParse('idigtec_sync_logs', null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    return [
      {
        id: 'log_seed_1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'AUTO',
        itemsProcessed: 4,
        successCount: 4,
        failedCount: 0,
        durationMs: 420,
        status: 'SUCCESS',
        details: 'Sincronização automática bem-sucedida (4 registos validados no servidor central).'
      }
    ];
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return safeParse('idigtec_last_sync_time', new Date(Date.now() - 3600000).toISOString());
  });

  const effectiveOnline = realOnline && !isSimulatedOffline;

  useEffect(() => {
    localStorage.setItem('idigtec_simulated_offline', JSON.stringify(isSimulatedOffline));
  }, [isSimulatedOffline]);

  useEffect(() => {
    localStorage.setItem('idigtec_sync_queue', JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    localStorage.setItem('idigtec_sync_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (lastSyncTime) {
      localStorage.setItem('idigtec_last_sync_time', JSON.stringify(lastSyncTime));
    }
  }, [lastSyncTime]);

  const enqueueChange = useCallback((
    entity: string,
    entityId: string,
    operation: SyncOperation,
    payload: any,
    companyId?: string
  ) => {
    const newItem: SyncQueueItem = {
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      entity,
      entityId,
      operation,
      payload,
      timestamp: new Date().toISOString(),
      status: 'PENDING',
      retryCount: 0,
      companyId: companyId || 'default'
    };

    setQueue(prev => [newItem, ...prev]);
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const resolveConflict = useCallback((itemId: string, strategy: 'KEEP_LOCAL' | 'KEEP_SERVER') => {
    setQueue(prev => prev.filter(item => item.id !== itemId));
    const log: SyncLogEntry = {
      id: `log_resolve_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'MANUAL',
      itemsProcessed: 1,
      successCount: 1,
      failedCount: 0,
      durationMs: 120,
      status: 'SUCCESS',
      details: `Conflito resolvido manualmente para o item ${itemId} com estratégia: ${strategy}`
    };
    setLogs(prev => [log, ...prev]);
  }, []);

  const syncNow = useCallback(async (): Promise<{ success: boolean; syncedCount: number; failedCount: number }> => {
    if (!effectiveOnline) {
      return { success: false, syncedCount: 0, failedCount: queue.length };
    }

    if (queue.length === 0) {
      setLastSyncTime(new Date().toISOString());
      return { success: true, syncedCount: 0, failedCount: 0 };
    }

    setIsSyncing(true);
    const startTime = Date.now();

    // Mark items as SYNCING
    setQueue(prev => prev.map(item => ({ ...item, status: 'SYNCING' })));

    // Simulate network round-trip & verification
    await new Promise(res => setTimeout(res, 1200));

    const totalToSync = queue.length;
    // Mark as SYNCED
    const nowIso = new Date().toISOString();
    setLastSyncTime(nowIso);

    const newLog: SyncLogEntry = {
      id: `log_${Date.now()}`,
      timestamp: nowIso,
      type: 'MANUAL',
      itemsProcessed: totalToSync,
      successCount: totalToSync,
      failedCount: 0,
      durationMs: Date.now() - startTime,
      status: 'SUCCESS',
      details: `Sincronizados com êxito ${totalToSync} registos pendentes (armazenamento local -> base de dados principal).`
    };

    setLogs(prev => [newLog, ...prev]);
    // Clear out synced items
    setQueue([]);
    setIsSyncing(false);

    return { success: true, syncedCount: totalToSync, failedCount: 0 };
  }, [effectiveOnline, queue]);

  // Online / offline real event listeners
  useEffect(() => {
    const handleOnline = () => {
      setRealOnline(true);
      // Auto trigger sync if network restores and not simulated offline
      if (!isSimulatedOffline && queue.length > 0) {
        syncNow();
      }
    };
    const handleOffline = () => {
      setRealOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isSimulatedOffline, queue.length, syncNow]);

  const pendingCount = queue.filter(q => q.status === 'PENDING' || q.status === 'FAILED').length;

  return (
    <SyncContext.Provider value={{
      isOnline: realOnline,
      isSimulatedOffline,
      setSimulatedOffline,
      effectiveOnline,
      queue,
      logs,
      isSyncing,
      lastSyncTime,
      pendingCount,
      enqueueChange,
      removeFromQueue,
      clearQueue,
      syncNow,
      resolveConflict
    }}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) throw new Error('useSync must be used within a SyncProvider');
  return context;
};
