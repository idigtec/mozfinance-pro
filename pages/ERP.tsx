
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Users, Briefcase, Landmark, Truck, 
  TrendingUp, Plus, Search, Filter,
  MoreVertical, Calendar, DollarSign,
  CheckCircle2, Clock, AlertCircle,
  Building2, Phone, Mail, Star
} from 'lucide-react';
import { LeadStatus } from '../types';

export const ERP = () => {
  const { 
    leads, projects, fixedAssets, suppliers,
    addLead, updateLead, addProject, addFixedAsset, addSupplier
  } = useFinance();
  
  const [activeTab, setActiveTab] = useState<'CRM' | 'PROJECTS' | 'ASSETS' | 'SUPPLIERS'>('CRM');

  const fmtMoney = (val: number) => val.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão Empresarial (ERP)</h2>
          <p className="text-gray-500 text-sm">Controlo avançado de CRM, Projetos, Ativos e Fornecedores</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-8 overflow-x-auto scrollbar-hide">
        {[
          { id: 'CRM', label: 'CRM & Vendas', icon: Users },
          { id: 'PROJECTS', label: 'Projetos', icon: Briefcase },
          { id: 'ASSETS', label: 'Ativos (Imobilizado)', icon: Landmark },
          { id: 'SUPPLIERS', label: 'Fornecedores', icon: Truck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-4 border-b-2 transition-all font-bold text-sm whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-emerald-600 text-emerald-600' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* CRM Tab */}
      {activeTab === 'CRM' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Total Leads</p>
              <p className="text-2xl font-black text-gray-900">{leads.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Pipeline Estimado</p>
              <p className="text-2xl font-black text-emerald-600">{fmtMoney(leads.reduce((acc, l) => acc + (l.value || 0), 0))}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Taxa de Conversão</p>
              <p className="text-2xl font-black text-blue-600">
                {leads.length > 0 ? ((leads.filter(l => l.status === LeadStatus.WON).length / leads.length) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Novos (Este Mês)</p>
              <p className="text-2xl font-black text-orange-600">{leads.filter(l => new Date(l.createdAt).getMonth() === new Date().getMonth()).length}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input type="text" placeholder="Pesquisar leads..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-emerald-500 w-64" />
                </div>
                <button className="p-2 hover:bg-white rounded-lg border border-gray-200 text-gray-500"><Filter className="h-4 w-4" /></button>
              </div>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-100">
                <Plus className="h-4 w-4" /> Novo Lead
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase text-gray-400 font-black tracking-wider border-b border-gray-100">
                    <th className="p-4">Nome / Empresa</th>
                    <th className="p-4">Origem</th>
                    <th className="p-4">Valor Est.</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4">Data</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="p-4">
                        <p className="font-bold text-gray-900">{lead.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {lead.phone && <span className="text-[10px] text-gray-400 flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</span>}
                          {lead.email && <span className="text-[10px] text-gray-400 flex items-center gap-1"><Mail className="h-3 w-3" /> {lead.email}</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">{lead.source}</span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-black text-gray-900">{fmtMoney(lead.value || 0)}</p>
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                          lead.status === LeadStatus.WON ? 'bg-emerald-100 text-emerald-700' :
                          lead.status === LeadStatus.LOST ? 'bg-red-100 text-red-700' :
                          lead.status === LeadStatus.PROPOSAL ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-gray-500">
                        {new Date(lead.createdAt).toLocaleDateString('pt-MZ')}
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-gray-600 transition-all">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'PROJECTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {projects.map(project => {
            const progress = (project.spent / project.budget) * 100;
            return (
              <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase mb-2 inline-block ${
                      project.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {project.status}
                    </span>
                    <h3 className="text-lg font-black text-gray-900">{project.name}</h3>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600"><MoreVertical className="h-4 w-4" /></button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-gray-400 uppercase">Orçamento</span>
                    <span className="text-gray-900">{fmtMoney(project.budget)}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-black">
                      <span className="text-gray-400 uppercase">Execução Financeira</span>
                      <span className={progress > 90 ? 'text-red-600' : 'text-emerald-600'}>{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${progress > 90 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${Math.min(100, progress)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Gasto</p>
                      <p className="text-sm font-black text-gray-900">{fmtMoney(project.spent)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Início</p>
                      <p className="text-sm font-black text-gray-900">{new Date(project.startDate).toLocaleDateString('pt-MZ')}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <button className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-all group">
            <div className="p-3 bg-gray-50 rounded-full mb-3 group-hover:bg-emerald-50">
              <Plus className="h-6 w-6" />
            </div>
            <span className="font-bold text-sm">Novo Projeto</span>
          </button>
        </div>
      )}

      {/* Assets Tab */}
      {activeTab === 'ASSETS' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-800">Mapa de Imobilizado</h3>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 font-bold text-sm flex items-center gap-2">
              <Plus className="h-4 w-4" /> Registar Ativo
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase text-gray-400 font-black tracking-wider border-b border-gray-100">
                  <th className="p-4">Ativo</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Compra</th>
                  <th className="p-4">Valor Aquisição</th>
                  <th className="p-4">Depreciação</th>
                  <th className="p-4">Valor Atual</th>
                  <th className="p-4 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {fixedAssets.map(asset => (
                  <tr key={asset.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{asset.name}</td>
                    <td className="p-4 text-xs text-gray-600">{asset.category}</td>
                    <td className="p-4 text-xs text-gray-500">{new Date(asset.purchaseDate).toLocaleDateString('pt-MZ')}</td>
                    <td className="p-4 text-sm font-bold text-gray-900">{fmtMoney(asset.purchaseValue)}</td>
                    <td className="p-4 text-xs font-bold text-red-600">-{asset.depreciationRate}%/ano</td>
                    <td className="p-4 text-sm font-black text-emerald-600">{fmtMoney(asset.currentValue)}</td>
                    <td className="p-4 text-right">
                      <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 uppercase">
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Suppliers Tab */}
      {activeTab === 'SUPPLIERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {suppliers.map(supplier => (
            <div key={supplier.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-emerald-200 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <Building2 className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < supplier.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              <h3 className="font-black text-gray-900 mb-1">{supplier.name}</h3>
              <p className="text-[10px] font-bold text-emerald-600 uppercase mb-4">{supplier.category}</p>
              
              <div className="space-y-2 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone className="h-3.5 w-3.5" /> {supplier.contact}
                </div>
                {supplier.email && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail className="h-3.5 w-3.5" /> {supplier.email}
                  </div>
                )}
              </div>
            </div>
          ))}
          <button className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-all">
            <Plus className="h-6 w-6 mb-2" />
            <span className="font-bold text-xs">Novo Fornecedor</span>
          </button>
        </div>
      )}
    </div>
  );
};
