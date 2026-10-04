import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Task, TaskPriority } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, Calendar, Clock, Edit2, X, AlertTriangle, Check, RotateCcw, Bell } from 'lucide-react';

export const Tasks = () => {
  const { tasks, addTask, updateTask, removeTask } = useFinance();
  
  // Create State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [newDate, setNewDate] = useState('');
  const [newReminder, setNewReminder] = useState('');

  // Manage State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for Snooze Menu in List Item
  const [snoozeMenuId, setSnoozeMenuId] = useState<string | null>(null);

  // --- Helpers ---
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Sem data';
    return new Date(dateStr).toLocaleDateString('pt-MZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  const formatDateTime = (dateStr?: string) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return `${d.toLocaleDateString('pt-MZ')} ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  };

  const isTaskOverdue = (task: Task) => {
    if (task.isCompleted || !task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(task.dueDate) < today;
  };

  // --- Handlers ---
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    addTask({
      title: newTaskTitle,
      description: newTaskDescription,
      priority: newPriority,
      isCompleted: false,
      dueDate: newDate ? new Date(newDate).toISOString() : undefined,
      reminderDate: newReminder ? new Date(newReminder).toISOString() : undefined,
      subtasks: []
    });
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewDate('');
    setNewReminder('');
    setNewPriority(TaskPriority.MEDIUM);
  };

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = (task: Task, completed: boolean) => {
    updateTask({ ...task, isCompleted: completed });
    if (isModalOpen) setIsModalOpen(false);
  };

  const handleSnooze = (task: Task, days: number) => {
    const current = task.dueDate ? new Date(task.dueDate) : new Date();
    const nextDate = new Date(current);
    nextDate.setDate(current.getDate() + days);
    
    updateTask({ 
      ...task, 
      dueDate: nextDate.toISOString(),
      isCompleted: false
    });
    setSnoozeMenuId(null);
    if (isModalOpen) setIsModalOpen(false);
  };

  const handleCustomDateSnooze = (task: Task, dateStr: string) => {
      if(!dateStr) return;
      updateTask({
          ...task,
          dueDate: new Date(dateStr).toISOString(),
          isCompleted: false
      });
      setSnoozeMenuId(null);
      if (isModalOpen) setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedTask && confirm('Tem certeza que deseja apagar esta tarefa?')) {
      removeTask(selectedTask.id);
      setIsModalOpen(false);
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTask) {
       updateTask(selectedTask);
       setIsModalOpen(false);
    }
  };

  const priorityColors = {
    [TaskPriority.HIGH]: 'text-red-700 bg-red-50 border-red-200',
    [TaskPriority.MEDIUM]: 'text-orange-700 bg-orange-50 border-orange-200',
    [TaskPriority.LOW]: 'text-blue-700 bg-blue-50 border-blue-200',
  };

  // Sort: Incomplete first, then by Date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Minhas Tarefas</h2>
        <p className="text-sm text-gray-500">Toque em uma tarefa para ver opções de gestão</p>
      </div>

      {/* Input Area */}
      <form onSubmit={handleAdd} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-3">
            <input 
            type="text" 
            value={newTaskTitle} 
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="O que precisa ser feito?" 
            className="flex-1 border border-gray-300 bg-white text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none placeholder-gray-500 shadow-sm font-medium"
            />
            <select 
            value={newPriority} 
            onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
            className="border border-gray-300 bg-white text-gray-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer font-medium"
            >
            {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
        </div>
        <div>
            <textarea 
              value={newTaskDescription} 
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Descrição ou detalhes adicionais (opcional)" 
              className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none placeholder-gray-500 shadow-sm font-medium text-sm resize-none"
              rows={2}
            />
        </div>
        <div className="flex flex-col md:flex-row gap-3 items-center">
             <div className="flex-1 w-full relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold uppercase pointer-events-none">Prazo:</span>
                <input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg pl-14 pr-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer font-medium text-sm"
                />
             </div>
             <div className="flex-1 w-full relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold uppercase pointer-events-none">Lembrete:</span>
                <input 
                    type="datetime-local" 
                    value={newReminder}
                    onChange={(e) => setNewReminder(e.target.value)}
                    className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg pl-20 pr-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer font-medium text-sm"
                />
             </div>
            <button type="submit" className="w-full md:w-auto bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm">
                <Plus className="h-5 w-5" /> <span>Adicionar</span>
            </button>
        </div>
      </form>

      {/* Task List */}
      <div className="space-y-3">
        {sortedTasks.map(task => {
           const isOverdue = isTaskOverdue(task);
           
           return (
            <div 
              key={task.id} 
              className={`group relative flex items-center justify-between p-4 bg-white rounded-xl border transition-all hover:shadow-md
                ${task.isCompleted ? 'border-gray-100 bg-gray-50' : 'border-gray-200'}
                ${isOverdue ? 'border-l-4 border-l-red-500 bg-red-50/30' : ''}
              `}
              onMouseLeave={() => setSnoozeMenuId(null)}
            >
              {/* Main Content Area - Click to Edit */}
              <div className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer" onClick={() => openTaskModal(task)}>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleUpdateStatus(task, !task.isCompleted); }}
                  className={`transition-colors flex-shrink-0 ${task.isCompleted ? 'text-emerald-500' : 'text-gray-300 hover:text-emerald-500'}`}
                >
                  {task.isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                </button>
                
                <div className="min-w-0">
                  <p className={`font-medium truncate transition-all ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className={`text-xs truncate transition-all ${task.isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${priorityColors[task.priority]}`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                        {isOverdue ? <AlertTriangle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                        {formatDate(task.dueDate)}
                        {isOverdue && <span className="text-[10px] bg-red-100 px-1 rounded">Atrasado</span>}
                      </span>
                    )}
                    {task.reminderDate && (
                        <span className="text-xs flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100" title={`Lembrete: ${formatDateTime(task.reminderDate)}`}>
                            <Bell className="h-3 w-3" />
                            {new Date(task.reminderDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Hover Actions for Incomplete Tasks */}
              {!task.isCompleted && (
                <div className="flex items-center gap-2 ml-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                   <button 
                      onClick={(e) => { e.stopPropagation(); handleUpdateStatus(task, true); }}
                      className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold border border-emerald-200 transition-colors"
                      title="Marcar como concluída"
                   >
                     <Check className="h-3 w-3" /> Confirmar
                   </button>
                   
                   <div className="relative">
                     <button 
                        onClick={(e) => { e.stopPropagation(); setSnoozeMenuId(snoozeMenuId === task.id ? null : task.id); }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg text-xs font-bold border border-gray-200 transition-colors"
                     >
                       <Clock className="h-3 w-3" /> Adiar
                     </button>
                     
                     {/* Snooze Dropdown */}
                     {snoozeMenuId === task.id && (
                       <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-10 overflow-hidden flex flex-col p-1">
                          <button onClick={(e) => { e.stopPropagation(); handleSnooze(task, 1); }} className="text-left px-3 py-2 hover:bg-gray-50 text-xs font-medium text-gray-700 rounded-lg">
                            +1 Dia (Amanhã)
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleSnooze(task, 3); }} className="text-left px-3 py-2 hover:bg-gray-50 text-xs font-medium text-gray-700 rounded-lg">
                            +3 Dias
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleSnooze(task, 7); }} className="text-left px-3 py-2 hover:bg-gray-50 text-xs font-medium text-gray-700 rounded-lg mb-1 border-b border-gray-100">
                            +1 Semana
                          </button>
                          <div className="px-2 py-1">
                              <label className="text-[10px] text-gray-400 font-bold uppercase ml-1">Escolher Data:</label>
                              <input 
                                type="date" 
                                className="w-full text-xs border border-gray-300 rounded p-1 mt-1 cursor-pointer bg-white text-gray-900 outline-none focus:border-emerald-500"
                                onChange={(e) => { e.stopPropagation(); handleCustomDateSnooze(task, e.target.value); }}
                                onClick={(e) => e.stopPropagation()}
                              />
                          </div>
                       </div>
                     )}
                   </div>
                </div>
              )}

              {/* Edit Icon (always visible on mobile, hover on desktop if completed) */}
              <div className={`ml-2 text-gray-300 ${!task.isCompleted ? 'hidden md:block md:opacity-0 md:group-hover:opacity-100' : ''}`}>
                  <Edit2 className="h-4 w-4" />
              </div>
            </div>
           );
        })}
        
        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p>Nenhuma tarefa pendente.</p>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                
                {/* Header */}
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Gerir Tarefa</h3>
                    <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-white/10 rounded-full"><X className="h-5 w-5" /></button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {/* Status & Actions */}
                    <div className="mb-6 flex flex-col gap-3">
                        <button 
                            onClick={() => handleUpdateStatus(selectedTask, !selectedTask.isCompleted)}
                            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                                selectedTask.isCompleted 
                                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'
                            }`}
                        >
                            {selectedTask.isCompleted ? (
                                <><RotateCcw className="h-5 w-5" /> Reabrir Tarefa</>
                            ) : (
                                <><CheckCircle2 className="h-5 w-5" /> Concluir Tarefa</>
                            )}
                        </button>

                        {!selectedTask.isCompleted && (
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => handleSnooze(selectedTask, 1)} className="py-2 px-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 text-xs font-medium flex flex-col items-center justify-center">
                                    <Clock className="h-4 w-4 mb-1" />
                                    +1 Dia
                                </button>
                                <button onClick={() => handleSnooze(selectedTask, 3)} className="py-2 px-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 text-xs font-medium flex flex-col items-center justify-center">
                                    <Clock className="h-4 w-4 mb-1" />
                                    +3 Dias
                                </button>
                                <div className="relative">
                                    <input 
                                        type="date"
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        onChange={(e) => handleCustomDateSnooze(selectedTask, e.target.value)}
                                    />
                                    <button className="w-full h-full py-2 px-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 text-xs font-medium flex flex-col items-center justify-center">
                                        <Calendar className="h-4 w-4 mb-1" />
                                        Data...
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <hr className="border-gray-100 mb-6" />

                    {/* Edit Form */}
                    <form onSubmit={handleEditSave} className="space-y-4">
                        <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Editar Detalhes</h4>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">Título</label>
                            <input 
                                type="text" 
                                value={selectedTask.title} 
                                onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
                                className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">Descrição</label>
                            <textarea 
                                value={selectedTask.description || ''} 
                                onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})}
                                className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium text-sm resize-none"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-800 mb-1">Prioridade</label>
                                <select 
                                    value={selectedTask.priority} 
                                    onChange={(e) => setSelectedTask({...selectedTask, priority: e.target.value as TaskPriority})}
                                    className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg p-3 shadow-sm cursor-pointer font-medium"
                                >
                                    {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-800 mb-1">Data Vencimento</label>
                                <input 
                                    type="date" 
                                    value={selectedTask.dueDate ? selectedTask.dueDate.split('T')[0] : ''}
                                    onChange={(e) => setSelectedTask({...selectedTask, dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined})}
                                    className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg p-3 shadow-sm cursor-pointer font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-800 mb-1">Lembrete Personalizado</label>
                             <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input 
                                    type="datetime-local" 
                                    value={selectedTask.reminderDate ? selectedTask.reminderDate.slice(0, 16) : ''}
                                    onChange={(e) => setSelectedTask({...selectedTask, reminderDate: e.target.value ? new Date(e.target.value).toISOString() : undefined})}
                                    className="w-full border border-gray-300 bg-white text-gray-900 rounded-lg pl-10 pr-4 py-3 shadow-sm cursor-pointer font-medium text-sm"
                                />
                             </div>
                             {selectedTask.reminderDate && (
                                 <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                                     <Bell className="h-3 w-3" /> Lembrete ativo
                                 </p>
                             )}
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs font-bold text-gray-800">Sub-tarefas</label>
                                <button 
                                  type="button" 
                                  onClick={() => setSelectedTask({...selectedTask, subtasks: [...(selectedTask.subtasks || []), { id: Date.now().toString(), title: '', isCompleted: false }]})}
                                  className="text-emerald-600 hover:text-emerald-700 text-xs font-bold flex items-center gap-1"
                                >
                                  <Plus className="h-3 w-3" /> Adicionar
                                </button>
                            </div>
                            <div className="space-y-2">
                                {selectedTask.subtasks?.map((st, index) => (
                                    <div key={st.id} className="flex items-center gap-2">
                                        <button 
                                          type="button"
                                          onClick={() => {
                                            const newSubtasks = [...(selectedTask.subtasks || [])];
                                            newSubtasks[index].isCompleted = !newSubtasks[index].isCompleted;
                                            setSelectedTask({...selectedTask, subtasks: newSubtasks});
                                          }}
                                          className={`flex-shrink-0 ${st.isCompleted ? 'text-emerald-500' : 'text-gray-300'}`}
                                        >
                                          {st.isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                                        </button>
                                        <input 
                                          type="text" 
                                          value={st.title}
                                          onChange={(e) => {
                                            const newSubtasks = [...(selectedTask.subtasks || [])];
                                            newSubtasks[index].title = e.target.value;
                                            setSelectedTask({...selectedTask, subtasks: newSubtasks});
                                          }}
                                          className={`flex-1 border-none bg-transparent p-1 text-sm font-medium focus:ring-0 ${st.isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}
                                          placeholder="Descrição da sub-tarefa..."
                                        />
                                        <button 
                                          type="button"
                                          onClick={() => {
                                            const newSubtasks = selectedTask.subtasks?.filter((_, i) => i !== index);
                                            setSelectedTask({...selectedTask, subtasks: newSubtasks});
                                          }}
                                          className="text-red-400 hover:text-red-600 p-1"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <button onClick={handleDelete} className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50 flex items-center gap-1 text-sm font-medium">
                        <Trash2 className="h-4 w-4" /> Apagar
                    </button>
                    <button onClick={handleEditSave} className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 text-sm font-bold shadow-md">
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};