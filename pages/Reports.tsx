import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Printer, Download, FileText, Activity, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { TransactionType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Reports = () => {
  const { transactions, auditLogs, accounts } = useFinance();
  const [activeTab, setActiveTab] = useState<'FINANCIAL' | 'AUDIT'>('FINANCIAL');

  const handlePrint = () => {
      window.print();
  };

  // Helper date formatter
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-MZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // --- Cash Flow Data Preparation ---
  const getCashFlowData = () => {
      const groupedData: Record<string, { name: string, Receita: number, Despesa: number }> = {};

      transactions.forEach(tx => {
          const date = new Date(tx.date);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthName = date.toLocaleDateString('pt-MZ', { month: 'short', year: '2-digit' });

          if (!groupedData[key]) {
              groupedData[key] = { name: monthName, Receita: 0, Despesa: 0 };
          }

          if (tx.type === TransactionType.INCOME) {
              groupedData[key].Receita += tx.amount;
          } else if (tx.type === TransactionType.EXPENSE) {
              groupedData[key].Despesa += tx.amount;
          }
      });

      // Convert to array and sort by date key
      return Object.keys(groupedData).sort().map(key => groupedData[key]);
  };

  const cashFlowData = getCashFlowData();

  return (
    <div className="space-y-8 pb-20">
       <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios & Auditoria</h2>
          <p className="text-sm text-gray-600">Exportação de dados e registo de atividades</p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition flex items-center space-x-2 shadow-lg"
        >
          <Printer className="h-4 w-4" />
          <span>Imprimir Relatório</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-200 p-1 rounded-xl w-fit print:hidden">
          <button 
            onClick={() => setActiveTab('FINANCIAL')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'FINANCIAL' ? 'bg-white shadow text-slate-900' : 'text-gray-600 hover:text-gray-900'}`}
          >
              Financeiro
          </button>
          <button 
            onClick={() => setActiveTab('AUDIT')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'AUDIT' ? 'bg-white shadow text-slate-900' : 'text-gray-600 hover:text-gray-900'}`}
          >
              Logs de Auditoria
          </button>
      </div>

      <div className="print:block">
          {/* Header for Print only */}
          <div className="hidden print:block mb-8 text-center border-b border-black pb-4">
              <h1 className="text-3xl font-bold mb-2 text-black">MozFinance Pro</h1>
              <p className="text-gray-800 font-bold uppercase">Relatório Geral do Sistema</p>
              <p className="text-sm mt-2 text-gray-600">Gerado em: {formatDateTime(new Date().toISOString())}</p>
          </div>

          {(activeTab === 'FINANCIAL' || window.matchMedia('print').matches) && (
             <div className="space-y-8">
                 
                 {/* CHART SECTION */}
                 <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 break-inside-avoid">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Activity className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-xl text-gray-900">Fluxo de Caixa Mensal</h3>
                    </div>
                    
                    <div className="h-80 w-full">
                        {cashFlowData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={cashFlowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                    <XAxis dataKey="name" tick={{fill: '#374151', fontSize: 12, fontWeight: 500}} axisLine={false} tickLine={false} />
                                    <YAxis tick={{fill: '#374151', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                                        cursor={{fill: '#f3f4f6'}}
                                        formatter={(value: number) => [`${value.toLocaleString()} MT`, '']}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                                    <Bar dataKey="Receita" fill="#10b981" radius={[4, 4, 0, 0]} name="Receitas" barSize={30} />
                                    <Bar dataKey="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} name="Despesas" barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 font-medium">
                                Sem dados suficientes para gerar o gráfico.
                            </div>
                        )}
                    </div>
                 </section>

                 {/* Summary Section */}
                 <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 break-inside-avoid">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900">
                         <DollarSign className="h-5 w-5 text-emerald-600" /> Saldos Atuais
                     </h3>
                     <table className="w-full text-sm">
                         <thead className="bg-gray-100 border-b border-gray-200">
                             <tr>
                                 <th className="text-left p-3 font-bold text-gray-700">Conta</th>
                                 <th className="text-left p-3 font-bold text-gray-700">Instituição</th>
                                 <th className="text-right p-3 font-bold text-gray-700">Saldo</th>
                             </tr>
                         </thead>
                         <tbody>
                             {accounts.map(acc => (
                                 <tr key={acc.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                     <td className="p-3 font-bold text-gray-800">{acc.name}</td>
                                     <td className="p-3 text-gray-600 font-medium">{acc.type}</td>
                                     <td className="p-3 text-right font-bold text-gray-900">{acc.balance.toLocaleString()} {acc.currency}</td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </section>

                 {/* Transactions Table */}
                 <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 break-inside-avoid">
                     <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-900">
                         <FileText className="h-5 w-5 text-blue-600" /> Histórico Recente
                     </h3>
                     <table className="w-full text-sm">
                         <thead className="bg-gray-100 border-b border-gray-200">
                             <tr>
                                 <th className="text-left p-3 font-bold text-gray-700">Data</th>
                                 <th className="text-left p-3 font-bold text-gray-700">Descrição</th>
                                 <th className="text-left p-3 font-bold text-gray-700">Categoria</th>
                                 <th className="text-right p-3 font-bold text-gray-700">Valor</th>
                             </tr>
                         </thead>
                         <tbody>
                             {transactions.slice(0, 20).map(tx => (
                                 <tr key={tx.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                     <td className="p-3 text-gray-600 font-medium">{formatDate(tx.date)}</td>
                                     <td className="p-3 font-bold text-gray-800">{tx.description}</td>
                                     <td className="p-3 text-gray-600">{tx.category}</td>
                                     <td className={`p-3 text-right font-black ${tx.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-red-600'}`}>
                                         {tx.type === TransactionType.INCOME ? '+' : '-'} {tx.amount.toLocaleString()} {tx.currency}
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                     <p className="text-xs text-gray-500 font-medium mt-4 text-center print:hidden bg-gray-50 p-2 rounded">A mostrar as últimas 20 transações.</p>
                 </section>
             </div>
          )}

          {(activeTab === 'AUDIT' || window.matchMedia('print').matches) && (
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-8 break-inside-avoid">
                  <h3 className="font-bold text-lg mb-4 text-gray-900">Logs de Auditoria (Segurança)</h3>
                  <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                              <tr>
                                  <th className="p-3 font-bold">Data/Hora</th>
                                  <th className="p-3 font-bold">Ação</th>
                                  <th className="p-3 font-bold">Entidade</th>
                                  <th className="p-3 font-bold">Detalhes</th>
                                  <th className="p-3 font-bold">Usuário</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {auditLogs.slice(0, 50).map(log => (
                                  <tr key={log.id} className="hover:bg-gray-50">
                                      <td className="p-3 text-gray-600 font-medium whitespace-nowrap">{formatDateTime(log.timestamp)}</td>
                                      <td className="p-3 font-bold">
                                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                                              log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                                              log.action === 'DELETE' ? 'bg-red-100 text-red-700' :
                                              'bg-blue-100 text-blue-700'
                                          }`}>{log.action}</span>
                                      </td>
                                      <td className="p-3 text-gray-800 font-medium">{log.entity}</td>
                                      <td className="p-3 text-gray-600">{log.details}</td>
                                      <td className="p-3 text-gray-500 italic font-medium">{log.user}</td>
                                  </tr>
                              ))}
                              {auditLogs.length === 0 && (
                                  <tr>
                                      <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">Nenhuma atividade registada ainda.</td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </section>
          )}
      </div>
    </div>
  );
};