
import React from 'react';
import { Truck, Fuel, Settings, Calendar, AlertTriangle, MapPin } from 'lucide-react';
import { Tooltip } from '../components/ui/Tooltip';

export const Fleet = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestão de Frotas</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Controlo de veículos, manutenção e combustível</p>
        </div>
        <Tooltip content="Registar um novo veículo na frota da empresa">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm font-bold flex items-center gap-2 transition-colors">
            <Truck className="h-4 w-4" /> Adicionar Veículo
          </button>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-1 rounded">Total: 0</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Veículos</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Frota ativa e disponível</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 dark:bg-orange-950/50 rounded-lg">
              <Settings className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-2 py-1 rounded">Pendentes: 0</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Manutenção</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Revisões e reparações</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg">
              <Fuel className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded">Este Mês: 0 MT</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Combustível</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Consumo e abastecimentos</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-12 text-center">
        <div className="max-w-md mx-auto">
          <Truck className="h-12 w-12 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Módulo de Frotas em Configuração</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Estamos a preparar as ferramentas para o controlo total da sua frota de veículos.</p>
          <div className="flex justify-center gap-4">
            <Tooltip content="Rastreamento em tempo real dos veículos da frota">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 cursor-help"><MapPin className="h-4 w-4" /> GPS Tracking</div>
            </Tooltip>
            <Tooltip content="Gestão de apólices e prazos de renovação de seguros">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 cursor-help"><Calendar className="h-4 w-4" /> Seguros</div>
            </Tooltip>
            <Tooltip content="Notificações preditivas de manutenções e inspeções periódicas">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 cursor-help"><AlertTriangle className="h-4 w-4" /> Alertas</div>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
