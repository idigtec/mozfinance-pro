import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { RestaurantTable, KitchenOrder, RestaurantTableItem } from '../types';
import { 
  UtensilsCrossed, ChefHat, Plus, Trash2, CheckCircle2, 
  Clock, AlertCircle, ShoppingBag, DollarSign, Layers,
  Receipt, ArrowRight, User, Sparkles, Filter, X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const RestaurantOperations = () => {
  const { 
    activeCompanyId, companies, materials, products, addSale, accounts
  } = useFinance();

  const [activeTab, setActiveTab] = useState<'TABLES' | 'KDS' | 'RECIPES' | 'STOCK_CATEGORIES'>('TABLES');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [activeTableModal, setActiveTableModal] = useState<RestaurantTable | null>(null);
  
  // Sample dish items for quick addition to table orders
  const menuItems = useMemo(() => {
    return [
      { id: 'm1', name: 'Camarão à Laurentina Grelhado', category: 'Frutos do Mar', price: 950 },
      { id: 'm2', name: 'Bife à Portuguesa com Ovo', category: 'Carnes', price: 820 },
      { id: 'm3', name: 'Galinha Cafreal c/ Batata Doce', category: 'Carnes', price: 680 },
      { id: 'm4', name: 'Matapa Tradicional c/ Arroz', category: 'Típicos', price: 450 },
      { id: 'm5', name: 'Cerveja 2M 330ml', category: 'Bebidas', price: 100 },
      { id: 'm6', name: 'Cerveja Laurentina Preta', category: 'Bebidas', price: 110 },
      { id: 'm7', name: 'Vinho Tinto Reserva Alentejo', category: 'Bebidas', price: 1400 },
      { id: 'm8', name: 'Água Mineral da Namaacha 500ml', category: 'Bebidas', price: 60 },
      { id: 'm9', name: 'Sobremesa Pudim de Caramelo', category: 'Sobremesas', price: 250 },
      { id: 'm10', name: 'Café Espresso Delta', category: 'Cafetaria', price: 70 },
    ];
  }, []);

  // Initial local state for tables
  const [tables, setTables] = useState<RestaurantTable[]>([
    {
      id: 'tbl_1',
      companyId: activeCompanyId,
      name: 'Mesa 01',
      zone: 'SALA_PRINCIPAL',
      capacity: 4,
      status: 'OCCUPIED',
      customerName: 'Família Macuácua',
      waiterName: 'Celso',
      openedAt: '12:40',
      total: 1980,
      items: [
        { id: 'ti_1', name: 'Camarão à Laurentina Grelhado', quantity: 1, unitPrice: 950, total: 950, sentToKitchen: true },
        { id: 'ti_2', name: 'Galinha Cafreal c/ Batata Doce', quantity: 1, unitPrice: 680, total: 680, sentToKitchen: true },
        { id: 'ti_3', name: 'Cerveja 2M 330ml', quantity: 2, unitPrice: 100, total: 200, sentToKitchen: true },
        { id: 'ti_4', name: 'Água Mineral da Namaacha 500ml', quantity: 2, unitPrice: 60, total: 120, sentToKitchen: false }
      ]
    },
    {
      id: 'tbl_2',
      companyId: activeCompanyId,
      name: 'Mesa 02',
      zone: 'SALA_PRINCIPAL',
      capacity: 2,
      status: 'AVAILABLE',
      items: [],
      total: 0
    },
    {
      id: 'tbl_3',
      companyId: activeCompanyId,
      name: 'Mesa 03',
      zone: 'SALA_PRINCIPAL',
      capacity: 6,
      status: 'BILL_REQUESTED',
      customerName: 'Dr. Armando Sitoe',
      waiterName: 'Ana Maria',
      openedAt: '12:15',
      total: 3100,
      items: [
        { id: 'ti_5', name: 'Vinho Tinto Reserva Alentejo', quantity: 1, unitPrice: 1400, total: 1400, sentToKitchen: true },
        { id: 'ti_6', name: 'Bife à Portuguesa com Ovo', quantity: 2, unitPrice: 820, total: 1640, sentToKitchen: true },
        { id: 'ti_7', name: 'Café Espresso Delta', quantity: 1, unitPrice: 70, total: 70, sentToKitchen: true }
      ]
    },
    {
      id: 'tbl_4',
      companyId: activeCompanyId,
      name: 'Esplanada 01',
      zone: 'ESPLANADA',
      capacity: 4,
      status: 'OCCUPIED',
      customerName: 'Mesa Grupo Tech',
      waiterName: 'Celso',
      openedAt: '13:05',
      total: 800,
      items: [
        { id: 'ti_8', name: 'Cerveja Laurentina Preta', quantity: 4, unitPrice: 110, total: 440, sentToKitchen: true },
        { id: 'ti_9', name: 'Matapa Tradicional c/ Arroz', quantity: 1, unitPrice: 450, total: 450, sentToKitchen: true }
      ]
    },
    {
      id: 'tbl_5',
      companyId: activeCompanyId,
      name: 'Esplanada 02',
      zone: 'ESPLANADA',
      capacity: 4,
      status: 'RESERVED',
      customerName: 'Sra. Beatriz (19:30)',
      items: [],
      total: 0
    },
    {
      id: 'tbl_6',
      companyId: activeCompanyId,
      name: 'Balcão / Bar 01',
      zone: 'BAR',
      capacity: 1,
      status: 'OCCUPIED',
      customerName: 'Cliente Rápido',
      waiterName: 'Bartender João',
      openedAt: '13:20',
      total: 160,
      items: [
        { id: 'ti_10', name: 'Cerveja 2M 330ml', quantity: 1, unitPrice: 100, total: 100, sentToKitchen: false },
        { id: 'ti_11', name: 'Água Mineral da Namaacha 500ml', quantity: 1, unitPrice: 60, total: 60, sentToKitchen: false }
      ]
    },
    {
      id: 'tbl_7',
      companyId: activeCompanyId,
      name: 'Sala VIP Privada',
      zone: 'VIP',
      capacity: 10,
      status: 'AVAILABLE',
      items: [],
      total: 0
    }
  ]);

  // Kitchen KDS state
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([
    {
      id: 'kds_1',
      companyId: activeCompanyId,
      orderNumber: '#K-108',
      origin: 'Mesa 01',
      items: [
        { name: 'Camarão à Laurentina Grelhado', quantity: 1, notes: 'Bem grelhado, picante à parte' },
        { name: 'Galinha Cafreal c/ Batata Doce', quantity: 1, notes: 'Sem salada crua' }
      ],
      status: 'PREPARING',
      createdAt: '12:45',
      priority: 'URGENT'
    },
    {
      id: 'kds_2',
      companyId: activeCompanyId,
      orderNumber: '#K-109',
      origin: 'Esplanada 01',
      items: [
        { name: 'Matapa Tradicional c/ Arroz', quantity: 1, notes: 'Arroz bem quente' }
      ],
      status: 'PENDING',
      createdAt: '13:08',
      priority: 'NORMAL'
    },
    {
      id: 'kds_3',
      companyId: activeCompanyId,
      orderNumber: '#K-107',
      origin: 'Mesa 03',
      items: [
        { name: 'Bife à Portuguesa com Ovo', quantity: 2, notes: 'Ovos mal passados' }
      ],
      status: 'READY',
      createdAt: '12:22',
      priority: 'NORMAL'
    }
  ]);

  // Active company name
  const currentCompany = companies.find(c => c.id === activeCompanyId);

  // Filtered tables by zone
  const filteredTables = useMemo(() => {
    if (selectedZone === 'ALL') return tables;
    return tables.filter(t => t.zone === selectedZone);
  }, [tables, selectedZone]);

  // Table status update
  const handleOpenTable = (tableId: string) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: 'OCCUPIED',
          openedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          items: [],
          total: 0
        };
      }
      return t;
    }));
  };

  const handleAddItemToTable = (table: RestaurantTable, item: typeof menuItems[0]) => {
    setTables(prev => prev.map(t => {
      if (t.id === table.id) {
        const existingItem = t.items.find(i => i.name === item.name && !i.sentToKitchen);
        let updatedItems: RestaurantTableItem[];
        if (existingItem) {
          updatedItems = t.items.map(i => i.id === existingItem.id ? { ...i, quantity: i.quantity + 1, total: (i.quantity + 1) * i.unitPrice } : i);
        } else {
          const newItem: RestaurantTableItem = {
            id: `ti_${Date.now()}_${Math.random()}`,
            name: item.name,
            quantity: 1,
            unitPrice: item.price,
            total: item.price,
            sentToKitchen: false
          };
          updatedItems = [...t.items, newItem];
        }
        const newTotal = updatedItems.reduce((acc, cur) => acc + cur.total, 0);
        const updatedTable = { ...t, items: updatedItems, total: newTotal };
        if (activeTableModal && activeTableModal.id === t.id) {
          setActiveTableModal(updatedTable);
        }
        return updatedTable;
      }
      return t;
    }));
  };

  const handleSendToKitchen = (table: RestaurantTable) => {
    const unsentItems = table.items.filter(i => !i.sentToKitchen);
    if (unsentItems.length === 0) {
      alert("Não há novos itens para enviar à cozinha nesta mesa.");
      return;
    }

    const newKdsOrder: KitchenOrder = {
      id: `kds_${Date.now()}`,
      companyId: activeCompanyId,
      orderNumber: `#K-${Math.floor(100 + Math.random() * 900)}`,
      origin: table.name,
      items: unsentItems.map(i => ({ name: i.name, quantity: i.quantity, notes: i.notes })),
      status: 'PENDING',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: 'NORMAL'
    };

    setKitchenOrders(prev => [newKdsOrder, ...prev]);

    // Mark items as sent
    setTables(prev => prev.map(t => {
      if (t.id === table.id) {
        const updatedItems = t.items.map(i => ({ ...i, sentToKitchen: true }));
        const updatedTable = { ...t, items: updatedItems };
        if (activeTableModal && activeTableModal.id === t.id) {
          setActiveTableModal(updatedTable);
        }
        return updatedTable;
      }
      return t;
    }));

    alert(`Pedido enviado para a Cozinha KDS (${unsentItems.length} pratos/bebidas)!`);
  };

  const handleCloseBill = (table: RestaurantTable) => {
    if (table.items.length === 0) {
      setTables(prev => prev.map(t => t.id === table.id ? { ...t, status: 'AVAILABLE', total: 0, items: [] } : t));
      setActiveTableModal(null);
      return;
    }

    const targetAccount = accounts[0]?.id || 'default_acc';
    addSale({
      companyId: activeCompanyId === 'all' ? (currentCompany?.id || 'default') : activeCompanyId,
      customerName: table.customerName || `Cliente ${table.name}`,
      date: new Date().toISOString(),
      items: table.items.map(i => ({
        productId: i.id,
        productName: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        total: i.total
      })),
      total: table.total,
      paymentMethod: 'POS_RESTAURANTE',
      status: 'COMPLETED'
    }, targetAccount);

    setTables(prev => prev.map(t => {
      if (t.id === table.id) {
        return {
          ...t,
          status: 'AVAILABLE',
          customerName: undefined,
          waiterName: undefined,
          openedAt: undefined,
          items: [],
          total: 0
        };
      }
      return t;
    }));

    setActiveTableModal(null);
    alert(`Conta da ${table.name} finalizada com sucesso! Valor total: ${table.total.toLocaleString('pt-MZ')} MT creditado em tesouraria.`);
  };

  const updateKdsStatus = (orderId: string, nextStatus: KitchenOrder['status']) => {
    setKitchenOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5">
                <UtensilsCrossed className="h-3.5 w-3.5" />
                Módulo de Restauração & Bar
              </span>
              <span className="text-xs text-amber-200/80 font-medium">
                {currentCompany ? currentCompany.name : 'Empresa Ativa'}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Gestão de Mesas, KDS & Fichas Técnicas
            </h1>
            <p className="text-xs md:text-sm text-amber-100/80 max-w-2xl">
              Controlo operacional de atendimento em salão, envio de pedidos para ecrã de cozinha, faturação de comandas e fichas técnicas de pratos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/pos"
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Abrir POS Caixa</span>
            </Link>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute right-0 -bottom-10 opacity-10 pointer-events-none">
          <ChefHat className="h-64 w-64 text-white" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('TABLES')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'TABLES'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <UtensilsCrossed className="h-4 w-4" />
          <span>Mapa de Mesas & Comandas ({tables.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('KDS')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'KDS'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <ChefHat className="h-4 w-4" />
          <span>Monitor de Cozinha KDS ({kitchenOrders.filter(o => o.status !== 'DELIVERED').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('RECIPES')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'RECIPES'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="h-4 w-4" />
          <span>Fichas Técnicas & Custos de Prato</span>
        </button>

        <button
          onClick={() => setActiveTab('STOCK_CATEGORIES')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'STOCK_CATEGORIES'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Categorias de Estoque Alimentar</span>
        </button>
      </div>

      {/* TAB 1: TABLES VIEW */}
      {activeTab === 'TABLES' && (
        <div className="space-y-6">
          {/* Zone Selector & Metrics */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mr-1 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Ambientes:
              </span>
              {[
                { id: 'ALL', label: 'Todas as Áreas' },
                { id: 'SALA_PRINCIPAL', label: 'Sala Principal' },
                { id: 'ESPLANADA', label: 'Esplanada' },
                { id: 'BAR', label: 'Bar & Balcão' },
                { id: 'VIP', label: 'Sala VIP' }
              ].map(zone => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedZone === zone.id
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {zone.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Disponível
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Ocupada
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Conta Pedida
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Reservada
              </span>
            </div>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTables.map(table => {
              const isOccupied = table.status === 'OCCUPIED';
              const isBillRequested = table.status === 'BILL_REQUESTED';
              const isAvailable = table.status === 'AVAILABLE';
              const isReserved = table.status === 'RESERVED';

              return (
                <div
                  key={table.id}
                  className={`rounded-3xl p-5 border-2 transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                    isBillRequested
                      ? 'border-red-500 bg-red-50/40 dark:bg-red-950/20 shadow-md'
                      : isOccupied
                      ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 shadow-sm'
                      : isReserved
                      ? 'border-blue-400 bg-blue-50/30 dark:bg-blue-950/20'
                      : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-400'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-stone-300">
                          {table.zone.replace('_', ' ')}
                        </span>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                          {table.name}
                        </h3>
                      </div>

                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        isBillRequested ? 'bg-red-600 text-white animate-pulse' :
                        isOccupied ? 'bg-amber-500 text-stone-950' :
                        isReserved ? 'bg-blue-600 text-white' :
                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        {isBillRequested ? 'Pediu Conta' :
                         isOccupied ? 'Ocupada' :
                         isReserved ? 'Reservada' : 'Livre'}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-300 mb-4">
                      <p className="flex items-center justify-between">
                        <span className="text-gray-400">Capacidade:</span>
                        <span className="font-bold">{table.capacity} Lugares</span>
                      </p>
                      {table.customerName && (
                        <p className="flex items-center justify-between">
                          <span className="text-gray-400">Cliente:</span>
                          <span className="font-bold truncate max-w-[150px]">{table.customerName}</span>
                        </p>
                      )}
                      {table.openedAt && (
                        <p className="flex items-center justify-between">
                          <span className="text-gray-400">Aberta às:</span>
                          <span className="font-bold font-mono">{table.openedAt}</span>
                        </p>
                      )}
                      {table.items.length > 0 && (
                        <p className="flex items-center justify-between">
                          <span className="text-gray-400">Itens Consumidos:</span>
                          <span className="font-bold">{table.items.length} itens ({table.items.reduce((a, b) => a + b.quantity, 0)} un)</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase text-gray-400">Subtotal da Mesa</span>
                      <span className="text-lg font-black text-gray-900 dark:text-white">
                        {table.total.toLocaleString('pt-MZ')} MT
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {isAvailable ? (
                        <button
                          onClick={() => handleOpenTable(table.id)}
                          className="col-span-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Plus className="h-4 w-4" /> Abrir Comanda
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setActiveTableModal(table)}
                            className="py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                          >
                            <UtensilsCrossed className="h-3.5 w-3.5" /> Ver Comanda
                          </button>

                          <button
                            onClick={() => handleCloseBill(table)}
                            className="py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-black transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Fechar Conta
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: KITCHEN DISPLAY SYSTEM (KDS) */}
      {activeTab === 'KDS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-stone-900 text-white p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-amber-400" />
              <h3 className="font-black text-sm uppercase tracking-wider">
                Monitor de Pedidos em Tempo Real da Cozinha
              </h3>
            </div>
            <span className="text-xs bg-stone-800 px-3 py-1 rounded-xl text-amber-300 font-bold">
              Auto-atualização ativa (KDS v2.0)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Pendente */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b-2 border-red-500">
                <span className="text-xs font-black uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  Pendentes na Cozinha
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800">
                  {kitchenOrders.filter(o => o.status === 'PENDING').length}
                </span>
              </div>

              <div className="space-y-3">
                {kitchenOrders.filter(o => o.status === 'PENDING').map(order => (
                  <div key={order.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-red-200 dark:border-red-950 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-black text-red-600 font-mono">{order.orderNumber}</span>
                        <h4 className="font-black text-base text-gray-900 dark:text-white">{order.origin}</h4>
                      </div>
                      <span className="text-[10px] font-bold font-mono text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {order.createdAt}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-slate-800 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-slate-800/60 p-2 rounded-xl">
                          <p className="font-black text-gray-900 dark:text-white">
                            <span className="text-amber-600 mr-1.5">{item.quantity}x</span> {item.name}
                          </p>
                          {item.notes && (
                            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium italic mt-0.5">
                              Nota: {item.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => updateKdsStatus(order.id, 'PREPARING')}
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Iniciar Preparação <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}

                {kitchenOrders.filter(o => o.status === 'PENDING').length === 0 && (
                  <div className="p-8 text-center text-xs text-gray-400 border border-dashed rounded-2xl">
                    Sem pedidos pendentes no momento.
                  </div>
                )}
              </div>
            </div>

            {/* Column 2: Em Preparação */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b-2 border-amber-500">
                <span className="text-xs font-black uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  Em Preparação no Fogão
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {kitchenOrders.filter(o => o.status === 'PREPARING').length}
                </span>
              </div>

              <div className="space-y-3">
                {kitchenOrders.filter(o => o.status === 'PREPARING').map(order => (
                  <div key={order.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-amber-300 dark:border-amber-900 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-black text-amber-600 font-mono">{order.orderNumber}</span>
                        <h4 className="font-black text-base text-gray-900 dark:text-white">{order.origin}</h4>
                      </div>
                      <span className="text-[10px] font-bold font-mono text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {order.createdAt}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-slate-800 text-xs">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="bg-amber-50/50 dark:bg-amber-950/30 p-2 rounded-xl">
                          <p className="font-black text-gray-900 dark:text-white">
                            <span className="text-amber-600 mr-1.5">{item.quantity}x</span> {item.name}
                          </p>
                          {item.notes && (
                            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium italic mt-0.5">
                              Nota: {item.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => updateKdsStatus(order.id, 'READY')}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Marcar como Pronto
                    </button>
                  </div>
                ))}

                {kitchenOrders.filter(o => o.status === 'PREPARING').length === 0 && (
                  <div className="p-8 text-center text-xs text-gray-400 border border-dashed rounded-2xl">
                    Nenhum prato a ser cozinhado no momento.
                  </div>
                )}
              </div>
            </div>

            {/* Column 3: Pronto a Servir */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b-2 border-emerald-500">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Prontos para Levar à Mesa
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {kitchenOrders.filter(o => o.status === 'READY').length}
                </span>
              </div>

              <div className="space-y-3">
                {kitchenOrders.filter(o => o.status === 'READY').map(order => (
                  <div key={order.id} className="bg-emerald-50/40 dark:bg-emerald-950/20 p-4 rounded-2xl border-2 border-emerald-400 dark:border-emerald-800 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-black text-emerald-600 font-mono">{order.orderNumber}</span>
                        <h4 className="font-black text-base text-gray-900 dark:text-white">{order.origin}</h4>
                      </div>
                      <span className="text-[10px] font-bold font-mono text-emerald-700 dark:text-emerald-300">
                        Pronto às {order.createdAt}
                      </span>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-emerald-100 dark:border-emerald-900 text-xs">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="font-bold text-gray-800 dark:text-gray-200">
                          ✓ {item.quantity}x {item.name}
                        </p>
                      ))}
                    </div>

                    <button
                      onClick={() => updateKdsStatus(order.id, 'DELIVERED')}
                      className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-black uppercase transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Servido na Mesa
                    </button>
                  </div>
                ))}

                {kitchenOrders.filter(o => o.status === 'READY').length === 0 && (
                  <div className="p-8 text-center text-xs text-gray-400 border border-dashed rounded-2xl">
                    Nenhum prato aguardando entrega no balcão.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RECIPES & FOOD COST */}
      {activeTab === 'RECIPES' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-gray-900 dark:text-white">
                Fichas Técnicas & Food Cost (Custo por Prato)
              </h3>
              <p className="text-xs text-gray-500">
                Engenharia de cardápio com explosão de ingredientes e controlo rigoroso de margem sobre cada refeição.
              </p>
            </div>
            <Link
              to="/production"
              className="bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-700 transition flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Nova Ficha Técnica
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: 'Camarão à Laurentina Grelhado',
                category: 'Frutos do Mar',
                ingredients: [
                  { item: 'Camarão Tigre Calibre 10/20', qty: '400g', cost: 380 },
                  { item: 'Cerveja Laurentina Preta', qty: '100ml', cost: 35 },
                  { item: 'Manteiga c/ Sal', qty: '50g', cost: 40 },
                  { item: 'Alho Fresco & Piri-piri', qty: '30g', cost: 20 },
                  { item: 'Batata Frita Artesanal', qty: '200g', cost: 35 }
                ],
                totalCost: 510,
                salePrice: 950,
                margin: '46.3%'
              },
              {
                name: 'Bife à Portuguesa',
                category: 'Carnes',
                ingredients: [
                  { item: 'Lombo de Vaca Fresco', qty: '250g', cost: 280 },
                  { item: 'Presunto / Bacon', qty: '50g', cost: 50 },
                  { item: 'Ovo de Galinha', qty: '1 un', cost: 15 },
                  { item: 'Batatas às Rodelas', qty: '200g', cost: 35 },
                  { item: 'Molho Especial & Vinho', qty: '60ml', cost: 30 }
                ],
                totalCost: 410,
                salePrice: 820,
                margin: '50.0%'
              },
              {
                name: 'Matapa de Camarão Tradicional',
                category: 'Pratos Típicos',
                ingredients: [
                  { item: 'Folhas de Mandioca Piladas', qty: '300g', cost: 60 },
                  { item: 'Leite de Coco Natural', qty: '200ml', cost: 50 },
                  { item: 'Amendoim Pilado', qty: '150g', cost: 45 },
                  { item: 'Camarão Seco / Fresco', qty: '100g', cost: 90 },
                  { item: 'Arroz Branco Agulha', qty: '150g', cost: 20 }
                ],
                totalCost: 265,
                salePrice: 450,
                margin: '41.1%'
              }
            ].map((recipe, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                      {recipe.category}
                    </span>
                    <h4 className="font-black text-base text-gray-900 dark:text-white mt-1">
                      {recipe.name}
                    </h4>
                  </div>
                  <span className="text-xs font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    {recipe.margin} Margem
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/40 p-3 rounded-xl">
                  <p className="font-black text-[10px] uppercase text-gray-400 mb-1">Ingredientes & Custo Base</p>
                  {recipe.ingredients.map((ing, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span>{ing.item} ({ing.qty})</span>
                      <span className="font-mono font-medium text-gray-900 dark:text-gray-200">{ing.cost} MT</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Custo Total (CMV)</span>
                    <span className="font-bold text-gray-900 dark:text-white font-mono">{recipe.totalCost} MT</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Preço de Cardápio</span>
                    <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">{recipe.salePrice} MT</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STOCK CATEGORIES FOR RESTAURANT */}
      {activeTab === 'STOCK_CATEGORIES' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white">
                  Categorias Setoriais de Estoque de Alimentos & Bebidas
                </h3>
                <p className="text-xs text-gray-500">
                  Estruturadas para gestão de despensas, arcas frigoríficas e controlo de validade e quebras (HACCP).
                </p>
              </div>
              <Link
                to="/production"
                className="bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-700 transition"
              >
                Gerir no Inventário
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {[
                { name: 'Carnes, Aves & Enchidos', temp: 'Congelados (-18°C) / Refrigerados', count: '14 Itens' },
                { name: 'Frutos do Mar & Peixes Frescos', temp: 'Gelo Escamado / Arca (-20°C)', count: '8 Itens' },
                { name: 'Legumes, Hortaliças & Frescos', temp: 'Câmara Frigorífica (+4°C a +8°C)', count: '22 Itens' },
                { name: 'Lacticínios, Queijos & Manteigas', temp: 'Refrigeração Controlada', count: '11 Itens' },
                { name: 'Mercearia Seca, Molhos & Óleos', temp: 'Despensa Seca & Arejada', count: '35 Itens' },
                { name: 'Bebidas Alcoólicas, Vinhos & Cervejas', temp: 'Adega Climatizada / Geleiras', count: '19 Itens' },
                { name: 'Refrigerantes, Águas & Sucos', temp: 'Balcão Frio', count: '12 Itens' },
                { name: 'Padaria, Massas & Farinhas', temp: 'Sacos em Paletes Elevadas', count: '9 Itens' },
                { name: 'Embalagens Takeaway & Descartáveis', temp: 'Armazém Seco', count: '16 Itens' },
                { name: 'Produtos de Limpeza & Higiene HACCP', temp: 'Armário Químico Isolado', count: '7 Itens' }
              ].map((cat, i) => (
                <div key={i} className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{cat.name}</h4>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">{cat.temp}</p>
                  <p className="text-[10px] text-gray-400">{cat.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TABLE COMANDA MODAL */}
      {activeTableModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 dark:border-slate-800 max-h-[90vh] flex flex-col justify-between overflow-hidden animate-in zoom-in-95">
            <div>
              <div className="flex justify-between items-start pb-4 border-b border-gray-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                      {activeTableModal.zone}
                    </span>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">
                      Comanda: {activeTableModal.name}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Cliente: {activeTableModal.customerName || 'Balcão'} | Garçom: {activeTableModal.waiterName || 'Geral'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTableModal(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Quick Add Menu */}
              <div className="py-3">
                <span className="text-[11px] font-black uppercase text-gray-400 block mb-2">
                  Adicionar Prato ou Bebida à Comanda:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {menuItems.slice(0, 6).map(dish => (
                    <button
                      key={dish.id}
                      onClick={() => handleAddItemToTable(activeTableModal, dish)}
                      className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-200 dark:border-amber-800 text-stone-900 dark:text-stone-200 text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> {dish.name.split(' ')[0]} ({dish.price} MT)
                    </button>
                  ))}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-[300px] overflow-y-auto py-2">
                <span className="text-[11px] font-black uppercase text-gray-400 block">
                  Itens Registados na Mesa ({activeTableModal.items.length}):
                </span>
                {activeTableModal.items.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-6 text-center">
                    Nenhum item adicionado à comanda ainda.
                  </p>
                ) : (
                  activeTableModal.items.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 text-xs"
                    >
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          <span className="font-black text-amber-600 mr-2">{item.quantity}x</span>
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-gray-400">{item.unitPrice} MT cada</span>
                          {item.sentToKitchen ? (
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded">
                              ✓ Na Cozinha
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded">
                              Aguardando Envio
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="font-black text-sm text-gray-900 dark:text-white font-mono">
                        {item.total.toLocaleString('pt-MZ')} MT
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Footer and Actions */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-gray-400">Total da Comanda</span>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                  {activeTableModal.total.toLocaleString('pt-MZ')} MT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSendToKitchen(activeTableModal)}
                  className="py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <ChefHat className="h-4 w-4" /> Enviar Pedido para Cozinha KDS
                </button>

                <button
                  onClick={() => handleCloseBill(activeTableModal)}
                  className="py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Emitir Conta & Receber
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
