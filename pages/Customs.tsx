
import React from 'react';
import { Ship, Package, FileText, Globe, Shield, AlertCircle, Search } from 'lucide-react';

export const Customs = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Módulo Aduaneiro</h2>
          <p className="text-gray-500 text-sm">Processos de importação, exportação e desembaraço</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-sm font-bold flex items-center gap-2">
          <Globe className="h-4 w-4" /> Novo Processo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Ship className="h-4 w-4" />
            <span className="text-xs font-bold uppercase">Importações</span>
          </div>
          <p className="text-2xl font-black text-gray-900">0</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <Globe className="h-4 w-4" />
            <span className="text-xs font-bold uppercase">Exportações</span>
          </div>
          <p className="text-2xl font-black text-gray-900">0</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-bold uppercase">Pendentes</span>
          </div>
          <p className="text-2xl font-black text-gray-900">0</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 text-slate-600 mb-2">
            <Shield className="h-4 w-4" />
            <span className="text-xs font-bold uppercase">Taxas Pagas</span>
          </div>
          <p className="text-2xl font-black text-gray-900">0 MT</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Despacho Aduaneiro</h3>
          <p className="text-gray-500 mb-6">Módulo especializado para despachantes e empresas de logística internacional.</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500"><FileText className="h-4 w-4 text-blue-500" /> Documentação</div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500"><Package className="h-4 w-4 text-orange-500" /> Gestão de Contentores</div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500"><Search className="h-4 w-4 text-emerald-500" /> Tracking de Carga</div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500"><Shield className="h-4 w-4 text-slate-500" /> Compliance & Taxas</div>
          </div>
        </div>
      </div>
    </div>
  );
};
