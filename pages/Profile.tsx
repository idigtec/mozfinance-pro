import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  ShieldCheck, 
  Lock, 
  Check, 
  KeyRound, 
  Calendar,
  Sparkles,
  History
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const { companies, auditLogs } = useFinance();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [pinCode, setPinCode] = useState(currentUser?.pinCode || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      department: department.trim(),
      pinCode: pinCode.trim(),
      avatarUrl: avatarUrl.trim() || undefined
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const userLogs = auditLogs.filter(log => log.userId === 'admin' || log.userId === currentUser?.id).slice(0, 8);

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Perfil do Utilizador
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Dados da conta, permissões e preferências de segurança local.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold animate-in fade-in">
            <Check className="h-4 w-4" />
            <span>Perfil actualizado!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center text-center">
          <div className="relative mb-4">
            <img
              src={avatarUrl || currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              className="h-24 w-24 rounded-2xl object-cover border-4 border-emerald-500 shadow-lg"
            />
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[9px] uppercase shadow">
              {currentUser?.role || 'ADMIN'}
            </span>
          </div>

          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {currentUser?.name}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {currentUser?.email}
          </p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {currentUser?.department || 'Gestão Executiva'}
          </span>

          <div className="w-full mt-6 pt-6 border-t border-gray-100 dark:border-slate-800 text-left space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Estado da Conta:</span>
              <span className="font-bold text-emerald-600">Activo (Local)</span>
            </div>
            <div className="flex justify-between">
              <span>Membro desde:</span>
              <span className="font-mono">
                {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('pt-MZ') : '2026-01-10'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Último Acesso:</span>
              <span className="font-mono">Hoje, {new Date().toLocaleTimeString('pt-MZ').slice(0, 5)}</span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Editar Informações Pessoais</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Número de Telefone
                </label>
                <input
                  type="text"
                  placeholder="+258 84 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Departamento / Pelouro
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  PIN de Acesso Rápido (4 dígitos)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="****"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                URL da Foto de Perfil (Avatar)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md cursor-pointer transition-all"
              >
                Guardar Dados do Perfil
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Activity History */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <History className="h-4 w-4 text-blue-500" />
          <span>Actividade Recente da Sessão</span>
        </h3>

        <div className="space-y-3">
          {userLogs.map(log => (
            <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800 text-xs">
              <div>
                <span className="font-bold text-gray-800 dark:text-gray-200 block">{log.details}</span>
                <span className="text-[10px] text-gray-400 font-mono">Acção: {log.action}</span>
              </div>
              <span className="text-gray-400 font-mono text-[11px]">
                {new Date(log.timestamp).toLocaleTimeString('pt-MZ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
