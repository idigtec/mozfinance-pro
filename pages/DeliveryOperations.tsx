import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { DeliveryOrder, DeliveryCourier } from '../types';
import { 
  Truck, Bike, MapPin, Plus, Phone, CheckCircle2, 
  Clock, DollarSign, Smartphone, Navigation, Search, 
  AlertCircle, ArrowRight, UserCheck, X
} from 'lucide-react';

export const DeliveryOperations = () => {
  const { activeCompanyId, companies, addSale, accounts } = useFinance();
  const currentCompany = companies.find(c => c.id === activeCompanyId);

  const [activeTab, setActiveTab] = useState<'ORDERS' | 'COURIERS' | 'ZONES'>('ORDERS');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  // Pre-configured delivery zones in Mozambique
  const deliveryZones = useMemo(() => [
    { id: 'z1', name: 'Maputo Central / Baixa', fee: 100, eta: '15-25 min', radius: '3 km' },
    { id: 'z2', name: 'Polana & Sommerschield', fee: 120, eta: '20-30 min', radius: '5 km' },
    { id: 'z3', name: 'Malhangalene & Maxaquene', fee: 130, eta: '25-35 min', radius: '6 km' },
    { id: 'z4', name: 'Costa do Sol & Triunfo', fee: 180, eta: '30-40 min', radius: '10 km' },
    { id: 'z5', name: 'Zimpeto & Magoanine', fee: 250, eta: '45-60 min', radius: '18 km' },
    { id: 'z6', name: 'Matola Cidade / Fomento', fee: 220, eta: '35-50 min', radius: '15 km' },
    { id: 'z7', name: 'Matola Rio & Tchumene', fee: 280, eta: '45-60 min', radius: '22 km' },
    { id: 'z8', name: 'Marracuene Sede', fee: 350, eta: '50-70 min', radius: '28 km' }
  ], []);

  // Initial couriers
  const [couriers, setCouriers] = useState<DeliveryCourier[]>([
    {
      id: 'cour_1',
      companyId: activeCompanyId,
      name: 'Nelson Tembe',
      phone: '+258 84 123 4567',
      vehicleType: 'MOTA',
      licensePlate: 'MM-44-89 (TVS 125)',
      status: 'ON_DELIVERY',
      completedDeliveries: 142
    },
    {
      id: 'cour_2',
      companyId: activeCompanyId,
      name: 'Simão Mondlane',
      phone: '+258 86 987 6543',
      vehicleType: 'MOTA',
      licensePlate: 'MC-12-78 (Honda Ace)',
      status: 'AVAILABLE',
      completedDeliveries: 98
    },
    {
      id: 'cour_3',
      companyId: activeCompanyId,
      name: 'Carlos Langa',
      phone: '+258 87 555 1212',
      vehicleType: 'MOTA',
      licensePlate: 'MM-88-21 (Boxer 150)',
      status: 'AVAILABLE',
      completedDeliveries: 76
    }
  ]);

  // Initial orders
  const [orders, setOrders] = useState<DeliveryOrder[]>([
    {
      id: 'del_101',
      companyId: activeCompanyId,
      orderCode: 'DEL-#2041',
      customerName: 'Dra. Sandra Matsinhe',
      phone: '+258 84 900 1122',
      deliveryAddress: 'Av. Julius Nyerere, Edifício Jat V, 4º Andar',
      zoneName: 'Polana & Sommerschield',
      itemsDescription: '2x Almoço Executivo + 2x Sucos Naturais',
      itemsAmount: 1400,
      deliveryFee: 120,
      totalAmount: 1520,
      paymentMethod: 'M-PESA',
      courierName: 'Nelson Tembe',
      courierPhone: '+258 84 123 4567',
      courierVehicle: 'Mota TVS - MM-44-89',
      status: 'IN_TRANSIT',
      createdAt: '12:35'
    },
    {
      id: 'del_102',
      companyId: activeCompanyId,
      orderCode: 'DEL-#2042',
      customerName: 'Eng. Alberto Chissano',
      phone: '+258 82 444 8899',
      deliveryAddress: 'Rua do Jardim, Bairro do Triunfo, Casa 22',
      zoneName: 'Costa do Sol & Triunfo',
      itemsDescription: 'Caixa de Medicamentos de Urgência',
      itemsAmount: 850,
      deliveryFee: 180,
      totalAmount: 1030,
      paymentMethod: 'POS',
      status: 'PENDING',
      createdAt: '13:02'
    },
    {
      id: 'del_103',
      companyId: activeCompanyId,
      orderCode: 'DEL-#2040',
      customerName: 'Carla Nhamposse',
      phone: '+258 84 333 4455',
      deliveryAddress: 'Av. 24 de Julho, perto da Polana Shopping',
      zoneName: 'Maputo Central / Baixa',
      itemsDescription: 'Pedido Takeaway Refeição Família',
      itemsAmount: 2200,
      deliveryFee: 100,
      totalAmount: 2300,
      paymentMethod: 'E-MOLA',
      courierName: 'Simão Mondlane',
      status: 'DELIVERED',
      createdAt: '11:45',
      deliveredAt: '12:15'
    }
  ]);

  // Form for new delivery order
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: '',
    phone: '',
    deliveryAddress: '',
    zoneId: deliveryZones[0].id,
    itemsDescription: '',
    itemsAmount: 500,
    paymentMethod: 'M-PESA' as DeliveryOrder['paymentMethod'],
    notes: ''
  });

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (statusFilter === 'ALL') return orders;
    return orders.filter(o => o.status === statusFilter);
  }, [orders, statusFilter]);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrderForm.customerName || !newOrderForm.deliveryAddress) {
      alert("Preencha o nome e o endereço de entrega do cliente.");
      return;
    }

    const selectedZone = deliveryZones.find(z => z.id === newOrderForm.zoneId) || deliveryZones[0];
    const fee = selectedZone.fee;
    const total = Number(newOrderForm.itemsAmount) + fee;

    const newOrder: DeliveryOrder = {
      id: `del_${Date.now()}`,
      companyId: activeCompanyId,
      orderCode: `DEL-#${Math.floor(2000 + Math.random() * 8000)}`,
      customerName: newOrderForm.customerName,
      phone: newOrderForm.phone || '+258 84 ...',
      deliveryAddress: newOrderForm.deliveryAddress,
      zoneName: selectedZone.name,
      itemsDescription: newOrderForm.itemsDescription || 'Encomenda Expressa',
      itemsAmount: Number(newOrderForm.itemsAmount),
      deliveryFee: fee,
      totalAmount: total,
      paymentMethod: newOrderForm.paymentMethod,
      status: 'PENDING',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: newOrderForm.notes
    };

    setOrders([newOrder, ...orders]);
    setShowNewOrderModal(false);
    alert(`Pedido de Delivery ${newOrder.orderCode} criado com sucesso! Taxa calculada: ${fee} MT para ${selectedZone.name}.`);
  };

  const handleAssignCourier = (orderId: string, courier: DeliveryCourier) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'IN_TRANSIT',
          courierName: courier.name,
          courierPhone: courier.phone,
          courierVehicle: courier.licensePlate
        };
      }
      return o;
    }));

    setCouriers(prev => prev.map(c => c.id === courier.id ? { ...c, status: 'ON_DELIVERY' } : c));
    alert(`Pedido atribuído ao estafeta ${courier.name}. Mota em rota de entrega!`);
  };

  const handleMarkDelivered = (order: DeliveryOrder) => {
    const targetAccount = accounts[0]?.id || 'default_acc';
    addSale({
      companyId: activeCompanyId === 'all' ? (currentCompany?.id || 'default') : activeCompanyId,
      customerName: `Delivery: ${order.customerName}`,
      date: new Date().toISOString(),
      items: [{
        productId: order.id,
        productName: `Serviço de Entrega & Encomenda (${order.orderCode})`,
        quantity: 1,
        unitPrice: order.totalAmount,
        total: order.totalAmount
      }],
      total: order.totalAmount,
      paymentMethod: `DELIVERY_${order.paymentMethod}`,
      status: 'COMPLETED'
    }, targetAccount);

    setOrders(prev => prev.map(o => {
      if (o.id === order.id) {
        return {
          ...o,
          status: 'DELIVERED',
          deliveredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return o;
    }));

    if (order.courierName) {
      setCouriers(prev => prev.map(c => {
        if (c.name === order.courierName) {
          return {
            ...c,
            status: 'AVAILABLE',
            completedDeliveries: c.completedDeliveries + 1
          };
        }
        return c;
      }));
    }

    alert(`Entrega ${order.orderCode} confirmada com sucesso! Valor total de ${order.totalAmount.toLocaleString('pt-MZ')} MT liquidado.`);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-stone-900 text-white p-6 md:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full border border-blue-400/30 flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" />
                Módulo de Delivery & Entregas Rápidas
              </span>
              <span className="text-xs text-blue-200/80 font-medium">
                Logística Urbana Moçambique
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Central de Despacho & Gestão de Estafetas
            </h1>
            <p className="text-xs md:text-sm text-blue-100/80 max-w-2xl">
              Monitorização de entregas em tempo real, cálculo automático de fretes por bairro, distribuição de rotas a estafetas e liquidação via M-Pesa / e-Mola / POS.
            </p>
          </div>

          <button
            onClick={() => setShowNewOrderModal(true)}
            className="bg-blue-500 hover:bg-blue-400 text-stone-950 font-black px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Pedido de Entrega</span>
          </button>
        </div>

        <div className="absolute right-0 -bottom-10 opacity-10 pointer-events-none">
          <Truck className="h-64 w-64 text-white" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('ORDERS')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ORDERS'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>Painel de Despacho ({orders.filter(o => o.status !== 'DELIVERED').length} Ativos)</span>
        </button>

        <button
          onClick={() => setActiveTab('COURIERS')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'COURIERS'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bike className="h-4 w-4" />
          <span>Estafetas & Motas ({couriers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ZONES')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'ZONES'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Tabela de Tarifas por Zona ({deliveryZones.length})</span>
        </button>
      </div>

      {/* TAB 1: DISPATCH ORDERS */}
      {activeTab === 'ORDERS' && (
        <div className="space-y-6">
          {/* Status Filter */}
          <div className="flex items-center gap-2 overflow-x-auto bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-200 dark:border-slate-800">
            <span className="text-xs font-bold text-gray-500 mr-2">Filtrar Estado:</span>
            {[
              { id: 'ALL', label: 'Todos os Pedidos' },
              { id: 'PENDING', label: 'Pendentes de Saída' },
              { id: 'IN_TRANSIT', label: 'Em Trânsito / Na Rua' },
              { id: 'DELIVERED', label: 'Concluídos Hoje' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Orders Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOrders.map(order => {
              const isPending = order.status === 'PENDING';
              const isInTransit = order.status === 'IN_TRANSIT';
              const isDelivered = order.status === 'DELIVERED';

              return (
                <div
                  key={order.id}
                  className={`rounded-3xl p-5 border-2 transition-all flex flex-col justify-between space-y-4 ${
                    isInTransit 
                      ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-950/20 shadow-md' 
                      : isPending 
                      ? 'border-amber-400 bg-amber-50/30 dark:bg-amber-950/20 shadow-sm' 
                      : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-xs font-mono font-black text-blue-600 dark:text-blue-400">
                          {order.orderCode}
                        </span>
                        <h3 className="font-black text-base text-gray-900 dark:text-white mt-0.5">
                          {order.customerName}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3" /> {order.phone}
                        </p>
                      </div>

                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-xl font-mono ${
                        isInTransit ? 'bg-blue-600 text-white animate-pulse' :
                        isPending ? 'bg-amber-500 text-stone-950' :
                        'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        {isInTransit ? 'Em Rota' : isPending ? 'Aguardando Moto' : 'Entregue'}
                      </span>
                    </div>

                    <div className="mt-3 p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700/60 space-y-2 text-xs">
                      <div className="flex items-start gap-1.5 text-gray-700 dark:text-gray-300">
                        <MapPin className="h-3.5 w-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">{order.zoneName}</p>
                          <p className="text-[11px] text-gray-500">{order.deliveryAddress}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 dark:border-slate-700 text-gray-600 dark:text-gray-400">
                        <p className="text-[11px] font-medium">{order.itemsDescription}</p>
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t border-gray-100 dark:border-slate-700">
                        <span className="text-gray-400">Pagamento:</span>
                        <span className="font-bold text-[11px] px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>

                    {order.courierName && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-950/30 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-bold">
                          <Bike className="h-3.5 w-3.5 text-blue-600" />
                          {order.courierName}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">{order.courierVehicle}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="text-gray-400 text-[10px] block">Produtos + Frete ({order.deliveryFee} MT)</span>
                        <span className="text-lg font-black text-gray-900 dark:text-white font-mono">
                          {order.totalAmount.toLocaleString('pt-MZ')} MT
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-gray-400">
                        Hora: {order.createdAt}
                      </span>
                    </div>

                    {isPending && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">Atribuir Estafeta:</span>
                        <div className="flex gap-1.5 overflow-x-auto pb-1">
                          {couriers.filter(c => c.status === 'AVAILABLE').map(courier => (
                            <button
                              key={courier.id}
                              onClick={() => handleAssignCourier(order.id, courier)}
                              className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition flex items-center gap-1 whitespace-nowrap cursor-pointer shadow-sm"
                            >
                              <Bike className="h-3 w-3" /> {courier.name.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {isInTransit && (
                      <button
                        onClick={() => handleMarkDelivered(order)}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Confirmar Entrega & Liquidar
                      </button>
                    )}

                    {isDelivered && (
                      <div className="text-center py-1.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Entregue com Sucesso ({order.deliveredAt})
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: COURIERS */}
      {activeTab === 'COURIERS' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Bike className="h-5 w-5 text-blue-600" />
                  Frota de Estafetas & Motas de Entrega
                </h3>
                <p className="text-xs text-gray-500">
                  Registo dos estafetas de serviço, matrículas das viaturas de duas rodas e histórico de encomendas entregues.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {couriers.map(c => (
                <div key={c.id} className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-base text-gray-900 dark:text-white">{c.name}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3" /> {c.phone}
                      </p>
                    </div>

                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      c.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' :
                      c.status === 'ON_DELIVERY' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {c.status === 'AVAILABLE' ? 'Disponível' : 'Em Rota'}
                    </span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl space-y-1 text-xs text-gray-600 dark:text-gray-300">
                    <p className="flex justify-between">
                      <span className="text-gray-400">Veículo & Matrícula:</span>
                      <span className="font-mono font-bold">{c.licensePlate}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-400">Entregas Concluídas:</span>
                      <span className="font-bold text-emerald-600">{c.completedDeliveries} pedidos</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ZONES */}
      {activeTab === 'ZONES' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-500" />
                Tabela Oficial de Tarifas de Frete por Zona Geográfica
              </h3>
              <p className="text-xs text-gray-500">
                Preços automáticos calculados na fatura do cliente consoante o raio e a zona de entrega em Moçambique.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {deliveryZones.map(z => (
                <div key={z.id} className="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-black text-sm text-gray-900 dark:text-white">{z.name}</h4>
                    <span className="text-[10px] font-bold text-gray-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded">
                      {z.radius}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-slate-700 text-xs">
                    <span className="text-gray-400">Taxa de Frete:</span>
                    <span className="font-mono font-black text-base text-blue-600 dark:text-blue-400">{z.fee} MT</span>
                  </div>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> ETA Médio: {z.eta}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW DELIVERY ORDER */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800">
              <h3 className="font-black text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-600" />
                Criar Novo Pedido de Entrega Expressa
              </h3>
              <button
                onClick={() => setShowNewOrderModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Nome do Destinatário / Cliente *</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.customerName}
                    onChange={e => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                    placeholder="Ex: João Tembe"
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Contacto Telefónico</label>
                  <input
                    type="text"
                    value={newOrderForm.phone}
                    onChange={e => setNewOrderForm({ ...newOrderForm, phone: e.target.value })}
                    placeholder="+258 84 ... / 82 ..."
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-gray-300">Zona Geográfica (Calcula a Taxa) *</label>
                <select
                  value={newOrderForm.zoneId}
                  onChange={e => setNewOrderForm({ ...newOrderForm, zoneId: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-bold text-blue-600"
                >
                  {deliveryZones.map(z => (
                    <option key={z.id} value={z.id}>
                      {z.name} — Taxa: {z.fee} MT ({z.eta})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-gray-300">Endereço Exato de Entrega *</label>
                <input
                  type="text"
                  required
                  value={newOrderForm.deliveryAddress}
                  onChange={e => setNewOrderForm({ ...newOrderForm, deliveryAddress: e.target.value })}
                  placeholder="Ex: Av. 24 de Julho, Edifício das Flores, 3º Esq."
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-gray-300">Descrição dos Produtos / Pacote</label>
                <input
                  type="text"
                  value={newOrderForm.itemsDescription}
                  onChange={e => setNewOrderForm({ ...newOrderForm, itemsDescription: e.target.value })}
                  placeholder="Ex: 2x Hamburgueres Especiais + 2x Batatas + 1x Refrigerante"
                  className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Valor dos Itens (MT)</label>
                  <input
                    type="number"
                    min="0"
                    value={newOrderForm.itemsAmount}
                    onChange={e => setNewOrderForm({ ...newOrderForm, itemsAmount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Método de Pagamento</label>
                  <select
                    value={newOrderForm.paymentMethod}
                    onChange={e => setNewOrderForm({ ...newOrderForm, paymentMethod: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="M-PESA">M-Pesa (Vodacom)</option>
                    <option value="E-MOLA">e-Mola (Movitel)</option>
                    <option value="POS">POS Cartão na Entrega</option>
                    <option value="CASH">Dinheiro Físico</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black"
                >
                  Criar Pedido de Despacho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
