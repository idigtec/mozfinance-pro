
import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Debt, DebtType, Currency, QuoteStatus } from '../types';
import { Plus, Trash2, Check, X, HandCoins, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Debts = () => {
  const { debts, addDebt, removeDebt, payDebt, accounts, quotes, customers } = useFinance();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);
  const [paymentAccount, setPaymentAccount] = useState(accounts[0]?.id || '');

  // Form State
  const [entity, setEntity] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<DebtType>(DebtType.BORROWED);
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Helper date formatter
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // --- INTEGRATED INTELLIGENCE: Merge Manual Debts with Pending Quotes ---
  const receivables = useMemo(() => {
      // 1. Manual Debts (LENT)
      const manualDebts = debts.filter(d => d.type === DebtType.LENT).map(d => ({
          ...d,
          isQuote: false,
          originId: d.id,
          displayName: d.entity
      }));

      // 2. Pending Quotes (Approved/Sent/Partial/Expired)
      const quoteDebts = quotes
        .filter(q => 
            (q.status === QuoteStatus.SENT || q.status === QuoteStatus.APPROVED || q.status === QuoteStatus.PARTIAL || q.status === QuoteStatus.EXPIRED) &&
            (q.total - (q.amountPaid || 0)) > 1 // Tolerance for floating point
        )
        .map(q => {
            const customerName = customers.find(c => c.id === q.customerId)?.name || 'Cliente Desconhecido';
            return {
                id: q.id, // Quote ID
                entity: customerName,
                amount: q.total - (q.amountPaid || 0), // Remaining Balance
                currency: q.currency,
                dueDate: q.validUntil,
                type: DebtType.LENT,
                isPaid: false,
                notes: `Ref: ${q.number}`,
                isQuote: true,
                originId: q.id,
                displayName: `${customerName} (${q.number})`
            };
        });

      // Sort by Due Date
      return [...manualDebts, ...quoteDebts].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [debts, quotes, customers]);

  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
        setError("O valor da dívida deve ser maior que zero.");
        return;
    }
    if (!dueDate) {
        setError("A data de vencimento é obrigatória.");
        return;
    }
    if (!entity.trim()) {
        setError("O nome da entidade é obrigatório.");
        return;
    }

    addDebt({
      entity,
      amount: val,
      currency: Currency.MZN,
      type,
      dueDate: new Date(dueDate).toISOString(),
      isPaid: false
    });
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEntity('');
    setAmount('');
    setDueDate('');
    setType(DebtType.BORROWED);
    setError(null);
  };

  const openPayModal = (debtId: string) => {
      setSelectedDebtId(debtId);
      setPayModalOpen(true);
  };

  const confirmPay = () => {
      if(selectedDebtId && paymentAccount) {
          payDebt(selectedDebtId, paymentAccount);
          setPayModalOpen(false);
          setSelectedDebtId(null);
      }
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Dívidas</h2>
          <p className="text-sm text-gray-500">Controle de empréstimos e valores a receber (Cotações & Manuais)</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition flex items-center space-x-2 shadow-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>Registar Dívida</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* A PAGAR (Liabilities) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-red-50 p-4 border-b border-red-100">
                <h3 className="font-bold text-red-800 flex items-center gap-2">
                    <HandCoins className="h-5 w-5" /> A Pagar (Passivo)
                </h3>
            </div>
            <div className="divide-y divide-gray-100 flex-1 overflow-y-auto max-h-[600px]">
                {debts.filter(d => d.type === DebtType.BORROWED).map(d => (
                    <div key={d.id} className={`p-4 flex justify-between items-center ${d.isPaid ? 'bg-gray-50 opacity-60' : 'hover:bg-red-50/20'} transition`}>
                        <div>
                            <p className="font-bold text-gray-900">{d.entity}</p>
                            <p className="text-xs text-gray-500 font-medium">Vence: {formatDate(d.dueDate)}</p>
                        </div>
                        <div className="text-right">
                             <p className="font-black text-red-600 text-lg">{d.amount.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</p>
                             <div className="flex justify-end gap-2 mt-2">
                                <button 
                                    onClick={() => !d.isPaid && openPayModal(d.id)}
                                    disabled={d.isPaid}
                                    className={`p-1.5 rounded-md border shadow-sm transition-all ${d.isPaid ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'}`}
                                    title={d.isPaid ? "Pago" : "Pagar"}
                                >
                                    <Check className="h-4 w-4" />
                                </button>
                                <button onClick={() => removeDebt(d.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md border border-transparent hover:border-red-100 transition-all">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                             </div>
                        </div>
                    </div>
                ))}
                {debts.filter(d => d.type === DebtType.BORROWED).length === 0 && (
                    <div className="p-12 text-center text-gray-400 text-sm font-medium">
                        Sem dívidas a pagar.
                    </div>
                )}
            </div>
        </div>

        {/* A RECEBER (Assets - Integrated) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex justify-between items-center">
                <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                    <HandCoins className="h-5 w-5" /> A Receber (Ativo)
                </h3>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                    {receivables.length}
                </span>
            </div>
            <div className="divide-y divide-gray-100 flex-1 overflow-y-auto max-h-[600px]">
                {receivables.map(d => (
                    <div key={d.id} className="p-4 flex justify-between items-center hover:bg-emerald-50/20 transition group">
                         <div>
                            <div className="flex items-center gap-2">
                                {d.isQuote ? (
                                    <span className="bg-blue-100 text-blue-700 p-1 rounded text-[10px]" title="Origem: Cotação">
                                        <FileText className="h-3 w-3" />
                                    </span>
                                ) : (
                                    <span className="bg-gray-100 text-gray-600 p-1 rounded text-[10px]" title="Origem: Manual">
                                        <HandCoins className="h-3 w-3" />
                                    </span>
                                )}
                                <p className="font-bold text-gray-900">{d.displayName}</p>
                            </div>
                            <p className="text-xs text-gray-500 font-medium mt-1">Vence: {formatDate(d.dueDate)}</p>
                        </div>
                        <div className="text-right">
                             <p className="font-black text-emerald-600 text-lg">{d.amount.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</p>
                             <div className="flex justify-end gap-2 mt-2">
                                {d.isQuote ? (
                                    <button 
                                        onClick={() => navigate(`/quotes/edit/${d.originId}`)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-md text-xs font-bold transition-all"
                                    >
                                        Ver / Receber <ArrowRight className="h-3 w-3" />
                                    </button>
                                ) : (
                                    <>
                                        <button 
                                            onClick={() => openPayModal(d.id)}
                                            className="p-1.5 bg-white text-gray-500 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 rounded-md transition-all shadow-sm"
                                            title="Confirmar Recebimento"
                                        >
                                            <Check className="h-4 w-4" />
                                        </button>
                                        <button onClick={() => removeDebt(d.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md border border-transparent hover:border-red-100 transition-all">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </>
                                )}
                             </div>
                        </div>
                    </div>
                ))}
                 {receivables.length === 0 && (
                    <div className="p-12 text-center text-gray-400 text-sm font-medium">
                        Nenhum valor a receber registado.
                    </div>
                )}
            </div>
        </div>
      </div>

       {/* Create Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold text-gray-900">Nova Dívida Manual</h3>
                <button onClick={() => setIsModalOpen(false)}><X className="h-5 w-5 text-gray-500" /></button>
            </div>
            
            <form onSubmit={handleAddDebt} className="space-y-5">
              {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200 font-bold">{error}</div>}
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Entidade (Quem?)</label>
                <input required type="text" value={entity} onChange={e => setEntity(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none font-bold" placeholder="Ex: Banco BIM ou Primo Zé" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor (MT)</label>
                    <input required type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none font-black text-lg" placeholder="0.00" min="0.01" step="0.01" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vencimento</label>
                    <input required type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full border border-gray-300 rounded-xl p-3 bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer font-medium" />
                  </div>
              </div>

              <div>
                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tipo de Registo</label>
                 <div className="grid grid-cols-2 gap-3">
                     <button type="button" onClick={() => setType(DebtType.BORROWED)} className={`py-3 rounded-xl border-2 transition-all ${type === DebtType.BORROWED ? 'bg-red-50 border-red-500 text-red-700 font-bold shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-500 font-medium'}`}>A Pagar</button>
                     <button type="button" onClick={() => setType(DebtType.LENT)} className={`py-3 rounded-xl border-2 transition-all ${type === DebtType.LENT ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold shadow-sm' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-500 font-medium'}`}>A Receber</button>
                 </div>
              </div>

              <div className="pt-2">
                  <button type="submit" className="w-full py-3.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 shadow-lg font-bold transition-transform active:scale-95">Salvar Registo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Confirmation Modal (Only for Manual Debts) */}
      {payModalOpen && selectedDebtId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center animate-in zoom-in-95">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmar Liquidação</h3>
                  <p className="text-gray-500 text-sm mb-6">Esta ação irá movimentar o saldo da conta selecionada.</p>
                  
                  <div className="text-left mb-4">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Conta de Movimento</label>
                      <select 
                        value={paymentAccount} 
                        onChange={e => setPaymentAccount(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3 text-sm font-bold bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                          {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.balance.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT)</option>)}
                      </select>
                  </div>

                  <div className="flex gap-3">
                      <button onClick={() => setPayModalOpen(false)} className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 font-bold">Cancelar</button>
                      <button onClick={confirmPay} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold shadow-md">Confirmar</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
