import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PharmacyBatch } from '../types';
import { 
  Pill, ShieldAlert, CalendarClock, Thermometer, Plus, 
  Search, CheckCircle2, AlertTriangle, FileText, ShoppingBag, 
  Layers, Filter, Clock, Check, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PharmacyOperations = () => {
  const { activeCompanyId, companies, addSale, accounts } = useFinance();
  const currentCompany = companies.find(c => c.id === activeCompanyId);

  const [activeTab, setActiveTab] = useState<'DISPENSARY' | 'BATCHES' | 'PRESCRIPTIONS' | 'COLD_CHAIN'>('DISPENSARY');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedBatchForSale, setSelectedBatchForSale] = useState<PharmacyBatch | null>(null);
  const [showNewBatchModal, setShowNewBatchModal] = useState(false);

  // Pharmacy Batches initial inventory
  const [batches, setBatches] = useState<PharmacyBatch[]>([
    {
      id: 'batch_1',
      companyId: activeCompanyId,
      medicationName: 'Amoxicilina + Ácido Clavulânico 1000mg',
      activeIngredient: 'Amoxicilina / Clavulanato',
      batchNumber: 'LT-2026-AMX44',
      expiryDate: '2026-11-30',
      dosageForm: 'Comprimidos (CX 14 un)',
      category: 'ANTIBIOTIC',
      stock: 45,
      minStock: 15,
      costPrice: 420,
      salePrice: 750,
      storageCondition: 'AMBIENT',
      anarmeCode: 'ANARME-MZ-4091/21',
      requiresPrescription: true
    },
    {
      id: 'batch_2',
      companyId: activeCompanyId,
      medicationName: 'Insulina Humana NPH 100 UI/ml',
      activeIngredient: 'Insulina Humana Recombinante',
      batchNumber: 'LT-2026-INS09',
      expiryDate: '2026-10-15',
      dosageForm: 'Frasco Injetável 10ml',
      category: 'MSRM',
      stock: 12,
      minStock: 10,
      costPrice: 650,
      salePrice: 1100,
      storageCondition: 'COLD_CHAIN',
      anarmeCode: 'ANARME-MZ-1120/19',
      requiresPrescription: true
    },
    {
      id: 'batch_3',
      companyId: activeCompanyId,
      medicationName: 'Paracetamol 500mg Genérico',
      activeIngredient: 'Paracetamol',
      batchNumber: 'LT-2027-PAR88',
      expiryDate: '2027-08-20',
      dosageForm: 'Blister 10 un',
      category: 'MNSRM',
      stock: 180,
      minStock: 50,
      costPrice: 25,
      salePrice: 60,
      storageCondition: 'AMBIENT',
      anarmeCode: 'ANARME-MZ-8821/23',
      requiresPrescription: false
    },
    {
      id: 'batch_4',
      companyId: activeCompanyId,
      medicationName: 'Diazepam 10mg Controlado',
      activeIngredient: 'Diazepam',
      batchNumber: 'LT-2026-DZP12',
      expiryDate: '2026-12-05',
      dosageForm: 'Comprimidos (CX 30 un)',
      category: 'CONTROLLED',
      stock: 18,
      minStock: 10,
      costPrice: 210,
      salePrice: 450,
      storageCondition: 'CONTROLLED_ROOM',
      anarmeCode: 'ANARME-MZ-PSIC-0034',
      requiresPrescription: true
    },
    {
      id: 'batch_5',
      companyId: activeCompanyId,
      medicationName: 'Arteméter + Lumefantrina (Coartem)',
      activeIngredient: 'Artemether / Lumefantrine (Antimalárico)',
      batchNumber: 'LT-2026-COA55',
      expiryDate: '2026-09-30', // Crítico < 30 dias
      dosageForm: 'Blister 24 Comprimidos',
      category: 'MSRM',
      stock: 32,
      minStock: 20,
      costPrice: 310,
      salePrice: 580,
      storageCondition: 'AMBIENT',
      anarmeCode: 'ANARME-MZ-MAL-9902',
      requiresPrescription: true
    },
    {
      id: 'batch_6',
      companyId: activeCompanyId,
      medicationName: 'Soro Fisiológico 0.9% 500ml',
      activeIngredient: 'Cloreto de Sódio 0.9%',
      batchNumber: 'LT-2027-SOR10',
      expiryDate: '2027-05-18',
      dosageForm: 'Frasco Perfusão 500ml',
      category: 'MNSRM',
      stock: 60,
      minStock: 25,
      costPrice: 90,
      salePrice: 180,
      storageCondition: 'AMBIENT',
      anarmeCode: 'ANARME-MZ-7740/22',
      requiresPrescription: false
    },
    {
      id: 'batch_7',
      companyId: activeCompanyId,
      medicationName: 'Vitamina C + Zinco Efervescente',
      activeIngredient: 'Ácido Ascórbico 1000mg + Zinco 10mg',
      batchNumber: 'LT-2028-VTC01',
      expiryDate: '2028-02-10',
      dosageForm: 'Tubo 20 Comprimidos Efervescentes',
      category: 'SUPPLEMENT',
      stock: 75,
      minStock: 20,
      costPrice: 150,
      salePrice: 320,
      storageCondition: 'AMBIENT',
      anarmeCode: 'SUP-MZ-3312/24',
      requiresPrescription: false
    }
  ]);

  // Prescriptions log
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'rx_1',
      patientName: 'Ernesto Guambe',
      patientNuit: '109844211',
      doctorName: 'Dra. Luísa Cossa',
      doctorLicense: 'OMM-1982',
      clinicOrHospital: 'Hospital Central de Maputo',
      date: '2026-09-12',
      medication: 'Amoxicilina + Ácido Clavulânico 1000mg',
      qtyDispensed: 2,
      batchNumber: 'LT-2026-AMX44',
      pharmacistName: 'Técnico Xavier',
      notes: 'Receita médica original arquivada no dossiê regulatório'
    },
    {
      id: 'rx_2',
      patientName: 'Fátima Abdula',
      patientNuit: '107655432',
      doctorName: 'Dr. Mário Nhantumbo',
      doctorLicense: 'OMM-2451',
      clinicOrHospital: 'Clínica Sommerschield',
      date: '2026-09-14',
      medication: 'Diazepam 10mg Controlado',
      qtyDispensed: 1,
      batchNumber: 'LT-2026-DZP12',
      pharmacistName: 'Diretora Técnica Dra. Célia',
      notes: 'Substância sujeita a controlo especial ANARME (Livro de Psicotrópicos)'
    }
  ]);

  // Form for new batch
  const [newBatchForm, setNewBatchForm] = useState({
    medicationName: '',
    activeIngredient: '',
    batchNumber: '',
    expiryDate: '',
    dosageForm: 'Comprimidos',
    category: 'MSRM' as PharmacyBatch['category'],
    stock: 20,
    minStock: 10,
    costPrice: 100,
    salePrice: 200,
    storageCondition: 'AMBIENT' as PharmacyBatch['storageCondition'],
    anarmeCode: '',
    requiresPrescription: true
  });

  // Calculate days to expire
  const getExpiryStatus = (dateStr: string) => {
    const today = new Date();
    const expiry = new Date(dateStr);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'Vencido', color: 'bg-red-600 text-white', days: diffDays, status: 'EXPIRED' };
    }
    if (diffDays <= 30) {
      return { label: `Crítico (${diffDays}d)`, color: 'bg-red-500 text-white animate-pulse', days: diffDays, status: 'CRITICAL' };
    }
    if (diffDays <= 90) {
      return { label: `Atenção (${diffDays}d)`, color: 'bg-amber-500 text-stone-950', days: diffDays, status: 'WARNING' };
    }
    return { label: `Válido (${Math.round(diffDays / 30)} meses)`, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300', days: diffDays, status: 'VALID' };
  };

  // Filtered Batches
  const filteredBatches = useMemo(() => {
    return batches.filter(b => {
      const matchesSearch = b.medicationName.toLowerCase().includes(search.toLowerCase()) ||
                            (b.activeIngredient && b.activeIngredient.toLowerCase().includes(search.toLowerCase())) ||
                            b.batchNumber.toLowerCase().includes(search.toLowerCase());
      const matchesCat = categoryFilter === 'ALL' || b.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [batches, search, categoryFilter]);

  const handleDispense = (batch: PharmacyBatch, qty: number = 1) => {
    if (batch.stock < qty) {
      alert("Stock insuficiente deste lote!");
      return;
    }

    // Process sale
    const targetAccount = accounts[0]?.id || 'default_acc';
    addSale({
      companyId: activeCompanyId === 'all' ? (currentCompany?.id || 'default') : activeCompanyId,
      customerName: 'Balcão Farmácia (Dispensação)',
      date: new Date().toISOString(),
      items: [{
        productId: batch.id,
        productName: `${batch.medicationName} [Lote: ${batch.batchNumber}]`,
        quantity: qty,
        unitPrice: batch.salePrice,
        total: batch.salePrice * qty
      }],
      total: batch.salePrice * qty,
      paymentMethod: 'POS_FARMACIA',
      status: 'COMPLETED'
    }, targetAccount);

    // Update batch stock
    setBatches(prev => prev.map(b => b.id === batch.id ? { ...b, stock: b.stock - qty } : b));

    alert(`Medicamento dispensado com sucesso! Lote: ${batch.batchNumber}, Validade: ${batch.expiryDate}. Total: ${(batch.salePrice * qty).toLocaleString('pt-MZ')} MT.`);
    setSelectedBatchForSale(null);
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchForm.medicationName || !newBatchForm.batchNumber || !newBatchForm.expiryDate) {
      alert("Preencha os campos obrigatórios (Nome, Lote e Data de Validade).");
      return;
    }

    const newBatch: PharmacyBatch = {
      id: `batch_${Date.now()}`,
      companyId: activeCompanyId,
      ...newBatchForm
    };

    setBatches([newBatch, ...batches]);
    setShowNewBatchModal(false);
    alert(`Novo lote farmacêutico ${newBatch.batchNumber} registado com sucesso no inventário!`);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-400/30 flex items-center gap-1.5">
                <Pill className="h-3.5 w-3.5" />
                Módulo Farmacêutico & Saúde
              </span>
              <span className="text-xs text-emerald-200/80 font-medium">
                Conformidade ANARME Moçambique
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Dispensação, Lotes FEFO & Controlo de Receitas
            </h1>
            <p className="text-xs md:text-sm text-emerald-100/80 max-w-2xl">
              Rastreabilidade de lotes com datas de validade (First Expired First Out), controlo de prescrições médicas (MSRM/Psicotrópicos) e monitorização de temperatura da cadeia de frio (2°C - 8°C).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewBatchModal(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Registar Novo Lote</span>
            </button>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute right-0 -bottom-10 opacity-10 pointer-events-none">
          <Pill className="h-64 w-64 text-white" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('DISPENSARY')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'DISPENSARY'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Pill className="h-4 w-4" />
          <span>Balcão de Dispensação</span>
        </button>

        <button
          onClick={() => setActiveTab('BATCHES')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'BATCHES'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <CalendarClock className="h-4 w-4" />
          <span>Gestão de Lotes & Validades FEFO ({batches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('PRESCRIPTIONS')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'PRESCRIPTIONS'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Livro de Receitas ANARME ({prescriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('COLD_CHAIN')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'COLD_CHAIN'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Thermometer className="h-4 w-4" />
          <span>Cadeia de Frio (2°C - 8°C)</span>
        </button>
      </div>

      {/* TAB 1: DISPENSARY */}
      {activeTab === 'DISPENSARY' && (
        <div className="space-y-6">
          {/* Search & Categories Bar */}
          <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Pesquisar medicamento, princípio ativo (ex: Amoxicilina, Paracetamol) ou lote..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: 'ALL', label: 'Todos' },
                { id: 'MSRM', label: 'Com Receita (MSRM)' },
                { id: 'MNSRM', label: 'Livre (MNSRM / OTC)' },
                { id: 'ANTIBIOTIC', label: 'Antibióticos' },
                { id: 'CONTROLLED', label: 'Controlados' },
                { id: 'SUPPLEMENT', label: 'Suplementos' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    categoryFilter === cat.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Medications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBatches.map(batch => {
              const expiry = getExpiryStatus(batch.expiryDate);
              const isCold = batch.storageCondition === 'COLD_CHAIN';

              return (
                <div
                  key={batch.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-gray-200 dark:border-slate-800 hover:border-emerald-500 transition-all flex flex-col justify-between shadow-sm space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            batch.requiresPrescription 
                              ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300' 
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          }`}>
                            {batch.requiresPrescription ? 'Receita Obrigatória' : 'Venda Livre'}
                          </span>

                          {isCold && (
                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 flex items-center gap-0.5">
                              <Thermometer className="h-2.5 w-2.5" /> 2-8°C
                            </span>
                          )}
                        </div>

                        <h3 className="font-black text-base text-gray-900 dark:text-white mt-1">
                          {batch.medicationName}
                        </h3>
                        {batch.activeIngredient && (
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                            Princípio Ativo: {batch.activeIngredient}
                          </p>
                        )}
                        <p className="text-[11px] text-gray-400">
                          Forma: {batch.dosageForm}
                        </p>
                      </div>

                      <span className={`text-[10px] font-black px-2 py-1 rounded-xl uppercase font-mono ${expiry.color}`}>
                        {expiry.label}
                      </span>
                    </div>

                    <div className="mt-4 p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/50 space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nº de Lote:</span>
                        <span className="font-mono font-bold">{batch.batchNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Validade (FEFO):</span>
                        <span className="font-mono font-bold text-gray-900 dark:text-white">{batch.expiryDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Registo ANARME:</span>
                        <span className="font-mono text-[11px]">{batch.anarmeCode || 'MZ-GERAL'}</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-gray-200 dark:border-slate-700">
                        <span className="text-gray-400">Stock Disponível:</span>
                        <span className={`font-black ${batch.stock <= batch.minStock ? 'text-red-500' : 'text-emerald-600'}`}>
                          {batch.stock} unidades
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Preço de Balcão</span>
                      <span className="text-xl font-black text-gray-900 dark:text-white font-mono">
                        {batch.salePrice.toLocaleString('pt-MZ')} MT
                      </span>
                    </div>

                    <button
                      onClick={() => handleDispense(batch, 1)}
                      disabled={batch.stock <= 0}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>Dispensar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BATCHES & FEFO */}
      {activeTab === 'BATCHES' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-emerald-600" />
                  Rastreabilidade de Lotes Farmacêuticos (FEFO)
                </h3>
                <p className="text-xs text-gray-500">
                  Prioridade automática de saída para lotes com data de validade mais próxima (First Expired, First Out).
                </p>
              </div>

              <button
                onClick={() => setShowNewBatchModal(true)}
                className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm hover:bg-emerald-700 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Novo Lote
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-50 dark:bg-slate-800 text-gray-500 uppercase text-[10px] font-black">
                  <tr>
                    <th className="p-3.5 rounded-l-xl">Medicamento</th>
                    <th className="p-3.5">Nº do Lote</th>
                    <th className="p-3.5">Data de Validade</th>
                    <th className="p-3.5">Estado / FEFO</th>
                    <th className="p-3.5">Estoque</th>
                    <th className="p-3.5">Custo / Venda</th>
                    <th className="p-3.5">Condição</th>
                    <th className="p-3.5 rounded-r-xl text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {batches.map(b => {
                    const exp = getExpiryStatus(b.expiryDate);
                    return (
                      <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 font-bold text-gray-900 dark:text-white">
                          <div>{b.medicationName}</div>
                          <div className="text-[10px] text-gray-400 font-normal">{b.dosageForm}</div>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {b.batchNumber}
                        </td>
                        <td className="p-3.5 font-mono font-medium">{b.expiryDate}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${exp.color}`}>
                            {exp.label}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold">
                          <span className={b.stock <= b.minStock ? 'text-red-500' : 'text-gray-900 dark:text-white'}>
                            {b.stock} un
                          </span>
                        </td>
                        <td className="p-3.5 font-mono">
                          {b.costPrice} MT / <span className="font-bold text-emerald-600">{b.salePrice} MT</span>
                        </td>
                        <td className="p-3.5">
                          {b.storageCondition === 'COLD_CHAIN' ? (
                            <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 dark:bg-cyan-950/40 px-2 py-0.5 rounded">
                              2°C - 8°C Frio
                            </span>
                          ) : (
                            <span className="text-[10px] text-gray-500">Ambiente (15-25°C)</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDispense(b, 1)}
                            className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold px-3 py-1 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
                          >
                            Dispensar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PRESCRIPTIONS & ANARME */}
      {activeTab === 'PRESCRIPTIONS' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                  Livro Oficial de Receitas Retidas & Psicotrópicos (ANARME)
                </h3>
                <p className="text-xs text-gray-500">
                  Registo obrigatório de prescrições médicas de antibióticos e substâncias sujeitas a controlo especial da República de Moçambique.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {prescriptions.map(rx => (
                <div
                  key={rx.id}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-black text-sm text-gray-900 dark:text-white">
                        Paciente: {rx.patientName}
                      </span>
                      <span className="text-gray-400 ml-2">NUIT/BI: {rx.patientNuit}</span>
                    </div>
                    <span className="text-gray-400 font-mono">{rx.date}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] bg-white dark:bg-slate-900 p-2.5 rounded-xl">
                    <div>
                      <span className="text-gray-400 block font-bold">Médico Prescritor:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{rx.doctorName} ({rx.doctorLicense})</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold">Unidade Sanitária:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{rx.clinicOrHospital}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold">Dispensado por:</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{rx.pharmacistName}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <p className="font-black text-emerald-600 dark:text-emerald-400">
                      Medicamento: {rx.medication} ({rx.qtyDispensed} un) - Lote: {rx.batchNumber}
                    </p>
                    <span className="text-[10px] text-gray-400 italic">{rx.notes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COLD CHAIN (2°C - 8°C) */}
      {activeTab === 'COLD_CHAIN' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-cyan-600" />
                  Monitorização da Cadeia de Frio Farmacêutica (2°C a 8°C)
                </h3>
                <p className="text-xs text-gray-500">
                  Controlo de temperatura contínuo para vacinas, insulinas, soros e reagentes termossensíveis.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 px-3 py-1.5 rounded-xl text-xs font-black">
                <span className="h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
                Frigorífico Farmacêutico 01: +4.2°C (Conforme)
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {batches.filter(b => b.storageCondition === 'COLD_CHAIN').map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-cyan-50/40 dark:bg-cyan-950/20 border-2 border-cyan-200 dark:border-cyan-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-sm text-gray-900 dark:text-white">{item.medicationName}</h4>
                      <p className="text-xs text-cyan-700 dark:text-cyan-400">{item.activeIngredient}</p>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-600 text-white">
                      2°C - 8°C
                    </span>
                  </div>

                  <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                    <p>Lote: <span className="font-mono font-bold">{item.batchNumber}</span> | Validade: <span className="font-mono">{item.expiryDate}</span></p>
                    <p>Estoque atual: <span className="font-bold text-emerald-600">{item.stock} frascos</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW BATCH */}
      {showNewBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Pill className="h-5 w-5 text-emerald-600" />
                Registar Novo Lote de Medicamento
              </h3>
              <button
                onClick={() => setShowNewBatchModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 pt-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-gray-300">Nome Comercial do Medicamento *</label>
                <input
                  type="text"
                  required
                  value={newBatchForm.medicationName}
                  onChange={e => setNewBatchForm({ ...newBatchForm, medicationName: e.target.value })}
                  placeholder="Ex: Ibuprofeno 600mg"
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Princípio Ativo</label>
                  <input
                    type="text"
                    value={newBatchForm.activeIngredient}
                    onChange={e => setNewBatchForm({ ...newBatchForm, activeIngredient: e.target.value })}
                    placeholder="Ex: Ibuprofeno"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Forma Farmacêutica</label>
                  <input
                    type="text"
                    value={newBatchForm.dosageForm}
                    onChange={e => setNewBatchForm({ ...newBatchForm, dosageForm: e.target.value })}
                    placeholder="Ex: Comprimidos (CX 20)"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Número de Lote (Batch) *</label>
                  <input
                    type="text"
                    required
                    value={newBatchForm.batchNumber}
                    onChange={e => setNewBatchForm({ ...newBatchForm, batchNumber: e.target.value })}
                    placeholder="Ex: LT-2026-IBU01"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Data de Validade (Expiry) *</label>
                  <input
                    type="date"
                    required
                    value={newBatchForm.expiryDate}
                    onChange={e => setNewBatchForm({ ...newBatchForm, expiryDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Quantidade Stock</label>
                  <input
                    type="number"
                    min="1"
                    value={newBatchForm.stock}
                    onChange={e => setNewBatchForm({ ...newBatchForm, stock: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Preço Custo (MT)</label>
                  <input
                    type="number"
                    value={newBatchForm.costPrice}
                    onChange={e => setNewBatchForm({ ...newBatchForm, costPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Preço Venda (MT)</label>
                  <input
                    type="number"
                    value={newBatchForm.salePrice}
                    onChange={e => setNewBatchForm({ ...newBatchForm, salePrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-mono font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Categoria Regulamentar</label>
                  <select
                    value={newBatchForm.category}
                    onChange={e => setNewBatchForm({ ...newBatchForm, category: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-medium"
                  >
                    <option value="MSRM">Medicamento c/ Receita (MSRM)</option>
                    <option value="MNSRM">Venda Livre (MNSRM / OTC)</option>
                    <option value="ANTIBIOTIC">Antibiótico</option>
                    <option value="CONTROLLED">Psicotrópico / Controlado</option>
                    <option value="SUPPLEMENT">Suplemento / Vitaminas</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Armazenamento</label>
                  <select
                    value={newBatchForm.storageCondition}
                    onChange={e => setNewBatchForm({ ...newBatchForm, storageCondition: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-medium"
                  >
                    <option value="AMBIENT">Ambiente (15°C - 25°C)</option>
                    <option value="COLD_CHAIN">Cadeia de Frio (2°C - 8°C)</option>
                    <option value="CONTROLLED_ROOM">Cofre de Controlados</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewBatchModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black"
                >
                  Salvar Lote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
