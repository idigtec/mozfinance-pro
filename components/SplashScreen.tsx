import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle2, HardDrive, Wifi, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  appName?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onFinish, 
  appName = "MozFinance Pro" 
}) => {
  const [progress, setProgress] = useState(15);
  const [step, setStep] = useState(0);

  const steps = [
    { label: 'A inicializar armazenamento local seguro...', icon: HardDrive },
    { label: 'A carregar plano contabilístico e empresas...', icon: CreditCard },
    { label: 'A verificar motor de sincronização offline...', icon: Wifi },
    { label: 'Sessão e integridade de dados validadas!', icon: ShieldCheck }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(40);
      setStep(1);
    }, 450);

    const timer2 = setTimeout(() => {
      setProgress(75);
      setStep(2);
    }, 900);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStep(3);
    }, 1400);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white p-6 select-none overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md flex flex-col items-center text-center relative z-10">
        {/* App Logo */}
        <div className="relative mb-6">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-emerald-600 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-500/30 border border-emerald-400/30 animate-pulse">
            <CreditCard className="h-12 w-12 text-white" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md">
            v2.4
          </span>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">
          {appName}
        </h1>
        <p className="text-sm font-semibold text-emerald-400 mb-6">
          microMoney • Gestão Financeira & Offline-First
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl mb-6 text-left">
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2 font-medium">
            <span className="flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-emerald-400" />
              {steps[step]?.label}
            </span>
            <span className="font-mono text-emerald-400 font-bold">{progress}%</span>
          </div>

          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Checklist of services */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
            {steps.map((s, idx) => {
              const isDone = step > idx || (step === idx && progress === 100);
              const isCurrent = step === idx && progress < 100;
              const Icon = s.icon;
              return (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Icon className={`h-3.5 w-3.5 ${isDone ? 'text-emerald-400' : isCurrent ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`} />
                    <span className={isDone ? 'text-slate-200' : isCurrent ? 'text-white font-medium' : 'text-slate-500'}>
                      {s.label.split('...')[0]}
                    </span>
                  </div>
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Offline Badge info */}
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-800/60">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>Suporte total offline • Persistência local ativada</span>
        </div>

        {/* Skip button for instant entry */}
        <button
          onClick={onFinish}
          className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer py-1 px-3 rounded-lg hover:bg-slate-900"
        >
          <span>Entrar imediatamente</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
