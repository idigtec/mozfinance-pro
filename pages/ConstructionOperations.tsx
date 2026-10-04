import React, { useState } from 'react';
import { 
  HardHat, 
  FileText, 
  Calculator, 
  Truck, 
  ShieldCheck, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Percent, 
  Layers, 
  Hammer, 
  Fuel, 
  Sun, 
  CloudRain, 
  Check
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useSearchParams } from 'react-router-dom';

interface MeasurementItem {
  id: string;
  stageName: string;
  unit: string;
  plannedQty: number;
  measuredQty: number;
  unitPriceMzn: number;
  totalStageMzn: number;
  percentExecuted: number;
  fiscalApproved: boolean;
  notes: string;
}

interface SiteLogRDO {
  id: string;
  date: string;
  siteName: string;
  weatherMorning: string;
  weatherAfternoon: string;
  headcountDirect: number;
  headcountIndirect: number;
  activitiesDone: string;
  equipmentOnSite: string;
  accidentsCount: number;
  fiscalSignOff: boolean;
}

interface EquipmentAsset {
  id: string;
  code: string;
  name: string;
  brandModel: string;
  currentHours: number;
  dieselLitersToday: number;
  operator: string;
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'IDLE';
  nextServiceHours: number;
}

interface CostCompositionCPU {
  id: string;
  code: string;
  description: string;
  unit: string;
  materialCost: number;
  laborCost: number;
  equipmentCost: number;
  bdiPercent: number; // Benefícios e Despesas Indiretas (ex: 22%)
  totalSalePrice: number;
}

export const ConstructionOperations: React.FC = () => {
  const { activeCompanyId, companies } = useFinance();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'measurements';

  const activeCompany = companies.find(c => c.id === activeCompanyId);

  // Initial State: Autos de Medição
  const [measurements, setMeasurements] = useState<MeasurementItem[]>([
    {
      id: 'MS-01',
      stageName: 'Movimento de Terras & Desmatação',
      unit: 'm³',
      plannedQty: 1200,
      measuredQty: 1200,
      unitPriceMzn: 450,
      totalStageMzn: 540000,
      percentExecuted: 100,
      fiscalApproved: true,
      notes: 'Concluído conforme cota do projeto topográfico.'
    },
    {
      id: 'MS-02',
      stageName: 'Fundações & Sapata de Betão Armado C25/30',
      unit: 'm³',
      plannedQty: 350,
      measuredQty: 315,
      unitPriceMzn: 12500,
      totalStageMzn: 4375000,
      percentExecuted: 90,
      fiscalApproved: true,
      notes: 'Ensaio de provetes aos 28 dias aprovado pelo laboratório.'
    },
    {
      id: 'MS-03',
      stageName: 'Estrutura de Pilares, Vigas e Lajes Maciças',
      unit: 'm³',
      plannedQty: 480,
      measuredQty: 240,
      unitPriceMzn: 14200,
      totalStageMzn: 6816000,
      percentExecuted: 50,
      fiscalApproved: true,
      notes: 'Descofragem do 1º piso concluída, armação do 2º piso em curso.'
    },
    {
      id: 'MS-04',
      stageName: 'Alvenarias em Bloco de Cimento Vazado (15cm)',
      unit: 'm²',
      plannedQty: 2800,
      measuredQty: 700,
      unitPriceMzn: 780,
      totalStageMzn: 2184000,
      percentExecuted: 25,
      fiscalApproved: false,
      notes: 'Paredes exteriores do rés-do-chão em elevação.'
    },
    {
      id: 'MS-05',
      stageName: 'Instalações Especiais Hidrossanitárias & Incêndio',
      unit: 'conj',
      plannedQty: 1,
      measuredQty: 0.15,
      unitPriceMzn: 1850000,
      totalStageMzn: 1850000,
      percentExecuted: 15,
      fiscalApproved: false,
      notes: 'Passagem de prumadas e tubagens embutidas nas vigas.'
    }
  ]);

  // Initial State: Diário de Obra (RDO)
  const [rdos, setRdos] = useState<SiteLogRDO[]>([
    {
      id: 'RDO-142',
      date: '2026-09-14',
      siteName: 'Edifício Sommerschield Tower (Lote 12)',
      weatherMorning: 'Ensolarado (28°C)',
      weatherAfternoon: 'Limpo com brisa marítima',
      headcountDirect: 28,
      headcountIndirect: 6,
      activitiesDone: 'Betonagem da laje piso 2 com recurso a bomba lança de 36m. Montagem de ferro A500NR nos pilares P12 a P18.',
      equipmentOnSite: '1x Bomba de betão, 2x Betoneiras 500L, 1x Grua de torre 45m',
      accidentsCount: 0,
      fiscalSignOff: true
    },
    {
      id: 'RDO-141',
      date: '2026-09-13',
      siteName: 'Edifício Sommerschield Tower (Lote 12)',
      weatherMorning: 'Chuva fraca matinal (1h)',
      weatherAfternoon: 'Encoberto sem precipitação',
      headcountDirect: 26,
      headcountIndirect: 5,
      activitiesDone: 'Colocação de armaduras de aço e passagem de tubos elétricos corrugados na esteira da laje.',
      equipmentOnSite: '1x Grua de torre, 1x Betoneira auxiliar, 1x Vibrador de agulha',
      accidentsCount: 0,
      fiscalSignOff: true
    }
  ]);

  // Initial State: Equipamentos Pesados
  const [equipmentList] = useState<EquipmentAsset[]>([
    {
      id: 'EQ-01',
      code: 'RET-01',
      name: 'Retroescavadora de Rastos',
      brandModel: 'Caterpillar 428F2',
      currentHours: 3420,
      dieselLitersToday: 65,
      operator: 'Joaquim Mabote',
      status: 'OPERATIONAL',
      nextServiceHours: 3500
    },
    {
      id: 'EQ-02',
      code: 'CAM-02',
      name: 'Camião Basculante 15m³',
      brandModel: 'Mercedes-Benz Actros 3340',
      currentHours: 5120,
      dieselLitersToday: 110,
      operator: 'Armando Guambe',
      status: 'OPERATIONAL',
      nextServiceHours: 5250
    },
    {
      id: 'EQ-03',
      code: 'BET-01',
      name: 'Betoneira Autocarregável 500L',
      brandModel: 'Carmix 2.5 TT',
      currentHours: 1840,
      dieselLitersToday: 40,
      operator: 'Fernando Sitoe',
      status: 'OPERATIONAL',
      nextServiceHours: 2000
    },
    {
      id: 'EQ-04',
      code: 'GRU-01',
      name: 'Grua de Torre 45m Lança',
      brandModel: 'Potain MC 85 B',
      currentHours: 2980,
      dieselLitersToday: 0, // Elétrica trifásica
      operator: 'Simão Mondlane',
      status: 'OPERATIONAL',
      nextServiceHours: 3000
    }
  ]);

  // Initial State: Composições de Preço Unitário (CPU)
  const [cpus] = useState<CostCompositionCPU[]>([
    {
      id: 'CPU-01',
      code: 'EST-001',
      description: 'Betão Armado C25/30 para Estruturas (incl. ferro, cofragem e vibração)',
      unit: 'm³',
      materialCost: 7800,
      laborCost: 2400,
      equipmentCost: 1200,
      bdiPercent: 25,
      totalSalePrice: 14250
    },
    {
      id: 'CPU-02',
      code: 'ALV-002',
      description: 'Alvenaria de bloco de cimento 15x20x40 assente com argamassa 1:4',
      unit: 'm²',
      materialCost: 420,
      laborCost: 180,
      equipmentCost: 40,
      bdiPercent: 22,
      totalSalePrice: 780
    },
    {
      id: 'CPU-03',
      code: 'REV-003',
      description: 'Reboco desempenado em paredes interiores com argamassa de cimento e areia',
      unit: 'm²',
      materialCost: 190,
      laborCost: 140,
      equipmentCost: 20,
      bdiPercent: 20,
      totalSalePrice: 420
    }
  ]);

  // Calculations
  const totalPlannedValue = measurements.reduce((acc, curr) => acc + (curr.plannedQty * curr.unitPriceMzn), 0);
  const totalMeasuredValue = measurements.reduce((acc, curr) => acc + (curr.measuredQty * curr.unitPriceMzn), 0);
  const globalProgress = Math.round((totalMeasuredValue / (totalPlannedValue || 1)) * 100);
  const totalFuelToday = equipmentList.reduce((acc, curr) => acc + curr.dieselLitersToday, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white rounded-2xl p-6 shadow-xl border border-amber-800/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 border border-amber-400/30 rounded-xl text-amber-400">
              <HardHat className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Sector de Construção Civil & Engenharia
                </span>
                <span className="text-xs text-stone-400">Alvará MOPHRH: 4ª Classe Obras Civis</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold mt-1 text-white">
                {activeCompany?.tradeName || activeCompany?.name || 'Gestão de Empreitadas, Medições & Obras'}
              </h1>
              <p className="text-stone-300 text-sm mt-1 max-w-2xl">
                Controlo físico-financeiro integral de empreitadas: autos de medição, diário de obra digital (RDO), caderno de encargos, maquinaria pesada e segurança no trabalho (HST).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => {
                const stage = prompt('Nome da nova etapa ou item de medição:');
                if (stage) {
                  const newM: MeasurementItem = {
                    id: `MS-0${measurements.length + 1}`,
                    stageName: stage,
                    unit: 'm²',
                    plannedQty: 1000,
                    measuredQty: 0,
                    unitPriceMzn: 850,
                    totalStageMzn: 850000,
                    percentExecuted: 0,
                    fiscalApproved: false,
                    notes: 'Novo item adicionado ao caderno de encargos'
                  };
                  setMeasurements(prev => [...prev, newM]);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              Adicionar Etapa de Obra
            </button>
          </div>
        </div>

        {/* Construction KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-amber-800/30">
          <div className="bg-stone-800/60 backdrop-blur rounded-xl p-3 border border-stone-700/50">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Avanço Físico Global</span>
              <Percent className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-white mt-1">
              {globalProgress}%
            </div>
            <div className="text-xs text-amber-300 mt-0.5">
              Medido vs Orçado
            </div>
          </div>

          <div className="bg-stone-800/60 backdrop-blur rounded-xl p-3 border border-stone-700/50">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Valor Medido Acumulado</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {totalMeasuredValue.toLocaleString('pt-MZ')} MT
            </div>
            <div className="text-xs text-stone-300 mt-0.5">
              Total Orçado: {totalPlannedValue.toLocaleString('pt-MZ')} MT
            </div>
          </div>

          <div className="bg-stone-800/60 backdrop-blur rounded-xl p-3 border border-stone-700/50">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Efetivo no Estaleiro</span>
              <HardHat className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">
              34 Trabalhadores
            </div>
            <div className="text-xs text-blue-300 mt-0.5">
              28 directos + 6 indiretos
            </div>
          </div>

          <div className="bg-stone-800/60 backdrop-blur rounded-xl p-3 border border-stone-700/50">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Segurança HST & Sinistros</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              340 Dias
            </div>
            <div className="text-xs text-stone-300 mt-0.5">
              Sem acidentes com paragem
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-700 overflow-x-auto pb-1">
        <button
          onClick={() => setSearchParams({ tab: 'measurements' })}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            currentTab === 'measurements'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <HardHat className="w-4 h-4" />
          Autos de Medição & Avanço
          <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
            {measurements.length}
          </span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'rdo' })}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            currentTab === 'rdo'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Diário de Obra (RDO)
          <span className="px-2 py-0.5 text-xs rounded-full bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300">
            {rdos.length}
          </span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'budget' })}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            currentTab === 'budget'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          Orçamentos & Preços CPU
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'equipment' })}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            currentTab === 'equipment'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          Maquinaria & Equipamentos
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'safety' })}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            currentTab === 'safety'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Segurança no Trabalho & HST
        </button>
      </div>

      {/* TAB 1: AUTOS DE MEDIÇÃO */}
      {currentTab === 'measurements' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Cronograma Físico-Financeiro & Medições de Empreitada
                </h3>
                <p className="text-xs text-gray-500">
                  Acompanhe a quantidade orçada vs executada por capítulo e gere o Auto de Medição para faturamento ao Dono da Obra.
                </p>
              </div>

              <button 
                onClick={() => alert('Auto de Medição nº 04 exportado em PDF oficial com carimbo e campos de assinatura do Fiscal e Empreiteiro.')}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                <FileText className="w-3.5 h-3.5" />
                Emitir Auto de Medição Oficial
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-slate-900/60 text-gray-500 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Etapa / Capítulo de Obra</th>
                    <th className="p-3">Unid.</th>
                    <th className="p-3">Previsto</th>
                    <th className="p-3">Executado</th>
                    <th className="p-3">Preço Unitário</th>
                    <th className="p-3">Valor Executado (MZN)</th>
                    <th className="p-3">% Concluído</th>
                    <th className="p-3">Aprovação Fiscal</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700 text-gray-700 dark:text-gray-300">
                  {measurements.map(item => {
                    const executedVal = item.measuredQty * item.unitPriceMzn;
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                        <td className="p-3 font-semibold text-gray-900 dark:text-white">
                          <div>{item.stageName}</div>
                          <div className="text-[11px] text-gray-500 font-normal">{item.notes}</div>
                        </td>
                        <td className="p-3 font-mono">{item.unit}</td>
                        <td className="p-3 font-mono">{item.plannedQty.toLocaleString('pt-MZ')}</td>
                        <td className="p-3 font-mono font-bold text-amber-600 dark:text-amber-400">
                          {item.measuredQty.toLocaleString('pt-MZ')}
                        </td>
                        <td className="p-3 font-mono">{item.unitPriceMzn.toLocaleString('pt-MZ')} MT</td>
                        <td className="p-3 font-bold text-gray-900 dark:text-white">
                          {executedVal.toLocaleString('pt-MZ')} MT
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-amber-500 h-2 rounded-full" 
                                style={{ width: `${Math.min(item.percentExecuted, 100)}%` }}
                              />
                            </div>
                            <span className="font-bold">{item.percentExecuted}%</span>
                          </div>
                        </td>
                        <td className="p-3">
                          {item.fiscalApproved ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                              <Clock className="w-3.5 h-3.5" /> Em Vistoria
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => {
                              const newQty = prompt(`Atualizar quantidade executada para "${item.stageName}" (em ${item.unit}):`, String(item.measuredQty));
                              if (newQty !== null) {
                                const num = parseFloat(newQty) || 0;
                                setMeasurements(prev => prev.map(m => m.id === item.id ? {
                                  ...m,
                                  measuredQty: num,
                                  percentExecuted: Math.round((num / (m.plannedQty || 1)) * 100),
                                  fiscalApproved: true
                                } : m));
                              }
                            }}
                            className="px-2 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold rounded hover:bg-amber-100 text-xs"
                          >
                            Medir
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

      {/* TAB 2: DIÁRIO DE OBRA (RDO) */}
      {currentTab === 'rdo' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Diário de Obra Digital (Registo Diário de Ocorrências - RDO)
              </h3>
              <p className="text-xs text-gray-500">
                Registo legal exigido pelo Ministério das Obras Públicas (MOPHRH) para acompanhamento do estaleiro.
              </p>
            </div>
            <button 
              onClick={() => {
                const activities = prompt('Atividades desenvolvidas hoje no estaleiro:');
                if (activities) {
                  const newRDO: SiteLogRDO = {
                    id: `RDO-${Math.floor(143 + Math.random() * 50)}`,
                    date: new Date().toISOString().split('T')[0],
                    siteName: 'Edifício Sommerschield Tower',
                    weatherMorning: 'Céu Limpo (29°C)',
                    weatherAfternoon: 'Ensolarado',
                    headcountDirect: 30,
                    headcountIndirect: 6,
                    activitiesDone: activities,
                    equipmentOnSite: 'Grua, Betoneira, Camião Basculante',
                    accidentsCount: 0,
                    fiscalSignOff: true
                  };
                  setRdos(prev => [newRDO, ...prev]);
                }
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Novo Registo Diário (Hoje)
            </button>
          </div>

          <div className="space-y-4">
            {rdos.map(rdo => (
              <div key={rdo.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-700 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400">
                      {rdo.id}
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {rdo.siteName}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {rdo.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Assinado pelo Fiscal
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
                  <div className="p-3 bg-gray-50 dark:bg-slate-900/40 rounded-lg">
                    <span className="text-gray-500 block mb-1">Condições Meteorológicas:</span>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                      <Sun className="w-3.5 h-3.5 text-amber-500" /> Manhã: {rdo.weatherMorning}
                    </div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1 mt-0.5">
                      <Sun className="w-3.5 h-3.5 text-amber-500" /> Tarde: {rdo.weatherAfternoon}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-slate-900/40 rounded-lg">
                    <span className="text-gray-500 block mb-1">Mão de Obra no Estaleiro:</span>
                    <div className="font-semibold text-gray-800 dark:text-gray-200">
                      Direta: {rdo.headcountDirect} trabalhadores
                    </div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                      Indireta (Eng./Fiscal): {rdo.headcountIndirect} profissionais
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-slate-900/40 rounded-lg">
                    <span className="text-gray-500 block mb-1">HST & Equipamentos:</span>
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Acidentes: {rdo.accidentsCount} (Sem ocorrências)
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 truncate mt-0.5">
                      {rdo.equipmentOnSite}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-700/60">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block mb-1">
                    Atividades Desenvolvidas:
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {rdo.activitiesDone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CADERNO DE ENCARGOS & CPU */}
      {currentTab === 'budget' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-600" />
              Composição de Preços Unitários (CPU) & BDI
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Base orçamental de referência para orçamentação de obras em Moçambique com cálculo automático de BDI (Benefícios e Despesas Indiretas).
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-slate-900/60 text-gray-500 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Código / Descrição</th>
                    <th className="p-3">Unid.</th>
                    <th className="p-3">Materiais (MZN)</th>
                    <th className="p-3">Mão de Obra (MZN)</th>
                    <th className="p-3">Equipamentos (MZN)</th>
                    <th className="p-3">Custo Direto</th>
                    <th className="p-3">BDI (%)</th>
                    <th className="p-3 font-bold text-gray-900 dark:text-white">Preço Venda Unit.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700 text-gray-700 dark:text-gray-300">
                  {cpus.map(cpu => {
                    const directCost = cpu.materialCost + cpu.laborCost + cpu.equipmentCost;
                    return (
                      <tr key={cpu.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                        <td className="p-3 font-semibold text-gray-900 dark:text-white">
                          <span className="font-mono text-amber-600 dark:text-amber-400 mr-2">{cpu.code}</span>
                          {cpu.description}
                        </td>
                        <td className="p-3 font-mono">{cpu.unit}</td>
                        <td className="p-3 font-mono">{cpu.materialCost.toLocaleString('pt-MZ')} MT</td>
                        <td className="p-3 font-mono">{cpu.laborCost.toLocaleString('pt-MZ')} MT</td>
                        <td className="p-3 font-mono">{cpu.equipmentCost.toLocaleString('pt-MZ')} MT</td>
                        <td className="p-3 font-bold">{directCost.toLocaleString('pt-MZ')} MT</td>
                        <td className="p-3 font-semibold text-amber-600">{cpu.bdiPercent}%</td>
                        <td className="p-3 font-bold text-gray-900 dark:text-white text-sm">
                          {cpu.totalSalePrice.toLocaleString('pt-MZ')} MT
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

      {/* TAB 4: MAQUINARIA & EQUIPAMENTOS */}
      {currentTab === 'equipment' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-600" />
                  Parque de Máquinas Pesadas & Viaturas de Obra
                </h3>
                <p className="text-xs text-gray-500">
                  Controlo de horímetro, consumo de gasóleo e calendário de revisões preventivas no estaleiro.
                </p>
              </div>
              <div className="text-xs text-stone-600 dark:text-stone-300">
                Consumo Diário: <span className="font-bold text-amber-600">{totalFuelToday} Litros Gasóleo</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipmentList.map(eq => (
                <div key={eq.id} className="p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">{eq.code}</span>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{eq.name}</h4>
                      <span className="text-xs text-gray-500">{eq.brandModel}</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 font-semibold">
                      Operacional
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-200 dark:border-slate-700">
                    <div>
                      <span className="text-gray-500">Horímetro Atual:</span>
                      <div className="font-bold font-mono">{eq.currentHours} horas</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Próxima Revisão:</span>
                      <div className="font-mono text-amber-600 font-bold">{eq.nextServiceHours} horas</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Operador:</span>
                      <div className="font-medium">{eq.operator}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Gasóleo Hoje:</span>
                      <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        <Fuel className="w-3.5 h-3.5 text-amber-500" /> {eq.dieselLitersToday} L
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SEGURANÇA NO TRABALHO & HST */}
      {currentTab === 'safety' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Higiene, Segurança e Saúde no Trabalho (HST)
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Conformidade com a legislação laboral de Moçambique e normas de proteção no estaleiro.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-700 bg-emerald-50/40 dark:bg-emerald-950/20">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Entrega de EPIs</span>
                <div className="text-xl font-bold text-gray-900 dark:text-white mt-1">100% Coberto</div>
                <p className="text-xs text-gray-500 mt-1">Capacetes, botas com biqueira de aço, óculos e arneses distribuídos com termo assinado.</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-700 bg-blue-50/40 dark:bg-blue-950/20">
                <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">DDS Diário</span>
                <div className="text-xl font-bold text-gray-900 dark:text-white mt-1">Realizado às 07:15</div>
                <p className="text-xs text-gray-500 mt-1">Tema de hoje: Prevenção de quedas em altura e uso correto de linhas de vida na laje piso 2.</p>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 dark:border-slate-700 bg-amber-50/40 dark:bg-amber-950/20">
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">Extintores & Farmácia</span>
                <div className="text-xl font-bold text-gray-900 dark:text-white mt-1">Vistorias em Dia</div>
                <p className="text-xs text-gray-500 mt-1">Kit de primeiros socorros completo no contentor do estaleiro e extintores ABC pressurizados.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
