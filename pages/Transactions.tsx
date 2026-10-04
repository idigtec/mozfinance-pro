import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionModal } from '../components/TransactionModal';
import { Plus, Search, Filter, Trash2, Edit2, Download, HelpCircle } from 'lucide-react';
import { TransactionType, Transaction } from '../types';
import { Tooltip } from '../components/ui/Tooltip';

export const Transactions = () => {
  const { transactions, getAccountName, removeTransaction, accounts } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('');
  
  // States for Edit/Delete
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(filter.toLowerCase()) || 
    t.category.toLowerCase().includes(filter.toLowerCase())
  );

  // --- Logic for Balance After Transaction ---
  // We need to calculate this per account, respecting date order.
  // Since we are showing a filtered list, showing "Balance After" might be confusing if some rows are hidden.
  // However, the calculation must always consider ALL transactions to be accurate.
  
  const transactionsWithBalance = useMemo(() => {
    // 1. Group transactions by Account
    const accountTxMap: Record<string, Transaction[]> = {};
    transactions.forEach(tx => {
        if (!accountTxMap[tx.accountId]) accountTxMap[tx.accountId] = [];
        accountTxMap[tx.accountId].push(tx);
        
        // Handle Transfer Destination Side (Virtual for visualization in a flat list?)
        // The current data model stores transfers as a single transaction with `toAccountId`.
        // To show "Balance After" for the destination account, we would need a row for it.
        // For simplicity in this view, we calculate Balance After for the Source Account (accountId).
    });

    // 2. Sort by date ASC to build balance
    // But wait, we have the CURRENT balance. It's safer to work BACKWARDS from current balance 
    // because we might not have the "Initial Balance" stored historically, only the current state.
    
    // Strategy: Map [TxID] -> BalanceAfter
    const balanceMap: Record<string, number> = {};

    accounts.forEach(acc => {
        let currentBal = acc.balance;
        
        // Get all transactions involving this account (Source OR Dest)
        // Note: The main list only lists the primary transaction object.
        // If we want to show balance for the 'toAccount' we'd need to duplicate rows.
        // Let's stick to the 'accountId' (Source/Main) balance for now to avoid UI chaos.
        
        const accTransactions = transactions.filter(t => t.accountId === acc.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Descending (Newest first)

        accTransactions.forEach(tx => {
            // The current 'currentBal' is the balance AFTER this transaction occurred (since we are going backwards)
            balanceMap[tx.id] = currentBal;

            // Reverse the operation to get the balance BEFORE this transaction (which is the After of the prev one)
            if (tx.type === TransactionType.INCOME) {
                currentBal -= tx.amount;
            } else {
                // Expense or Transfer Out
                currentBal += tx.amount;
            }
        });
    });

    return balanceMap;
  }, [transactions, accounts]);

  const handleEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (deletingTransactionId) {
        removeTransaction(deletingTransactionId);
        setDeletingTransactionId(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null); // Reset after close
  };

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) {
        alert("Nenhuma transação para exportar.");
        return;
    }

    const headers = "Data,Descrição,Categoria,Conta Origem,Conta Destino,Tipo,Valor,Moeda\n";
    const rows = filteredTransactions.map(t => {
        const date = new Date(t.date).toLocaleDateString();
        const desc = `"${t.description.replace(/"/g, '""')}"`; // Escape quotes
        const acc = getAccountName(t.accountId);
        const toAcc = t.toAccountId ? getAccountName(t.toAccountId) : '';
        return `${date},${desc},${t.category},${acc},${toAcc},${t.type},${t.amount},${t.currency}`;
    }).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transacoes_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Explicit Date Formatter
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Transações</h2>
           <p className="text-gray-600 text-sm">Registo de movimentos</p>
        </div>
        
        <div className="flex gap-2">
            <Tooltip content="Exportar extrato filtrado em formato CSV compatível com Excel">
              <button 
                  onClick={handleExportCSV}
                  className="flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-700 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm font-bold cursor-pointer"
              >
                  <Download className="h-4 w-4" />
                  <span className="hidden md:inline">Exportar CSV</span>
              </button>
            </Tooltip>

            <Tooltip content="Lançar nova receita, despesa ou transferência entre contas">
              <button 
                  onClick={() => {
                      setEditingTransaction(null);
                      setIsModalOpen(true);
                  }}
                  className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition shadow-sm font-bold cursor-pointer"
              >
                  <Plus className="h-4 w-4" />
                  <span>Registar</span>
              </button>
            </Tooltip>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por descrição ou categoria..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-500 font-medium"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <Tooltip content="Filtragem rápida e refinamento de lançamentos">
          <button className="p-2 border border-gray-300 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 cursor-pointer" aria-label="Filtrar">
            <Filter className="h-4 w-4" />
          </button>
        </Tooltip>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800/60 border-b border-gray-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-800 dark:text-slate-200">
                  <Tooltip content="Descrição ou finalidade e categoria da movimentação">
                    <span className="cursor-help inline-flex items-center gap-1">
                      Descrição <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                    </span>
                  </Tooltip>
                </th>
                <th className="px-6 py-4 font-bold text-gray-800 dark:text-slate-200">
                  <Tooltip content="Conta de liquidação ou carteira móvel (M-Pesa, e-Mola, Banco)">
                    <span className="cursor-help inline-flex items-center gap-1">
                      Conta <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                    </span>
                  </Tooltip>
                </th>
                <th className="px-6 py-4 font-bold text-gray-800 dark:text-slate-200">
                  <Tooltip content="Data em que o movimento foi registado">
                    <span className="cursor-help inline-flex items-center gap-1">
                      Data <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                    </span>
                  </Tooltip>
                </th>
                <th className="px-6 py-4 font-bold text-gray-800 dark:text-slate-200 text-right">
                  <Tooltip content="Quantia creditada (+) ou debitada (-)">
                    <span className="cursor-help inline-flex items-center gap-1 justify-end w-full">
                      Valor <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                    </span>
                  </Tooltip>
                </th>
                <th className="px-6 py-4 font-bold text-gray-800 dark:text-slate-200 text-right">
                  <Tooltip content="Saldo remanescente na conta de origem após a efetivação">
                    <span className="cursor-help inline-flex items-center gap-1 justify-end w-full">
                      Saldo Após <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                    </span>
                  </Tooltip>
                </th>
                <th className="px-6 py-4 font-bold text-gray-800 dark:text-slate-200 text-right">
                  <Tooltip content="Ações de gestão do registo">
                    <span className="cursor-help inline-flex items-center gap-1 justify-end w-full">
                      Ações
                    </span>
                  </Tooltip>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 dark:text-slate-100">{tx.description}</p>
                    <div className="flex gap-2 mt-1">
                        <Tooltip content={`Categoria orçamentária: ${tx.category}`}>
                          <span className="text-xs bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 cursor-default">
                            {tx.category}
                          </span>
                        </Tooltip>
                        {tx.type === TransactionType.TRANSFER && (
                          <Tooltip content="Movimentação interna entre contas da mesma empresa">
                            <span className="text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900 font-bold cursor-default">
                              Transferência
                            </span>
                          </Tooltip>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                      <p className="font-medium text-gray-800 dark:text-slate-200">{getAccountName(tx.accountId)}</p>
                      {tx.toAccountId && <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">➔ {getAccountName(tx.toAccountId)}</p>}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-slate-300 font-medium">{formatDate(tx.date)}</td>
                  <td className={`px-6 py-4 text-right font-black ${
                    tx.type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : 
                    tx.type === TransactionType.EXPENSE ? 'text-red-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'
                  }`}>
                    {tx.type === TransactionType.EXPENSE ? '-' : tx.type === TransactionType.INCOME ? '+' : ''}
                    {tx.amount.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">{tx.currency}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-600 dark:text-slate-400">
                      {/* Show Calculated Balance */}
                      {transactionsWithBalance[tx.id] !== undefined 
                        ? `${transactionsWithBalance[tx.id].toLocaleString()} ${tx.currency}` 
                        : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <Tooltip content="Editar dados da transação">
                          <button 
                              onClick={() => handleEdit(tx)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg border border-transparent hover:border-blue-100 dark:hover:border-blue-900 cursor-pointer"
                              aria-label="Editar"
                          >
                              <Edit2 className="h-4 w-4" />
                          </button>
                        </Tooltip>
                        <Tooltip content="Excluir este registo do balanço">
                          <button 
                              onClick={() => setDeletingTransactionId(tx.id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg border border-transparent hover:border-red-100 dark:hover:border-red-900 cursor-pointer"
                              aria-label="Apagar"
                          >
                              <Trash2 className="h-4 w-4" />
                          </button>
                        </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        transactionToEdit={editingTransaction}
      />

      {/* Delete Confirmation Modal */}
      {deletingTransactionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Trash2 className="h-6 w-6 text-red-600" />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-2">Apagar Transação?</h3>
             <p className="text-gray-600 text-sm mb-6 font-medium">
               Tem a certeza que deseja apagar esta transação? O saldo das contas será revertido.
             </p>
             <div className="flex space-x-3">
               <button 
                 onClick={() => setDeletingTransactionId(null)}
                 className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-bold text-gray-700"
               >
                 Cancelar
               </button>
               <button 
                 onClick={handleDelete}
                 className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold"
               >
                 Apagar
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};