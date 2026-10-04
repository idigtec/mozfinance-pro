import React, { useState } from 'react';
import { 
  Laptop, 
  Sparkles, 
  ShieldAlert, 
  Globe, 
  Users, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Server, 
  ExternalLink, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Code, 
  GitBranch, 
  Tag, 
  Check, 
  ArrowUpRight,
  HelpCircle,
  Play,
  RotateCw,
  Database
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { useSearchParams } from 'react-router-dom';

interface SprintTask {
  id: string;
  title: string;
  project: string;
  points: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignee: string;
  status: 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'CODE_REVIEW' | 'DONE';
  tags: string[];
}

interface SaasSubscription {
  id: string;
  client: string;
  nuit: string;
  plan: 'Starter' | 'Professional' | 'Enterprise Cloud';
  cycle: 'Mensal' | 'Anual';
  mrrMzn: number;
  startDate: string;
  nextRenewal: string;
  status: 'ACTIVE' | 'TRIAL' | 'OVERDUE' | 'CANCELLED';
  apiKey: string;
}

interface SupportTicket {
  id: string;
  title: string;
  client: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  slaHours: number;
  timeRemaining: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_CLIENT' | 'RESOLVED';
  assignee: string;
  createdAt: string;
}

interface CloudResource {
  id: string;
  provider: 'GCP' | 'AWS' | 'DigitalOcean' | 'Cloudflare';
  serviceName: string;
  region: string;
  monthlyCostUsd: number;
  monthlyCostMzn: number;
  status: 'HEALTHY' | 'WARNING' | 'MAINTENANCE';
  utilization: string;
}

export const TechOperations: React.FC = () => {
  const { activeCompanyId, companies } = useFinance();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'sprints';

  const activeCompany = companies.find(c => c.id === activeCompanyId);

  // Initial State: Tasks / Sprints
  const [tasks, setTasks] = useState<SprintTask[]>([
    {
      id: 'TASK-101',
      title: 'Integração API M-Pesa C2B com Webhook assíncrono',
      project: 'Portal Pagamentos',
      points: 8,
      priority: 'CRITICAL',
      assignee: 'Arsénio Mambo (Senior Dev)',
      status: 'IN_PROGRESS',
      tags: ['Backend', 'Fintech', 'NodeJS']
    },
    {
      id: 'TASK-102',
      title: 'Auditoria de Segurança e Cifra de Chaves OAuth2',
      project: 'Core Platform',
      points: 5,
      priority: 'HIGH',
      assignee: 'Helena Sitoe (Security)',
      status: 'CODE_REVIEW',
      tags: ['Security', 'OAuth']
    },
    {
      id: 'TASK-103',
      title: 'Otimização de Queries SQL de Relatórios de Fecho Mensal',
      project: 'Analytics ERP',
      points: 3,
      priority: 'MEDIUM',
      assignee: 'Edgar Cossa (DBA)',
      status: 'TODO',
      tags: ['Database', 'Postgres']
    },
    {
      id: 'TASK-104',
      title: 'Emissão de Factura Certificada e QR Code AT Moçambique',
      project: 'Fiscal Core',
      points: 8,
      priority: 'HIGH',
      assignee: 'Arsénio Mambo',
      status: 'DONE',
      tags: ['Fiscal', 'AT-MZ']
    },
    {
      id: 'TASK-105',
      title: 'Dashboard de Indicadores PGC-NIRF em tempo real',
      project: 'Executive Suite',
      points: 5,
      priority: 'MEDIUM',
      assignee: 'Neide Manjate (Frontend)',
      status: 'BACKLOG',
      tags: ['Frontend', 'React']
    }
  ]);

  // Initial State: Subscriptions SaaS
  const [subscriptions, setSubscriptions] = useState<SaasSubscription[]>([
    {
      id: 'SUB-01',
      client: 'Construções Zambeze, S.A.',
      nuit: '401823901',
      plan: 'Enterprise Cloud',
      cycle: 'Anual',
      mrrMzn: 45000,
      startDate: '2025-01-10',
      nextRenewal: '2026-01-10',
      status: 'ACTIVE',
      apiKey: 'pk_live_zambeze_901a8f'
    },
    {
      id: 'SUB-02',
      client: 'Restaurante & Lounge Costa do Sol',
      nuit: '400829104',
      plan: 'Professional',
      cycle: 'Mensal',
      mrrMzn: 18500,
      startDate: '2025-03-01',
      nextRenewal: '2026-10-01',
      status: 'ACTIVE',
      apiKey: 'pk_live_costasol_8471bd'
    },
    {
      id: 'SUB-03',
      client: 'Farmácia Central de Maputo',
      nuit: '400582918',
      plan: 'Enterprise Cloud',
      cycle: 'Mensal',
      mrrMzn: 32000,
      startDate: '2025-02-15',
      nextRenewal: '2026-10-15',
      status: 'ACTIVE',
      apiKey: 'pk_live_farmcentral_38102a'
    },
    {
      id: 'SUB-04',
      client: 'Express Moz Entregas Rápidas',
      nuit: '400381920',
      plan: 'Starter',
      cycle: 'Mensal',
      mrrMzn: 12000,
      startDate: '2025-05-20',
      nextRenewal: '2026-10-20',
      status: 'ACTIVE',
      apiKey: 'pk_live_expressmoz_9941cd'
    }
  ]);

  // Initial State: Helpdesk / SLA Tickets
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TCK-201',
      title: 'Lentidão na sincronização de comprovativos de pagamento via e-Mola',
      client: 'Supermercado Marracuene',
      priority: 'P1',
      slaHours: 2,
      timeRemaining: '42 min restantes',
      status: 'IN_PROGRESS',
      assignee: 'Arsénio Mambo',
      createdAt: 'Hoje às 13:10'
    },
    {
      id: 'TCK-202',
      title: 'Pedido de adição de novo utilizador com perfil Auditor Fiscal',
      client: 'Construções Zambeze',
      priority: 'P3',
      slaHours: 24,
      timeRemaining: '18h restantes',
      status: 'OPEN',
      assignee: 'Neide Manjate',
      createdAt: 'Hoje às 09:30'
    },
    {
      id: 'TCK-203',
      title: 'Atualização de certificado SSL no subdomínio de pagamentos',
      client: 'Restaurante Costa do Sol',
      priority: 'P2',
      slaHours: 8,
      timeRemaining: '4h 15m restantes',
      status: 'RESOLVED',
      assignee: 'Helena Sitoe',
      createdAt: 'Ontem às 16:40'
    }
  ]);

  // Initial State: Cloud Resources
  const [cloudResources] = useState<CloudResource[]>([
    {
      id: 'cld-1',
      provider: 'GCP',
      serviceName: 'Google Cloud Run (API Cluster)',
      region: 'europe-west2',
      monthlyCostUsd: 145,
      monthlyCostMzn: 9280,
      status: 'HEALTHY',
      utilization: 'CPU 28% | RAM 45%'
    },
    {
      id: 'cld-2',
      provider: 'GCP',
      serviceName: 'Cloud SQL PostgreSQL (Alta Disponibilidade)',
      region: 'europe-west2',
      monthlyCostUsd: 210,
      monthlyCostMzn: 13440,
      status: 'HEALTHY',
      utilization: 'Armazenamento 42% de 100GB'
    },
    {
      id: 'cld-3',
      provider: 'Cloudflare',
      serviceName: 'Cloudflare Pro DNS & WAF DDoS Shield',
      region: 'Global Edge',
      monthlyCostUsd: 25,
      monthlyCostMzn: 1600,
      status: 'HEALTHY',
      utilization: '1.4M requisições/mês'
    },
    {
      id: 'cld-4',
      provider: 'AWS',
      serviceName: 'Amazon S3 Backups & Document Archive',
      region: 'af-south-1 (Cape Town)',
      monthlyCostUsd: 38,
      monthlyCostMzn: 2432,
      status: 'HEALTHY',
      utilization: '240 GB armazenados'
    }
  ]);

  // Calculations
  const totalMrr = subscriptions.filter(s => s.status === 'ACTIVE').reduce((acc, curr) => acc + curr.mrrMzn, 0);
  const totalCloudCostMzn = cloudResources.reduce((acc, curr) => acc + curr.monthlyCostMzn, 0);
  const totalStoryPoints = tasks.reduce((acc, curr) => acc + curr.points, 0);
  const doneStoryPoints = tasks.filter(t => t.status === 'DONE').reduce((acc, curr) => acc + curr.points, 0);

  // Action to move task in Kanban
  const moveTask = (taskId: string, newStatus: SprintTask['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-cyan-800/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cyan-500/20 border border-cyan-400/30 rounded-xl text-cyan-400">
              <Laptop className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Sector de Tecnologia & Software
                </span>
                <span className="text-xs text-slate-400">Sprint 18 Ativo (Semana 37)</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold mt-1 text-white">
                {activeCompany?.tradeName || activeCompany?.name || 'Centro de Engenharia de Software & SaaS'}
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-2xl">
                Plataforma integrada de gestão técnica: desenvolvimento ágil (Scrum/Kanban), faturação de assinaturas recorrentes (MRR), chamados técnicos SLA e monitorização de servidores cloud.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => {
                const title = prompt('Título da nova tarefa técnica / user story:');
                if (title) {
                  const newTask: SprintTask = {
                    id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
                    title,
                    project: 'Core Platform',
                    points: 5,
                    priority: 'HIGH',
                    assignee: 'Equipa de Engenharia',
                    status: 'TODO',
                    tags: ['Backend', 'Feature']
                  };
                  setTasks(prev => [newTask, ...prev]);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova Tarefa / Story
            </button>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-cyan-800/30">
          <div className="bg-slate-800/60 backdrop-blur rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>MRR Recorrente</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {totalMrr.toLocaleString('pt-MZ')} MT
            </div>
            <div className="text-xs text-emerald-400 mt-0.5">
              {subscriptions.length} clientes activos (+12% vs mês ant.)
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Velocidade da Sprint</span>
              <Code className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {doneStoryPoints} / {totalStoryPoints} pts
            </div>
            <div className="text-xs text-cyan-300 mt-0.5">
              {Math.round((doneStoryPoints / (totalStoryPoints || 1)) * 100)}% concluído
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Tickets de Suporte SLA</span>
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {tickets.filter(t => t.status !== 'RESOLVED').length} pendentes
            </div>
            <div className="text-xs text-amber-300 mt-0.5">
              SLA Médio Cumprido: 98.4%
            </div>
          </div>

          <div className="bg-slate-800/60 backdrop-blur rounded-xl p-3 border border-slate-700/50">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Custos Cloud / Mês</span>
              <Server className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-xl font-bold text-white mt-1">
              {totalCloudCostMzn.toLocaleString('pt-MZ')} MT
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              4 clusters activos (GCP, AWS, CF)
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-700 overflow-x-auto pb-1">
        <button
          onClick={() => setSearchParams({ tab: 'sprints' })}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            currentTab === 'sprints'
              ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Code className="w-4 h-4" />
          Sprints Ágeis & Kanban
          <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300">
            {tasks.length}
          </span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'saas' })}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            currentTab === 'saas'
              ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Subscrições SaaS & MRR
          <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
            {subscriptions.length}
          </span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'support' })}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            currentTab === 'support'
              ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Helpdesk & Tickets SLA
          <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
            {tickets.length}
          </span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'cloud' })}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            currentTab === 'cloud'
              ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Server className="w-4 h-4" />
          Custos Cloud & Servidores
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'team' })}
          className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            currentTab === 'team'
              ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20'
              : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Devs & Repositórios
        </button>
      </div>

      {/* TAB 1: SPRINTS & KANBAN */}
      {currentTab === 'sprints' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Sprint Atual:</span>
              <span className="px-2.5 py-1 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-300 font-bold text-xs rounded-lg">
                SPRINT-18 (01 Set - 15 Set 2026)
              </span>
              <span className="text-xs text-gray-500">Objetivo: Lançamento de Módulos Verticais ERP</span>
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              CI/CD Pipeline: GitHub Actions Verificado
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
            {(['BACKLOG', 'TODO', 'IN_PROGRESS', 'CODE_REVIEW', 'DONE'] as const).map(columnStatus => {
              const columnTitles: Record<typeof columnStatus, string> = {
                BACKLOG: 'Backlog do Produto',
                TODO: 'A Fazer (Sprint)',
                IN_PROGRESS: 'Em Desenvolvimento',
                CODE_REVIEW: 'Code Review & QA',
                DONE: 'Concluído (Deploy)'
              };

              const columnColors: Record<typeof columnStatus, string> = {
                BACKLOG: 'border-gray-200 dark:border-slate-700 bg-gray-50/70 dark:bg-slate-900/40',
                TODO: 'border-blue-200 dark:border-blue-900/40 bg-blue-50/40 dark:bg-blue-950/20',
                IN_PROGRESS: 'border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20',
                CODE_REVIEW: 'border-purple-200 dark:border-purple-900/40 bg-purple-50/40 dark:bg-purple-950/20',
                DONE: 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20'
              };

              const columnTasks = tasks.filter(t => t.status === columnStatus);

              return (
                <div key={columnStatus} className={`rounded-xl p-3 border ${columnColors[columnStatus]} min-w-[240px] flex flex-col`}>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="font-bold text-xs uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      {columnTitles[columnStatus]}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 shadow-xs">
                      {columnTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1">
                    {columnTasks.map(task => (
                      <div 
                        key={task.id} 
                        className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow transition-shadow"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            {task.id}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            task.priority === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                            task.priority === 'HIGH' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                            'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300'
                          }`}>
                            {task.priority}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 leading-snug">
                          {task.title}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-slate-700/60 text-[11px] text-gray-500">
                          <span className="truncate max-w-[120px]">{task.assignee}</span>
                          <span className="font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                            {task.points} pts
                          </span>
                        </div>

                        {/* Move controls */}
                        <div className="flex items-center justify-end gap-1 mt-2.5 pt-1.5 border-t border-gray-100 dark:border-slate-700/40">
                          {columnStatus !== 'BACKLOG' && (
                            <button 
                              onClick={() => {
                                const flow: SprintTask['status'][] = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'CODE_REVIEW', 'DONE'];
                                const currIdx = flow.indexOf(columnStatus);
                                if (currIdx > 0) moveTask(task.id, flow[currIdx - 1]);
                              }}
                              className="text-[10px] px-2 py-0.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                            >
                              ← Recuar
                            </button>
                          )}
                          {columnStatus !== 'DONE' && (
                            <button 
                              onClick={() => {
                                const flow: SprintTask['status'][] = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'CODE_REVIEW', 'DONE'];
                                const currIdx = flow.indexOf(columnStatus);
                                if (currIdx < flow.length - 1) moveTask(task.id, flow[currIdx + 1]);
                              }}
                              className="text-[10px] px-2 py-0.5 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 font-bold hover:bg-cyan-100 rounded"
                            >
                              Avançar →
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {columnTasks.length === 0 && (
                      <div className="text-center py-6 text-xs text-gray-400">
                        Nenhuma tarefa nesta coluna
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SAAS SUBSCRIPTIONS & MRR */}
      {currentTab === 'saas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-gray-500">MRR Total (Mensal)</span>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {totalMrr.toLocaleString('pt-MZ')} MT
              </div>
              <span className="text-xs text-emerald-600 font-semibold">+15% este trimestre</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-gray-500">ARR Anualizado (MRR x 12)</span>
              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">
                {(totalMrr * 12).toLocaleString('pt-MZ')} MT
              </div>
              <span className="text-xs text-gray-500">Contratos vigentes</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-gray-500">Churn Rate (Cancelamentos)</span>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                1.4%
              </div>
              <span className="text-xs text-gray-500">Excelente retenção (meta &lt; 3%)</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
              <span className="text-xs text-gray-500">Ticket Médio por Cliente</span>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {Math.round(totalMrr / (subscriptions.length || 1)).toLocaleString('pt-MZ')} MT
              </div>
              <span className="text-xs text-gray-500">{subscriptions.length} clientes ativos</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  Contratos de Software & Assinaturas SaaS
                </h3>
                <p className="text-xs text-gray-500">
                  Gestão de planos recorrentes, chaves de API emitidas e datas de renovação contratual.
                </p>
              </div>
              <button 
                onClick={() => {
                  const client = prompt('Nome do novo cliente de software:');
                  if (client) {
                    const newSub: SaasSubscription = {
                      id: `SUB-0${subscriptions.length + 1}`,
                      client,
                      nuit: '400' + Math.floor(100000 + Math.random() * 900000),
                      plan: 'Professional',
                      cycle: 'Mensal',
                      mrrMzn: 25000,
                      startDate: new Date().toISOString().split('T')[0],
                      nextRenewal: '2026-10-15',
                      status: 'ACTIVE',
                      apiKey: `pk_live_${Math.random().toString(36).substring(2, 10)}`
                    };
                    setSubscriptions(prev => [...prev, newSub]);
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Nova Assinatura de Software
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-slate-900/60 text-gray-500 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Cliente / Entidade</th>
                    <th className="p-3">NUIT</th>
                    <th className="p-3">Plano</th>
                    <th className="p-3">Ciclo</th>
                    <th className="p-3">Valor Recorrente</th>
                    <th className="p-3">Próxima Renovação</th>
                    <th className="p-3">Chave API</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700 text-gray-700 dark:text-gray-300">
                  {subscriptions.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 font-semibold text-gray-900 dark:text-white">
                        {sub.client}
                      </td>
                      <td className="p-3 font-mono">{sub.nuit}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300 font-medium">
                          {sub.plan}
                        </span>
                      </td>
                      <td className="p-3">{sub.cycle}</td>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">
                        {sub.mrrMzn.toLocaleString('pt-MZ')} MT/mês
                      </td>
                      <td className="p-3 text-gray-600 dark:text-gray-400">{sub.nextRenewal}</td>
                      <td className="p-3 font-mono text-[11px] text-gray-500">{sub.apiKey}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <Check className="w-3.5 h-3.5" /> Activo
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button 
                          onClick={() => alert(`Faturação para ${sub.client} gerada com sucesso e integrada com módulo Fiscal (IVA 16%).`)}
                          className="px-2 py-1 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200 rounded text-xs"
                        >
                          Faturar
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

      {/* TAB 3: HELPDESK & SLA TICKETS */}
      {currentTab === 'support' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Fila de Chamados & Incidentes SLA
              </h3>
              <p className="text-xs text-gray-500">
                Monitorização rigorosa de tempos de atendimento e resolução com priorização P1 (Crítico) a P4 (Baixo).
              </p>
            </div>
            <button 
              onClick={() => {
                const title = prompt('Resumo do chamado técnico:');
                const client = prompt('Nome do cliente:');
                if (title && client) {
                  const newTicket: SupportTicket = {
                    id: `TCK-${Math.floor(200 + Math.random() * 800)}`,
                    title,
                    client,
                    priority: 'P2',
                    slaHours: 8,
                    timeRemaining: '8h restantes',
                    status: 'OPEN',
                    assignee: 'Suporte L1',
                    createdAt: 'Agora'
                  };
                  setTickets(prev => [newTicket, ...prev]);
                }
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Abrir Ticket Técnico
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tickets.map(ticket => (
              <div 
                key={ticket.id} 
                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:border-cyan-500 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {ticket.id}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    ticket.priority === 'P1' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                    ticket.priority === 'P2' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                  }`}>
                    {ticket.priority} - SLA {ticket.slaHours}h
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                  {ticket.title}
                </h4>

                <div className="text-xs text-gray-500 mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Cliente:</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{ticket.client}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Responsável:</span>
                    <span>{ticket.assignee}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tempo Restante:</span>
                    <span className="font-mono font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {ticket.timeRemaining}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-slate-700/60">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    ticket.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' :
                    ticket.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' :
                    'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300'
                  }`}>
                    {ticket.status === 'RESOLVED' ? 'Resolvido' : ticket.status === 'IN_PROGRESS' ? 'Em Análise' : 'Aberto'}
                  </span>

                  {ticket.status !== 'RESOLVED' && (
                    <button 
                      onClick={() => {
                        setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: 'RESOLVED', timeRemaining: 'Concluído' } : t));
                      }}
                      className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                    >
                      Marcar Resolvido ✓
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CLOUD COSTS & SERVERS */}
      {currentTab === 'cloud' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-600" />
                  Infraestrutura Cloud & Servidores Gerenciados
                </h3>
                <p className="text-xs text-gray-500">
                  Acompanhamento de consumo mensal de servidores, bancos de dados e proteção DDoS.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500">Custo Total Previsto:</span>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {totalCloudCostMzn.toLocaleString('pt-MZ')} MT / mês
                </div>
                <span className="text-[11px] text-gray-400">Câmbio de referência: 1 USD = 64,00 MT</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-slate-900/60 text-gray-500 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3">Provedor</th>
                    <th className="p-3">Serviço / Cluster</th>
                    <th className="p-3">Região / Datacenter</th>
                    <th className="p-3">Utilização / Métricas</th>
                    <th className="p-3">Custo Mensal (USD)</th>
                    <th className="p-3">Custo Mensal (MZN)</th>
                    <th className="p-3">Status de Saúde</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700 text-gray-700 dark:text-gray-300">
                  {cloudResources.map(res => (
                    <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                      <td className="p-3 font-bold text-cyan-600 dark:text-cyan-400">
                        {res.provider}
                      </td>
                      <td className="p-3 font-semibold text-gray-900 dark:text-white">
                        {res.serviceName}
                      </td>
                      <td className="p-3 font-mono text-gray-500">{res.region}</td>
                      <td className="p-3">{res.utilization}</td>
                      <td className="p-3 font-mono">${res.monthlyCostUsd}</td>
                      <td className="p-3 font-bold text-gray-900 dark:text-white">
                        {res.monthlyCostMzn.toLocaleString('pt-MZ')} MT
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          100% Operacional
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DEVS & REPOSITORIES */}
      {currentTab === 'team' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-600" />
                Alocação da Equipa de Engenharia
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Arsénio Mambo', role: 'Staff Software Engineer', tech: 'TypeScript, Node, Go, Postgres', hours: '38h / 40h', status: 'Ativo' },
                  { name: 'Helena Sitoe', role: 'Security & Cloud DevOps', tech: 'Docker, GCP, Kubernetes, CI/CD', hours: '40h / 40h', status: 'Ativo' },
                  { name: 'Neide Manjate', role: 'Frontend & UI/UX Specialist', tech: 'React 18, Tailwind, Next.js', hours: '36h / 40h', status: 'Ativo' },
                  { name: 'Edgar Cossa', role: 'Database & Data Architect', tech: 'PostgreSQL, Redis, Elasticsearch', hours: '32h / 40h', status: 'Ativo' }
                ].map(dev => (
                  <div key={dev.name} className="p-3 rounded-lg border border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-gray-900 dark:text-white">{dev.name}</div>
                      <div className="text-xs text-cyan-600 dark:text-cyan-400">{dev.role}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{dev.tech}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{dev.hours}</span>
                      <div className="text-[10px] text-emerald-600 font-semibold">{dev.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-cyan-600" />
                Repositórios Git & Deploys
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'idigtec/erp-core-mz', branch: 'main', commit: 'e273c88: Feat modular multi-tenant architecture', status: 'Deploy Sucedido', time: 'Há 12 min' },
                  { name: 'idigtec/fintech-gateway', branch: 'release/v2.4', commit: 'a90184c: M-Pesa C2B payment webhook handler', status: 'Em Produção', time: 'Há 2 horas' },
                  { name: 'idigtec/kds-kitchen-socket', branch: 'main', commit: 'b491823: WebSocket real-time order broadcast', status: 'Deploy Sucedido', time: 'Ontem' },
                  { name: 'idigtec/fefo-pharma-cron', branch: 'main', commit: 'c391842: Daily expiry notification scheduler', status: 'Deploy Sucedido', time: 'Ontem' }
                ].map(repo => (
                  <div key={repo.name} className="p-3 rounded-lg border border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/40">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">{repo.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300">
                        {repo.branch}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">{repo.commit}</div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mt-2 pt-1.5 border-t border-gray-200 dark:border-slate-700/60">
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {repo.status}
                      </span>
                      <span>{repo.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
