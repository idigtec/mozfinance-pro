import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { QuoteStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Building2, TrendingUp, CheckCircle2, XCircle, Wallet } from 'lucide-react';

export const CommercialReports = () => {
  const { quotes, companies } = useFinance();

  // Filtrar Cotações
  const filteredQuotes = quotes;

  // Metrics
  const totalQuoted = filteredQuotes.reduce((acc, q) => acc + q.total, 0);
  const totalApproved = filteredQuotes.filter(q => q.status === QuoteStatus.APPROVED || q.status === QuoteStatus.PARTIAL || q.status === QuoteStatus.PAID).reduce((acc, q) => acc + q.total, 0);
  const totalPaid = filteredQuotes.reduce((acc, q) => acc + (q.amountPaid || 0), 0);
  
  const countApproved = filteredQuotes.filter(q => q.status === QuoteStatus.APPROVED || q.status === QuoteStatus.PARTIAL || q.status === QuoteStatus.PAID).length;
  const countTotal = filteredQuotes.length;
  
  const conversionRate = countTotal > 0 ? (countApproved / countTotal) * 100 : 0;

  // Chart Data: Status Distribution
  const statusData = Object.values(QuoteStatus).map(status => {
      const count = filteredQuotes.filter(q => q.status === status).length;
      return { name: status, value: count };
  });

  // Payment History (Flattened)
  const allPayments = filteredQuotes.flatMap(q => (q.payments || []).map(p => ({
      ...p,
      quoteNumber: q.number,
      companyId: q.companyId
  }))).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios Comerciais</h2>
          <p className="text-sm text-gray-500">Desempenho de vendas e propostas</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-blue-600">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-bold text-sm uppercase">Total Cotado</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalQuoted.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</p>
              <p className="text-xs text-gray-500 mt-1">{countTotal} propostas emitidas</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-bold text-sm uppercase">Total Aprovado</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalApproved.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</p>
              <p className="text-xs text-gray-500 mt-1">{countApproved} propostas ganhas</p>
          </div>
          
           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-green-700">
                  <Wallet className="h-5 w-5" />
                  <span className="font-bold text-sm uppercase">Recebido (Caixa)</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalPaid.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</p>
              <p className="text-xs text-gray-500 mt-1">Valor efetivamente pago</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2 text-purple-600">
                  <ActivityIcon className="h-5 w-5" />
                  <span className="font-bold text-sm uppercase">Taxa de Conversão</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</p>
              <div className="w-full bg-gray-200 h-2 mt-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full" style={{ width: `${conversionRate}%` }}></div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts Area */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg text-gray-800 mb-6">Status das Propostas</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} name="Qtd. Cotações" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Payments History Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Últimos Recebimentos</h3>
            <div className="overflow-y-auto flex-1">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs sticky top-0">
                        <tr>
                            <th className="p-3">Data</th>
                            <th className="p-3">Cotação</th>
                            <th className="p-3">Método</th>
                            <th className="p-3 text-right">Valor</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {allPayments.slice(0, 10).map((p, i) => (
                            <tr key={i}>
                                <td className="p-3 text-gray-500">{new Date(p.date).toLocaleDateString()}</td>
                                <td className="p-3 font-medium">{p.quoteNumber}</td>
                                <td className="p-3 text-gray-500 text-xs">{p.method}</td>
                                <td className="p-3 text-right font-bold text-green-600">+{p.amount.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                         {allPayments.length === 0 && (
                             <tr><td colSpan={4} className="p-6 text-center text-gray-400">Sem pagamentos registados.</td></tr>
                         )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

    </div>
  );
};

function ActivityIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    )
}