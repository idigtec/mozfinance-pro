import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Customer } from '../types';
import { Plus, Search, Edit2, Trash2, User, Phone, Mail, MapPin, X, Save, Building } from 'lucide-react';

export const Customers = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useFinance();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Customer>>({});

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.nuit?.includes(search) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
        setEditingCustomer(customer);
        setFormData(customer);
    } else {
        setEditingCustomer(null);
        setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingCustomer) {
        updateCustomer({ ...editingCustomer, ...formData } as Customer);
    } else {
        addCustomer(formData as Omit<Customer, 'id'>);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-500 text-sm">Gerencie sua carteira de clientes</p>
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-sm flex items-center gap-2 font-medium"
        >
          <Plus className="h-4 w-4" /> Novo Cliente
        </button>
      </div>

      {/* Search */}
      <div className="relative bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por nome, NUIT ou email..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-gray-50 rounded-lg focus:ring-emerald-500 text-gray-900 text-sm"
          />
      </div>

      {/* List / Table View */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">Cliente / Empresa</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Contactos</th>
                <th className="px-6 py-4 font-semibold text-gray-700">NUIT & Endereço</th>
                <th className="px-6 py-4 font-semibold text-gray-700 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50 transition group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">{customer.name}</p>
                            {customer.contactPerson && (
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <User className="h-3 w-3" /> {customer.contactPerson}
                                </p>
                            )}
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-gray-600">
                        {customer.email ? (
                            <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-gray-400" /> 
                                <span>{customer.email}</span>
                            </div>
                        ) : <span className="text-xs text-gray-400 italic">Sem email</span>}
                        {customer.phone ? (
                            <div className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-gray-400" /> 
                                <span>{customer.phone}</span>
                            </div>
                        ) : <span className="text-xs text-gray-400 italic">Sem telefone</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="space-y-1">
                        {customer.nuit ? (
                            <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs font-mono font-medium text-gray-700 border border-gray-200">
                                NUIT: {customer.nuit}
                            </span>
                        ) : <span className="text-xs text-gray-400 italic block">Sem NUIT</span>}
                        
                        {customer.address && (
                            <div className="flex items-start gap-1 text-gray-500 text-xs mt-1 max-w-[200px]">
                                <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" /> 
                                <span className="truncate">{customer.address}</span>
                            </div>
                        )}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => handleOpenModal(customer)} 
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Editar"
                        >
                            <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                            onClick={() => { if(confirm('Apagar cliente?')) deleteCustomer(customer.id) }} 
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Apagar"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                        Nenhum cliente encontrado.
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-gray-900">{editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-full"><X className="h-5 w-5 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome da Empresa / Cliente *</label>
                        <input required value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 bg-white rounded-lg p-3 focus:ring-emerald-500 text-gray-900 font-medium shadow-sm" placeholder="Ex: Mozal S.A." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">NUIT</label>
                            <input value={formData.nuit || ''} onChange={e => setFormData({...formData, nuit: e.target.value})} className="w-full border border-gray-300 bg-white rounded-lg p-3 focus:ring-emerald-500 text-gray-900 font-medium shadow-sm" placeholder="Ex: 400..." />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Telefone</label>
                            <input value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-300 bg-white rounded-lg p-3 focus:ring-emerald-500 text-gray-900 font-medium shadow-sm" placeholder="+258..." />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                        <input type="email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border border-gray-300 bg-white rounded-lg p-3 focus:ring-emerald-500 text-gray-900 font-medium shadow-sm" placeholder="email@empresa.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Pessoa de Contacto</label>
                        <input value={formData.contactPerson || ''} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="w-full border border-gray-300 bg-white rounded-lg p-3 focus:ring-emerald-500 text-gray-900 font-medium shadow-sm" placeholder="Nome do representante" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Endereço</label>
                        <textarea rows={3} value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border border-gray-300 bg-white rounded-lg p-3 focus:ring-emerald-500 text-gray-900 font-medium shadow-sm" placeholder="Endereço físico..." />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 flex justify-center items-center gap-2 shadow-lg transition transform active:scale-95">
                            <Save className="h-5 w-5" /> Salvar Cliente
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};