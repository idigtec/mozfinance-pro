import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { FinanceCategory, CategoryKind, TransactionType } from '../types';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Check, 
  X, 
  ShoppingBag, 
  Briefcase, 
  UtensilsCrossed, 
  Laptop, 
  Users, 
  Package, 
  Home, 
  Zap, 
  Truck, 
  Calculator, 
  CreditCard,
  Layers,
  Sparkles
} from 'lucide-react';

export const Categorias: React.FC = () => {
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    transactions, 
    expenses 
  } = useFinance();

  const [activeTab, setActiveTab] = useState<CategoryKind>('EXPENSE');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FinanceCategory | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'EXPENSE' as CategoryKind,
    color: '#ef4444',
    iconName: 'Tag',
    description: '',
    budgetMonthly: ''
  });

  const filteredCategories = useMemo(() => {
    return categories.filter(c => c.type === activeTab);
  }, [categories, activeTab]);

  // Compute live spending or income per category
  const categoryStats = useMemo(() => {
    const stats: Record<string, { totalAmount: number; count: number }> = {};
    categories.forEach(c => {
      stats[c.name] = { totalAmount: 0, count: 0 };
    });

    // Incomes from transactions
    transactions.forEach(t => {
      if (t.type === TransactionType.INCOME) {
        if (!stats[t.category]) stats[t.category] = { totalAmount: 0, count: 0 };
        stats[t.category].totalAmount += t.amount;
        stats[t.category].count += 1;
      }
    });

    // Expenses from transactions & expenses
    transactions.forEach(t => {
      if (t.type === TransactionType.EXPENSE) {
        if (!stats[t.category]) stats[t.category] = { totalAmount: 0, count: 0 };
        stats[t.category].totalAmount += t.amount;
        stats[t.category].count += 1;
      }
    });

    return stats;
  }, [categories, transactions]);

  const handleOpenAddModal = (kind: CategoryKind) => {
    setEditingCategory(null);
    setFormData({
      name: '',
      type: kind,
      color: kind === 'INCOME' ? '#10b981' : '#ef4444',
      iconName: kind === 'INCOME' ? 'TrendingUp' : 'Tag',
      description: '',
      budgetMonthly: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (category: FinanceCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      type: category.type,
      color: category.color,
      iconName: category.iconName,
      description: category.description || '',
      budgetMonthly: category.budgetMonthly ? String(category.budgetMonthly) : ''
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Por favor insira um nome para a categoria.');
      return;
    }

    const budget = formData.budgetMonthly ? parseFloat(formData.budgetMonthly) : undefined;

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: formData.name.trim(),
        type: formData.type,
        color: formData.color,
        iconName: formData.iconName,
        description: formData.description.trim() || undefined,
        budgetMonthly: budget
      });
    } else {
      addCategory({
        name: formData.name.trim(),
        type: formData.type,
        color: formData.color,
        iconName: formData.iconName,
        description: formData.description.trim() || undefined,
        budgetMonthly: budget
      });
    }

    setIsAddModalOpen(false);
  };

  const colorPalette = [
    '#10b981', '#06b6d4', '#3b82f6', '#6366f1', 
    '#8b5cf6', '#ec4899', '#ef4444', '#f97316', 
    '#f59e0b', '#84cc16', '#64748b', '#0f172a'
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Tag className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Categorias Personalizadas
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Organize os seus lançamentos de receitas e despesas com limites orçamentais e cores temáticas.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal(activeTab)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Nova Categoria</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('EXPENSE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'EXPENSE'
              ? 'bg-red-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <TrendingDown className="h-4 w-4" />
          <span>Categorias de Despesas ({categories.filter(c => c.type === 'EXPENSE').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('INCOME')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'INCOME'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Categorias de Receitas ({categories.filter(c => c.type === 'INCOME').length})</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const stats = categoryStats[cat.name] || { totalAmount: 0, count: 0 };
          const budget = cat.budgetMonthly || 0;
          const budgetPercentage = budget > 0 ? (stats.totalAmount / budget) * 100 : 0;
          const isOverBudget = budget > 0 && stats.totalAmount > budget;

          return (
            <div 
              key={cat.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between"
            >
              {/* Category color strip */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: cat.color }}
              />

              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    >
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {stats.count} {stats.count === 1 ? 'registo' : 'registos'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Editar"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    {!cat.isSystem && (
                      <button
                        onClick={() => {
                          if (confirm(`Pretende eliminar a categoria "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {cat.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                    {cat.description}
                  </p>
                )}

                {/* Real Recorded Total */}
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800/80 mb-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Movimentado:</span>
                    <span className={`font-black font-mono text-sm ${cat.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                      {stats.totalAmount.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })} MT
                    </span>
                  </div>
                </div>

                {/* Budget Bar if set */}
                {budget > 0 && (
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-gray-500">Limite Mensal: {budget.toLocaleString()} MT</span>
                      <span className={`font-mono font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-700 dark:text-gray-300'}`}>
                        {budgetPercentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isOverBudget ? 'bg-red-600' : budgetPercentage > 80 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, budgetPercentage)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Adicionar / Editar Categoria */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Tag className="h-4 w-4 text-emerald-600" />
                <span>{editingCategory ? 'Editar Categoria' : 'Nova Categoria Personalizada'}</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Consultoria Externa ou Logística Marítima"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Tipo de Lançamento
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as CategoryKind })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="EXPENSE">Despesa (Saída)</option>
                    <option value="INCOME">Receita (Entrada)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Orçamento Mensal (MT)
                  </label>
                  <input
                    type="number"
                    step="100"
                    placeholder="Opcional"
                    value={formData.budgetMonthly}
                    onChange={(e) => setFormData({ ...formData, budgetMonthly: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Cor da Etiqueta
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorPalette.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: c })}
                      className="h-7 w-7 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center"
                      style={{ 
                        backgroundColor: c, 
                        borderColor: formData.color === c ? '#ffffff' : 'transparent',
                        transform: formData.color === c ? 'scale(1.15)' : 'scale(1)'
                      }}
                    >
                      {formData.color === c && <Check className="h-3.5 w-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Descrição ou Finalidade
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Encargos específicos com aluguer de armazéns centrais."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer"
                >
                  {editingCategory ? 'Guardar Alterações' : 'Criar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
