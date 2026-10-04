import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { FiscalObligation, TaxObligationType } from '../types';
import { 
  FileCheck, 
  Calendar as CalendarIcon, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Download, 
  Plus, 
  FileText, 
  Building2, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  DollarSign, 
  Calculator, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Receipt,
  FileSpreadsheet,
  Layers,
  Users
} from 'lucide-react';

const TAX_BADGES: Record<TaxObligationType, { label: string; bg: string; text: string; border: string }> = {
  IVA: { label: 'IVA (16%)', bg: 'bg-blue-50 dark:bg-blue-950/50', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  INSS: { label: 'INSS (Folha 7%)', bg: 'bg-emerald-50 dark:bg-emerald-950/50', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  IRPS: { label: 'IRPS (Retenção)', bg: 'bg-purple-50 dark:bg-purple-950/50', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  ISPC: { label: 'ISPC (Simplificado 3%)', bg: 'bg-amber-50 dark:bg-amber-950/50', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' },
  IRPC: { label: 'IRPC (Sociedades)', bg: 'bg-indigo-50 dark:bg-indigo-950/50', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
  ALVARA: { label: 'Alvará & Licença', bg: 'bg-cyan-50 dark:bg-cyan-950/50', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800' },
  SECTORIAL: { label: 'Taxa Sectorial', bg: 'bg-orange-50 dark:bg-orange-950/50', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
  SELO: { label: 'Imposto do Selo', bg: 'bg-rose-50 dark:bg-rose-950/50', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800' },
  OUTRO: { label: 'Outras Taxas', bg: 'bg-slate-50 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' }
};

export const FiscalCompliance = () => {
  const { 
    fiscalObligations, 
    allFiscalObligations, 
    companies, 
    activeCompanyId, 
    uploadSubmissionProof, 
    markObligationPaid, 
    addFiscalObligation, 
    deleteFiscalObligation 
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'CALENDAR' | 'LIST' | 'SIMULATOR'>('LIST');
  const [filterTax, setFilterTax] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [uploadModalItem, setUploadModalItem] = useState<FiscalObligation | null>(null);
  const [payModalItem, setPayModalItem] = useState<FiscalObligation | null>(null);
  const [viewProofItem, setViewProofItem] = useState<FiscalObligation | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for Upload
  const [refNumberInput, setRefNumberInput] = useState('');
  const [fileNameInput, setFileNameInput] = useState('');
  const [fileSizeInput, setFileSizeInput] = useState('245 KB');
  const [isDragging, setIsDragging] = useState(false);

  // Form states for Payment
  const [receiptNumberInput, setReceiptNumberInput] = useState('');
  const [finalAmountInput, setFinalAmountInput] = useState<number>(0);

  // Form states for New Obligation
  const [newObligation, setNewObligation] = useState<Partial<FiscalObligation>>({
    title: '',
    taxType: 'IVA',
    dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
    period: 'Setembro/2026',
    estimatedAmount: 25000,
    instructions: 'Submeter declaração Modelo A no portal e-Tributação da AT.',
    status: 'PENDING',
    sector: 'Geral'
  });

  // Simulator states
  const [simBaseIVA, setSimBaseIVA] = useState<number>(150000);
  const [simDeductibleIVA, setSimDeductibleIVA] = useState<number>(8500);
  const [simGrossSalary, setSimGrossSalary] = useState<number>(200000);

  const activeCompany = useMemo(() => {
    if (activeCompanyId === 'all') return null;
    return companies.find(c => c.id === activeCompanyId) || null;
  }, [companies, activeCompanyId]);

  const fmtMZN = (val: number) => {
    return val.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN', maximumFractionDigits: 0 });
  };

  // Determine overdue or due soon dynamically
  const todayStr = new Date().toISOString().split('T')[0];

  const processedObligations = useMemo(() => {
    const list = activeCompanyId === 'all' ? allFiscalObligations : fiscalObligations;
    return list.map(ob => {
      let currentStatus = ob.status;
      if (currentStatus === 'PENDING' && ob.dueDate < todayStr) {
        currentStatus = 'OVERDUE';
      }
      return {
        ...ob,
        effectiveStatus: currentStatus
      };
    });
  }, [activeCompanyId, allFiscalObligations, fiscalObligations, todayStr]);

  // Filtered obligations
  const filteredObligations = useMemo(() => {
    return processedObligations.filter(ob => {
      const matchTax = filterTax === 'ALL' || ob.taxType === filterTax;
      const matchStatus = filterStatus === 'ALL' || ob.effectiveStatus === filterStatus;
      const matchSearch = ob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ob.taxType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ob.period && ob.period.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (ob.referenceNumber && ob.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchTax && matchStatus && matchSearch;
    });
  }, [processedObligations, filterTax, filterStatus, searchQuery]);

  // Summary Metrics
  const summaryMetrics = useMemo(() => {
    const total = processedObligations.length;
    const pending = processedObligations.filter(o => o.effectiveStatus === 'PENDING').length;
    const overdue = processedObligations.filter(o => o.effectiveStatus === 'OVERDUE').length;
    const submitted = processedObligations.filter(o => o.effectiveStatus === 'SUBMITTED').length;
    const paid = processedObligations.filter(o => o.effectiveStatus === 'PAID').length;

    const totalEstimated = processedObligations.reduce((acc, o) => acc + o.estimatedAmount, 0);
    const totalPaidAmount = processedObligations
      .filter(o => o.status === 'PAID')
      .reduce((acc, o) => acc + (o.finalAmount ?? o.estimatedAmount), 0);
    const pendingAmount = processedObligations
      .filter(o => o.effectiveStatus === 'PENDING' || o.effectiveStatus === 'OVERDUE')
      .reduce((acc, o) => acc + o.estimatedAmount, 0);

    const complianceRate = total > 0 ? Math.round(((submitted + paid) / total) * 100) : 100;

    return { total, pending, overdue, submitted, paid, totalEstimated, totalPaidAmount, pendingAmount, complianceRate };
  }, [processedObligations]);

  // Handle Mock File Drop/Select
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileNameInput(file.name);
      setFileSizeInput(`${(file.size / 1024).toFixed(1)} KB`);
    }
  };

  const handleConfirmUpload = () => {
    if (!uploadModalItem) return;
    const proofUrl = 'https://at.gov.mz/portal/comprovativo_simulado_' + uploadModalItem.id;
    const fname = fileNameInput.trim() || `Guia_Submissao_${uploadModalItem.taxType}_${uploadModalItem.period?.replace(/\s+/g, '_') || '2026'}.pdf`;
    uploadSubmissionProof(
      uploadModalItem.id,
      proofUrl,
      fname,
      fileSizeInput || '284 KB',
      refNumberInput.trim() || `DUC-MZ-${Math.floor(10000000 + Math.random() * 90000000)}`
    );
    setUploadModalItem(null);
    setFileNameInput('');
    setRefNumberInput('');
  };

  const handleConfirmPayment = () => {
    if (!payModalItem) return;
    markObligationPaid(
      payModalItem.id,
      new Date().toISOString().split('T')[0],
      receiptNumberInput.trim() || `REC-BIM-${Math.floor(100000 + Math.random() * 900000)}`,
      finalAmountInput || payModalItem.estimatedAmount
    );
    setPayModalItem(null);
    setReceiptNumberInput('');
  };

  const handleCreateObligation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObligation.title) return;
    addFiscalObligation({
      companyId: activeCompanyId === 'all' ? (companies[0]?.id || 'default') : activeCompanyId,
      title: newObligation.title,
      taxType: newObligation.taxType as TaxObligationType,
      dueDate: newObligation.dueDate || todayStr,
      period: newObligation.period || 'Corrente/2026',
      estimatedAmount: Number(newObligation.estimatedAmount) || 0,
      instructions: newObligation.instructions || 'Submissão regular via portal tributário.',
      status: 'PENDING',
      sector: activeCompany?.sector || 'Geral'
    });
    setIsAddModalOpen(false);
    setNewObligation({
      title: '',
      taxType: 'IVA',
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      period: 'Setembro/2026',
      estimatedAmount: 25000,
      instructions: 'Submeter declaração no portal e-Tributação da AT.',
      status: 'PENDING',
      sector: 'Geral'
    });
  };

  // Group by Month for Calendar / Timeline view
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, typeof processedObligations> = {};
    filteredObligations.forEach(ob => {
      const monthKey = ob.dueDate.slice(0, 7); // 'YYYY-MM'
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(ob);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredObligations]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Conformidade Fiscal & Obrigações Legais</h1>
              <p className="text-slate-300 text-sm">
                Rastreio de IVA, INSS, IRPS e retenções conforme legislação tributária de Moçambique
              </p>
            </div>
          </div>
          {activeCompany ? (
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-xs text-emerald-300">
              <Building2 className="h-3.5 w-3.5" />
              <span>Entidade: <strong>{activeCompany.name}</strong></span>
              <span>•</span>
              <span>Sector: <strong>{activeCompany.sector || activeCompany.businessType}</strong></span>
              <span>•</span>
              <span>NUIT: <strong>{activeCompany.nuit || '400918231'}</strong></span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-xs text-blue-300">
              <Layers className="h-3.5 w-3.5" />
              <span>Visualizando Obrigações Consolidadas ({companies.length} empresas do grupo)</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
          >
            <Plus className="h-4 w-4" /> Nova Obrigação Fiscal
          </button>
          <button 
            onClick={() => {
              const csv = "data:text/csv;charset=utf-8,"
                + "ID,Título,Tipo,Período,Vencimento,Valor Estimado,Estado,Nº Referência,Comprovativo\n"
                + filteredObligations.map(o => `"${o.id}","${o.title}","${o.taxType}","${o.period}","${o.dueDate}",${o.estimatedAmount},"${o.effectiveStatus}","${o.referenceNumber || ''}","${o.submissionProofName || ''}"`).join("\n");
              const link = document.createElement("a");
              link.setAttribute("href", encodeURI(csv));
              link.setAttribute("download", `conformidade_fiscal_${todayStr}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition-all"
          >
            <Download className="h-4 w-4" /> Exportar Relatório
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Índice de Conformidade</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{summaryMetrics.complianceRate}%</h3>
            <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${summaryMetrics.complianceRate}%` }}></div>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
              {summaryMetrics.submitted + summaryMetrics.paid} de {summaryMetrics.total} obrigações regularizadas
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">A Pagar / Em Aberto</span>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{fmtMZN(summaryMetrics.pendingAmount)}</h3>
            <div className="flex items-center gap-2 mt-2 text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>{summaryMetrics.pending} guias pendentes de liquidação</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Guias em Atraso</span>
            <div className={`p-2 rounded-xl ${summaryMetrics.overdue > 0 ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 animate-pulse' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl font-black ${summaryMetrics.overdue > 0 ? 'text-rose-600' : 'text-gray-900 dark:text-white'}`}>
              {summaryMetrics.overdue}
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">
              {summaryMetrics.overdue > 0 ? 'Risco iminente de coimas e juros AT' : 'Sem guias vencidas no momento'}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Impostos Pagos (2026)</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{fmtMZN(summaryMetrics.totalPaidAmount)}</h3>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-2">
              {summaryMetrics.paid} obrigações com recibo anexado
            </p>
          </div>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('LIST')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'LIST'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              Lista de Obrigações ({filteredObligations.length})
            </button>
            <button
              onClick={() => setActiveTab('CALENDAR')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'CALENDAR'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" /> Calendário de Vencimentos
            </button>
            <button
              onClick={() => setActiveTab('SIMULATOR')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'SIMULATOR'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              <Calculator className="h-3.5 w-3.5" /> Simulador IVA & INSS
            </button>
          </div>

          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar por imposto, período, ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1 font-semibold text-gray-500 dark:text-gray-400">
            <Filter className="h-3.5 w-3.5" /> Imposto:
          </div>
          {['ALL', 'IVA', 'INSS', 'IRPS', 'ISPC', 'IRPC'].map(tax => (
            <button
              key={tax}
              onClick={() => setFilterTax(tax)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterTax === tax
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {tax === 'ALL' ? 'Todos os Impostos' : tax}
            </button>
          ))}

          <div className="h-4 w-px bg-gray-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

          <div className="flex items-center gap-1 font-semibold text-gray-500 dark:text-gray-400">
            Estado:
          </div>
          {[
            { key: 'ALL', label: 'Todos' },
            { key: 'PENDING', label: 'Pendentes' },
            { key: 'SUBMITTED', label: 'Submetidos' },
            { key: 'PAID', label: 'Pagos' },
            { key: 'OVERDUE', label: 'Em Atraso' }
          ].map(st => (
            <button
              key={st.key}
              onClick={() => setFilterStatus(st.key)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterStatus === st.key
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content: LIST VIEW */}
      {activeTab === 'LIST' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-700 text-[11px] uppercase tracking-wider text-gray-400 font-bold bg-gray-50/50 dark:bg-slate-800/50">
                  <th className="p-4">Obrigação Legal</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Período Fiscal</th>
                  <th className="p-4">Data Vencimento</th>
                  <th className="p-4 text-right">Valor Estimado</th>
                  <th className="p-4 text-center">Estado</th>
                  <th className="p-4">Comprovativo Submissão</th>
                  <th className="p-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {filteredObligations.map(ob => {
                  const badge = TAX_BADGES[ob.taxType] || TAX_BADGES.OUTRO;
                  const isOverdue = ob.effectiveStatus === 'OVERDUE';
                  const isPaid = ob.effectiveStatus === 'PAID';
                  const isSubmitted = ob.effectiveStatus === 'SUBMITTED';

                  return (
                    <tr key={ob.id} className="hover:bg-gray-50/70 dark:hover:bg-slate-700/40 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>{ob.title}</span>
                          {isOverdue && (
                            <span className="flex items-center gap-1 text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 px-1.5 py-0.5 rounded">
                              <AlertTriangle className="h-3 w-3" /> Vencida
                            </span>
                          )}
                        </div>
                        {ob.instructions && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                            {ob.instructions}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`text-[11px] font-black px-2 py-0.5 rounded-md border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {ob.period}
                      </td>
                      <td className="p-4 text-xs font-mono font-bold">
                        <span className={isOverdue ? 'text-rose-600 font-black' : 'text-gray-900 dark:text-gray-200'}>
                          {new Date(ob.dueDate).toLocaleDateString('pt-MZ')}
                        </span>
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                        {fmtMZN(ob.estimatedAmount)}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isPaid ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          isSubmitted ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                          isOverdue ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {isPaid ? 'Liquidada' : isSubmitted ? 'Submetida' : isOverdue ? 'Em Atraso' : 'A Pagar'}
                        </span>
                      </td>
                      <td className="p-4">
                        {ob.submissionProofName ? (
                          <button
                            onClick={() => setViewProofItem(ob)}
                            className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline group"
                          >
                            <FileCheck className="h-4 w-4 text-blue-500" />
                            <span className="truncate max-w-[140px]">{ob.submissionProofName}</span>
                            <Eye className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setUploadModalItem(ob);
                              setFileNameInput(`Comprovativo_${ob.taxType}_${ob.period.replace(/[\/\s]/g, '_')}.pdf`);
                              setRefNumberInput(ob.referenceNumber || '');
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800/60 px-2.5 py-1 rounded-lg transition-all"
                          >
                            <Upload className="h-3.5 w-3.5" /> Anexar Comprovativo
                          </button>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isPaid && (
                            <button
                              onClick={() => {
                                setPayModalItem(ob);
                                setFinalAmountInput(ob.estimatedAmount);
                              }}
                              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-all"
                            >
                              Liquidar
                            </button>
                          )}
                          {ob.submissionProofName && (
                            <button
                              onClick={() => {
                                setUploadModalItem(ob);
                                setFileNameInput(ob.submissionProofName || '');
                                setRefNumberInput(ob.referenceNumber || '');
                              }}
                              title="Substituir comprovativo"
                              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                            >
                              <Upload className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: CALENDAR / TIMELINE VIEW */}
      {activeTab === 'CALENDAR' && (
        <div className="space-y-6">
          {groupedByMonth.map(([monthKey, obligations]) => {
            const dateObj = new Date(`${monthKey}-01T00:00:00`);
            const monthName = dateObj.toLocaleDateString('pt-MZ', { month: 'long', year: 'numeric' });
            const monthTotal = obligations.reduce((acc, o) => acc + o.estimatedAmount, 0);

            return (
              <div key={monthKey} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize">{monthName}</h2>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {obligations.length} vencimentos
                    </span>
                  </div>
                  <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Total do Mês: <span className="text-emerald-600 dark:text-emerald-400 font-mono">{fmtMZN(monthTotal)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {obligations.map(ob => {
                    const badge = TAX_BADGES[ob.taxType] || TAX_BADGES.OUTRO;
                    const isOverdue = ob.effectiveStatus === 'OVERDUE';
                    const isPaid = ob.effectiveStatus === 'PAID';
                    const isSubmitted = ob.effectiveStatus === 'SUBMITTED';

                    return (
                      <div 
                        key={ob.id} 
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                          isPaid ? 'bg-emerald-50/20 border-emerald-200 dark:border-emerald-800/40' :
                          isOverdue ? 'bg-rose-50/30 border-rose-200 dark:border-rose-800/40' :
                          'bg-white dark:bg-slate-800/70 border-gray-200 dark:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                              {badge.label}
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                              isPaid ? 'bg-emerald-100 text-emerald-800' :
                              isSubmitted ? 'bg-blue-100 text-blue-800' :
                              isOverdue ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {isPaid ? 'Pago' : isSubmitted ? 'Submetido' : isOverdue ? 'Atrasado' : 'A Pagar'}
                            </span>
                          </div>

                          <h3 className="font-bold text-sm text-gray-900 dark:text-white">{ob.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Período: {ob.period}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 uppercase font-bold block">Vencimento</span>
                            <span className={`text-xs font-mono font-bold ${isOverdue ? 'text-rose-600' : 'text-gray-800 dark:text-gray-200'}`}>
                              {new Date(ob.dueDate).toLocaleDateString('pt-MZ')}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-gray-400 uppercase font-bold block">Montante</span>
                            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {fmtMZN(ob.estimatedAmount)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          {ob.submissionProofName ? (
                            <button
                              onClick={() => setViewProofItem(ob)}
                              className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1"
                            >
                              <FileCheck className="h-3.5 w-3.5" /> Comprovativo Anexado
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setUploadModalItem(ob);
                                setFileNameInput(`Guia_${ob.taxType}_${ob.period.replace(/[\/\s]/g, '_')}.pdf`);
                              }}
                              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 hover:underline"
                            >
                              <Upload className="h-3.5 w-3.5" /> Anexar Prova
                            </button>
                          )}

                          {!isPaid && (
                            <button
                              onClick={() => {
                                setPayModalItem(ob);
                                setFinalAmountInput(ob.estimatedAmount);
                              }}
                              className="bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-emerald-500"
                            >
                              Liquidar
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab Content: SIMULATOR */}
      {activeTab === 'SIMULATOR' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* IVA Simulator */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-700 pb-3">
              <span className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg text-blue-600">
                <Calculator className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Simulador de IVA (Moçambique - 16%)</h2>
                <p className="text-xs text-gray-500">Cálculo de IVA Liquidado nas Vendas vs IVA Dedutível nas Compras</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Base Tributável das Vendas / Serviços (MZN)
                </label>
                <input
                  type="number"
                  value={simBaseIVA}
                  onChange={(e) => setSimBaseIVA(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  IVA Dedutível Suportado nas Compras (MZN)
                </label>
                <input
                  type="number"
                  value={simDeductibleIVA}
                  onChange={(e) => setSimDeductibleIVA(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold"
                />
              </div>

              {/* Simulation Result */}
              {(() => {
                const ivaLiquidado = simBaseIVA * 0.16;
                const saldoPagar = ivaLiquidado - simDeductibleIVA;
                return (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">IVA Liquidado (16% sobre vendas):</span>
                      <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{fmtMZN(ivaLiquidado)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">IVA Dedutível (comprovado em facturas):</span>
                      <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{fmtMZN(simDeductibleIVA)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        {saldoPagar >= 0 ? 'IVA a Liquidar à Autoridade Tributária:' : 'Crédito de IVA para Mês Seguinte:'}
                      </span>
                      <span className={`text-base font-black font-mono ${saldoPagar >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {fmtMZN(Math.abs(saldoPagar))}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* INSS Simulator */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-700 pb-3">
              <span className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-lg text-emerald-600">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">Simulador de INSS Moçambique (7%)</h2>
                <p className="text-xs text-gray-500">4% Entidade Empregadora + 3% Trabalhador sobre Massa Salarial</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Massa Salarial Bruta Total do Mês (MZN)
                </label>
                <input
                  type="number"
                  value={simGrossSalary}
                  onChange={(e) => setSimGrossSalary(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold"
                />
              </div>

              {/* Simulation Result */}
              {(() => {
                const employerPart = simGrossSalary * 0.04;
                const employeePart = simGrossSalary * 0.03;
                const totalINSS = employerPart + employeePart;
                return (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Contribuição Patronal (4% Empregador):</span>
                      <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{fmtMZN(employerPart)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Desconto do Trabalhador (3% na Folha):</span>
                      <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{fmtMZN(employeePart)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        Guia Total a Pagar ao INSS:
                      </span>
                      <span className="text-base font-black font-mono text-emerald-600">
                        {fmtMZN(totalINSS)}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Upload de Comprovativo de Submissão */}
      {uploadModalItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-lg">
                  <Upload className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Anexar Comprovativo de Submissão</h3>
                  <p className="text-xs text-gray-500">{uploadModalItem.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setUploadModalItem(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Drag and Drop Zone */}
              <label 
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    setFileNameInput(file.name);
                    setFileSizeInput(`${(file.size / 1024).toFixed(1)} KB`);
                  }
                }}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer block transition-colors ${
                  isDragging 
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' 
                    : 'border-gray-200 dark:border-slate-700 hover:border-emerald-400 bg-gray-50/50 dark:bg-slate-900/50'
                }`}
              >
                <input 
                  type="file" 
                  accept=".pdf,.png,.jpg,.jpeg" 
                  onChange={handleFileSelect}
                  className="hidden" 
                />
                <FileCheck className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Clique para selecionar ou arraste o ficheiro aqui
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Formatos aceites: PDF, PNG, JPG (Guias DUC, Recibos do Portal e-Tributação, Comprovativos Bancários)
                </p>
                {fileNameInput && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                    <FileText className="h-4 w-4" />
                    <span>{fileNameInput}</span>
                    <span className="text-[10px] opacity-75 font-mono">({fileSizeInput})</span>
                  </div>
                )}
              </label>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  N.º de Referência / Guia DUC da AT
                </label>
                <input
                  type="text"
                  placeholder="Ex: DUC-MZ-89218201 ou Ref. Pagamento"
                  value={refNumberInput}
                  onChange={(e) => setRefNumberInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  O anexo ficará arquivado e vinculado permanentemente a esta obrigação para efeitos de auditoria e fiscalização.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={() => setUploadModalItem(null)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmUpload}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" /> Guardar & Submeter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Registar Liquidação / Pagamento */}
      {payModalItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-lg">
                  <Receipt className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Registar Pagamento Fiscal</h3>
                  <p className="text-xs text-gray-500">{payModalItem.title}</p>
                </div>
              </div>
              <button onClick={() => setPayModalItem(null)} className="text-gray-400 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Montante Final Pago (MZN)
                </label>
                <input
                  type="number"
                  value={finalAmountInput}
                  onChange={(e) => setFinalAmountInput(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  N.º do Recibo / Talão de Pagamento Bancário
                </label>
                <input
                  type="text"
                  placeholder="Ex: REC-BIM-982172 / DUC-PAGO"
                  value={receiptNumberInput}
                  onChange={(e) => setReceiptNumberInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={() => setPayModalItem(null)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Check className="h-4 w-4" /> Confirmar Liquidação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Visualizar Comprovativo Anexado */}
      {viewProofItem && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 rounded-lg">
                  <FileCheck className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Comprovativo Arquivado</h3>
                  <p className="text-xs text-gray-500">{viewProofItem.title}</p>
                </div>
              </div>
              <button onClick={() => setViewProofItem(null)} className="text-gray-400 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document Preview Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-emerald-600" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{viewProofItem.submissionProofName}</h4>
                    <span className="text-[10px] text-gray-400 font-mono">Tamanho: {viewProofItem.submissionProofSize || '245 KB'}</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                  Autenticado AT
                </span>
              </div>

              <div className="text-xs space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-gray-500">Referência DUC:</span>
                  <span className="font-mono font-bold text-gray-800 dark:text-gray-200">{viewProofItem.referenceNumber || 'DUC-MZ-2026-OK'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Data de Submissão:</span>
                  <span className="font-mono text-gray-800 dark:text-gray-200">{viewProofItem.submissionDate || '2026-08-15'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Valor Declarado:</span>
                  <span className="font-mono font-bold text-emerald-600">{fmtMZN(viewProofItem.finalAmount ?? viewProofItem.estimatedAmount)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={() => setViewProofItem(null)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  alert(`Descarregando ${viewProofItem.submissionProofName} autenticado.`);
                }}
                className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" /> Descarregar PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar Nova Obrigação Fiscal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateObligation} className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-lg">
                  <Plus className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Criar Nova Obrigação Fiscal</h3>
                  <p className="text-xs text-gray-500">Registo de obrigação legal periódica</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-gray-400 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Título da Obrigação *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: IVA Mensal - Declaração Modelo A"
                  value={newObligation.title}
                  onChange={(e) => setNewObligation(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Tipo de Imposto *
                  </label>
                  <select
                    value={newObligation.taxType}
                    onChange={(e) => setNewObligation(prev => ({ ...prev, taxType: e.target.value as TaxObligationType }))}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  >
                    <option value="IVA">IVA (16%)</option>
                    <option value="INSS">INSS (Folha 7%)</option>
                    <option value="IRPS">IRPS (Retenção)</option>
                    <option value="ISPC">ISPC (Simplificado 3%)</option>
                    <option value="IRPC">IRPC (Sociedades)</option>
                    <option value="SELO">Imposto do Selo</option>
                    <option value="OUTRO">Outra Taxa / Licença</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Período de Referência *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Setembro/2026"
                    value={newObligation.period}
                    onChange={(e) => setNewObligation(prev => ({ ...prev, period: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Data Limite de Vencimento *
                  </label>
                  <input
                    type="date"
                    required
                    value={newObligation.dueDate}
                    onChange={(e) => setNewObligation(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Valor Estimado (MZN) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newObligation.estimatedAmount}
                    onChange={(e) => setNewObligation(prev => ({ ...prev, estimatedAmount: Number(e.target.value) }))}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Instruções de Pagamento / Submissão
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Submeter através da plataforma e-Tributação da AT e pagar no BIM/BCI via DUC."
                  value={newObligation.instructions}
                  onChange={(e) => setNewObligation(prev => ({ ...prev, instructions: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Criar Obrigação
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
