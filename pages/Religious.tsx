
import React from 'react';
import { Heart, Users, Calendar, DollarSign, BookOpen, Music } from 'lucide-react';

export const Religious = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Módulo Religioso</h2>
          <p className="text-gray-500 text-sm">Gestão de membros, dízimos, ofertas e eventos</p>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-sm font-bold flex items-center gap-2">
          <Heart className="h-4 w-4" /> Novo Membro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">Membros: 0</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Comunidade</h3>
          <p className="text-gray-500 text-sm">Registo e acompanhamento de membros</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Este Mês: 0 MT</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Dízimos & Ofertas</h3>
          <p className="text-gray-500 text-sm">Controlo de contribuições</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Próximos: 0</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">Eventos & Cultos</h3>
          <p className="text-gray-500 text-sm">Agenda e planeamento</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="max-w-md mx-auto">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Gestão Eclesiástica</h3>
          <p className="text-gray-500 mb-6">Ferramentas dedicadas para a organização de instituições religiosas e comunidades.</p>
          <div className="flex justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <Music className="h-5 w-5 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-500 uppercase">Ministérios</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-500 uppercase">Grupos</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-500 uppercase">Escalamento</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
