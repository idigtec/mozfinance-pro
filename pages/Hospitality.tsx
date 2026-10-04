
import React from 'react';
import { Bed, Users, Calendar, Utensils, Key, Star } from 'lucide-react';

export const Hospitality = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Módulo de Hotelaria</h2>
          <p className="text-gray-500 text-sm">Gestão de reservas, quartos e serviços</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-sm font-bold flex items-center gap-2">
          <Calendar className="h-4 w-4" /> Nova Reserva
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Check-ins Hoje</p>
          <p className="text-2xl font-black text-emerald-600">0</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Quartos Livres</p>
          <p className="text-2xl font-black text-blue-600">0</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Ocupação</p>
          <p className="text-2xl font-black text-orange-600">0%</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase mb-1">Receita Prevista</p>
          <p className="text-2xl font-black text-gray-900">0 MT</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <Bed className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Gestão Hoteleira</h3>
          <p className="text-gray-500 mb-6">Módulo em desenvolvimento para gestão completa de hotéis, pensões e alojamentos.</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500"><Key className="h-4 w-4 text-blue-500" /> Gestão de Chaves</div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500"><Utensils className="h-4 w-4 text-orange-500" /> Restaurante & Bar</div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500"><Users className="h-4 w-4 text-emerald-500" /> Fichas de Hóspedes</div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500"><Star className="h-4 w-4 text-yellow-500" /> Housekeeping</div>
          </div>
        </div>
      </div>
    </div>
  );
};
