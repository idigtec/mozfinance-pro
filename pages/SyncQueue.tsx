import React, { useState } from 'react';
import { useSync } from '../context/SyncContext';
import { 
  UploadCloud, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  HardDrive, 
  Trash2, 
  History, 
  Database,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

export const SyncQueue: React.FC = () => {
  const { 
    isOnline, 
    isSimulatedOffline, 
    setSimulatedOffline, 
    effectiveOnline, 
    queue, 
    logs, 
    isSyncing, 
    lastSyncTime, 
    pendingCount, 
    syncNow, 
    removeFromQueue, 
    clearQueue 
  } = useSync();

  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleManualSync = async () => {
    setSyncFeedback(null);
    const result = await syncNow();
    if (result.success) {
      setSyncFeedback(`Sincronização concluída com êxito! ${result.syncedCount} registos actualizados.`);
    } else {
      setSyncFeedback('Não foi possível sincronizar: O dispositivo encontra-se sem ligação ou em modo offline simulado.');
    }
    setTimeout(() => setSyncFeedback(null), 5000);
  };

  // Estimate local storage usage in KB
  const estimatedStorageKB = Math.round((JSON.stringify(localStorage).length * 2) / 1024);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <UploadCloud className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Fila de Sincronização & Motor Offline
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Gestão da fila de alterações locais (outbox), monitorização da rede e consistência de dados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSimulatedOffline(!isSimulatedOffline)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isSimulatedOffline 
                ? 'bg-amber-500/20 text-amber-400 border-amber-600' 
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 hover:bg-gray-200'
            }`}
          >
            {isSimulatedOffline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
            <span>{isSimulatedOffline ? 'Sair do Modo Simulado' : 'Simular Modo Offline'}</span>
          </button>

          <button
            onClick={handleManualSync}
            disabled={isSyncing || !effectiveOnline}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-900/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'A Sincronizar...' : 'Sincronizar Agora'}</span>
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
          <button onClick={() => setSyncFeedback(null)} className="text-emerald-400 hover:text-white">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Network Status Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Conexao */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Estado da Rede</span>
            {effectiveOnline ? (
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            ) : (
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            )}
          </div>
          <div className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            {effectiveOnline ? (
              <>
                <Wifi className="h-5 w-5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-amber-500" />
                <span className="text-amber-500">Offline {isSimulatedOffline ? '(Simulado)' : ''}</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            {effectiveOnline ? 'Conectado ao servidor principal' : 'Operações gravadas localmente'}
          </p>
        </div>

        {/* Pendentes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Fila Pendente</span>
            <div className="p-1 rounded bg-amber-50 dark:bg-amber-950 text-amber-500">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className={`text-2xl font-black font-mono ${pendingCount > 0 ? 'text-amber-500' : 'text-gray-900 dark:text-white'}`}>
            {pendingCount} {pendingCount === 1 ? 'registo' : 'registos'}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            {pendingCount > 0 ? 'Aguardando sincronização' : 'Tudo em dia'}
          </p>
        </div>

        {/* Ultimo Sync */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Última Sincronização</span>
            <div className="p-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-500">
              <History className="h-4 w-4" />
            </div>
          </div>
          <div className="text-sm font-bold text-gray-900 dark:text-white font-mono truncate">
            {lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString('pt-MZ') : 'Nunca'}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            {lastSyncTime ? new Date(lastSyncTime).toLocaleDateString('pt-MZ') : 'Sem registo anterior'}
          </p>
        </div>

        {/* Cache Usado */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Armazenamento Local</span>
            <div className="p-1 rounded bg-purple-50 dark:bg-purple-950 text-purple-500">
              <HardDrive className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900 dark:text-white font-mono">
            {estimatedStorageKB} KB
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            IndexedDB / LocalStorage persistente
          </p>
        </div>
      </div>

      {/* Info notice about offline persistence */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-start gap-3 shadow-lg">
        <Info className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-slate-100">
            Como funciona a Arquitetura Offline-First do MozFinance Pro:
          </p>
          <p className="text-slate-300 leading-relaxed">
            Qualquer cadastro, receita, despesa ou movimentação registada sem internet é guardada imediatamente no armazenamento local persistente. As operações entram nesta <strong>Fila de Sincronização</strong> e são enviadas automaticamente para a base de dados central assim que a conexão à internet for restabelecida.
          </p>
        </div>
      </div>

      {/* Pending Queue Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span>Registos Pendentes na Fila (Outbox)</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              {queue.length}
            </span>
          </h2>

          {queue.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Tem a certeza que deseja limpar todos os itens da fila de sincronização?')) {
                  clearQueue();
                }
              }}
              className="text-xs text-red-500 hover:text-red-600 font-semibold cursor-pointer"
            >
              Limpar Fila
            </button>
          )}
        </div>

        {queue.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-500 mb-3" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Fila de sincronização vazia</p>
            <p className="text-xs text-gray-500 mt-1">Todos os registos e lançamentos locais estão em sincronia com o servidor.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Momento</th>
                  <th className="py-3 px-4">Entidade</th>
                  <th className="py-3 px-4">Operação</th>
                  <th className="py-3 px-4">Resumo dos Dados</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-center">Acção</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {queue.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-gray-500 whitespace-nowrap">
                      {new Date(item.timestamp).toLocaleTimeString('pt-MZ')}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                      {item.entity}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.operation === 'CREATE' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                        item.operation === 'UPDATE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' :
                        'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                      }`}>
                        {item.operation === 'CREATE' ? 'Criação' : item.operation === 'UPDATE' ? 'Actualização' : 'Eliminação'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300 max-w-xs truncate font-mono text-[11px]">
                      {item.payload?.description || item.payload?.name || item.payload?.title || JSON.stringify(item.payload)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'SYNCING' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                        item.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {item.status === 'SYNCING' ? 'A enviar...' : 'Pendente'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => removeFromQueue(item.id)}
                        className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Descartar da fila"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sync Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <History className="h-4 w-4 text-blue-500" />
            <span>Histórico de Sincronizações</span>
          </h2>
          <span className="text-xs text-gray-400 font-mono">{logs.length} registos</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Data/Hora</th>
                <th className="py-3 px-4">Gatilho</th>
                <th className="py-3 px-4">Itens Processados</th>
                <th className="py-3 px-4">Duração</th>
                <th className="py-3 px-4 text-center">Resultado</th>
                <th className="py-3 px-4">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {logs.slice(0, 10).map(log => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-gray-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('pt-MZ')}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800 dark:text-gray-200">
                    {log.type === 'AUTO' ? 'Automático' : log.type === 'MANUAL' ? 'Manual (Utilizador)' : 'Reconexão'}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-gray-900 dark:text-white">
                    {log.itemsProcessed}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-500">
                    {log.durationMs}ms
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" />
                      Sucesso
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-[11px] truncate max-w-sm">
                    {log.details || 'Registos sincronizados com êxito.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
