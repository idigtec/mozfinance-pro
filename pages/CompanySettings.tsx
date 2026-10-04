import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CompanyProfile } from '../types';
import { 
  Save, 
  Building2, 
  Image as ImageIcon, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2,
  UtensilsCrossed,
  Pill,
  Bike,
  Truck,
  Store,
  HardHat,
  Laptop,
  Briefcase,
  Bed,
  Globe,
  Layers,
  Check,
  X,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  SectorType, 
  SECTOR_DEFINITIONS, 
  SYSTEM_MODULES, 
  SectorDefinition 
} from '../constants/sectorModules';

const SECTOR_OPTIONS: { type: SectorType; label: string; icon: any; color: string }[] = [
  { type: 'RESTAURANT', label: 'Restaurante / Bar / Takeaway', icon: UtensilsCrossed, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200' },
  { type: 'PHARMACY', label: 'Farmácia / Medicamentos', icon: Pill, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' },
  { type: 'DELIVERY', label: 'Delivery / Estafetas & Entregas', icon: Bike, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/40 border-sky-200' },
  { type: 'RETAIL', label: 'Comércio & Retalho / Loja', icon: Store, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200' },
  { type: 'CONSTRUCTION', label: 'Construção Civil & Empreitadas', icon: HardHat, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40 border-orange-200' },
  { type: 'TECH', label: 'Tecnologia & Serviços Digitais', icon: Laptop, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200' },
  { type: 'SERVICES', label: 'Serviços & Consultoria', icon: Briefcase, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200' },
  { type: 'HOSPITALITY', label: 'Hotelaria & Turismo', icon: Bed, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40 border-teal-200' },
  { type: 'CUSTOMS', label: 'Despacho Aduaneiro & Trânsito', icon: Globe, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200' },
  { type: 'OTHER', label: 'Gestão Empresarial Geral', icon: Building2, color: 'text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-200' },
];

export const CompanySettings = () => {
  const { companies, addCompany, updateCompany, deleteCompany, activeCompanyId, setActiveCompanyId } = useFinance();
  const [isEditing, setIsEditing] = useState(false);
  const [sectorValidationError, setSectorValidationError] = useState<string | null>(null);
  
  const emptyCompany: Omit<CompanyProfile, 'id'> = {
      name: '', nuit: '', address: '', city: '', phone: '', email: '', 
      additionalPhones: [], additionalEmails: [],
      website: '', bankDetails: '', logoUrl: '', isDefault: false,
      businessType: '' as any,
      enabledModules: []
  };

  const [formData, setFormData] = useState<Partial<CompanyProfile>>(emptyCompany);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCustomModule, setNewCustomModule] = useState('');

  const handleCreate = () => {
      setFormData(emptyCompany);
      setEditingId(null);
      setSectorValidationError(null);
      setIsEditing(true);
  };

  const handleEdit = (company: CompanyProfile) => {
      setFormData({
        ...company,
        businessType: company.businessType || 'OTHER' as any,
        enabledModules: company.enabledModules || (SECTOR_DEFINITIONS[company.businessType as SectorType]?.defaultModules) || ['finance', 'fiscal', 'inventory']
      });
      setEditingId(company.id);
      setSectorValidationError(null);
      setIsEditing(true);
  };

  const handleSelectSector = (sector: SectorType) => {
    setSectorValidationError(null);
    const sectorDef = SECTOR_DEFINITIONS[sector];
    const defaultMods = sectorDef ? [...sectorDef.defaultModules] : ['finance', 'fiscal', 'inventory', 'pos', 'hr'];
    setFormData(prev => ({
      ...prev,
      businessType: sector,
      sector: sectorDef ? sectorDef.title : prev.sector,
      enabledModules: defaultMods
    }));
  };

  const handleToggleModule = (moduleId: string) => {
    setFormData(prev => {
      const current = prev.enabledModules || [];
      const updated = current.includes(moduleId)
        ? current.filter(m => m !== moduleId)
        : [...current, moduleId];
      return { ...prev, enabledModules: updated };
    });
  };

  const handleAddCustomModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomModule.trim()) return;
    const clean = newCustomModule.trim();
    setFormData(prev => ({
      ...prev,
      enabledModules: [...(prev.enabledModules || []), clean]
    }));
    setNewCustomModule('');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhone = () => {
    setFormData(prev => ({ ...prev, additionalPhones: [...(prev.additionalPhones || []), ''] }));
  };

  const handleRemovePhone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalPhones: prev.additionalPhones?.filter((_, i) => i !== index)
    }));
  };

  const handleAdditionalPhoneChange = (index: number, value: string) => {
    setFormData(prev => {
      const newPhones = [...(prev.additionalPhones || [])];
      newPhones[index] = value;
      return { ...prev, additionalPhones: newPhones };
    });
  };

  const handleAddEmail = () => {
    setFormData(prev => ({ ...prev, additionalEmails: [...(prev.additionalEmails || []), ''] }));
  };

  const handleRemoveEmail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalEmails: prev.additionalEmails?.filter((_, i) => i !== index)
    }));
  };

  const handleAdditionalEmailChange = (index: number, value: string) => {
    setFormData(prev => {
      const newEmails = [...(prev.additionalEmails || [])];
      newEmails[index] = value;
      return { ...prev, additionalEmails: newEmails };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.businessType) {
      setSectorValidationError("Selecção obrigatória: Por favor escolha o sector de negócio (Restaurante, Farmácia, Construção, Tecnologia, Retalho, etc.) para definir os módulos operacionais da empresa.");
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSectorValidationError(null);
    if (editingId) {
        updateCompany({ ...formData, id: editingId } as CompanyProfile);
    } else {
        addCompany(formData as Omit<CompanyProfile, 'id'>);
    }
    setIsEditing(false);
  };

  const handleDelete = (id: string) => {
      if(companies.length <= 1) {
          alert("Você precisa ter pelo menos uma empresa cadastrada.");
          return;
      }
      if (confirm("Tem certeza que deseja apagar esta empresa?")) {
          deleteCompany(id);
      }
  };

  const currentSectorType = (formData.businessType as SectorType) || 'OTHER';
  const sectorDef = SECTOR_DEFINITIONS[currentSectorType];

  if (isEditing) {
      return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      {editingId ? 'Editar Empresa & Sector' : 'Nova Empresa do Grupo'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Configure os dados fiscais, seleccione o tipo de negócio e active as funcionalidades sob medida.
                    </p>
                </div>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-bold text-xs bg-gray-100 dark:bg-slate-800 px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Sector Validation Error Banner */}
                {sectorValidationError && (
                    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 flex items-center gap-3 animate-shake">
                        <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
                        <span className="text-xs font-bold">{sectorValidationError}</span>
                    </div>
                )}

                {/* 1. SELECÇÃO DO TIPO DE NEGÓCIO / SECTOR */}
                <div className={`bg-white dark:bg-slate-900 rounded-3xl shadow-sm border p-6 md:p-8 space-y-4 transition-all ${
                    sectorValidationError && !formData.businessType 
                        ? 'border-rose-400 ring-2 ring-rose-400/20' 
                        : 'border-gray-200 dark:border-slate-800'
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Passo 1 • Arquitectura Sectorial</span>
                                <span className="text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold px-1.5 py-0.5 rounded">Obrigatório</span>
                            </div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">Qual é o Tipo de Negócio desta Empresa?</h3>
                            <p className="text-xs text-gray-500">
                              A selecção irá pré-configurar automaticamente os módulos operacionais (Restaurante, Farmácia, Delivery, Retalho, etc.).
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                        {SECTOR_OPTIONS.map(opt => {
                            const Icon = opt.icon;
                            const isSelected = formData.businessType === opt.type;
                            return (
                                <button
                                    key={opt.type}
                                    type="button"
                                    onClick={() => handleSelectSector(opt.type)}
                                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                                        isSelected
                                            ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/30'
                                            : 'border-gray-200 dark:border-slate-800 hover:border-emerald-300 bg-gray-50/40 dark:bg-slate-800/40'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-xl ${opt.color}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-xs text-gray-900 dark:text-white block">{opt.label}</span>
                                            {isSelected && <Check className="h-4 w-4 text-emerald-600" />}
                                        </div>
                                        <span className="text-[10px] text-gray-500 mt-0.5 block">
                                            {SECTOR_DEFINITIONS[opt.type]?.defaultModules.length || 6} funcionalidades recomendadas
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {sectorDef && (
                        <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                            <Sparkles className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs space-y-1">
                                <p className="font-bold text-gray-900 dark:text-white">{sectorDef.title}: {sectorDef.subtitle}</p>
                                <p className="text-gray-500">{sectorDef.description}</p>
                                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">{sectorDef.regulatoryInfo}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. FUNCIONALIDADES & MÓDULOS ATIVOS */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 md:p-8 space-y-5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                        <div>
                            <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Passo 2 • Funcionalidades do Sistema</span>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">
                                Gestão Modular de Funcionalidades ({formData.enabledModules?.length || 0} Ativas)
                            </h3>
                            <p className="text-xs text-gray-500">
                                Active ou desactive os módulos conforme as necessidades operacionais desta empresa.
                            </p>
                        </div>

                        {/* Reset to defaults button */}
                        {sectorDef && (
                            <button
                                type="button"
                                onClick={() => handleSelectSector(currentSectorType)}
                                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 cursor-pointer"
                            >
                                Restaurar Padrões do Sector
                            </button>
                        )}
                    </div>

                    {/* Modules Checklist */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                        {SYSTEM_MODULES.map(module => {
                            const isEnabled = formData.enabledModules?.includes(module.id);
                            const isSectorRecommended = module.recommendedFor.includes(currentSectorType);

                            return (
                                <div
                                    key={module.id}
                                    onClick={() => handleToggleModule(module.id)}
                                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                                        isEnabled
                                            ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-300 dark:border-blue-900/50'
                                            : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isEnabled}
                                        onChange={() => {}}
                                        className="h-4 w-4 rounded text-blue-600 mt-1 cursor-pointer"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="font-bold text-xs text-gray-900 dark:text-white">
                                                {module.shortName}
                                            </span>
                                            {module.badge && (
                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                                    {module.badge}
                                                </span>
                                            )}
                                            {isSectorRecommended && !module.badge && (
                                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950">
                                                    Sugerido
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">
                                            {module.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Add Custom Functionality Form */}
                    <div className="pt-4 border-t border-gray-100 dark:border-slate-800">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Deseja adicionar mais funcionalidades personalizadas a esta empresa?
                        </label>
                        <div className="flex gap-2 max-w-lg">
                            <input
                                type="text"
                                value={newCustomModule}
                                onChange={e => setNewCustomModule(e.target.value)}
                                placeholder="Ex: Lavandaria Externa, Balança de Precisão, Rastreio GPS..."
                                className="flex-1 p-2.5 rounded-xl border border-gray-300 dark:border-slate-700 text-xs bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={handleAddCustomModule}
                                className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase hover:bg-slate-800 transition cursor-pointer flex items-center gap-1"
                            >
                                <Plus className="h-3.5 w-3.5" /> Adicionar
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. DADOS OFICIAIS & FISCAIS */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 md:p-8 space-y-6">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Passo 3 • Dados Legais & Fiscais (Moçambique)</span>
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Logo */}
                        <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                            <div className="w-48 h-48 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-slate-800 overflow-hidden relative group">
                                {formData.logoUrl ? (
                                    <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                                        <span className="text-xs font-bold">Carregar Logotipo</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition pointer-events-none font-bold text-xs">Alterar</div>
                            </div>
                        </div>

                        {/* Inputs */}
                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">Razão Social / Nome da Empresa</label>
                                <input required name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Maré Alta Restaurante, Lda" className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-3 text-xs font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">NUIT (Número Fiscal)</label>
                                <input required name="nuit" value={formData.nuit} onChange={handleChange} className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-3 text-xs font-bold font-mono text-gray-900 dark:text-white" placeholder="Ex: 400123456" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">Cidade / Província</label>
                                <input required name="city" value={formData.city} onChange={handleChange} placeholder="Ex: Maputo, Matola, Beira" className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-3 text-xs font-medium text-gray-900 dark:text-white" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">Endereço Completo</label>
                                <input required name="address" value={formData.address} onChange={handleChange} placeholder="Av. Julius Nyerere nº 123" className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-3 text-xs font-medium text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">Email Principal</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="contacto@empresa.co.mz" className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-3 text-xs font-medium text-gray-900 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">Telefone Principal</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+258 84 123 4567" className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-3 text-xs font-medium text-gray-900 dark:text-white" />
                            </div>
                            
                            {/* Additional Emails */}
                            <div className="col-span-1">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">Emails Adicionais</label>
                                    <button type="button" onClick={handleAddEmail} className="text-emerald-600 text-xs font-bold flex items-center gap-1 cursor-pointer">
                                        <Plus className="h-3.5 w-3.5" /> Adicionar
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.additionalEmails?.map((email, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input type="email" value={email} onChange={(e) => handleAdditionalEmailChange(index, e.target.value)} className="flex-1 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white" placeholder="outro@empresa.co.mz" />
                                            <button type="button" onClick={() => handleRemoveEmail(index)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl border border-red-200 cursor-pointer">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Phones */}
                            <div className="col-span-1">
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">Telefones Adicionais</label>
                                    <button type="button" onClick={handleAddPhone} className="text-emerald-600 text-xs font-bold flex items-center gap-1 cursor-pointer">
                                        <Plus className="h-3.5 w-3.5" /> Adicionar
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.additionalPhones?.map((phone, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input type="tel" value={phone} onChange={(e) => handleAdditionalPhoneChange(index, e.target.value)} className="flex-1 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-2.5 text-xs text-gray-900 dark:text-white" placeholder="82 000 0000" />
                                            <button type="button" onClick={() => handleRemovePhone(index)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl border border-red-200 cursor-pointer">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200 dark:border-slate-800" />
                    <div>
                        <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">Dados Bancários / NIB & M-Pesa (Impressão em Facturas)</label>
                        <textarea name="bankDetails" value={formData.bankDetails} onChange={handleChange} rows={3} className="w-full border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl p-3 text-gray-900 dark:text-white text-xs font-mono shadow-sm" placeholder="BIM: 0001... | BCI: 0008... | M-Pesa: 84..."></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-wider hover:bg-emerald-700 flex items-center gap-2 shadow-xl transition cursor-pointer">
                            <Save className="h-4 w-4" /> Salvar Empresa & Funcionalidades
                        </button>
                    </div>
                </div>
            </form>
        </div>
      );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-6 w-6 text-emerald-600" />
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Minhas Empresas & Módulos</h2>
            </div>
            <p className="text-xs text-gray-500">
              Gestão multissectorial do grupo empresarial (Restaurantes, Farmácias, Deliveries, Construção, etc.).
            </p>
        </div>
        <button 
          onClick={handleCreate} 
          className="bg-emerald-600 text-white px-5 py-3 rounded-2xl hover:bg-emerald-700 shadow-lg flex items-center gap-2 font-black text-xs uppercase tracking-wider transition cursor-pointer"
        >
            <Plus className="h-4 w-4" /> Nova Empresa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map(company => {
              const sectorOpt = SECTOR_OPTIONS.find(s => s.type === company.businessType) || SECTOR_OPTIONS[SECTOR_OPTIONS.length - 1];
              const SectorIcon = sectorOpt.icon;
              const isActive = activeCompanyId === company.id;
              const modulesCount = company.enabledModules?.length || 0;

              return (
                  <div 
                    key={company.id} 
                    className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all relative flex flex-col justify-between ${
                        isActive
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'border-gray-200 dark:border-slate-800'
                    }`}
                  >
                      <div>
                          {/* Top controls */}
                          <div className="flex justify-between items-start mb-4">
                              <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 border ${sectorOpt.color}`}>
                                  <SectorIcon className="h-3.5 w-3.5" />
                                  {sectorOpt.label.split('/')[0].trim()}
                              </span>
                              
                              <div className="flex gap-1">
                                  <button onClick={() => handleEdit(company)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer">
                                      <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button onClick={() => handleDelete(company.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer">
                                      <Trash2 className="h-4 w-4" />
                                  </button>
                              </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mb-4">
                              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                  {company.logoUrl ? <img src={company.logoUrl} className="w-full h-full object-contain" /> : <Building2 className="h-8 w-8 text-gray-300" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                  <h3 className="font-black text-gray-900 dark:text-white text-base truncate">{company.name}</h3>
                                  <p className="text-[11px] text-gray-500 font-medium uppercase">{company.city || 'Moçambique'}</p>
                                  <span className="font-mono text-[10px] text-gray-400">NUIT: {company.nuit}</span>
                              </div>
                          </div>
                          
                          {/* Modules pill preview */}
                          <div className="mb-4 pt-3 border-t border-gray-100 dark:border-slate-800">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                                  Funcionalidades ({modulesCount} activas):
                              </span>
                              <div className="flex flex-wrap gap-1">
                                  {company.enabledModules?.slice(0, 4).map(modId => {
                                      const mod = SYSTEM_MODULES.find(m => m.id === modId);
                                      return (
                                          <span key={modId} className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">
                                              {mod ? mod.shortName : modId}
                                          </span>
                                      );
                                  })}
                                  {modulesCount > 4 && (
                                      <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                                          +{modulesCount - 4} mais
                                      </span>
                                  )}
                              </div>
                          </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
                          <button
                              onClick={() => setActiveCompanyId(company.id)}
                              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                  isActive
                                      ? 'bg-emerald-600 text-white shadow-md'
                                      : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 hover:text-emerald-600'
                              }`}
                          >
                              {isActive ? <CheckCircle2 className="h-4 w-4" /> : null}
                              <span>{isActive ? 'Empresa Ativa' : 'Ativar no Sistema'}</span>
                          </button>

                          {/* Quick link to sector module */}
                          {company.businessType === 'RESTAURANT' && (
                              <Link to="/restaurant" title="Abrir Módulo Restaurante" className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 hover:bg-amber-100 border border-amber-200">
                                  <UtensilsCrossed className="h-4 w-4" />
                              </Link>
                          )}
                          {company.businessType === 'PHARMACY' && (
                              <Link to="/pharmacy" title="Abrir Módulo Farmácia" className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
                                  <Pill className="h-4 w-4" />
                              </Link>
                          )}
                          {company.businessType === 'DELIVERY' && (
                              <Link to="/delivery" title="Abrir Módulo Delivery" className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 hover:bg-sky-100 border border-sky-200">
                                  <Bike className="h-4 w-4" />
                              </Link>
                          )}
                          {company.businessType === 'TECH' && (
                              <Link to="/tech" title="Abrir Módulo Tecnologia & TI" className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 hover:bg-blue-100 border border-blue-200">
                                  <Laptop className="h-4 w-4" />
                              </Link>
                          )}
                          {company.businessType === 'CONSTRUCTION' && (
                              <Link to="/construction" title="Abrir Módulo Construção Civil" className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-700 hover:bg-orange-100 border border-orange-200">
                                  <HardHat className="h-4 w-4" />
                              </Link>
                          )}
                      </div>
                  </div>
              );
          })}
      </div>
    </div>
  );
};
