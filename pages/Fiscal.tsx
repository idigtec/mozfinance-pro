import React, { useState } from 'react';
import { 
  FileText, 
  Receipt, 
  FileCheck, 
  FileX, 
  Calculator, 
  Plus, 
  Search, 
  Download, 
  MoreVertical, 
  Printer, 
  ShieldCheck, 
  CalendarDays,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { FiscalCompliance } from './FiscalCompliance';

export const Fiscal = () => {
  const { invoices, customers, quotes } = useFinance();
  const [activeView, setActiveView] = useState<'COMPLIANCE' | 'INVOICING'>('COMPLIANCE');
  const [searchTerm, setSearchTerm] = useState('');

  const fmtMoney = (val: number) => val.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' });

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('COMPLIANCE')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeView === 'COMPLIANCE'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Conformidade Fiscal (IVA, INSS, IRPS)</span>
          </button>

          <button
            onClick={() => setActiveView('INVOICING')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeView === 'INVOICING'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Facturação & Documentos Comerciais</span>
          </button>
        </div>

        {activeView === 'INVOICING' && (
          <div className="flex gap-2">
            <Link to="/quotes/new" className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl hover:bg-emerald-700 shadow-sm font-bold flex items-center gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" /> Nova Cotação
            </Link>
          </div>
        )}
      </div>

      {/* Render View */}
      {activeView === 'COMPLIANCE' ? (
        <FiscalCompliance />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-xl">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">Total: {invoices.length}</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Facturas Emitidas</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Gestão de facturação comercial e proformas</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-xl">
                  <Receipt className="h-5 w-5 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Venda a Dinheiro (VD)</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Vendas a pronto e recibos de caixa</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/50 rounded-xl">
                  <FileCheck className="h-5 w-5 text-purple-600" />
                </div>
                <span className="text-xs font-black text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded">Ativas: {quotes.length}</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Cotações</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Propostas comerciais e orçamentos</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-rose-50 dark:bg-rose-950/50 rounded-xl">
                  <FileX className="h-5 w-5 text-rose-600" />
                </div>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Notas de Crédito</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Anulações e retificações fiscais</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-bold text-gray-900 dark:text-white">Últimos Documentos Fiscais Emitidos</h3>
              <div className="relative">
                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Pesquisar documento..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 rounded-xl text-xs w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {invoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-slate-700 text-xs font-bold text-gray-400 uppercase bg-gray-50/50 dark:bg-slate-800/50">
                      <th className="p-4">Documento</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Data Emissão</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                    {invoices.map(inv => {
                      const customer = customers.find(c => c.id === inv.customerId);
                      return (
                        <tr key={inv.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/40 transition-colors">
                          <td className="p-4 font-bold text-gray-900 dark:text-white">{inv.number}</td>
                          <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{customer?.name || 'Cliente Geral'}</td>
                          <td className="p-4 text-xs text-gray-500 dark:text-gray-400">{new Date(inv.createdAt).toLocaleDateString('pt-MZ')}</td>
                          <td className="p-4 text-sm font-black text-gray-900 dark:text-white font-mono">{fmtMoney(inv.total)}</td>
                          <td className="p-4">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${
                              inv.status === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                              inv.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                              'bg-red-100 text-red-700 dark:bg-rose-950 dark:text-rose-300'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-400 hover:text-blue-600 transition-colors">
                                <Printer className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="font-medium">Nenhum documento fiscal registado recentemente.</p>
                <p className="text-xs mt-1">Utilize o módulo de cotações para iniciar o processo de venda.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
