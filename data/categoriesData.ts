import { FinanceCategory, SharedGroup, SharedExpense, Currency } from '../types';

export const DEFAULT_CATEGORIES: FinanceCategory[] = [
  // Receitas (Income)
  {
    id: 'cat_inc_1',
    name: 'Vendas de Mercadorias & Produtos',
    type: 'INCOME',
    iconName: 'ShoppingBag',
    color: '#10b981', // emerald
    description: 'Facturação directa de produtos, balcão e retalho',
    isSystem: true
  },
  {
    id: 'cat_inc_2',
    name: 'Prestação de Serviços & Consultoria',
    type: 'INCOME',
    iconName: 'Briefcase',
    color: '#06b6d4', // cyan
    description: 'Honorários de serviços técnicos, auditoria e engenharia',
    isSystem: true
  },
  {
    id: 'cat_inc_3',
    name: 'Receitas POS & Restauração',
    type: 'INCOME',
    iconName: 'UtensilsCrossed',
    color: '#f59e0b', // amber
    description: 'Consumo no local, delivery e takeaway',
    isSystem: true
  },
  {
    id: 'cat_inc_4',
    name: 'Contratos de Manutenção & SLA',
    type: 'INCOME',
    iconName: 'Laptop',
    color: '#6366f1', // indigo
    description: 'Receitas recorrentes mensais (MRR)',
    isSystem: true
  },
  {
    id: 'cat_inc_5',
    name: 'Rendimentos Financeiros & Juros',
    type: 'INCOME',
    iconName: 'TrendingUp',
    color: '#8b5cf6', // purple
    description: 'Juros de depósitos a prazo e rendimentos cambiais',
    isSystem: true
  },
  {
    id: 'cat_inc_6',
    name: 'Outras Receitas Operacionais',
    type: 'INCOME',
    iconName: 'PlusCircle',
    color: '#14b8a6', // teal
    description: 'Subsídios, donativos e receitas avulsas',
    isSystem: true
  },

  // Despesas (Expense)
  {
    id: 'cat_exp_1',
    name: 'Salários & Encargos Sociais',
    type: 'EXPENSE',
    iconName: 'Users',
    color: '#ef4444', // red
    description: 'Remunerações líquidas, INSS e subsídios',
    budgetMonthly: 350000,
    isSystem: true
  },
  {
    id: 'cat_exp_2',
    name: 'Fornecedores & Matérias-Primas',
    type: 'EXPENSE',
    iconName: 'Package',
    color: '#f97316', // orange
    description: 'Aquisição de insumos, stock e mercadorias para revenda',
    budgetMonthly: 500000,
    isSystem: true
  },
  {
    id: 'cat_exp_3',
    name: 'Rendas & Instalações',
    type: 'EXPENSE',
    iconName: 'Home',
    color: '#ec4899', // pink
    description: 'Aluguer de escritórios, armazéns e lojas',
    budgetMonthly: 120000,
    isSystem: true
  },
  {
    id: 'cat_exp_4',
    name: 'Água, Electricidade & Telecomunicações',
    type: 'EXPENSE',
    iconName: 'Zap',
    color: '#eab308', // yellow
    description: 'EDM, Fipag, internet fibra e recargas M-Pesa de voz',
    budgetMonthly: 45000,
    isSystem: true
  },
  {
    id: 'cat_exp_5',
    name: 'Combustível & Frotas',
    type: 'EXPENSE',
    iconName: 'Truck',
    color: '#84cc16', // lime
    description: 'Gasóleo, gasolina, portagens e manutenção viaturas',
    budgetMonthly: 80000,
    isSystem: true
  },
  {
    id: 'cat_exp_6',
    name: 'Impostos & Obrigações Fiscais',
    type: 'EXPENSE',
    iconName: 'Calculator',
    color: '#dc2626', // deep red
    description: 'Guias de IVA Modelo A, IRPC, IRPS e taxas municipais',
    budgetMonthly: 180000,
    isSystem: true
  },
  {
    id: 'cat_exp_7',
    name: 'Marketing, Design & Publicidade',
    type: 'EXPENSE',
    iconName: 'Megaphone',
    color: '#3b82f6', // blue
    description: 'Anúncios digitais, brindes e impressão gráfica',
    budgetMonthly: 35000,
    isSystem: true
  },
  {
    id: 'cat_exp_8',
    name: 'Encargos Bancários & Comissões POS',
    type: 'EXPENSE',
    iconName: 'CreditCard',
    color: '#6b7280', // gray
    description: 'Comissões de cartões SIMO, M-Pesa e manutenção de contas',
    budgetMonthly: 20000,
    isSystem: true
  }
];

export const DEFAULT_SHARED_GROUPS: SharedGroup[] = [
  {
    id: 'group_maputo_hub',
    name: 'Consórcio Hub Central Maputo',
    description: 'Despesas conjuntas de infraestrutura, segurança 24h e gerador',
    currency: Currency.MZN,
    createdAt: '2026-02-15T09:00:00Z',
    color: '#10b981',
    members: [
      { id: 'mem_1', name: 'idigtec Soluções Lda', role: 'OWNER', shareRatio: 40 },
      { id: 'mem_2', name: 'Express Moz Logística', role: 'ADMIN', shareRatio: 30 },
      { id: 'mem_3', name: 'Farmácia Central Maputo', role: 'MEMBER', shareRatio: 30 }
    ]
  },
  {
    id: 'group_marketing_campaign',
    name: 'Campanha Conjunta Black Friday MZ',
    description: 'Rateio de custos com publicidade rádio, outdoors e redes sociais',
    currency: Currency.MZN,
    createdAt: '2026-06-01T10:00:00Z',
    color: '#6366f1',
    members: [
      { id: 'mem_1', name: 'idigtec Soluções Lda', role: 'OWNER', shareRatio: 50 },
      { id: 'mem_4', name: 'Supermercado Marracuene', role: 'MEMBER', shareRatio: 50 }
    ]
  }
];

export const DEFAULT_SHARED_EXPENSES: SharedExpense[] = [
  {
    id: 'shared_exp_1',
    groupId: 'group_maputo_hub',
    companyId: 'default',
    title: 'Abastecimento Gerador de Emergência 500L',
    amount: 47500,
    currency: Currency.MZN,
    paidByMemberId: 'mem_1',
    paidByMemberName: 'idigtec Soluções Lda',
    date: '2026-09-28',
    category: 'Combustível & Frotas',
    splitType: 'PERCENTAGE',
    splits: [
      { memberId: 'mem_1', memberName: 'idigtec Soluções Lda', amount: 19000, isSettled: true },
      { memberId: 'mem_2', memberName: 'Express Moz Logística', amount: 14250, isSettled: false },
      { memberId: 'mem_3', memberName: 'Farmácia Central Maputo', amount: 14250, isSettled: true }
    ],
    status: 'PENDING',
    notes: 'Fornecido pela TotalEnergies Sommerschield'
  },
  {
    id: 'shared_exp_2',
    groupId: 'group_maputo_hub',
    companyId: 'default',
    title: 'Segurança Armada Privada & Alarme CTT',
    amount: 32000,
    currency: Currency.MZN,
    paidByMemberId: 'mem_2',
    paidByMemberName: 'Express Moz Logística',
    date: '2026-10-01',
    category: 'Rendas & Instalações',
    splitType: 'PERCENTAGE',
    splits: [
      { memberId: 'mem_1', memberName: 'idigtec Soluções Lda', amount: 12800, isSettled: false },
      { memberId: 'mem_2', memberName: 'Express Moz Logística', amount: 9600, isSettled: true },
      { memberId: 'mem_3', memberName: 'Farmácia Central Maputo', amount: 9600, isSettled: false }
    ],
    status: 'PENDING',
    notes: 'Mensalidade de Outubro'
  }
];
