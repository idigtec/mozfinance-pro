import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CATEGORIES } from '../constants';
import { TransactionType, Currency } from '../types';
import { Plus, List, LayoutGrid, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const Budget = () => {
  const { budgets, transactions, addBudget } = useFinance();
  const [isAdding, setIsAdding] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [limit, setLimit] = useState('');
  
  // View mode for future expansion if needed, currently we show both or layout differently
  const [viewMode, setViewMode] = useState<'CARDS' | 'LIST'>('CARDS');

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addBudget({
      category,
      limit: parseFloat(limit),
      currency: Currency.MZN,
      period: currentMonth
    });
    setIsAdding(false);
    setLimit('');
  };

  const getSpent = (cat: string) => {
    return transactions
      .filter(t => t.category === cat && t.type === TransactionType.EXPENSE && t.date.startsWith(currentMonth))
      .reduce((acc, t) => acc + t.amount, 0); // Note: Assuming MZN for simplicity here
  };

  const currentBudgets = budgets.filter(b => b.period === currentMonth);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orçamento Mensal</h2>
          <p className="text-sm text-gray-500">Planeamento para {new Date().toLocaleDateString('pt-MZ', { month: 'long', year: 'numeric' })}</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setIsAdding(!isAdding)}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition flex items-center space-x-2 shadow-sm"
            >
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">Definir Limite</span>
            </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="bg-white p-4 rounded-xl shadow-sm border border-emerald-200 flex flex-col md:flex-row gap-4 items-end animate-in slide-in-from-top-4 duration-300">
          <div className="flex-1 w-full">
            <label className="block text-xs text-gray-800 font-bold mb-1">Categoria</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-emerald-500 cursor-pointer shadow-sm font-medium">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs text-gray-800 font-bold mb-1">Limite (MT)</label>
            <input required type="number" value={limit} onChange={e => setLimit(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-emerald-500 shadow-sm font-bold" placeholder="Ex: 5000" />
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 w-full md:w-auto shadow-sm font-medium">Salvar</button>
        </form>
      )}

      {/* Cards View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentBudgets.map(b => {
          const spent = getSpent(b.category);
          const percent = Math.min((spent / b.limit) * 100, 100);
          const isOver = spent > b.limit;

          return (
            <div key={b.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-900">{b.category}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded ${isOver ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {isOver ? 'Alerta' : 'Dentro do limite'}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 font-medium mb-2">
                <span>Gasto: {spent.toLocaleString('pt-MZ')} MT</span>
                <span>Limite: {b.limit.toLocaleString('pt-MZ')} MT</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${isOver ? 'bg-red-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
        {currentBudgets.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
             <p className="text-gray-500">Nenhum orçamento definido para este mês.</p>
          </div>
        )}
      </div>

      {/* Detailed List View */}
      {currentBudgets.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <List className="h-5 w-5 text-gray-500" />
                      Detalhes do Orçamento
                  </h3>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                          <tr>
                              <th className="p-4">Categoria</th>
                              <th className="p-4 text-right">Limite</th>
                              <th className="p-4 text-right">Gasto</th>
                              <th className="p-4 text-right">Restante</th>
                              <th className="p-4 text-center">Estado</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {currentBudgets.map(b => {
                              const spent = getSpent(b.category);
                              const remaining = b.limit - spent;
                              const isOver = remaining < 0;
                              const percent = (spent / b.limit) * 100;

                              return (
                                  <tr key={b.id} className="hover:bg-gray-50">
                                      <td className="p-4 font-medium text-gray-900">{b.category}</td>
                                      <td className="p-4 text-right text-gray-600">{b.limit.toLocaleString()} MT</td>
                                      <td className="p-4 text-right text-gray-600">{spent.toLocaleString()} MT</td>
                                      <td className={`p-4 text-right font-bold ${isOver ? 'text-red-600' : 'text-emerald-600'}`}>
                                          {remaining.toLocaleString()} MT
                                      </td>
                                      <td className="p-4">
                                          <div className="flex items-center gap-2 justify-center">
                                              <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                  <div className={`h-full ${isOver ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                                              </div>
                                              <span className="text-xs font-bold text-gray-500 w-10 text-right">{percent.toFixed(0)}%</span>
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
    </div>
  );
};