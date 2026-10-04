
import React, { useState, useMemo, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Material, Product, LaborProfile } from '../types';
import { 
  Package, Box, Calculator, TrendingUp, History, 
  Plus, Trash2, Edit2, X, AlertTriangle, 
  CheckCircle2, Factory, BarChart3, 
  Sparkles, AlertCircle, FileText, 
  LayoutList, DollarSign, Building2, Truck, Wrench, Users, Gem, Clock,
  Search, Filter, CalendarClock, Tag, ShieldCheck, Layers
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie } from 'recharts';
import { SECTOR_DEFINITIONS, getDefaultStockCategoriesForSector, SectorType } from '../constants/sectorModules';

export const Production = () => {
  const { 
    materials, addMaterial, updateMaterial, deleteMaterial,
    products, addProduct, updateProduct, deleteProduct,
    recordProduction, productionHistory, accounts, companies,
    getProductionProjection, getStockValuation, activeCompanyId, updateCompany
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'STOCK' | 'PRODUCTS' | 'CATEGORIES' | 'RUN' | 'ANALYTICS'>('STOCK');
  const [isMatModalOpen, setIsMatModalOpen] = useState(false);
  const [editingMat, setEditingMat] = useState<Material | null>(null);
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newCustomCategory, setNewCustomCategory] = useState<string>('');

  const effectiveCompanyId = activeCompanyId === 'all' ? (companies[0]?.id || 'default') : activeCompanyId;
  const currentCompany = companies.find(c => c.id === effectiveCompanyId);

  // Sector-based stock categories
  const currentSector: SectorType = (currentCompany?.businessType as SectorType) || 'OTHER';
  const sectorStockCategories = useMemo(() => {
    return getDefaultStockCategoriesForSector(currentSector);
  }, [currentSector]);

  // Combined categories: default sector categories + company custom categories + categories in existing items
  const allCategories = useMemo(() => {
    const existingMatCats = materials.map(m => m.category).filter(Boolean);
    const existingProdCats = products.map(p => p.category).filter(Boolean);
    const custom = currentCompany?.customCategories || [];
    return Array.from(new Set([...sectorStockCategories, ...custom, ...existingMatCats, ...existingProdCats]));
  }, [sectorStockCategories, currentCompany, materials, products]);

  // Filtered Materials with search & category
  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchCat = selectedCategory === 'ALL' || m.category === selectedCategory;
      const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (m.batchNumber && m.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (m.category && m.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [materials, selectedCategory, searchQuery]);

  // Filtered Products with search & category
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.batchNumber && p.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const filteredHistory = productionHistory;
  const stockValuation = getStockValuation(activeCompanyId);

  // Expiry check helper (FEFO)
  const getBatchExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Vencido', color: 'bg-red-600 text-white font-black', isAlert: true };
    }
    if (diffDays <= 30) {
      return { label: `Crítico (${diffDays}d)`, color: 'bg-red-500 text-white animate-pulse', isAlert: true };
    }
    if (diffDays <= 90) {
      return { label: `Atenção (${diffDays}d)`, color: 'bg-amber-500 text-stone-950 font-bold', isAlert: false };
    }
    return { label: `Válido (${Math.round(diffDays / 30)}m)`, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold', isAlert: false };
  };

  const handleAddCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomCategory.trim()) return;
    const cat = newCustomCategory.trim();
    if (currentCompany) {
      const updated = Array.from(new Set([...(currentCompany.customCategories || []), cat]));
      updateCompany(currentCompany.id, { customCategories: updated });
      setNewCustomCategory('');
      alert(`Categoria "${cat}" adicionada com sucesso ao catálogo da empresa!`);
    }
  };

  // --- Components ---

  const StockValuationCard = () => (
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex justify-between items-center overflow-hidden relative">
          <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">Capital Imobilizado em Stock</p>
              <p className="text-3xl font-black">{stockValuation.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-bold text-slate-500">MT</span></p>
          </div>
          <div className="bg-white/10 p-4 rounded-2xl">
              <TrendingUp className="h-8 w-8 text-emerald-500" />
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5">
              <Box className="h-32 w-32" />
          </div>
      </div>
  );

  const InventoryView = () => (
      <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <h3 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest flex items-center gap-2">
                      <Box className="h-4 w-4 text-emerald-600" /> Gestão de Insumos & Matérias-Primas ({filteredMaterials.length})
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Organização por categorias sectoriais e controlo de validade (FEFO).
                  </p>
              </div>

              <div className="flex items-center gap-2">
                  <button onClick={()=>{setEditingMat(null);setIsMatModalOpen(true)}} className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase hover:bg-emerald-700 shadow-lg transition-all flex items-center gap-2 cursor-pointer">
                      <Plus className="h-4 w-4" /> Adicionar Material
                  </button>
              </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800">
              <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                  <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Pesquisar material por nome, lote ou categoria..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full md:max-w-xl">
                  <button
                      onClick={() => setSelectedCategory('ALL')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                          selectedCategory === 'ALL'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                      }`}
                  >
                      Todas ({materials.length})
                  </button>
                  {allCategories.map(cat => {
                      const count = materials.filter(m => m.category === cat).length;
                      return (
                          <button
                              key={cat}
                              onClick={() => setSelectedCategory(cat)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                                  selectedCategory === cat
                                      ? 'bg-emerald-600 text-white shadow-sm'
                                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                              }`}
                          >
                              <span>{cat}</span>
                              {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
                          </button>
                      );
                  })}
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredMaterials.map(m => {
                  const isLow = m.stock <= m.minStock;
                  const expiryStatus = getBatchExpiryStatus(m.expiryDate);

                  return (
                      <div key={m.id} className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border-2 transition-all hover:shadow-lg flex flex-col justify-between ${isLow ? 'border-red-200 dark:border-red-900/50 bg-red-50/10' : 'border-gray-100 dark:border-slate-800'}`}>
                          <div>
                              <div className="flex justify-between items-start mb-3 gap-2">
                                  <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/30">
                                      {m.category || 'Geral'}
                                  </span>
                                  <div className="flex gap-1">
                                      <button onClick={()=>{setEditingMat(m);setIsMatModalOpen(true)}} className="p-1 text-gray-400 hover:text-blue-600"><Edit2 className="h-3 w-3"/></button>
                                      <button onClick={()=>{if(confirm('Apagar?'))deleteMaterial(m.id)}} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="h-3 w-3"/></button>
                                  </div>
                              </div>

                              <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{m.name}</h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">
                                  {m.stock} {m.unit} em stock {isLow && <span className="text-red-500 font-bold ml-1">(Abaixo do Mínimo!)</span>}
                              </p>

                              {(m.batchNumber || m.expiryDate) && (
                                  <div className="mb-3 p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800/60 text-[11px] space-y-1">
                                      {m.batchNumber && (
                                          <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                              <span className="text-gray-400">Lote:</span>
                                              <span className="font-mono font-bold">{m.batchNumber}</span>
                                          </div>
                                      )}
                                      {m.expiryDate && (
                                          <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                              <span className="text-gray-400">Validade:</span>
                                              <span className="font-mono">{m.expiryDate}</span>
                                          </div>
                                      )}
                                      {expiryStatus && (
                                          <div className="pt-1 flex justify-end">
                                              <span className={`px-2 py-0.5 rounded text-[9px] uppercase ${expiryStatus.color}`}>
                                                  {expiryStatus.label}
                                              </span>
                                          </div>
                                      )}
                                  </div>
                              )}
                          </div>

                          <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center">
                              <p className="text-[10px] font-black text-gray-400 uppercase">Custo Unit.</p>
                              <p className="font-bold text-gray-900 dark:text-white text-sm">{m.costPrice.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</p>
                          </div>
                      </div>
                  );
              })}
          </div>

          {filteredMaterials.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 text-gray-400">
                  <Box className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-bold uppercase">Nenhum material encontrado com os filtros atuais.</p>
              </div>
          )}
      </div>
  );

  const ProductCatalogView = () => (
      <div className="space-y-6 animate-in fade-in duration-500">
           <div className="flex justify-between items-center">
              <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" /> Gestão de Produtos & Custeio
              </h3>
              <button onClick={()=>{setEditingProd(null);setIsProdModalOpen(true)}} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase hover:bg-blue-700 shadow-lg transition-all flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Criar Novo Produto
              </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProducts.map(p => {
                  const matCost = p.bom.reduce((acc, i) => acc + (materials.find(m => m.id === i.materialId)?.costPrice || 0) * i.quantity, 0);
                  const laborCost = p.labor.peopleCount * p.labor.hoursWorked * p.labor.hourlyRate;
                  const opCost = p.electricityCost + p.packagingCost + p.transportCost + p.maintenanceCost + p.otherCosts;
                  const totalCost = p.purchasePrice ? p.purchasePrice : (matCost + laborCost + opCost);
                  const margin = p.salePrice > 0 ? ((p.salePrice - totalCost) / p.salePrice) * 100 : 0;
                  
                  const unitsPerPkg = p.unitsPerPackage || 1;
                  const pkgs = Math.floor((p.currentStock || 0) / unitsPerPkg);
                  const loose = (p.currentStock || 0) % unitsPerPkg;
                  const isWholesaleBlocked = p.stopWholesaleThreshold !== undefined && pkgs <= p.stopWholesaleThreshold;
                  const isLowStock = p.minStockLevel !== undefined && (p.currentStock || 0) <= p.minStockLevel;

                  return (
                      <div key={p.id} className={`bg-white rounded-3xl shadow-sm border overflow-hidden hover:shadow-xl transition-all ${isLowStock ? 'border-red-200' : 'border-gray-100'}`}>
                          <div className="p-6 bg-slate-50 border-b flex justify-between items-start">
                              <div>
                                  <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-black text-gray-900 uppercase text-base">{p.name}</h4>
                                      {p.qualityStatus && (
                                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                              p.qualityStatus === 'Excelente' ? 'bg-emerald-100 text-emerald-700' :
                                              p.qualityStatus === 'Bom' ? 'bg-blue-100 text-blue-700' :
                                              p.qualityStatus === 'Atenção' ? 'bg-yellow-100 text-yellow-700' :
                                              'bg-red-100 text-red-700'
                                          }`}>
                                              {p.qualityStatus}
                                          </span>
                                      )}
                                  </div>
                                  <div className="flex flex-col gap-1 mt-2">
                                      <p className="text-xs text-gray-600 font-bold">
                                          Estoque: <span className="text-blue-600">{pkgs} Cx</span> e <span className="text-emerald-600">{loose} Un</span> <span className="text-[10px] text-gray-400 font-medium">({p.currentStock || 0} Total)</span>
                                      </p>
                                      {isWholesaleBlocked && (
                                          <p className="text-[10px] font-black text-red-500 uppercase flex items-center gap-1">
                                              <AlertTriangle className="h-3 w-3" /> Venda a Grosso Bloqueada (Restam {pkgs} Cx)
                                          </p>
                                      )}
                                  </div>
                              </div>
                              <div className="flex gap-2">
                                  <button onClick={()=>{setEditingProd(p);setIsProdModalOpen(true)}} className="p-2 bg-white rounded-lg border border-gray-200 text-blue-600 hover:shadow-md"><Edit2 className="h-4 w-4"/></button>
                                  <button onClick={()=>{if(confirm('Apagar?'))deleteProduct(p.id)}} className="p-2 bg-white rounded-lg border border-gray-200 text-red-600 hover:shadow-md"><Trash2 className="h-4 w-4"/></button>
                              </div>
                          </div>
                          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="p-3 bg-gray-50 rounded-xl">
                                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Preço Compra / Custo</p>
                                  <p className="font-bold text-gray-900 text-sm">{totalCost.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-xl">
                                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Preço Venda (Grosso)</p>
                                  <p className="font-bold text-gray-900 text-sm">{(p.wholesalePrice || 0).toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</p>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-xl">
                                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Preço Unitário</p>
                                  <p className="font-black text-blue-600 text-sm">{p.salePrice.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</p>
                              </div>
                              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                  <p className="text-[8px] font-black text-emerald-600 uppercase mb-1">Margem</p>
                                  <p className="font-black text-emerald-700 text-sm">{margin.toFixed(1)}%</p>
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>
  );

  const FactoryRunView = () => {
      const [prodId, setProdId] = useState('');
      const [qty, setQty] = useState(1);
      const [accId, setAccId] = useState('');
      const [msg, setMsg] = useState<string | null>(null);

      const projection = getProductionProjection(prodId);
      const selectedProduct = filteredProducts.find(p => p.id === prodId);

      const handleExecute = () => {
          if (!prodId) return;
          const res = recordProduction(prodId, qty, { accountId: accId || undefined });
          setMsg(res.message);
          if (res.success) { setProdId(''); setQty(1); }
      };

      return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right duration-500">
              <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                      <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                          <Factory className="h-4 w-4 text-emerald-600" /> Registrar Lote
                      </h3>
                      <div className="space-y-4">
                          <div>
                              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Produto</label>
                              <select value={prodId} onChange={e=>setProdId(e.target.value)} className="w-full border-2 border-gray-100 p-4 rounded-2xl font-black bg-gray-50 focus:border-emerald-500 outline-none">
                                  <option value="">Selecione...</option>
                                  {filteredProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                              </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Quantidade</label>
                                  <input type="number" min="1" value={qty} onChange={e=>setQty(parseInt(e.target.value)||1)} className="w-full border-2 border-gray-100 p-4 rounded-2xl font-black text-center text-lg focus:border-emerald-500 outline-none" />
                              </div>
                              <div>
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Pagar Custos De</label>
                                  <select value={accId} onChange={e=>setAccId(e.target.value)} className="w-full border-2 border-gray-100 p-4 rounded-2xl font-bold bg-white text-xs">
                                      <option value="">Apenas Registrar</option>
                                      {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                  </select>
                              </div>
                          </div>
                          {projection.bottleneck && (
                              <div className={`p-4 rounded-2xl border text-xs font-bold ${qty > projection.maxUnits ? 'bg-red-50 border-red-100 text-red-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                                  {qty > projection.maxUnits ? (
                                      <p className="flex items-center gap-2"><AlertTriangle className="h-4 w-4"/> Stock insuficiente! Máximo possível: {projection.maxUnits} un.</p>
                                  ) : (
                                      <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4"/> Stock disponível para este lote.</p>
                                  )}
                                  <p className="mt-2 text-[10px] opacity-70 uppercase tracking-wider">Bottleneck detectado em: {projection.bottleneck}</p>
                              </div>
                          )}
                          <button onClick={handleExecute} disabled={!prodId || qty > projection.maxUnits} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-slate-800 disabled:opacity-30 transition-all">
                              Executar Produção
                          </button>
                          {msg && <p className="text-center text-[10px] font-black text-emerald-600 uppercase">{msg}</p>}
                      </div>
                  </div>
              </div>

              <div className="lg:col-span-2">
                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 min-h-[400px]">
                      <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-6">Histórico Recente de Produção</h3>
                      <div className="space-y-4">
                          {filteredHistory.slice(0, 10).map(h => (
                              <div key={h.id} className="flex justify-between items-center p-4 border border-gray-50 rounded-2xl hover:bg-gray-50 transition">
                                  <div className="flex items-center gap-4">
                                      <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400">{h.quantity}</div>
                                      <div>
                                          <p className="font-bold text-gray-900">{filteredProducts.find(p=>p.id===h.productId)?.name}</p>
                                          <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(h.date).toLocaleDateString()}</p>
                                      </div>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-xs font-black text-gray-900">-{h.totalInvestment.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</p>
                                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Investimento Lote</p>
                                  </div>
                              </div>
                          ))}
                          {filteredHistory.length === 0 && <div className="text-center py-20 text-gray-300 font-bold uppercase text-xs italic">Nenhuma produção registada.</div>}
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const CategoriesView = () => (
      <div className="space-y-6 animate-in fade-in duration-500">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                      <h3 className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-widest flex items-center gap-2">
                          <Tag className="h-5 w-5 text-emerald-600" />
                          Categorização de Estoque & Setores
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                          Categorias inteligentes adaptadas ao sector económico: <span className="font-bold text-emerald-600 uppercase">{currentSector}</span> ({SECTOR_DEFINITIONS[currentSector]?.title || 'Geral'}).
                      </p>
                  </div>
              </div>

              {/* Add Custom Category Form */}
              <form onSubmit={handleAddCustomCategory} className="flex gap-2 max-w-xl">
                  <input
                      type="text"
                      value={newCustomCategory}
                      onChange={e => setNewCustomCategory(e.target.value)}
                      placeholder="Adicionar nova categoria personalizada (Ex: Perecíveis, Embalagens VIP)..."
                      className="flex-1 p-3 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-bold"
                  />
                  <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase flex items-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                      <Plus className="h-4 w-4" /> Adicionar
                  </button>
              </form>

              {/* Sector Default Categories Grid */}
              <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">
                      Categorias Padrão do Sector ({currentSector})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {sectorStockCategories.map(cat => {
                          const matCount = materials.filter(m => m.category === cat).length;
                          const prodCount = products.filter(p => p.category === cat).length;
                          return (
                              <div
                                  key={cat}
                                  onClick={() => { setSelectedCategory(cat); setActiveTab('STOCK'); }}
                                  className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 hover:border-emerald-500 transition-all cursor-pointer group"
                              >
                                  <div className="flex justify-between items-center mb-1">
                                      <span className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-emerald-600">
                                          {cat}
                                      </span>
                                      <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                                          Padrão
                                      </span>
                                  </div>
                                  <p className="text-[10px] text-gray-500">
                                      {matCount} insumos • {prodCount} produtos
                                  </p>
                              </div>
                          );
                      })}
                  </div>
              </div>

              {/* Custom Categories Grid */}
              {(currentCompany?.customCategories && currentCompany.customCategories.length > 0) && (
                  <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">
                          Categorias Personalizadas da Empresa ({currentCompany.name})
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {currentCompany.customCategories.map(cat => {
                              const matCount = materials.filter(m => m.category === cat).length;
                              const prodCount = products.filter(p => p.category === cat).length;
                              return (
                                  <div
                                      key={cat}
                                      className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 flex justify-between items-center"
                                  >
                                      <div>
                                          <span className="font-bold text-xs text-gray-900 dark:text-white block">
                                              {cat}
                                          </span>
                                          <span className="text-[10px] text-gray-400">
                                              {matCount + prodCount} itens registados
                                          </span>
                                      </div>
                                      <button
                                          onClick={() => {
                                              if (confirm(`Remover categoria "${cat}"?`)) {
                                                  const updated = currentCompany.customCategories?.filter(c => c !== cat);
                                                  updateCompany(currentCompany.id, { customCategories: updated });
                                              }
                                          }}
                                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-white transition"
                                      >
                                          <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              )}
          </div>
      </div>
  );

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white p-8 rounded-[40px] shadow-2xl border border-gray-100 relative overflow-hidden">
          <div className="flex items-center gap-6 relative z-10">
              <div className="p-5 bg-slate-950 text-white rounded-[24px] shadow-2xl shadow-slate-200">
                  <Factory className="h-8 w-8" />
              </div>
              <div>
                  <h2 className="text-4xl font-black text-slate-950 tracking-tighter leading-none mb-2">PRODUÇÃO & CUSTOS</h2>
                  <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-black text-emerald-700 uppercase">
                          {activeCompanyId === 'all' ? 'Todas as Empresas' : companies.find(c => c.id === activeCompanyId)?.name || 'Empresa'}
                      </span>
                  </div>
              </div>
          </div>

          <div className="flex bg-gray-100 p-1.5 rounded-3xl border border-gray-200 shadow-inner relative z-10">
              {[
                  { id: 'STOCK', icon: Box, label: 'Stock' },
                  { id: 'PRODUCTS', icon: Calculator, label: 'Produtos' },
                  { id: 'CATEGORIES', icon: Tag, label: 'Categorias' },
                  { id: 'RUN', icon: Clock, label: 'Execução' },
                  { id: 'ANALYTICS', icon: TrendingUp, label: 'Analytics' },
              ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-xl scale-105 ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-900'}`}>
                      <tab.icon className="h-4 w-4" /><span className="hidden lg:inline">{tab.label}</span>
                  </button>
              ))}
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="h-40 w-40" />
          </div>
      </div>

      <main className="space-y-8">
          {activeTab === 'STOCK' && (
              <>
                  <StockValuationCard />
                  <InventoryView />
              </>
          )}
          {activeTab === 'PRODUCTS' && <ProductCatalogView />}
          {activeTab === 'CATEGORIES' && <CategoriesView />}
          {activeTab === 'RUN' && <FactoryRunView />}
          {activeTab === 'ANALYTICS' && (
              <div className="bg-white p-12 rounded-[40px] border-2 border-dashed border-gray-200 text-center flex flex-col items-center justify-center min-h-[500px]">
                  <BarChart3 className="h-20 w-20 text-gray-200 mb-6" />
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Motor de Inteligência Industrial</h3>
                  <p className="text-gray-400 text-sm max-w-sm mt-4 font-medium">Relatórios de rentabilidade de produto, eficiência de mão de obra e previsibilidade de stock em desenvolvimento.</p>
              </div>
          )}
      </main>

      {/* Modals Implementation (Simplified for context) */}
      <MaterialModal isOpen={isMatModalOpen} onClose={()=>setIsMatModalOpen(false)} initialData={editingMat} companyId={effectiveCompanyId} categories={allCategories} onSave={addMaterial} onUpdate={updateMaterial} />
      <ProductModal isOpen={isProdModalOpen} onClose={()=>setIsProdModalOpen(false)} initialData={editingProd} materials={filteredMaterials} companyId={effectiveCompanyId} categories={allCategories} onSave={addProduct} onUpdate={updateProduct} />
    </div>
  );
};

// --- MODALS SUB-COMPONENTS ---

const MaterialModal = ({ isOpen, onClose, initialData, companyId, categories, onSave, onUpdate }: any) => {
    const [form, setForm] = useState({ 
        name: '', 
        category: 'Geral', 
        unit: 'UN', 
        stock: 0, 
        minStock: 5, 
        costPrice: 0,
        batchNumber: '',
        expiryDate: '',
        location: '',
        isPerishable: false
    });

    useEffect(() => { 
        if(isOpen) setForm(initialData || { 
            name: '', 
            category: categories?.[0] || 'Geral', 
            unit: 'UN', 
            stock: 0, 
            minStock: 5, 
            costPrice: 0,
            batchNumber: '',
            expiryDate: '',
            location: '',
            isPerishable: false
        }); 
    }, [isOpen, initialData, categories]);

    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 max-h-[90vh] flex flex-col">
                <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Ficha de Insumo / Material</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full"><X className="h-5 w-5 text-gray-400" /></button>
                </div>
                <form onSubmit={(e)=>{e.preventDefault(); initialData?onUpdate({...form, id:initialData.id}):onSave({...form, companyId});onClose();}} className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Designação do Material</label>
                        <input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border-2 border-gray-100 p-3.5 rounded-2xl font-bold bg-gray-50 focus:border-emerald-500 outline-none text-xs" placeholder="Ex: Carne Moída Bovina / Amoxicilina" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Categoria de Estoque</label>
                            <input 
                                list="mat-categories" 
                                value={form.category} 
                                onChange={e=>setForm({...form, category: e.target.value})} 
                                className="w-full border-2 border-gray-100 p-3.5 rounded-2xl font-bold bg-gray-50 text-xs" 
                                placeholder="Selecione ou digite..."
                            />
                            <datalist id="mat-categories">
                                {categories?.map((c: string) => <option key={c} value={c} />)}
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Unidade de Medida</label>
                            <select value={form.unit} onChange={e=>setForm({...form, unit: e.target.value as any})} className="w-full border-2 border-gray-100 p-3.5 rounded-2xl font-bold bg-gray-50 text-xs">
                                <option value="UN">UN</option>
                                <option value="KG">KG</option>
                                <option value="L">LITRO</option>
                                <option value="M">METRO</option>
                                <option value="CX">CAIXA</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-black text-blue-600 uppercase mb-1 ml-1">Custo Médio (MT)</label>
                            <input type="number" required value={form.costPrice} onChange={e=>setForm({...form, costPrice: parseFloat(e.target.value)||0})} className="w-full border-2 border-blue-50 p-3.5 rounded-2xl font-black bg-blue-50/20 text-blue-700 text-xs" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Stock em Mão</label>
                            <input type="number" value={form.stock} onChange={e=>setForm({...form, stock: parseFloat(e.target.value)||0})} className="w-full border-2 border-gray-100 p-3.5 rounded-2xl font-black bg-white text-xs" />
                        </div>
                    </div>

                    {/* Lote e Validade FEFO */}
                    <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                        <span className="text-[10px] font-black uppercase text-emerald-700 flex items-center gap-1">
                            <CalendarClock className="h-3.5 w-3.5" /> Rastreabilidade & Validade (FEFO)
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Número de Lote</label>
                                <input 
                                    type="text" 
                                    value={form.batchNumber || ''} 
                                    onChange={e=>setForm({...form, batchNumber: e.target.value})} 
                                    placeholder="Ex: LT-2026-09" 
                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-xs font-mono bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold text-gray-500 uppercase mb-1">Data de Validade</label>
                                <input 
                                    type="date" 
                                    value={form.expiryDate || ''} 
                                    onChange={e=>setForm({...form, expiryDate: e.target.value})} 
                                    className="w-full border border-gray-200 p-2.5 rounded-xl text-xs font-mono bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Aviso Crítico (Mín)</label>
                            <input type="number" value={form.minStock} onChange={e=>setForm({...form, minStock: parseFloat(e.target.value)||0})} className="w-full border-2 border-gray-100 p-3.5 rounded-2xl font-black bg-white text-xs" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">Local / Prateleira</label>
                            <input type="text" value={form.location || ''} onChange={e=>setForm({...form, location: e.target.value})} placeholder="Ex: Armazém A / Frio" className="w-full border-2 border-gray-100 p-3.5 rounded-2xl font-bold bg-white text-xs" />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-slate-800 transition-all cursor-pointer">
                        Salvar no Inventário
                    </button>
                </form>
            </div>
        </div>
    );
};

const ProductModal = ({ isOpen, onClose, initialData, materials, companyId, categories, onSave, onUpdate }: any) => {
    const [form, setForm] = useState<Omit<Product, 'id' | 'createdAt'>>({ 
        name: '', 
        category: categories?.[0] || 'Geral', 
        bom: [], 
        labor: { type:'STAFF', peopleCount:1, hoursWorked:1, hourlyRate:50 }, 
        electricityCost:0, 
        packagingCost:0, 
        transportCost:0, 
        maintenanceCost:0, 
        otherCosts:0, 
        salePrice:0, 
        purchasePrice:0, 
        profitMargin:0, 
        wholesalePrice:0, 
        currentStock:0, 
        unitsPerPackage: 1, 
        minStockLevel: 0, 
        stopWholesaleThreshold: 0, 
        qualityStatus: 'Bom',
        barcode: '',
        batchNumber: '',
        expiryDate: ''
    });
    const [calc, setCalc] = useState({ qty: 0, totalCost: 0, margin: 0 });

    useEffect(() => { 
        if(isOpen) { 
            setForm(initialData || { 
                name: '', 
                category: categories?.[0] || 'Geral', 
                bom: [], 
                labor: { type:'STAFF', peopleCount:1, hoursWorked:1, hourlyRate:50 }, 
                electricityCost:0, 
                packagingCost:0, 
                transportCost:0, 
                maintenanceCost:0, 
                otherCosts:0, 
                salePrice:0, 
                purchasePrice:0, 
                profitMargin:0, 
                wholesalePrice:0, 
                currentStock:0, 
                unitsPerPackage: 1, 
                minStockLevel: 0, 
                stopWholesaleThreshold: 0, 
                qualityStatus: 'Bom',
                barcode: '',
                batchNumber: '',
                expiryDate: ''
            }); 
            setCalc({ qty: 0, totalCost: 0, margin: initialData?.profitMargin || 0 }); 
        } 
    }, [isOpen, initialData, categories]);

    useEffect(() => {
        if (calc.qty > 0 && calc.totalCost > 0) {
            const unitCost = calc.totalCost / calc.qty;
            let updates: any = { purchasePrice: unitCost };
            if (calc.margin > 0) {
                updates.profitMargin = calc.margin;
                updates.salePrice = unitCost * (1 + calc.margin / 100);
            }
            setForm(f => ({ ...f, ...updates }));
        } else if (calc.margin > 0 && form.purchasePrice && form.purchasePrice > 0) {
            setForm(f => ({ ...f, profitMargin: calc.margin, salePrice: f.purchasePrice! * (1 + calc.margin / 100) }));
        }
    }, [calc.qty, calc.totalCost, calc.margin]);

    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95">
                <div className="p-8 border-b bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Cadastro de Produto</h3>
                    <button onClick={onClose}><X className="h-6 w-6 text-gray-400" /></button>
                </div>
                <div className="p-8 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Designação do Produto Final</label>
                            <input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border-2 border-gray-100 p-4 rounded-[20px] font-black text-lg bg-gray-50 focus:border-blue-500 outline-none" placeholder="Ex: Hambúrguer Artesanal / Paracetamol 500mg" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Categoria de Estoque</label>
                            <input 
                                list="prod-categories" 
                                value={form.category} 
                                onChange={e=>setForm({...form, category: e.target.value})} 
                                className="w-full border-2 border-gray-100 p-4 rounded-2xl font-bold bg-gray-50 text-xs" 
                                placeholder="Selecione categoria..."
                            />
                            <datalist id="prod-categories">
                                {categories?.map((c: string) => <option key={c} value={c} />)}
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Código de Barras / SKU</label>
                            <input 
                                type="text" 
                                value={form.barcode || ''} 
                                onChange={e=>setForm({...form, barcode: e.target.value})} 
                                placeholder="Ex: 560123456789" 
                                className="w-full border-2 border-gray-100 p-4 rounded-2xl font-mono text-xs bg-gray-50"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Quantidade em Estoque</label><input type="number" required value={form.currentStock} onChange={e=>setForm({...form, currentStock: parseFloat(e.target.value)||0})} className="w-full border-2 border-gray-100 p-4 rounded-2xl font-black bg-gray-50 focus:border-blue-500 outline-none" /></div>
                        <div><label className="block text-[10px] font-black text-gray-400 uppercase mb-2">Preço de Compra / Custo (MT)</label><input type="number" required value={form.purchasePrice} onChange={e=>setForm({...form, purchasePrice: parseFloat(e.target.value)||0})} className="w-full border-2 border-gray-100 p-4 rounded-2xl font-black bg-gray-50 focus:border-blue-500 outline-none" /></div>
                    </div>

                    {/* Lote & Validade do Produto */}
                    <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                        <div>
                            <label className="block text-[9px] font-black text-gray-500 uppercase mb-1">Lote de Fabricação</label>
                            <input 
                                type="text" 
                                value={form.batchNumber || ''} 
                                onChange={e=>setForm({...form, batchNumber: e.target.value})} 
                                placeholder="Ex: PRD-2026-001" 
                                className="w-full border border-gray-200 p-3 rounded-xl text-xs font-mono bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-gray-500 uppercase mb-1">Data de Validade (FEFO)</label>
                            <input 
                                type="date" 
                                value={form.expiryDate || ''} 
                                onChange={e=>setForm({...form, expiryDate: e.target.value})} 
                                className="w-full border border-gray-200 p-3 rounded-xl text-xs font-mono bg-white"
                            />
                        </div>
                    </div>

                    <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 space-y-4">
                        <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Calculadora Automática de Custo e Margem</h4>
                        <p className="text-xs text-indigo-800/70 mb-4">Insira os dados da compra para calcular automaticamente o custo unitário e o preço de venda sugerido.</p>
                        <div className="grid grid-cols-3 gap-4">
                            <div><label className="block text-[8px] font-black text-indigo-600 uppercase mb-1">Qtd. Comprada</label><input type="number" value={calc.qty || ''} onChange={e=>setCalc({...calc, qty:parseFloat(e.target.value)||0})} placeholder="Ex: 10" className="w-full border-none bg-white p-3 rounded-xl font-black text-sm" /></div>
                            <div><label className="block text-[8px] font-black text-indigo-600 uppercase mb-1">Custo Total (MT)</label><input type="number" value={calc.totalCost || ''} onChange={e=>setCalc({...calc, totalCost:parseFloat(e.target.value)||0})} placeholder="Ex: 1000" className="w-full border-none bg-white p-3 rounded-xl font-black text-sm" /></div>
                            <div><label className="block text-[8px] font-black text-indigo-600 uppercase mb-1">Margem de Lucro (%)</label><input type="number" value={calc.margin || ''} onChange={e=>setCalc({...calc, margin:parseFloat(e.target.value)||0})} placeholder="Ex: 30" className="w-full border-none bg-white p-3 rounded-xl font-black text-sm" /></div>
                        </div>
                        {(calc.qty > 0 && calc.totalCost > 0) && (
                            <div className="mt-4 p-3 bg-indigo-100/50 rounded-xl flex justify-between items-center">
                                <span className="text-xs font-bold text-indigo-900">Custo Unitário Calculado:</span>
                                <span className="text-sm font-black text-indigo-700">{(calc.totalCost / calc.qty).toFixed(2)} MT</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-[10px] font-black text-emerald-600 uppercase mb-2">Preço Unitário (Venda) (MT)</label><input type="number" required value={form.salePrice} onChange={e=>setForm({...form, salePrice: parseFloat(e.target.value)||0})} className="w-full border-none bg-emerald-50 p-4 rounded-2xl font-black text-lg text-emerald-800" /></div>
                        <div><label className="block text-[10px] font-black text-blue-600 uppercase mb-2">Preço de Venda à Grosso (MT)</label><input type="number" required value={form.wholesalePrice} onChange={e=>setForm({...form, wholesalePrice: parseFloat(e.target.value)||0})} className="w-full border-none bg-blue-50 p-4 rounded-2xl font-black text-lg text-blue-800" /></div>
                    </div>

                    <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 space-y-4">
                        <h4 className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Controle de Estoque & Qualidade</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div><label className="block text-[8px] font-black text-orange-600 uppercase mb-1">Unidades por Caixa/Embalagem</label><input type="number" value={form.unitsPerPackage} onChange={e=>setForm({...form, unitsPerPackage:parseInt(e.target.value)||1})} className="w-full border-none bg-white p-3 rounded-xl font-black text-sm" /></div>
                            <div><label className="block text-[8px] font-black text-orange-600 uppercase mb-1">Status de Qualidade</label>
                                <select value={form.qualityStatus} onChange={e=>setForm({...form, qualityStatus: e.target.value as any})} className="w-full border-none bg-white p-3 rounded-xl font-black text-sm text-gray-700">
                                    <option value="Excelente">Excelente</option>
                                    <option value="Bom">Bom</option>
                                    <option value="Atenção">Atenção</option>
                                    <option value="Crítico">Crítico</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="block text-[8px] font-black text-orange-600 uppercase mb-1">Limite Mínimo (Alerta Geral)</label><input type="number" value={form.minStockLevel} onChange={e=>setForm({...form, minStockLevel:parseInt(e.target.value)||0})} className="w-full border-none bg-white p-3 rounded-xl font-black text-sm" /></div>
                            <div><label className="block text-[8px] font-black text-orange-600 uppercase mb-1">Parar Venda a Grosso (Restam X Caixas)</label><input type="number" value={form.stopWholesaleThreshold} onChange={e=>setForm({...form, stopWholesaleThreshold:parseInt(e.target.value)||0})} className="w-full border-none bg-white p-3 rounded-xl font-black text-sm" /></div>
                        </div>
                    </div>

                    {/* BOM SECTION */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center"><h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1. Bill of Materials (BOM)</h4><button type="button" onClick={() => setForm({...form, bom: [...form.bom, {materialId: materials[0]?.id || '', quantity: 1}]})} className="text-[10px] font-black text-blue-600 hover:underline cursor-pointer">+ Adicionar Insumo</button></div>
                        <div className="space-y-2">
                            {form.bom.map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 group">
                                    <select value={item.materialId} onChange={e=>{const n=[...form.bom]; n[idx].materialId=e.target.value; setForm({...form, bom:n})}} className="flex-1 bg-transparent border-none font-bold text-sm focus:ring-0">{materials.map((m:any)=><option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}</select>
                                    <input type="number" step="0.01" value={item.quantity} onChange={e=>{const n=[...form.bom]; n[idx].quantity=parseFloat(e.target.value)||0; setForm({...form, bom:n})}} className="w-20 text-center bg-white border-2 border-slate-200 rounded-xl py-1 font-black text-sm" />
                                    <button onClick={()=>{const n=form.bom.filter((_,i)=>i!==idx); setForm({...form, bom:n})}} className="text-red-300 hover:text-red-600 transition-colors cursor-pointer"><Trash2 className="h-4 w-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* LABOR SECTION */}
                    <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 space-y-4">
                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">2. Alocação de Mão de Obra</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div><label className="block text-[8px] font-black text-blue-600 uppercase mb-1">Equipa (Pessoas)</label><input type="number" value={form.labor.peopleCount} onChange={e=>setForm({...form, labor:{...form.labor, peopleCount:parseInt(e.target.value)||1}})} className="w-full border-none bg-white p-3 rounded-xl font-black text-sm" /></div>
                            <div><label className="block text-[8px] font-black text-blue-600 uppercase mb-1">Tempo (Horas)</label><input type="number" value={form.labor.hoursWorked} onChange={e=>setForm({...form, labor:{...form.labor, hoursWorked:parseFloat(e.target.value)||1}})} className="w-full border-none bg-white p-3 rounded-xl font-black text-sm" /></div>
                            <div><label className="block text-[8px] font-black text-blue-600 uppercase mb-1">Taxa/H Unit. (MT)</label><input type="number" value={form.labor.hourlyRate} onChange={e=>setForm({...form, labor:{...form.labor, hourlyRate:parseFloat(e.target.value)||0}})} className="w-full border-none bg-white p-3 rounded-xl font-black text-sm" /></div>
                        </div>
                    </div>

                    {/* OP COSTS */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3. Custos Operacionais & Indiretos</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100"><Wrench className="h-4 w-4 text-slate-400"/><input type="number" placeholder="Manutenção" value={form.maintenanceCost} onChange={e=>setForm({...form, maintenanceCost:parseFloat(e.target.value)||0})} className="w-full bg-transparent border-none text-sm font-bold p-0"/></div>
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100"><Truck className="h-4 w-4 text-slate-400"/><input type="number" placeholder="Transporte" value={form.transportCost} onChange={e=>setForm({...form, transportCost:parseFloat(e.target.value)||0})} className="w-full bg-transparent border-none text-sm font-bold p-0"/></div>
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100"><Users className="h-4 w-4 text-slate-400"/><input type="number" placeholder="Outros" value={form.otherCosts} onChange={e=>setForm({...form, otherCosts:parseFloat(e.target.value)||0})} className="w-full bg-transparent border-none text-sm font-bold p-0"/></div>
                        </div>
                    </div>
                </div>
                <div className="p-8 border-t bg-gray-50"><button onClick={()=>{initialData?onUpdate({...form, id:initialData.id}):onSave({...form, companyId}); onClose();}} className="w-full bg-slate-950 text-white py-5 rounded-[24px] font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-slate-800 transition-all cursor-pointer">Salvar Produto</button></div>
            </div>
        </div>
    );
};
