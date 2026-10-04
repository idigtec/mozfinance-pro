import React, { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { CalendarEvent, DebtType, QuoteStatus, ExpenseStatus, CalendarEventType } from '../types';
import { 
  ChevronLeft, ChevronRight, Printer, Bell, CheckSquare, 
  Banknote, Calendar as CalendarIcon, List as ListIcon, 
  LayoutGrid, Activity, Clock, FileText, AlertTriangle, ShieldCheck, Plus, X, Mail, MessageSquare, Smartphone
} from 'lucide-react';

type ViewMode = 'YEAR' | 'MONTH' | 'WEEK' | 'LIST';

export const Agenda = () => {
  const { debts, tasks, transactions, notes, quotes, expenses, events: customEvents, addEvent } = useFinance();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('MONTH');
  
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '', type: 'MEETING', time: '09:00', notifyEmail: false, notifySMS: false, notifyWhatsApp: false, description: ''
  });

  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: Math.max(10, currentYear - startYear + 5) }, (_, i) => startYear + i);
  const monthsList = Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1).toLocaleDateString('pt-MZ', { month: 'long' }));

  // --- Consolidate ALL System Events ---
  const allEvents: CalendarEvent[] = useMemo(() => {
    const evts: CalendarEvent[] = [...customEvents];

    // 1. Dívidas (Debts)
    debts.forEach(d => {
      evts.push({
        id: `debt-${d.id}`,
        date: d.dueDate.split('T')[0],
        title: `${d.type === DebtType.BORROWED ? 'Pagar' : 'Receber'}: ${d.entity}`,
        type: 'DEBT',
        amount: d.amount,
        status: d.isPaid ? 'COMPLETED' : 'PENDING',
        color: d.type === DebtType.BORROWED ? '#ef4444' : '#10b981'
      });
    });

    // 2. Tarefas (Tasks)
    tasks.forEach(t => {
      if (t.dueDate) {
        evts.push({
          id: `task-${t.id}`,
          date: t.dueDate.split('T')[0],
          title: `Tarefa: ${t.title}`,
          type: 'TASK',
          status: t.isCompleted ? 'COMPLETED' : 'PENDING',
          color: '#3b82f6'
        });
      }
    });

    // 3. Validade de Cotações (Quotes)
    quotes.forEach(q => {
      if (q.status !== QuoteStatus.PAID && q.status !== QuoteStatus.REJECTED) {
        evts.push({
          id: `quote-${q.id}`,
          date: q.validUntil.split('T')[0],
          title: `Expira Cotação: ${q.number}`,
          type: 'REMINDER',
          status: 'PENDING',
          color: '#f59e0b'
        });
      }
    });

    // 4. Despesas Operacionais (Financial Expenses)
    expenses.forEach(e => {
       evts.push({
         id: `exp-${e.id}`,
         date: e.dueDate.split('T')[0],
         title: `Despesa: ${e.name}`,
         type: 'TRANSACTION',
         amount: e.amount,
         status: e.status === ExpenseStatus.PAID ? 'COMPLETED' : 'PENDING',
         color: '#6366f1'
       });
    });

    // 5. Notas com Lembretes
    notes.forEach(n => {
        if(n.reminder) {
            evts.push({
                id: `note-${n.id}`,
                date: n.reminder.split('T')[0],
                title: `Nota: ${n.title}`,
                type: 'NOTE',
                status: 'PENDING',
                color: '#a855f7'
            });
        }
    });

    return evts;
  }, [debts, tasks, quotes, expenses, notes, customEvents]);

  // --- Date Math Helpers ---
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'YEAR') {
      newDate.setFullYear(currentDate.getFullYear() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'MONTH' || viewMode === 'LIST') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'WEEK') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  const setToday = () => setCurrentDate(new Date());

  const getEventsForDate = (dateStr: string) => allEvents.filter(e => e.date === dateStr);

  const handleDayClick = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setNewEvent(prev => ({ ...prev, date: dateStr }));
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    
    addEvent({
      date: newEvent.date,
      time: newEvent.time,
      title: newEvent.title,
      type: newEvent.type as CalendarEventType,
      status: 'PENDING',
      color: '#10b981', // Default color for custom events
      description: newEvent.description,
      notifyEmail: newEvent.notifyEmail,
      notifySMS: newEvent.notifySMS,
      notifyWhatsApp: newEvent.notifyWhatsApp
    });
    
    setIsEventModalOpen(false);
    setNewEvent({ title: '', type: 'MEETING', time: '09:00', notifyEmail: false, notifySMS: false, notifyWhatsApp: false, description: '' });
  };

  // --- Sub-Components for Views ---

  const AnnualView = () => {
    const year = currentDate.getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-300">
        {months.map(month => {
          const days = getDaysInMonth(year, month);
          const firstDay = getFirstDayOfMonth(year, month);
          const monthName = new Date(year, month).toLocaleDateString('pt-MZ', { month: 'long' });

          return (
            <div key={month} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-bold text-gray-900 capitalize mb-2 text-center text-sm border-b pb-1">{monthName}</h4>
              <div className="grid grid-cols-7 gap-1">
                {['D','S','T','Q','Q','S','S'].map(d => <div key={d} className="text-[8px] font-bold text-gray-400 text-center">{d}</div>)}
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                {Array.from({ length: days }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const hasEvents = getEventsForDate(dateStr).length > 0;
                  const isCurrent = new Date().toISOString().split('T')[0] === dateStr;

                  return (
                    <div 
                      key={day} 
                      onClick={() => handleDayClick(year, month, day)}
                      className={`h-6 w-6 flex items-center justify-center text-[10px] rounded-full cursor-pointer transition-colors
                        ${hasEvents ? 'bg-emerald-100 text-emerald-700 font-bold border border-emerald-200' : 'text-gray-600 hover:bg-gray-100'}
                        ${isCurrent ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                      `}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const WeeklyView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2 animate-in slide-in-from-right-4 duration-300">
        {weekDays.map(day => {
          const dateStr = day.toISOString().split('T')[0];
          const dayEvents = getEventsForDate(dateStr);
          const isToday = new Date().toISOString().split('T')[0] === dateStr;

          return (
            <div key={dateStr} className={`min-h-[400px] rounded-xl border p-3 flex flex-col ${isToday ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' : 'bg-white border-gray-200'}`}>
              <div className="text-center mb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase">{day.toLocaleDateString('pt-MZ', { weekday: 'short' })}</p>
                <p className={`text-xl font-black ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>{day.getDate()}</p>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto max-h-[350px] pr-1">
                {dayEvents.map(ev => (
                  <div key={ev.id} className="p-2 rounded-lg border-l-4 shadow-sm bg-white text-[10px] font-bold leading-tight" style={{ borderLeftColor: ev.color }}>
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-gray-500 uppercase text-[8px]">{ev.type}</span>
                        {ev.amount && <span className="text-gray-900">{ev.amount.toLocaleString()} MT</span>}
                    </div>
                    <p className="text-gray-800 line-clamp-2">{ev.title}</p>
                  </div>
                ))}
                {dayEvents.length === 0 && <div className="h-full flex items-center justify-center text-gray-300 opacity-30 italic text-[10px]">Sem tarefas</div>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const MonthlyView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in duration-500">
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(d => (
            <div key={d} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-widest">{d.substring(0,3)}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 auto-rows-fr">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="border-b border-r border-gray-50 bg-gray-50/20 min-h-[120px]" />)}
          {Array.from({ length: days }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = getEventsForDate(dateStr);
            const isToday = new Date().toISOString().split('T')[0] === dateStr;

            return (
              <div key={day} onClick={() => handleDayClick(year, month, day)} className={`border-b border-r border-gray-100 p-2 min-h-[120px] transition-colors hover:bg-gray-50 group relative cursor-pointer ${isToday ? 'bg-blue-50/30' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-bold h-7 w-7 flex items-center justify-center rounded-full
                    ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 group-hover:text-blue-600'}
                  `}>{day}</span>
                  <button className="opacity-0 group-hover:opacity-100 text-emerald-600 hover:bg-emerald-50 p-1 rounded transition"><Plus className="h-3 w-3" /></button>
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(ev => (
                    <div key={ev.id} className="px-1.5 py-0.5 rounded text-[9px] font-bold truncate border-l-2 shadow-sm bg-white" style={{ borderLeftColor: ev.color, color: ev.color }}>
                      {ev.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && <p className="text-[8px] text-gray-400 font-bold ml-1">+{dayEvents.length - 3} mais...</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const ListView = () => {
    const grouped = allEvents.reduce((acc, ev) => {
      if (!acc[ev.date]) acc[ev.date] = [];
      acc[ev.date].push(ev);
      return acc;
    }, {} as Record<string, CalendarEvent[]>);

    const sortedDates = Object.keys(grouped).sort();

    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
        {sortedDates.map(date => {
          const dateObj = new Date(date + 'T12:00:00');
          const isToday = new Date().toISOString().split('T')[0] === date;

          return (
            <div key={date} className="flex flex-col md:flex-row gap-4">
              <div className="md:w-32 flex-shrink-0">
                <div className={`p-3 rounded-2xl text-center shadow-sm border ${isToday ? 'bg-blue-600 border-blue-500 text-white shadow-blue-200' : 'bg-white border-gray-200 text-gray-900'}`}>
                  <p className="text-[10px] font-bold uppercase opacity-80">{dateObj.toLocaleDateString('pt-MZ', { weekday: 'short' })}</p>
                  <p className="text-2xl font-black">{dateObj.getDate()}</p>
                  <p className="text-[10px] font-bold opacity-80">{dateObj.toLocaleDateString('pt-MZ', { month: 'short' })}</p>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                {grouped[date].map(ev => (
                  <div key={ev.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center opacity-20" style={{ backgroundColor: ev.color, color: ev.color }}>
                            {ev.type === 'DEBT' ? <Banknote /> : ev.type === 'TASK' ? <CheckSquare /> : <Activity />}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{ev.type}</p>
                            <h5 className="font-bold text-gray-900">{ev.title}</h5>
                        </div>
                    </div>
                    {ev.amount && <div className="text-right"><p className="font-black text-gray-900">{ev.amount.toLocaleString()} MT</p></div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {sortedDates.length === 0 && <div className="py-20 text-center text-gray-400 font-medium">Nenhum evento futuro ou lembrete registado.</div>}
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 print:hidden">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <CalendarIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Agenda Pro</h2>
              <div className="flex items-center gap-2 mt-1">
                <select 
                  value={currentDate.getMonth()} 
                  onChange={(e) => {
                    const newDate = new Date(currentDate);
                    newDate.setMonth(parseInt(e.target.value));
                    setCurrentDate(newDate);
                  }}
                  className="text-sm font-bold text-blue-600 bg-blue-50 border-none rounded-lg py-1 pl-2 pr-8 cursor-pointer focus:ring-0 capitalize"
                >
                  {monthsList.map((m, i) => <option key={i} value={i}>{m}</option>)}
                </select>
                <select 
                  value={currentDate.getFullYear()} 
                  onChange={(e) => {
                    const newDate = new Date(currentDate);
                    newDate.setFullYear(parseInt(e.target.value));
                    setCurrentDate(newDate);
                  }}
                  className="text-sm font-bold text-blue-600 bg-blue-50 border-none rounded-lg py-1 pl-2 pr-8 cursor-pointer focus:ring-0"
                >
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
        </div>

        {/* View Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
           {[
             { id: 'YEAR', icon: LayoutGrid, label: 'Anual' },
             { id: 'MONTH', icon: CalendarIcon, label: 'Mensal' },
             { id: 'WEEK', icon: Activity, label: 'Semanal' },
             { id: 'LIST', icon: ListIcon, label: 'Lista' }
           ].map(view => (
             <button
                key={view.id}
                onClick={() => setViewMode(view.id as ViewMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === view.id ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-900'}`}
             >
                <view.icon className="h-4 w-4" />
                <span className="hidden lg:inline">{view.label}</span>
             </button>
           ))}
        </div>

        <div className="flex items-center gap-2">
            <button onClick={setToday} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition">Hoje</button>
            <div className="flex bg-white border border-gray-300 rounded-lg shadow-sm">
                <button onClick={() => navigateDate('prev')} className="p-2 hover:bg-gray-50 border-r"><ChevronLeft className="h-4 w-4 text-gray-600" /></button>
                <button onClick={() => navigateDate('next')} className="p-2 hover:bg-gray-50"><ChevronRight className="h-4 w-4 text-gray-600" /></button>
            </div>
            <button onClick={() => window.print()} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow-lg"><Printer className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Main View Area */}
      <main className="min-h-[600px]">
          {viewMode === 'YEAR' && <AnnualView />}
          {viewMode === 'MONTH' && <MonthlyView />}
          {viewMode === 'WEEK' && <WeeklyView />}
          {viewMode === 'LIST' && <ListView />}
      </main>

      {/* Legend & Stats Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 print:hidden">
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center gap-4">
              <div className="bg-emerald-500 text-white p-2 rounded-lg shadow-lg shadow-emerald-200">
                  <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Recebimentos (Este Mês)</p>
                  <p className="text-xl font-black text-emerald-900">{allEvents.filter(e => e.date.startsWith(currentDate.toISOString().substring(0, 7)) && e.type === 'DEBT' && e.color === '#10b981').reduce((acc, i) => acc + (i.amount || 0), 0).toLocaleString()} MT</p>
              </div>
          </div>

          <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-4">
              <div className="bg-red-500 text-white p-2 rounded-lg shadow-lg shadow-red-200">
                  <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                  <p className="text-[10px] font-bold text-red-600 uppercase">Vencimentos (Este Mês)</p>
                  <p className="text-xl font-black text-red-900">{allEvents.filter(e => e.date.startsWith(currentDate.toISOString().substring(0, 7)) && (e.color === '#ef4444' || e.color === '#6366f1')).reduce((acc, i) => acc + (i.amount || 0), 0).toLocaleString()} MT</p>
              </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
              <div className="bg-blue-500 text-white p-2 rounded-lg shadow-lg shadow-blue-200">
                  <CheckSquare className="h-5 w-5" />
              </div>
              <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase">Tarefas em Aberto</p>
                  <p className="text-xl font-black text-blue-900">{allEvents.filter(e => e.type === 'TASK' && e.status === 'PENDING').length} Pendentes</p>
              </div>
          </div>
      </div>

      {/* Event Creation Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-lg text-gray-900">Nova Atividade</h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-gray-500 hover:text-gray-900"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Data</label>
                <input type="date" required value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Hora</label>
                  <input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
                  <select value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value as CalendarEventType})} className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500">
                    <option value="MEETING">Reunião</option>
                    <option value="ANNIVERSARY">Aniversário</option>
                    <option value="ENCOUNTER">Encontro</option>
                    <option value="POTENTIAL">Atividade Potencial</option>
                    <option value="PERSONAL">Pessoal</option>
                    <option value="REMINDER">Lembrete</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Título</label>
                <input type="text" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="Ex: Reunião com Cliente X" className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                <textarea rows={2} value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} placeholder="Detalhes da atividade..." className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 resize-none"></textarea>
              </div>
              
              <div className="border-t pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Notificações (Lembretes)</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={newEvent.notifyEmail} onChange={e => setNewEvent({...newEvent, notifyEmail: e.target.checked})} className="rounded text-emerald-600 focus:ring-emerald-500" />
                    <Mail className="h-4 w-4 text-gray-400" /> E-mail
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={newEvent.notifySMS} onChange={e => setNewEvent({...newEvent, notifySMS: e.target.checked})} className="rounded text-emerald-600 focus:ring-emerald-500" />
                    <MessageSquare className="h-4 w-4 text-gray-400" /> SMS
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={newEvent.notifyWhatsApp} onChange={e => setNewEvent({...newEvent, notifyWhatsApp: e.target.checked})} className="rounded text-emerald-600 focus:ring-emerald-500" />
                    <Smartphone className="h-4 w-4 text-green-500" /> WhatsApp
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-bold">Salvar Atividade</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};