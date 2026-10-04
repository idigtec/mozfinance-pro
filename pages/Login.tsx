import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSync } from '../context/SyncContext';
import { 
  CreditCard, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Wifi, 
  WifiOff, 
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';

export const Login: React.FC = () => {
  const { users, login, switchUser, isAuthenticated, currentUser } = useAuth();
  const { effectiveOnline, isSimulatedOffline } = useSync();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError('Por favor, informe o seu e-mail.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(email, pin || undefined);
      setLoading(false);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.message);
      }
    }, 400);
  };

  const handleQuickLogin = (userId: string) => {
    switchUser(userId);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 -left-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Network banner */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          {effectiveOnline ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Rede Online
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <WifiOff className="h-3.5 w-3.5" />
              Modo Offline Activo
            </span>
          )}
        </div>
        <span className="text-slate-400 text-[11px]">
          Sessão local segura
        </span>
      </div>

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        {/* Brand header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-950">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              microMoney <span className="text-xs uppercase px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-400 font-bold border border-emerald-500/30">Pro</span>
            </h1>
            <p className="text-xs text-slate-400">Inicie sessão para aceder às suas finanças</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              E-mail do Utilizador
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@idigtec.co.mz"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                PIN ou Palavra-passe
              </label>
              <span className="text-[11px] text-slate-500 hover:text-emerald-400 cursor-pointer">
                Esqueceu o PIN?
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Insira o seu PIN de 4 dígitos"
                maxLength={8}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
              />
              <span>Manter sessão guardada localmente</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>A autenticar...</span>
            ) : (
              <>
                <span>Entrar no Sistema</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Switcher */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-emerald-400" />
              Perfis de Acesso Rápido
            </span>
            <span className="text-[10px] text-slate-500">1-clique</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {users.map((u) => {
              const roleLabels: Record<string, { label: string; badge: string }> = {
                ADMIN: { label: 'Administrador', badge: 'bg-emerald-950 text-emerald-300 border-emerald-800' },
                FINANCIAL_MANAGER: { label: 'Gestora Fin.', badge: 'bg-blue-950 text-blue-300 border-blue-800' },
                OPERATOR: { label: 'Operador Caixa', badge: 'bg-amber-950 text-amber-300 border-amber-800' },
                AUDITOR: { label: 'Auditora', badge: 'bg-purple-950 text-purple-300 border-purple-800' }
              };
              const roleInfo = roleLabels[u.role] || { label: u.role, badge: 'bg-slate-800 text-slate-300 border-slate-700' };

              return (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u.id)}
                  type="button"
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition-all text-left cursor-pointer group"
                >
                  <img
                    src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                    alt={u.name}
                    className="h-8 w-8 rounded-lg object-cover border border-slate-700 group-hover:border-emerald-400 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-200 truncate group-hover:text-emerald-300">
                      {u.name}
                    </p>
                    <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded border font-medium ${roleInfo.badge}`}>
                      {roleInfo.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Offline notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>Dados encriptados e persistidos no dispositivo local.</span>
        </div>
      </div>
    </div>
  );
};
