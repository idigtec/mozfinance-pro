import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Tooltip } from './ui/Tooltip';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, hide prompt
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <Tooltip content="Instalar o microMoney no seu dispositivo para acesso rápido e offline">
        <button
          onClick={install}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs md:text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition active:scale-95"
        >
          <Download className="h-4 w-4" />
          {!compact && <span>Instalar App</span>}
        </button>
      </Tooltip>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <Tooltip content="Instruções para instalar o microMoney no iPhone/iPad">
          <button
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50 transition"
          >
            <Smartphone className="h-3.5 w-3.5" />
            {!compact && <span>Instalar no iOS</span>}
          </button>
        </Tooltip>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-gray-100 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-emerald-600" /> Instalar no iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Para instalar o <strong>microMoney</strong> no seu ecrã principal:<br />
                <span className="block mt-2 font-medium">1. Toque no ícone de <strong>Partilhar (Share)</strong> na barra do Safari.</span>
                <span className="block mt-1 font-medium">2. Deslize para baixo e toque em <strong>&quot;Adicionar ao Ecrã Principal&quot; (Add to Home Screen)</strong>.</span>
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 shadow-md transition"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
