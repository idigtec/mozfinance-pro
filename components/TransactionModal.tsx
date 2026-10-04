import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { TransactionType, Currency, Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { Tooltip } from './ui/Tooltip';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
  initialType?: TransactionType; // New Prop
  initialAccountId?: string;     // New Prop
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ 
    isOpen, 
    onClose, 
    transactionToEdit, 
    initialType, 
    initialAccountId 
}) => {
  const { accounts, addTransaction, updateTransaction } = useFinance();
  
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);

  // Effect to populate or reset form
  useEffect(() => {
    if (isOpen) {
        setError(null);
        if (transactionToEdit) {
            // Edit Mode
            setType(transactionToEdit.type);
            setAmount(transactionToEdit.amount.toString());
            setAccountId(transactionToEdit.accountId);
            setToAccountId(transactionToEdit.toAccountId || '');
            setCategory(transactionToEdit.category);
            setDescription(transactionToEdit.description);
            setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
        } else {
            // Create Mode
            setType(initialType || TransactionType.EXPENSE);
            setAmount('');
            setAccountId(initialAccountId || accounts[0]?.id || '');
            setToAccountId('');
            setCategory(CATEGORIES[0]);
            setDescription('');
            setDate(new Date().toISOString().split('T')[0]);
        }
    }
  }, [isOpen, transactionToEdit, accounts, initialType, initialAccountId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validações Robustas
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
        setError("O valor da transação deve ser maior que zero.");
        return;
    }
    
    if (!accountId) {
        setError("Selecione uma conta.");
        return;
    }

    if (!date) {
        setError("A data é obrigatória.");
        return;
    }

    // Basic Validation for Transfer
    if (type === TransactionType.TRANSFER) {
      if (!toAccountId) {
          setError("Selecione a conta de destino.");
          return;
      }
      if (accountId === toAccountId) {
          setError("A conta de destino deve ser diferente da conta de origem.");
          return;
      }
    }

    const payload = {
        accountId,
        toAccountId: type === TransactionType.TRANSFER ? toAccountId : undefined,
        amount: val,
        currency: accounts.find(a => a.id === accountId)?.currency || Currency.MZN,
        category: type === TransactionType.TRANSFER ? 'Transferência' : category,
        date: new Date(date).toISOString(),
        description: description || (type === TransactionType.TRANSFER ? 'Transferência entre contas' : 'Sem descrição'),
        type
    };

    if (transactionToEdit) {
        updateTransaction({
            ...transactionToEdit,
            ...payload
        });
    } else {
        addTransaction(payload);
    }

    onClose();
    setAmount('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 flex justify-between items-center border-b border-slate-800">
          <h2 className="text-lg font-bold">
              {transactionToEdit ? 'Editar Transação' : (type === TransactionType.TRANSFER ? 'Nova Transferência' : 'Nova Transação')}
          </h2>
          <Tooltip content="Fechar janela">
            <button onClick={onClose} className="hover:bg-slate-800 p-1.5 rounded-full transition text-gray-400 hover:text-white" aria-label="Fechar">
              <X className="h-5 w-5" />
            </button>
          </Tooltip>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-900 font-bold">
                {error}
            </div>
          )}

          {/* Transaction Type Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-xl border border-gray-200 dark:border-slate-700">
            {Object.values(TransactionType).map((t) => (
              <Tooltip key={t} content={`Registrar operação como ${t}`}>
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 text-sm font-bold rounded-lg transition ${
                    type === t 
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-gray-200 dark:ring-slate-600' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {t}
                </button>
              </Tooltip>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-bold text-gray-800 dark:text-slate-200 mb-1">Valor</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full rounded-xl border-gray-300 dark:border-slate-700 border bg-white dark:bg-slate-800 text-gray-900 dark:text-white pl-3 pr-12 py-3 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 font-bold shadow-sm text-lg"
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 sm:text-sm font-bold">MT</span>
              </div>
            </div>
          </div>

          {/* Source Account */}
          <div>
            <label className="block text-sm font-bold text-gray-800 dark:text-slate-200 mb-1">
              {type === TransactionType.INCOME ? 'Conta de Destino' : 'Conta de Origem'}
            </label>
            <select
              required
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="block w-full rounded-xl border-gray-300 dark:border-slate-700 border bg-white dark:bg-slate-800 text-gray-900 dark:text-white py-3 px-3 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm cursor-pointer font-medium"
            >
              <option value="" disabled>Selecione a conta</option>
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>
              ))}
            </select>
          </div>

          {/* Transfer Destination Account */}
          {type === TransactionType.TRANSFER && (
            <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-100 dark:border-blue-900/50">
              <label className="block text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">Para (Conta Destino)</label>
              <select
                required
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                className="block w-full rounded-xl border-blue-300 dark:border-blue-700 border bg-white dark:bg-slate-800 text-gray-900 dark:text-white py-3 px-3 focus:ring-blue-500 focus:border-blue-500 shadow-sm cursor-pointer font-medium"
              >
                <option value="" disabled>Selecione o destino</option>
                {accounts.filter(a => a.id !== accountId).map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>
                ))}
              </select>
            </div>
          )}

          {/* Category */}
          {type !== TransactionType.TRANSFER && (
            <div>
              <label className="block text-sm font-bold text-gray-800 dark:text-slate-200 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full rounded-xl border-gray-300 dark:border-slate-700 border bg-white dark:bg-slate-800 text-gray-900 dark:text-white py-3 px-3 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm cursor-pointer font-medium"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="block text-sm font-bold text-gray-800 dark:text-slate-200 mb-1">Data</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full rounded-xl border-gray-300 dark:border-slate-700 border bg-white dark:bg-slate-800 text-gray-900 dark:text-white py-3 px-3 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm cursor-pointer font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-800 dark:text-slate-200 mb-1">Descrição</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Compra de recarga"
              className="block w-full rounded-xl border-gray-300 dark:border-slate-700 border bg-white dark:bg-slate-800 text-gray-900 dark:text-white py-3 px-3 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 font-medium shadow-sm"
            />
          </div>

          <Tooltip content="Confirmar e registrar lançamento no balanço">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors mt-4 cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Salvar {type === TransactionType.TRANSFER ? 'Transferência' : 'Transação'}</span>
            </button>
          </Tooltip>
        </form>
      </div>
    </div>
  );
};