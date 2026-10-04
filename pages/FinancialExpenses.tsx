
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { ExpenseCategory, ExpenseStatus, Currency } from '../types';
import { Plus, Wallet, AlertTriangle, CheckCircle2, TrendingUp, X, Filter, Lock, Clock, Calendar, Users, Landmark, UserCheck, CreditCard } from 'lucide-react';

export const FinancialExpenses = () => {
  const { expenses, addExpense, payExpense, deleteExpense, netProfit, realizedInterest, totalExpensesPaid, accounts } = useFinance();
  const [activeTab, setActiveTab] = useState<ExpenseCategory>(ExpenseCategory.FIXED);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Payment Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
      name: '',
      amount: '',
      dueDate: new Date().toISOString().split('T')[0],
      category: ExpenseCategory.FIXED,
      recurrence: 'NENHUMA'
  });

  const filteredExpenses = expenses.filter(e => e.category === activeTab);
  const pendingExpenses = filteredExpenses.filter(e => e.status === ExpenseStatus.PENDING);
  const paidExpenses = filteredExpenses.filter(e => e.status === ExpenseStatus.PAID);

  const handleAdd = (e: React.FormEvent) => {
      e.preventDefault();
      addExpense({
          name: formData.name,
          amount: parseFloat(formData.amount),
          category: formData.category,
          currency: Currency.MZN,
          dueDate: new Date(formData.dueDate).toISOString(),
          status: ExpenseStatus.PENDING,
          recurrence: formData.recurrence as any,
          origin: 'MANUAL'
      });
      setIsModalOpen(false);
      setFormData({
          name: '', amount: '', dueDate: new Date().toISOString().split('T')[0], category: ExpenseCategory.FIXED, recurrence: 'NENHUMA'
      });
  };

  const initiatePayment = (id: string) => {
      setSelectedExpenseId(id);
      setPaymentError(null);
      setPaymentModalOpen(true);
  };

  const confirmPayment = () => {
      if (!selectedExpenseId || !selectedAccountId) return;
      
      const result = payExpense(selectedExpenseId, selectedAccountId);
      if (result.success) {
          setPaymentModalOpen(false);
          setSelectedExpenseId(null);
          setSelectedAccountId('');
      } else {
          setPaymentError(result.message);
      }
  };

  // Helper para calcular dias restantes
  const getDaysRemaining = (dateString: string) => {
      const due = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);
      const diffTime = due.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const efficiencyRatio = realizedInterest > 0 ? (totalExpensesPaid / realizedInterest) * 100 : 0;

  const getCategoryIcon = (cat: ExpenseCategory) => {
      switch(cat) {
          case ExpenseCategory.FIXED: return <Calendar className="h-4 w-4" />;
          case ExpenseCategory.CURRENT: return <Wallet className="h-4 w-4" />;
          case ExpenseCategory.PERSONNEL: return <UserCheck className="h-4 w-4" />;
          case ExpenseCategory.DEBT_SERVICE: return <Landmark className="h-4 w-4" />;
          default: return <Wallet className="h-4 w-4" />;
      }
  };

  const getOriginBadge = (origin?: string) => {
      if (!origin || origin === 'MANUAL') return null;
      const config: any = {
          'HR': { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Users className="h-3 w-3" /> },
          'DEBT': { bg: 'bg-orange-100', text: 'text-orange-700', icon: <CreditCard className="h-3 w-3" /> }
      };
      const c = config[origin] || { bg: 'bg-gray-100', text: 'text-gray-700', icon: null };
      return (
          <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${c.bg} ${c.text}`}>
              {c.icon} {origin}
          </span>
      );
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fluxo de Despesas Unificado</h2>
          <p className="text-sm text-gray-600">Custos fixos, variáveis, salários e dívidas acoplados.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition flex items-center gap-2 shadow-xl font-black text-xs uppercase tracking-widest"
        >
          <Plus className="h-4 w-4" />
          <span>Registar Manual</span>
        </button>
      </div>

      {/* Financial Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-blue-600">
               <p className="text-[10px] text-blue-700 font-black uppercase mb-1 flex items-center gap-1">
                   <TrendingUp className="h-4 w-4" /> Receita Total (Realizada)
               </p>
               <p className="text-3xl font-black text-gray-900">{realizedInterest.toLocaleString()} MT</p>
               <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">Total bruto disponível</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-red-500">
               <p className="text-[10px] text-red-600 font-black uppercase mb-1 flex items-center gap-1">
                   <Wallet className="h-4 w-4" /> Custos de Operação Pagos
               </p>
               <p className="text-3xl font-black text-gray-900">{totalExpensesPaid.toLocaleString()} MT</p>
               <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">
                   Impacto no Lucro: <span className={efficiencyRatio > 50 ? 'text-red-600' : 'text-emerald-600'}>{efficiencyRatio.toFixed(1)}%</span>
               </p>
          </div>

          <div className={`p-6 rounded-2xl shadow-sm bg-white border-l-8 ${netProfit < 0 ? 'border-red-600' : 'border-emerald-600'}`}>
               <p className={`text-[10px] font-black uppercase mb-1 flex items-center gap-1 ${netProfit < 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                   <Lock className="h-4 w-4" /> Lucro Net (Final)
               </p>
               <p className={`text-3xl font-black ${netProfit < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                   {netProfit.toLocaleString()} MT
               </p>
               <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">Após liquidação de todos os acoplados</p>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
          {Object.values(ExpenseCategory).map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === cat ? 'bg-white text-black shadow-md border border-gray-200' : 'text-gray-500 hover:text-black'}`}
              >
                  {getCategoryIcon(cat)}
                  {cat.split('(')[0]}
              </button>
          ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Pending Expenses */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-100 bg-white flex justify-between items-center">
                  <h3 className="font-black text-gray-900 flex items-center gap-2 uppercase text-xs">
                      <AlertTriangle className="h-5 w-5 text-orange-600" /> Pendentes (A Liquidar)
                  </h3>
                  <span className="text-[10px] font-black text-white bg-orange-600 px-3 py-1 rounded-full">{pendingExpenses.length}</span>
              </div>
              <div className="overflow-y-auto max-h-[500px] flex-1 bg-white">
                  {pendingExpenses.length === 0 ? (
                      <div className="p-12 text-center text-gray-400 font-bold text-xs uppercase italic">Tudo liquidado nesta categoria.</div>
                  ) : (
                      <div className="divide-y divide-gray-50">
                          {pendingExpenses.map(e => {
                              const daysLeft = getDaysRemaining(e.dueDate);
                              const isUrgent = daysLeft <= 5 && daysLeft >= 0;
                              const isOverdue = daysLeft < 0;

                              return (
                              <div key={e.id} className={`p-5 transition hover:bg-gray-50/50 ${isUrgent ? 'bg-orange-50/30' : ''} ${isOverdue ? 'bg-red-50/30' : ''}`}>
                                  <div className="flex justify-between items-start mb-4">
                                      <div>
                                          <div className="flex items-center gap-2">
                                            <p className="font-black text-gray-900 text-base">{e.name}</p>
                                            {getOriginBadge(e.origin)}
                                          </div>
                                          <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1 uppercase">
                                                <Calendar className="h-3 w-3" /> Vence: {new Date(e.dueDate).toLocaleDateString()}
                                            </p>
                                            {isUrgent && <span className="text-[9px] font-black bg-orange-100 text-orange-700 px-2 py-0.5 rounded border border-orange-200 animate-pulse">Urgente</span>}
                                            {isOverdue && <span className="text-[9px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200">Atrasado</span>}
                                          </div>
                                      </div>
                                      <p className="font-black text-slate-900 text-lg">{e.amount.toLocaleString()} MT</p>
                                  </div>
                                  <div className="flex justify-end gap-2 pt-2">
                                      <button onClick={() => deleteExpense(e.id)} className="text-[10px] text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg font-black uppercase">Cancelar</button>
                                      <button 
                                        onClick={() => initiatePayment(e.id)}
                                        className="text-[10px] bg-slate-900 text-white px-5 py-2 rounded-xl hover:bg-slate-800 font-black uppercase shadow-lg"
                                      >
                                          Liquidar
                                      </button>
                                  </div>
                              </div>
                          )})}
                      </div>
                  )}
              </div>
          </div>

          {/* Paid History */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col opacity-90">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="font-black text-gray-900 flex items-center gap-2 uppercase text-xs">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Histórico de Saídas
                  </h3>
                  <span className="text-[10px] font-black text-gray-600 bg-gray-200 px-3 py-1 rounded-full">{paidExpenses.length}</span>
              </div>
              <div className="overflow-y-auto max-h-[500px] flex-1 bg-white">
                  {paidExpenses.length === 0 ? (
                      <div className="p-12 text-center text-gray-400 font-bold text-xs uppercase italic">Sem pagamentos registados.</div>
                  ) : (
                      <div className="divide-y divide-gray-50">
                          {paidExpenses.map(e => (
                              <div key={e.id} className="p-5 hover:bg-gray-50 transition">
                                  <div className="flex justify-between items-center">
                                      <div>
                                          <div className="flex items-center gap-2">
                                              <p className="font-bold text-gray-900 text-sm">{e.name}</p>
                                              {getOriginBadge(e.origin)}
                                          </div>
                                          <p className="text-[9px] text-emerald-700 font-black flex items-center gap-1 uppercase mt-1">
                                              <CheckCircle2 className="h-3 w-3" /> Pago em: {e.paidDate ? new Date(e.paidDate).toLocaleDateString() : '-'}
                                          </p>
                                      </div>
                                      <p className="font-black text-gray-400 line-through text-sm">{e.amount.toLocaleString()} MT</p>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
                  <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
                      <h3 className="font-black text-gray-900 uppercase text-xs">Nova Despesa Manual</h3>
                      <button onClick={() => setIsModalOpen(false)}><X className="h-5 w-5 text-gray-500" /></button>
                  </div>
                  <form onSubmit={handleAdd} className="p-8 space-y-5">
                      <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Descrição</label>
                          <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border-2 border-gray-100 rounded-2xl p-4 text-gray-900 font-bold bg-gray-50 focus:border-slate-500 outline-none" placeholder="Ex: Renda Mensal" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Valor (MT)</label>
                              <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border-2 border-gray-100 rounded-2xl p-4 font-black text-gray-900 bg-white" />
                          </div>
                          <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Vencimento</label>
                              <input type="date" required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full border-2 border-gray-100 rounded-2xl p-4 text-gray-900 bg-white" />
                          </div>
                      </div>
                      <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Categoria</label>
                          <select 
                            value={formData.category} 
                            onChange={e => setFormData({...formData, category: e.target.value as ExpenseCategory})}
                            className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-white text-gray-900 font-bold cursor-pointer"
                          >
                              {Object.values(ExpenseCategory).map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                              ))}
                          </select>
                      </div>
                      <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-slate-800 mt-2">Salvar Despesa</button>
                  </form>
              </div>
          </div>
      )}

      {/* Payment Confirmation Modal */}
      {paymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
                  <div className="p-5 border-b bg-gray-50">
                      <h3 className="font-black text-gray-900 uppercase text-xs">Confirmar Liquidação</h3>
                  </div>
                  <div className="p-8 space-y-6">
                      {paymentError ? (
                          <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-xs font-black border border-red-200 flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-red-600" /> {paymentError}
                          </div>
                      ) : (
                          <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl text-xs font-bold border border-blue-100">
                              <div className="flex justify-between mb-2">
                                  <span className="uppercase opacity-60">Lucro Disponível:</span>
                                  <span className="font-black">{netProfit.toLocaleString()} MT</span>
                              </div>
                              <div className="flex justify-between border-t border-blue-200 pt-2 text-sm">
                                  <span className="uppercase opacity-60">Valor a Pagar:</span>
                                  <span className="font-black text-red-600">
                                      - {expenses.find(e => e.id === selectedExpenseId)?.amount.toLocaleString()} MT
                                  </span>
                              </div>
                          </div>
                      )}

                      <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Conta de Saída</label>
                          <select 
                            value={selectedAccountId}
                            onChange={e => { setSelectedAccountId(e.target.value); setPaymentError(null); }}
                            className="w-full border-2 border-gray-100 rounded-2xl p-4 bg-gray-50 text-gray-900 font-bold focus:border-blue-500"
                          >
                              <option value="">Selecione a conta...</option>
                              {accounts.map(acc => (
                                  <option key={acc.id} value={acc.id}>{acc.name} ({acc.balance.toLocaleString()} {acc.currency})</option>
                              ))}
                          </select>
                      </div>

                      <div className="flex gap-3 pt-2">
                          <button onClick={() => { setPaymentModalOpen(false); setPaymentError(null); }} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-black uppercase text-[10px] text-gray-500 hover:bg-gray-50">Sair</button>
                          <button 
                            onClick={confirmPayment}
                            disabled={!!paymentError || !selectedAccountId}
                            className={`flex-1 py-4 rounded-2xl font-black uppercase text-[10px] text-white shadow-xl flex justify-center items-center gap-2 ${paymentError || !selectedAccountId ? 'bg-gray-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                          >
                              <CheckCircle2 className="h-4 w-4" /> Confirmar
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};
