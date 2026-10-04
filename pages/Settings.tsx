import React, { useState, useRef } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useSync } from '../context/SyncContext';
import { 
  Settings as SettingsIcon, 
  HardDrive, 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Database, 
  ShieldCheck, 
  DollarSign, 
  Wifi, 
  AlertTriangle,
  RefreshCw,
  Sliders
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { 
    transactions, 
    accounts, 
    categories, 
    companies, 
    debts, 
    expenses, 
    auditLogs 
  } = useFinance();

  const { isSimulatedOffline, setSimulatedOffline, lastSyncTime, pendingCount } = useSync();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notification, setNotification] = useState<string | null>(null);
  const [currency, setCurrency] = useState('MZN');
  const [syncInterval, setSyncInterval] = useState('AUTO');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Export full JSON backup
  const handleExportBackup = () => {
    const fullDatabase = {
      version: '2.4.0',
      exportedAt: new Date().toISOString(),
      companies,
      accounts,
      transactions,
      expenses,
      categories,
      debts,
      auditLogs
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullDatabase, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mozfinance_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showNotification('Backup exportado com êxito para ficheiro JSON!');
  };

  // Import JSON backup
  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        if (parsed.transactions && parsed.accounts) {
          localStorage.setItem('idigtec_transactions', JSON.stringify(parsed.transactions));
          localStorage.setItem('idigtec_accounts', JSON.stringify(parsed.accounts));
          if (parsed.companies) localStorage.setItem('idigtec_companies', JSON.stringify(parsed.companies));
          if (parsed.categories) localStorage.setItem('idigtec_categories', JSON.stringify(parsed.categories));
          if (parsed.expenses) localStorage.setItem('idigtec_financial_expenses', JSON.stringify(parsed.expenses));
          if (parsed.debts) localStorage.setItem('idigtec_debts', JSON.stringify(parsed.debts));

          showNotification('Dados restaurados com êxito! A recarregar aplicação...');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          alert('Ficheiro de backup inválido: faltam tabelas estruturais.');
        }
      } catch (err) {
        alert('Erro ao processar ficheiro JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Factory reset
  const handleResetData = () => {
    if (confirm('ATENÇÃO: Pretende reiniciar todos os dados locais para a configuração de fábrica? Esta acção não pode ser desfeita.')) {
      localStorage.clear();
      showNotification('Armazenamento reiniciado! A recarregar...');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Configurações & Gestão de Dados
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Parametrizações do sistema, gestão de cópias de segurança (Backup) e persistência offline.
            </p>
          </div>
        </div>

        {notification && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold animate-in fade-in">
            <Check className="h-4 w-4" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Database Health Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Database className="h-4 w-4 text-emerald-500" />
          <span>Integridade da Base de Dados Local (IndexedDB / LocalStorage)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Empresas</span>
            <span className="text-xl font-black text-gray-900 dark:text-white font-mono">{companies.length}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Contas & Caixas</span>
            <span className="text-xl font-black text-gray-900 dark:text-white font-mono">{accounts.length}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Lançamentos</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{transactions.length}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Despesas</span>
            <span className="text-xl font-black text-red-500 font-mono">{expenses.length}</span>
          </div>
        </div>
      </div>

      {/* Backup and Restore Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-blue-500" />
          <span>Cópias de Segurança & Portabilidade de Dados</span>
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Guarde todo o histórico financeiro, transacções, orçamentos e cadastros num ficheiro JSON portátil. Pode transferir este ficheiro para outro dispositivo ou restaurar a qualquer momento.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Backup Completo (JSON)</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportBackup}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800 transition-all cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            <span>Restaurar / Importar Backup (JSON)</span>
          </button>
        </div>
      </div>

      {/* Sync Preferences & Offline Control */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sliders className="h-4 w-4 text-purple-500" />
          <span>Preferências do Motor de Sincronização</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Frequência de Sincronização em Segundo Plano
            </label>
            <select
              value={syncInterval}
              onChange={(e) => setSyncInterval(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="AUTO">Automático (Ao restabelecer rede ou a cada 2 min)</option>
              <option value="5MIN">A cada 5 minutos</option>
              <option value="15MIN">A cada 15 minutos</option>
              <option value="MANUAL">Apenas Manual</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
              Moeda Principal do Sistema
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="MZN">Metical de Moçambique (MZN / MT)</option>
              <option value="USD">Dólar Norte-Americano (USD / $)</option>
              <option value="ZAR">Rand Sul-Africano (ZAR / R)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block">
              Simulação de Modo Offline para Testes
            </span>
            <span className="text-[11px] text-gray-500">
              Desconecta artificialmente a aplicação para simular operações em áreas remotas.
            </span>
          </div>

          <button
            onClick={() => setSimulatedOffline(!isSimulatedOffline)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSimulatedOffline 
                ? 'bg-amber-500 text-white' 
                : 'bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {isSimulatedOffline ? 'Activo (Offline)' : 'Desactivado'}
          </button>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="bg-red-50/50 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900/50 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm mb-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Zona de Perigo — Reposição de Dados</span>
        </div>
        <p className="text-xs text-red-700/80 dark:text-red-300/80 mb-4 leading-relaxed">
          Se desejar limpar todas as alterações e restabelecer a base de dados de demonstração com todas as empresas e dados iniciais de fábrica, clique no botão abaixo.
        </p>

        <button
          onClick={handleResetData}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Limpar e Reiniciar Dados de Fábrica</span>
        </button>
      </div>
    </div>
  );
};
