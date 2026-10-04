import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AppUser, UserRole } from '../types';
import { 
  Users, 
  Plus, 
  Check, 
  X, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Mail, 
  Phone, 
  Briefcase, 
  Trash2,
  KeyRound,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { users, currentUser, switchUser, addUser, updateUser, deleteUser } = useAuth();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'FINANCIAL_MANAGER' as UserRole,
    phone: '',
    department: '',
    pinCode: '1234',
    avatarUrl: ''
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Nome e email são obrigatórios.');
      return;
    }

    addUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      phone: formData.phone.trim() || undefined,
      department: formData.department.trim() || 'Operações',
      pinCode: formData.pinCode.trim() || '1234',
      avatarUrl: formData.avatarUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isActive: true,
      companyIds: ['all']
    });

    setIsAddModalOpen(false);
    setFormData({
      name: '',
      email: '',
      role: 'FINANCIAL_MANAGER',
      phone: '',
      department: '',
      pinCode: '1234',
      avatarUrl: ''
    });
  };

  const roleLabels: Record<UserRole, { label: string; badge: string; desc: string }> = {
    ADMIN: { 
      label: 'Administrador Geral', 
      badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300',
      desc: 'Acesso total a todas as empresas, configurações de sincronização e relatórios fiscais.'
    },
    FINANCIAL_MANAGER: { 
      label: 'Gestora Financeira', 
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
      desc: 'Gestão de contas, receitas, despesas, conciliação e aprovação de orçamentos.'
    },
    OPERATOR: { 
      label: 'Operador de Caixa / POS', 
      badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
      desc: 'Registo de vendas no POS, emissão de faturas-recibo e conferência de caixa.'
    },
    AUDITOR: { 
      label: 'Auditor Fiscal', 
      badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300',
      desc: 'Consulta de auditoria, conformidade IVA/DGI e relatórios analíticos.'
    }
  };

  const permissionsMatrix = [
    { module: 'Lançamentos (Receitas/Despesas)', admin: true, finance: true, operator: true, auditor: 'Leitura' },
    { module: 'Contas Bancárias & Conciliação', admin: true, finance: true, operator: false, auditor: 'Leitura' },
    { module: 'Orçamentos & Rateio Compartilhado', admin: true, finance: true, operator: false, auditor: 'Leitura' },
    { module: 'Módulo Fiscal (DGI & Guias)', admin: true, finance: true, operator: false, auditor: true },
    { module: 'Gestão de Frotas & Produção', admin: true, finance: true, operator: true, auditor: 'Leitura' },
    { module: 'Configurações de Sincronização & Backup', admin: true, finance: false, operator: false, auditor: false },
    { module: 'Gestão de Utilizadores & Permissões', admin: true, finance: false, operator: false, auditor: false }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Gestão de Utilizadores & Sessões
            </h1>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Controlo de acessos baseados em perfis (RBAC), multi-utilizador e alternância instantânea.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-900/30 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>+ Convidar / Criar Utilizador</span>
        </button>
      </div>

      {/* Users Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map(u => {
          const isCurrent = currentUser?.id === u.id;
          const roleInfo = roleLabels[u.role] || { label: u.role, badge: 'bg-gray-100 text-gray-800', desc: '' };

          return (
            <div 
              key={u.id}
              className={`p-5 rounded-2xl border transition-all relative overflow-hidden bg-white dark:bg-slate-900 ${
                isCurrent 
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' 
                  : 'border-gray-200 dark:border-slate-800 shadow-sm hover:border-gray-300'
              }`}
            >
              {isCurrent && (
                <span className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl shadow-sm">
                  Sessão Activa
                </span>
              )}

              <div className="flex items-start gap-3 mb-4">
                <img
                  src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                  alt={u.name}
                  className="h-12 w-12 rounded-xl object-cover border border-gray-200 dark:border-slate-700 shrink-0"
                />
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <span>{u.name}</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded border ${roleInfo.badge}`}>
                    {roleInfo.label}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {roleInfo.desc}
              </p>

              <div className="pt-3 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400 font-mono">
                  {u.department || 'Geral'}
                </span>

                <div className="flex items-center gap-2">
                  {!isCurrent ? (
                    <button
                      onClick={() => switchUser(u.id)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Alternar para esta Sessão</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      Utilizador Actual
                    </span>
                  )}

                  {!isCurrent && (
                    <button
                      onClick={() => {
                        if (confirm(`Deseja remover o utilizador ${u.name}?`)) {
                          deleteUser(u.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden p-5">
        <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-emerald-600" />
          <span>Matriz de Acessos e Perfis de Segurança (RBAC)</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 uppercase font-semibold text-[10px] tracking-wider border-b border-gray-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Módulo do Sistema</th>
                <th className="py-3 px-4 text-center">Administrador</th>
                <th className="py-3 px-4 text-center">Gestora Financeira</th>
                <th className="py-3 px-4 text-center">Operador Caixa</th>
                <th className="py-3 px-4 text-center">Auditor Fiscal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-gray-800 dark:text-gray-200">
                    {row.module}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Total</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.finance ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">Total</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.operator ? (
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Operar</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                      {row.auditor === true ? 'Total' : row.auditor}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Novo Utilizador */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span>Adicionar Novo Utilizador</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alberto Chissano"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Endereço de E-mail *
                </label>
                <input
                  type="email"
                  required
                  placeholder="alberto@idigtec.co.mz"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Perfil de Acesso
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="ADMIN">Administrador</option>
                    <option value="FINANCIAL_MANAGER">Gestora Financeira</option>
                    <option value="OPERATOR">Operador Caixa</option>
                    <option value="AUDITOR">Auditor Fiscal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    PIN Inicial (4 dígitos)
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Departamento
                </label>
                <input
                  type="text"
                  placeholder="Ex: Tesouraria ou Contabilidade"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer"
                >
                  Criar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
