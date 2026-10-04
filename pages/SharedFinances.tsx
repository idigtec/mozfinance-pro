import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { SharedGroup, SharedExpense, Currency } from '../types';
import { 
  Share2, 
  Plus, 
  Users, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  UserCheck, 
  ArrowRight, 
  X, 
  Wallet,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';

export const SharedFinances: React.FC = () => {
  const { 
    sharedGroups, 
    addSharedGroup, 
    sharedExpenses, 
    addSharedExpense, 
    settleSplitItem,
    accounts
  } = useFinance();

  const [activeGroupId, setActiveGroupId] = useState<string>(sharedGroups[0]?.id || '');
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  // Active group
  const currentGroup = useMemo(() => {
    return sharedGroups.find(g => g.id === activeGroupId) || sharedGroups[0];
  }, [sharedGroups, activeGroupId]);

  // Expenses for active group
  const groupExpenses = useMemo(() => {
    if (!currentGroup) return [];
    return sharedExpenses.filter(e => e.groupId === currentGroup.id);
  }, [sharedExpenses, currentGroup]);

  // Group Financial Totals
  const totalSharedAmount = useMemo(() => {
    return groupExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [groupExpenses]);

  const pendingSettlements = useMemo(() => {
    let pendingCount = 0;
    let pendingTotal = 0;
    groupExpenses.forEach(e => {
      e.splits.forEach(s => {
        if (!s.isSettled) {
          pendingCount += 1;
          pendingTotal += s.amount;
        }
      });
    });
    return { count: pendingCount, total: pendingTotal };
  }, [groupExpenses]);

  // Form: Novo Grupo
  const [groupFormData, setGroupFormData] = useState({
    name: '',
    description: '',
    currency: Currency.MZN,
    member1: 'idigtec Soluções Lda',
    member2: 'Express Moz Logística',
    member3: 'Parceiro Externo'
  });

  // Form: Nova Despesa Partilhada
  const [expenseFormData, setExpenseFormData] = useState({
    title: '',
    amount: '',
    category: 'Infraestrutura & Operações',
    paidByMemberId: currentGroup?.members[0]?.id || '',
    splitType: 'PERCENTAGE' as 'EQUAL' | 'PERCENTAGE' | 'EXACT',
    notes: ''
  });

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupFormData.name.trim()) return;

    const members = [
      { id: `mem_${Date.now()}_1`, name: groupFormData.member1.trim() || 'Membro 1', role: 'OWNER' as const, shareRatio: 40 },
      { id: `mem_${Date.now()}_2`, name: groupFormData.member2.trim() || 'Membro 2', role: 'MEMBER' as const, shareRatio: 30 },
      { id: `mem_${Date.now()}_3`, name: groupFormData.member3.trim() || 'Membro 3', role: 'MEMBER' as const, shareRatio: 30 }
    ];

    addSharedGroup({
      name: groupFormData.name.trim(),
      description: groupFormData.description.trim() || undefined,
      currency: groupFormData.currency,
      members,
      color: '#10b981'
    });

    setIsAddGroupModalOpen(false);
  };

  const handleCreateSharedExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGroup) return;
    const parsedAmount = parseFloat(expenseFormData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Insira um montante válido.');
      return;
    }

    const payer = currentGroup.members.find(m => m.id === expenseFormData.paidByMemberId) || currentGroup.members[0];

    // Calculate splits
    const splits = currentGroup.members.map(m => {
      const splitAmount = (m.shareRatio / 100) * parsedAmount;
      return {
        memberId: m.id,
        memberName: m.name,
        amount: Math.round(splitAmount),
        isSettled: m.id === payer.id // The payer is already settled
      };
    });

    addSharedExpense({
      groupId: currentGroup.id,
      title: expenseFormData.title.trim(),
      amount: parsedAmount,
      currency: currentGroup.currency,
      paidByMemberId: payer.id,
      paidByMemberName: payer.name,
      date: new Date().toISOString().split('T')[0],
      category: expenseFormData.category,
      splitType: expenseFormData.splitType,
      splits,
      status: 'PENDING',
      notes: expenseFormData.notes.trim() || undefined
    });

    setIsAddExpenseModalOpen(false);
    setExpenseFormData({
      title: '',
      amount: '',
      category: 'Infraestrutura & Operações',
      paidByMemberId: currentGroup.members[0]?.id || '',
      splitType: 'PERCENTAGE',
      notes: ''
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Share2 className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Finanças Compartilhadas & Rateio
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Gestão de despesas conjuntas entre empresas do grupo, consórcios e parceiros de negócio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddGroupModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold text-xs cursor-pointer"
          >
            <Users className="h-4 w-4" />
            <span>+ Novo Grupo</span>
          </button>

          <button
            onClick={() => setIsAddExpenseModalOpen(true)}
            disabled={!currentGroup}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-900/30 cursor-pointer disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>+ Ratear Despesa</span>
          </button>
        </div>
      </div>

      {/* Group Selector Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {sharedGroups.map(g => (
          <button
            key={g.id}
            onClick={() => setActiveGroupId(g.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border ${
              activeGroupId === g.id 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-900/20' 
                : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>{g.name}</span>
            <span className="text-[10px] opacity-80 font-mono">({g.members.length} membros)</span>
          </button>
        ))}
      </div>

      {currentGroup && (
        <>
          {/* Group Overview Banner & KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Partilhado</span>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-1">
                {totalSharedAmount.toLocaleString('pt-MZ')} {currentGroup.currency}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">{groupExpenses.length} despesas registadas no consórcio</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Parcelas Pendentes</span>
              <div className="text-2xl font-black text-amber-500 font-mono mt-1">
                {pendingSettlements.total.toLocaleString('pt-MZ')} {currentGroup.currency}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">{pendingSettlements.count} reembolsos por liquidar</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Membros Participantes</span>
              <div className="flex items-center gap-1.5 mt-2">
                {currentGroup.members.map((m, idx) => (
                  <span 
                    key={idx}
                    className="inline-block px-2.5 py-1 rounded-xl text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 truncate"
                    title={`${m.name}: ${m.shareRatio}%`}
                  >
                    {m.name.split(' ')[0]} ({m.shareRatio}%)
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Expenses & Split Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Despesas Rateadas — {currentGroup.name}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                  {groupExpenses.length}
                </span>
              </h2>
            </div>

            {groupExpenses.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                <Share2 className="h-12 w-12 mx-auto text-gray-300 dark:text-slate-700 mb-3" />
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nenhuma despesa partilhada ainda</p>
                <p className="text-xs text-gray-500 mt-1">Adicione uma despesa para dividir automaticamente entre os membros.</p>
                <button
                  onClick={() => setIsAddExpenseModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md cursor-pointer hover:bg-blue-700"
                >
                  Registar Primeira Despesa Partilhada
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {groupExpenses.map(exp => (
                  <div key={exp.id} className="p-4 sm:p-5 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-gray-900 dark:text-white">{exp.title}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400">
                            {exp.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Pago por: <strong className="text-gray-800 dark:text-gray-200">{exp.paidByMemberName}</strong> • {new Date(exp.date).toLocaleDateString('pt-MZ')}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-black text-gray-900 dark:text-white font-mono">
                          {exp.amount.toLocaleString()} {exp.currency}
                        </div>
                        <span className={`text-[10px] font-bold uppercase ${exp.status === 'SETTLED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {exp.status === 'SETTLED' ? '100% Liquidado' : 'Rateio Pendente'}
                        </span>
                      </div>
                    </div>

                    {/* Member split cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-gray-100 dark:border-slate-800/60">
                      {exp.splits.map(split => (
                        <div 
                          key={split.memberId}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                            split.isSettled 
                              ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300' 
                              : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          <div>
                            <span className="font-bold block truncate max-w-[120px]">{split.memberName}</span>
                            <span className="font-mono text-[11px] font-semibold">{split.amount.toLocaleString()} MT</span>
                          </div>

                          {split.isSettled ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Liquidado
                            </span>
                          ) : (
                            <button
                              onClick={() => settleSplitItem(exp.id, split.memberId)}
                              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer shadow-sm"
                            >
                              Liquidar
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal: Novo Grupo */}
      {isAddGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span>Novo Grupo de Finanças Compartilhadas</span>
              </h3>
              <button onClick={() => setIsAddGroupModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Nome do Grupo / Parceria *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Consórcio Logístico Norte"
                  value={groupFormData.name}
                  onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Descrição do Rateio
                </label>
                <textarea
                  rows={2}
                  placeholder="Finalidade do grupo (ex: divisão de custos de escritório partilhado)"
                  value={groupFormData.description}
                  onChange={(e) => setGroupFormData({ ...groupFormData, description: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Participantes / Empresas Parceiras
                </label>
                <input
                  type="text"
                  placeholder="Participante 1 (40%)"
                  value={groupFormData.member1}
                  onChange={(e) => setGroupFormData({ ...groupFormData, member1: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs"
                />
                <input
                  type="text"
                  placeholder="Participante 2 (30%)"
                  value={groupFormData.member2}
                  onChange={(e) => setGroupFormData({ ...groupFormData, member2: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs"
                />
                <input
                  type="text"
                  placeholder="Participante 3 (30%)"
                  value={groupFormData.member3}
                  onChange={(e) => setGroupFormData({ ...groupFormData, member3: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddGroupModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer"
                >
                  Criar Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nova Despesa Partilhada */}
      {isAddExpenseModalOpen && currentGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Share2 className="h-4 w-4 text-blue-600" />
                <span>Nova Despesa Partilhada</span>
              </h3>
              <button onClick={() => setIsAddExpenseModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSharedExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Título da Despesa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Factura Mensal de Internet Fibra Sommerschield"
                  value={expenseFormData.title}
                  onChange={(e) => setExpenseFormData({ ...expenseFormData, title: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Valor Total (MT) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="0.00"
                    value={expenseFormData.amount}
                    onChange={(e) => setExpenseFormData({ ...expenseFormData, amount: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-bold text-blue-600 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Quem Efetuou o Pagamento?
                  </label>
                  <select
                    value={expenseFormData.paidByMemberId}
                    onChange={(e) => setExpenseFormData({ ...expenseFormData, paidByMemberId: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {currentGroup.members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Notas / Observações
                </label>
                <textarea
                  rows={2}
                  placeholder="Número de factura ou comprovativo..."
                  value={expenseFormData.notes}
                  onChange={(e) => setExpenseFormData({ ...expenseFormData, notes: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer"
                >
                  Efetuar Rateio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
