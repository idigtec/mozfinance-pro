
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Account, Transaction, Institution, Budget, TransactionType, Currency,
  AccountType, Debt, Task, DebtType, TaskPriority, Note, AuditLog,
  CompanyProfile, Customer, Quote, QuoteStatus, QuotePayment,
  FinancialExpense, ExpenseStatus, ExpenseCategory, Material,
  Product, ProductionHistory, Invoice, Employee, Payroll, Sale, CalendarEvent,
  Lead, Project, FixedAsset, Supplier, PurchaseOrder, LeadStatus,
  FiscalObligation, FinanceCategory, SharedGroup, SharedExpense
} from '../types';
import { PREDEFINED_INSTITUTIONS, EXCHANGE_RATES } from '../constants';
import { SECTOR_DEFINITIONS, SectorType } from '../constants/sectorModules';
import { 
  DEFAULT_FISCAL_OBLIGATIONS, 
  SAMPLE_COMPANY_TRANSACTIONS, 
  ADDITIONAL_ACCOUNTS, 
  SAMPLE_MATERIALS 
} from '../data/fiscalData';
import { 
  DEFAULT_CATEGORIES, 
  DEFAULT_SHARED_GROUPS, 
  DEFAULT_SHARED_EXPENSES 
} from '../data/categoriesData';

interface FinanceContextType {
  institutions: Institution[];
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  debts: Debt[];
  tasks: Task[];
  notes: Note[];
  events: CalendarEvent[];
  auditLogs: AuditLog[];
  companies: CompanyProfile[];
  customers: Customer[];
  quotes: Quote[];
  expenses: FinancialExpense[];
  materials: Material[];
  products: Product[];
  productionHistory: ProductionHistory[];
  invoices: Invoice[];
  employees: Employee[];
  payrolls: Payroll[];
  sales: Sale[];
  leads: Lead[];
  projects: Project[];
  fixedAssets: FixedAsset[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  fiscalObligations: FiscalObligation[];
  allFiscalObligations: FiscalObligation[];
  
  categories: FinanceCategory[];
  allCategories: FinanceCategory[];
  addCategory: (category: Omit<FinanceCategory, 'id'>) => void;
  updateCategory: (category: FinanceCategory) => void;
  deleteCategory: (id: string) => void;

  sharedGroups: SharedGroup[];
  addSharedGroup: (group: Omit<SharedGroup, 'id' | 'createdAt'>) => void;
  updateSharedGroup: (group: SharedGroup) => void;
  deleteSharedGroup: (id: string) => void;

  sharedExpenses: SharedExpense[];
  addSharedExpense: (exp: Omit<SharedExpense, 'id'>) => void;
  updateSharedExpense: (exp: SharedExpense) => void;
  deleteSharedExpense: (id: string) => void;
  settleSplitItem: (expenseId: string, memberId: string) => void;

  activeCompanyId: string | 'all';
  setActiveCompanyId: (id: string | 'all') => void;

  addFiscalObligation: (obligation: Omit<FiscalObligation, 'id'>) => void;
  updateFiscalObligation: (obligation: FiscalObligation) => void;
  deleteFiscalObligation: (id: string) => void;
  uploadSubmissionProof: (id: string, proofUrl: string, fileName: string, fileSize?: string, referenceNumber?: string) => void;
  markObligationPaid: (id: string, paidDate?: string, receiptNumber?: string, finalAmount?: number) => void;

  addAccount: (account: Omit<Account, 'id'>) => void;
  removeAccount: (id: string) => void;
  updateInstitution: (institution: Institution) => void;
  addInstitution: (institution: Institution) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (transaction: Transaction) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  payDebt: (id: string, accountId: string) => void; 
  removeDebt: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (task: Task) => void;
  toggleTaskStatus: (id: string) => void;
  removeTask: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  addCompany: (company: Omit<CompanyProfile, 'id'>) => void;
  updateCompany: (company: CompanyProfile) => void;
  deleteCompany: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addQuote: (quote: Omit<Quote, 'id'>) => void;
  updateQuote: (quote: Quote) => void;
  deleteQuote: (id: string) => void;
  duplicateQuote: (id: string) => void;
  addQuotePayment: (quoteId: string, payment: Omit<QuotePayment, 'id'>, accountId: string) => void;
  addExpense: (expense: Omit<FinancialExpense, 'id'>) => void;
  updateExpense: (expense: FinancialExpense) => void;
  deleteExpense: (id: string) => void;
  payExpense: (id: string, accountId: string) => { success: boolean; message: string };
  
  addMaterial: (m: Omit<Material, 'id' | 'createdAt'>) => void;
  updateMaterial: (m: Material) => void;
  deleteMaterial: (id: string) => void;
  addProduct: (p: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  recordProduction: (productId: string, quantity: number, options?: { accountId?: string, notes?: string }) => { success: boolean; message: string };
  getProductionProjection: (productId: string) => { maxUnits: number; bottleneck: string | null };
  getStockValuation: (companyId: string) => number;

  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (emp: Employee) => void;
  processPayroll: (payroll: Omit<Payroll, 'id' | 'status'>, accountId: string) => void;

  addSale: (sale: Omit<Sale, 'id'>, accountId: string) => { success: boolean; message: string };

  // New ERP Methods
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addFixedAsset: (asset: Omit<FixedAsset, 'id'>) => void;
  updateFixedAsset: (asset: FixedAsset) => void;
  deleteFixedAsset: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: string) => void;
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;
  updatePurchaseOrder: (po: PurchaseOrder) => void;
  deletePurchaseOrder: (id: string) => void;

  allAccounts: Account[];
  allCompanies: CompanyProfile[];
  allTransactions: Transaction[];
  allExpenses: FinancialExpense[];
  allInvoices: Invoice[];
  allEmployees: Employee[];
  allMaterials: Material[];
  allProducts: Product[];
  getCompanyMetrics: (companyId: string) => {
    totalBalance: number;
    accountsCount: number;
    employeesCount: number;
    projectsCount: number;
    unpaidDebts: number;
    pendingExpenses: number;
    income: number;
    expense: number;
  };
  netProfit: number;
  realizedInterest: number;
  totalExpensesPaid: number;
  getInstitutionName: (id: string) => string;
  getAccountName: (id: string) => string;
  totalBalanceMZN: number;

  getFinancialSnapshot: () => any;
  calculateRunway: () => { months: number; status: 'CRITICAL' | 'WARNING' | 'HEALTHY' };
  logActivity: (action: string, details: string, relatedId?: string, relatedType?: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

const safeParse = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) { return fallback; }
};

export const DEFAULT_COMPANIES: CompanyProfile[] = [
  { 
    id: 'default', 
    name: 'idigtec Soluções Lda', 
    tradeName: 'idigtec Cloud & Software',
    nuit: '400928172', 
    legalForm: 'Sociedade por Quotas (Lda)',
    registrationNumber: '10049281/2021',
    gazetteNotice: 'BR III Série n.º 84/2021',
    caeCode: '62010 - Consultoria e Programação Informática',
    taxRegime: 'Regime Geral (IVA 16% + IRPC 32%)',
    inssNumber: 'INSS-MP-102938',
    accountingPlan: 'PGC-NIRF',
    sector: 'Tecnologia & Serviços Digitais',
    businessType: 'TECH',
    sectors: ['Tecnologia', 'Software', 'Cloud'],
    address: 'Av. 24 de Julho, n.º 1200, Sommerschield', 
    city: 'Maputo', 
    province: 'Maputo Cidade',
    district: 'KaMpfumo',
    phone: '+258 84 123 4567', 
    email: 'contacto@idigtec.co.mz', 
    isDefault: true, 
    bankDetails: 'Millennium BIM: 000100000000000000000 | M-Pesa: 841234567', 
    logoUrl: '',
    status: 'ACTIVE',
    enabledModules: SECTOR_DEFINITIONS.TECH.defaultModules
  },
  {
    id: 'comp_zambeze',
    name: 'Construções Zambeze, S.A.',
    tradeName: 'Zambeze Engenharia & Obras',
    nuit: '401823901',
    legalForm: 'Sociedade Anónima (S.A.)',
    registrationNumber: '20084719/2018',
    gazetteNotice: 'BR III Série n.º 112/2018',
    caeCode: '41200 - Construção de Edifícios e Vias de Comunicação',
    taxRegime: 'Regime Geral (Alvará 4ª Classe Obras Civis)',
    inssNumber: 'INSS-SF-204918',
    accountingPlan: 'PGC-PE',
    sector: 'Construção Civil & Obras Públicas',
    businessType: 'CONSTRUCTION',
    sectors: ['Construção', 'Engenharia', 'Obras Públicas'],
    address: 'Bairro Ponta-Gêa, Rua das Acácias, n.º 45',
    city: 'Beira',
    province: 'Sofala',
    district: 'Beira',
    phone: '+258 82 987 6543',
    email: 'direccao@zambeze-obras.co.mz',
    isDefault: false,
    bankDetails: 'Standard Bank: 000200000000000000000 | BCI: 000800000000000000000',
    logoUrl: '',
    status: 'ACTIVE',
    enabledModules: SECTOR_DEFINITIONS.CONSTRUCTION.defaultModules
  },
  {
    id: 'comp_costasol',
    name: 'Restaurante & Lounge Costa do Sol, Lda',
    tradeName: 'Costa do Sol Seafood & Grill',
    nuit: '400829104',
    legalForm: 'Sociedade por Quotas (Lda)',
    registrationNumber: '10082910/2019',
    gazetteNotice: 'BR III Série n.º 42/2019',
    caeCode: '56101 - Restaurantes do Tipo Tradicional e Bares',
    taxRegime: 'Regime Geral (IVA 16% + IRPC)',
    inssNumber: 'INSS-MP-208192',
    accountingPlan: 'PGC-PE',
    sector: 'Restauração, Bares & Takeaway',
    businessType: 'RESTAURANT',
    sectors: ['Restaurante', 'Bar', 'Gastronomia'],
    address: 'Av. Marginal, n.º 4100, Costa do Sol',
    city: 'Maputo',
    province: 'Maputo Cidade',
    district: 'KaMavota',
    phone: '+258 84 888 7766',
    email: 'reservas@costadosol.co.mz',
    isDefault: false,
    bankDetails: 'Millennium BIM: 000100000000000000001 | M-Pesa: 848887766',
    logoUrl: '',
    status: 'ACTIVE',
    enabledModules: SECTOR_DEFINITIONS.RESTAURANT.defaultModules
  },
  {
    id: 'comp_farmacia',
    name: 'Farmácia Central de Maputo, Lda',
    tradeName: 'Farmácia Central Saúde & Bem-Estar',
    nuit: '400582918',
    legalForm: 'Sociedade por Quotas (Lda)',
    registrationNumber: '10058291/2020',
    gazetteNotice: 'BR III Série n.º 55/2020',
    caeCode: '47721 - Comércio a Retalho de Produtos Farmacêuticos',
    taxRegime: 'Regime Geral (Isenção IVA Medicamentos essenciais Art. 9)',
    inssNumber: 'INSS-MP-192837',
    accountingPlan: 'PGC-PE',
    sector: 'Farmácia, Medicamentos & Saúde',
    businessType: 'PHARMACY',
    sectors: ['Farmácia', 'Saúde', 'Medicamentos'],
    address: 'Av. 25 de Setembro, n.º 850, Baixa',
    city: 'Maputo',
    province: 'Maputo Cidade',
    district: 'KaMpfumo',
    phone: '+258 82 333 4455',
    email: 'farmacia@centralmaputo.co.mz',
    isDefault: false,
    bankDetails: 'BCI: 000800000000000000002 | e-Mola: 863334455',
    logoUrl: '',
    status: 'ACTIVE',
    enabledModules: SECTOR_DEFINITIONS.PHARMACY.defaultModules
  },
  {
    id: 'comp_express',
    name: 'Express Moz Entregas Rápidas, Lda',
    tradeName: 'Express Moz Delivery & Logística',
    nuit: '400381920',
    legalForm: 'Sociedade por Quotas (Lda)',
    registrationNumber: '10038192/2022',
    gazetteNotice: 'BR III Série n.º 71/2022',
    caeCode: '53200 - Atividades de Correio Rápido e Entregas Urbanas',
    taxRegime: 'Regime Geral (IVA 16%)',
    inssNumber: 'INSS-MP-381920',
    accountingPlan: 'PGC-PE',
    sector: 'Delivery, Logística & Frotas',
    businessType: 'DELIVERY',
    sectors: ['Delivery', 'Logística', 'Estafetas'],
    address: 'Av. Karl Marx, n.º 1420',
    city: 'Maputo',
    province: 'Maputo Cidade',
    district: 'KaMpfumo',
    phone: '+258 84 999 1122',
    email: 'operacoes@expressmoz.co.mz',
    isDefault: false,
    bankDetails: 'Millennium BIM: 000100000000000000003 | M-Pesa: 849991122',
    logoUrl: '',
    status: 'ACTIVE',
    enabledModules: SECTOR_DEFINITIONS.DELIVERY.defaultModules
  },
  {
    id: 'comp_marracuene',
    name: 'Supermercado Marracuene, E.I.',
    tradeName: 'Marracuene Super Fresh Retail',
    nuit: '400192834',
    legalForm: 'Empresário em Nome Individual (E.I.)',
    registrationNumber: '30018492/2023',
    gazetteNotice: 'Mera Comunicação Prévia n.º 450/2023',
    caeCode: '47111 - Comércio a Retalho em Supermercados e Mercearias',
    taxRegime: 'Regime Simplificado (ISPC)',
    inssNumber: 'INSS-MP-309182',
    accountingPlan: 'PGC-PE',
    sector: 'Retalho Alimentar & Bebidas',
    businessType: 'RETAIL',
    sectors: ['Retalho', 'Alimentar', 'Supermercado'],
    address: 'Estrada Nacional EN1, km 30, Vila de Marracuene',
    city: 'Marracuene',
    province: 'Maputo Província',
    district: 'Marracuene',
    phone: '+258 86 345 6789',
    email: 'comercial@spmarracuene.co.mz',
    isDefault: false,
    bankDetails: 'BCI: 000300000000000000000 | e-Mola: 863456789',
    logoUrl: '',
    status: 'ACTIVE',
    enabledModules: SECTOR_DEFINITIONS.RETAIL.defaultModules
  }
];

export const FinanceProvider = ({ children }: { children?: ReactNode }) => {
  const [activeCompanyId, setActiveCompanyId] = useState<string | 'all'>(() => safeParse('idigtec_active_company', 'all'));
  const [institutions, setInstitutions] = useState<Institution[]>(() => safeParse('idigtec_institutions', PREDEFINED_INSTITUTIONS));
  
  const [companies, setCompanies] = useState<CompanyProfile[]>(() => {
    const saved = safeParse('idigtec_companies', null);
    const baseList: CompanyProfile[] = (saved && Array.isArray(saved) && saved.length >= 1 && saved[0].nuit)
      ? saved
      : DEFAULT_COMPANIES;

    // Merge missing predefined sector templates so user can test all business models out of the box
    const existingIds = new Set(baseList.map(c => c.id));
    const mergedList = [...baseList];
    DEFAULT_COMPANIES.forEach(defComp => {
      if (!existingIds.has(defComp.id)) {
        mergedList.push(defComp);
      }
    });

    // Audit and activate all sector functionalities
    return mergedList.map(comp => {
      let bType = comp.businessType;
      if (!bType) {
        const s = ((comp.sector || '') + ' ' + (comp.name || '') + ' ' + (comp.tradeName || '')).toLowerCase();
        if (s.includes('restauran') || s.includes('costa do sol') || s.includes('bar') || s.includes('lounge') || s.includes('zambi')) bType = 'RESTAURANT';
        else if (s.includes('farmácia') || s.includes('medicament') || s.includes('saúde')) bType = 'PHARMACY';
        else if (s.includes('delivery') || s.includes('express') || s.includes('entrega')) bType = 'DELIVERY';
        else if (s.includes('constru') || s.includes('zambeze') || s.includes('obra')) bType = 'CONSTRUCTION';
        else if (s.includes('retalh') || s.includes('supermercado') || s.includes('marracuene')) bType = 'RETAIL';
        else if (s.includes('tecnolog') || s.includes('idigtec') || s.includes('software')) bType = 'TECH';
        else bType = 'OTHER';
      }
      const defaultMods = SECTOR_DEFINITIONS[bType as SectorType]?.defaultModules || SECTOR_DEFINITIONS.OTHER.defaultModules;
      const existingMods = comp.enabledModules && comp.enabledModules.length > 0 ? comp.enabledModules : [];
      const auditedModules = Array.from(new Set([...defaultMods, ...existingMods]));
      return {
        ...comp,
        businessType: bType,
        enabledModules: auditedModules
      };
    });
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = safeParse('idigtec_accounts', null);
    const baseList: Account[] = (saved && Array.isArray(saved) && saved.length >= 3)
      ? saved
      : [
          {
            id: 'acc_bim_default',
            name: 'Millennium BIM (Ordem)',
            institutionId: 'inst_bim',
            type: AccountType.CHECKING,
            currency: Currency.MZN,
            balance: 1450000,
            companyId: 'default'
          },
          {
            id: 'acc_mpesa_default',
            name: 'M-Pesa Empresarial C2B',
            institutionId: 'inst_mpesa',
            type: AccountType.CHECKING,
            currency: Currency.MZN,
            balance: 380000,
            companyId: 'default'
          },
          {
            id: 'acc_sb_zambeze',
            name: 'Standard Bank Obras Públicas',
            institutionId: 'inst_sb',
            type: AccountType.CHECKING,
            currency: Currency.MZN,
            balance: 5200000,
            companyId: 'comp_zambeze'
          },
          {
            id: 'acc_bci_zambeze',
            name: 'BCI Garantias & Cauções',
            institutionId: 'inst_bci',
            type: AccountType.SAVINGS,
            currency: Currency.MZN,
            balance: 2100000,
            companyId: 'comp_zambeze'
          },
          {
            id: 'acc_bci_marracuene',
            name: 'BCI Caixa Diário Loja',
            institutionId: 'inst_bci',
            type: AccountType.CHECKING,
            currency: Currency.MZN,
            balance: 620000,
            companyId: 'comp_marracuene'
          },
          {
            id: 'acc_emola_marracuene',
            name: 'e-Mola Pagamentos POS',
            institutionId: 'inst_emola',
            type: AccountType.CHECKING,
            currency: Currency.MZN,
            balance: 145000,
            companyId: 'comp_marracuene'
          }
        ];
    const existingIds = new Set(baseList.map(a => a.id));
    const merged = [...baseList];
    ADDITIONAL_ACCOUNTS.forEach(acc => {
      if (!existingIds.has(acc.id)) merged.push(acc);
    });
    return merged;
  });
  const [customers, setCustomers] = useState<Customer[]>(() => safeParse('idigtec_customers', []));
  const [materials, setMaterials] = useState<Material[]>(() => {
    const saved = safeParse('idigtec_materials', null);
    if (saved && Array.isArray(saved) && saved.length >= 2) return saved;
    return SAMPLE_MATERIALS;
  });
  const [products, setProducts] = useState<Product[]>(() => safeParse('idigtec_products', []));
  const [quotes, setQuotes] = useState<Quote[]>(() => safeParse('idigtec_quotes', []));
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = safeParse('idigtec_transactions', null);
    if (saved && Array.isArray(saved) && saved.length >= 3) return saved;
    return SAMPLE_COMPANY_TRANSACTIONS;
  });
  const [debts, setDebts] = useState<Debt[]>(() => safeParse('idigtec_debts', []));
  const [expenses, setExpenses] = useState<FinancialExpense[]>(() => safeParse('idigtec_financial_expenses', []));
  const [tasks, setTasks] = useState<Task[]>(() => safeParse('idigtec_tasks', []));
  const [notes, setNotes] = useState<Note[]>(() => safeParse('idigtec_notes', []));
  const [events, setEvents] = useState<CalendarEvent[]>(() => safeParse('idigtec_events', []));
  const [budgets, setBudgets] = useState<Budget[]>(() => safeParse('idigtec_budgets', []));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => safeParse('idigtec_audit', []));
  const [productionHistory, setProductionHistory] = useState<ProductionHistory[]>(() => safeParse('idigtec_prod_history', []));
  const [invoices, setInvoices] = useState<Invoice[]>(() => safeParse('idigtec_invoices', []));
  const [employees, setEmployees] = useState<Employee[]>(() => safeParse('idigtec_employees', []));
  const [payrolls, setPayrolls] = useState<Payroll[]>(() => safeParse('idigtec_payrolls', []));
  const [sales, setSales] = useState<Sale[]>(() => safeParse('idigtec_sales', []));
  const [leads, setLeads] = useState<Lead[]>(() => safeParse('idigtec_leads', []));
  const [projects, setProjects] = useState<Project[]>(() => safeParse('idigtec_projects', []));
  const [fixedAssets, setFixedAssets] = useState<FixedAsset[]>(() => safeParse('idigtec_fixed_assets', []));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => safeParse('idigtec_suppliers', []));
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => safeParse('idigtec_purchase_orders', []));
  const [fiscalObligations, setFiscalObligations] = useState<FiscalObligation[]>(() => {
    const saved = safeParse('idigtec_fiscal_obligations', null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    return DEFAULT_FISCAL_OBLIGATIONS;
  });

  const [categories, setCategories] = useState<FinanceCategory[]>(() => {
    const saved = safeParse('idigtec_categories', null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    return DEFAULT_CATEGORIES;
  });

  const [sharedGroups, setSharedGroups] = useState<SharedGroup[]>(() => {
    const saved = safeParse('idigtec_shared_groups', null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    return DEFAULT_SHARED_GROUPS;
  });

  const [sharedExpenses, setSharedExpenses] = useState<SharedExpense[]>(() => {
    const saved = safeParse('idigtec_shared_expenses', null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    return DEFAULT_SHARED_EXPENSES;
  });

  useEffect(() => { localStorage.setItem('idigtec_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('idigtec_shared_groups', JSON.stringify(sharedGroups)); }, [sharedGroups]);
  useEffect(() => { localStorage.setItem('idigtec_shared_expenses', JSON.stringify(sharedExpenses)); }, [sharedExpenses]);
  useEffect(() => { localStorage.setItem('idigtec_fiscal_obligations', JSON.stringify(fiscalObligations)); }, [fiscalObligations]);

  useEffect(() => { localStorage.setItem('idigtec_materials', JSON.stringify(materials)); }, [materials]);
  useEffect(() => { localStorage.setItem('idigtec_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('idigtec_prod_history', JSON.stringify(productionHistory)); }, [productionHistory]);
  useEffect(() => { localStorage.setItem('idigtec_accounts', JSON.stringify(accounts)); }, [accounts]);
  useEffect(() => { localStorage.setItem('idigtec_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('idigtec_financial_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('idigtec_debts', JSON.stringify(debts)); }, [debts]);
  useEffect(() => { localStorage.setItem('idigtec_budgets', JSON.stringify(budgets)); }, [budgets]);
  useEffect(() => { localStorage.setItem('idigtec_customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('idigtec_quotes', JSON.stringify(quotes)); }, [quotes]);
  useEffect(() => { localStorage.setItem('idigtec_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('idigtec_notes', JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem('idigtec_events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('idigtec_companies', JSON.stringify(companies)); }, [companies]);
  useEffect(() => { localStorage.setItem('idigtec_employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('idigtec_audit', JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem('idigtec_active_company', JSON.stringify(activeCompanyId)); }, [activeCompanyId]);
  useEffect(() => { localStorage.setItem('idigtec_leads', JSON.stringify(leads)); }, [leads]);
  useEffect(() => { localStorage.setItem('idigtec_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('idigtec_fixed_assets', JSON.stringify(fixedAssets)); }, [fixedAssets]);
  useEffect(() => { localStorage.setItem('idigtec_suppliers', JSON.stringify(suppliers)); }, [suppliers]);
  useEffect(() => { localStorage.setItem('idigtec_purchase_orders', JSON.stringify(purchaseOrders)); }, [purchaseOrders]);
  useEffect(() => { localStorage.setItem('idigtec_sales', JSON.stringify(sales)); }, [sales]);

  const logActivity = (action: string, details: string, relatedId?: string, relatedType?: string) => {
    const newLog: AuditLog = {
      id: generateId(),
      companyId: activeCompanyId === 'all' ? (companies[0]?.id || 'default') : activeCompanyId,
      userId: 'admin', // Default user for now
      action,
      details,
      timestamp: new Date().toISOString(),
      relatedId,
      relatedType
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const getCompanyId = (providedId?: string) => providedId || (activeCompanyId !== 'all' ? activeCompanyId : (companies[0]?.id || 'default'));

  const queueSyncChange = (entity: string, entityId: string, operation: 'CREATE' | 'UPDATE' | 'DELETE', payload: any, compId?: string) => {
    try {
      const rawQueue = localStorage.getItem('idigtec_sync_queue');
      const existingQueue = rawQueue ? JSON.parse(rawQueue) : [];
      const newItem = {
        id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        entity,
        entityId,
        operation,
        payload,
        timestamp: new Date().toISOString(),
        status: 'PENDING',
        retryCount: 0,
        companyId: compId || (activeCompanyId !== 'all' ? activeCompanyId : 'default')
      };
      localStorage.setItem('idigtec_sync_queue', JSON.stringify([newItem, ...existingQueue]));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  const addAccount = (newAccount: Omit<Account, 'id'>) => {
    const id = generateId();
    const finalAcc = { ...newAccount, id, companyId: getCompanyId(newAccount.companyId) };
    setAccounts([...accounts, finalAcc]);
    logActivity('CREATE_ACCOUNT', `Conta criada: ${newAccount.name}`, id, 'ACCOUNT');
    queueSyncChange('Conta', id, 'CREATE', finalAcc, finalAcc.companyId);
  };
  const removeAccount = (id: string) => setAccounts(accounts.filter(acc => acc.id !== id));
  const updateInstitution = (updated: Institution) => setInstitutions(institutions.map(i => i.id === updated.id ? updated : i));
  const addInstitution = (newInst: Institution) => setInstitutions([...institutions, newInst]);

  const addTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx = { ...newTx, id: generateId(), companyId: getCompanyId(newTx.companyId) };
    setTransactions(prev => [tx, ...prev]);
    setAccounts(prevAccounts => prevAccounts.map(acc => {
      let newBalance = acc.balance;
      if (acc.id === tx.accountId) {
        if (tx.type === TransactionType.EXPENSE || tx.type === TransactionType.TRANSFER) newBalance -= tx.amount;
        else if (tx.type === TransactionType.INCOME) newBalance += tx.amount;
      }
      if (tx.type === TransactionType.TRANSFER && tx.toAccountId && acc.id === tx.toAccountId) newBalance += tx.amount;
      return { ...acc, balance: newBalance };
    }));
    logActivity('CREATE_TRANSACTION', `Transação adicionada: ${tx.description} (${tx.amount} MT)`, tx.id, 'TRANSACTION');
    queueSyncChange('Transação', tx.id, 'CREATE', tx, tx.companyId);
  };

  const removeTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx) return;
    setTransactions(prev => prev.filter(t => t.id !== id));
    setAccounts(prevAccounts => prevAccounts.map(acc => {
      let newBalance = acc.balance;
      if (acc.id === tx.accountId) {
        if (tx.type === TransactionType.EXPENSE || tx.type === TransactionType.TRANSFER) newBalance += tx.amount;
        else if (tx.type === TransactionType.INCOME) newBalance -= tx.amount;
      }
      if (tx.type === TransactionType.TRANSFER && tx.toAccountId && acc.id === tx.toAccountId) newBalance -= tx.amount;
      return { ...acc, balance: newBalance };
    }));
    logActivity('DELETE_TRANSACTION', `Transação apagada: ${tx.description}`, tx.id, 'TRANSACTION');
  };

  const updateTransaction = (updatedTx: Transaction) => {
    removeTransaction(updatedTx.id);
    addTransaction(updatedTx);
  };

  const addBudget = (newBudget: Omit<Budget, 'id'>) => setBudgets([...budgets, { ...newBudget, id: generateId(), companyId: getCompanyId(newBudget.companyId) }]);

  const payDebt = (id: string, accountId: string) => {
      const debt = debts.find(d => d.id === id);
      if (!debt || debt.isPaid) return;
      setDebts(prev => prev.map(d => d.id === id ? { ...d, isPaid: true } : d));
      if (debt.type === DebtType.BORROWED) {
          addExpense({
              name: `Liquidado: ${debt.entity}`, amount: debt.amount, category: ExpenseCategory.DEBT_SERVICE, currency: debt.currency,
              dueDate: new Date().toISOString(), status: ExpenseStatus.PAID, paidDate: new Date().toISOString(), origin: 'DEBT', referenceId: debt.id
          });
      }
      addTransaction({ accountId, amount: debt.amount, category: 'Dívidas', currency: debt.currency, date: new Date().toISOString(), description: `Pgto: ${debt.entity}`, type: debt.type === DebtType.BORROWED ? TransactionType.EXPENSE : TransactionType.INCOME });
      logActivity('PAY_DEBT', `Dívida paga: ${debt.entity} (${debt.amount} ${debt.currency})`, debt.id, 'DEBT');
  };

  const removeDebt = (id: string) => {
      setDebts(debts.filter(d => d.id !== id));
      logActivity('DELETE_DEBT', `Dívida apagada`, id, 'DEBT');
  };
  const addDebt = (newDebt: Omit<Debt, 'id'>) => {
      const id = generateId();
      setDebts([...debts, { ...newDebt, id, companyId: getCompanyId(newDebt.companyId) }]);
      logActivity('CREATE_DEBT', `Dívida criada: ${newDebt.entity} (${newDebt.amount})`, id, 'DEBT');
  };
  const addTask = (newTask: Omit<Task, 'id'>) => {
      const id = generateId();
      setTasks([...tasks, { ...newTask, id, companyId: getCompanyId(newTask.companyId) }]);
      logActivity('CREATE_TASK', `Tarefa criada: ${newTask.title}`, id, 'TASK');
  };
  const updateTask = (updatedTask: Task) => {
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      logActivity('UPDATE_TASK', `Tarefa atualizada: ${updatedTask.title}`, updatedTask.id, 'TASK');
  };
  const toggleTaskStatus = (id: string) => {
      setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
      logActivity('TOGGLE_TASK', `Status da tarefa alterado`, id, 'TASK');
  };
  const removeTask = (id: string) => {
      setTasks(tasks.filter(t => t.id !== id));
      logActivity('DELETE_TASK', `Tarefa apagada`, id, 'TASK');
  };
  const addNote = (newNote: Omit<Note, 'id' | 'createdAt'>) => {
      const id = generateId();
      setNotes([{ ...newNote, id, companyId: getCompanyId(newNote.companyId), createdAt: new Date().toISOString() }, ...notes]);
      logActivity('CREATE_NOTE', `Nota criada: ${newNote.title}`, id, 'NOTE');
  };
  const updateNote = (updatedNote: Note) => {
      setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
      logActivity('UPDATE_NOTE', `Nota atualizada: ${updatedNote.title}`, updatedNote.id, 'NOTE');
  };
  const deleteNote = (id: string) => {
      setNotes(notes.filter(n => n.id !== id));
      logActivity('DELETE_NOTE', `Nota apagada`, id, 'NOTE');
  };
  
  const addEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
      const id = generateId();
      setEvents([{ ...newEvent, id, companyId: getCompanyId(newEvent.companyId) }, ...events]);
      logActivity('CREATE_EVENT', `Evento criado: ${newEvent.title}`, id, 'EVENT');
  };
  const updateEvent = (updatedEvent: CalendarEvent) => {
      setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
      logActivity('UPDATE_EVENT', `Evento atualizado: ${updatedEvent.title}`, updatedEvent.id, 'EVENT');
  };
  const deleteEvent = (id: string) => {
      setEvents(events.filter(e => e.id !== id));
      logActivity('DELETE_EVENT', `Evento apagado`, id, 'EVENT');
  };

  const addCompany = (company: Omit<CompanyProfile, 'id'>) => {
      const id = generateId();
      setCompanies([...companies, { ...company, id }]);
      logActivity('CREATE_COMPANY', `Empresa criada: ${company.name}`, id, 'COMPANY');
  };
  const updateCompany = (updatedCompany: CompanyProfile) => {
      setCompanies(companies.map(c => c.id === updatedCompany.id ? updatedCompany : c));
      logActivity('UPDATE_COMPANY', `Empresa atualizada: ${updatedCompany.name}`, updatedCompany.id, 'COMPANY');
  };
  const deleteCompany = (id: string) => {
      setCompanies(companies.filter(c => c.id !== id));
      logActivity('DELETE_COMPANY', `Empresa apagada`, id, 'COMPANY');
  };
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
      const id = generateId();
      setCustomers([...customers, { ...customer, id, companyId: getCompanyId(customer.companyId) }]);
      logActivity('CREATE_CUSTOMER', `Cliente criado: ${customer.name}`, id, 'CUSTOMER');
  };
  const updateCustomer = (customer: Customer) => {
      setCustomers(customers.map(c => c.id === customer.id ? customer : c));
      logActivity('UPDATE_CUSTOMER', `Cliente atualizado: ${customer.name}`, customer.id, 'CUSTOMER');
  };
  const deleteCustomer = (id: string) => {
      setCustomers(customers.filter(c => c.id !== id));
      logActivity('DELETE_CUSTOMER', `Cliente apagado`, id, 'CUSTOMER');
  };
  const addQuote = (quote: Omit<Quote, 'id'>) => {
      const id = generateId();
      setQuotes([{ ...quote, id, companyId: getCompanyId(quote.companyId), payments: [], amountPaid: 0 }, ...quotes]);
      logActivity('CREATE_QUOTE', `Cotação criada: ${quote.number}`, id, 'QUOTE');
  };
  const updateQuote = (quote: Quote) => {
      setQuotes(quotes.map(q => q.id === quote.id ? quote : q));
      logActivity('UPDATE_QUOTE', `Cotação atualizada: ${quote.number}`, quote.id, 'QUOTE');
  };
  const deleteQuote = (id: string) => {
      setQuotes(quotes.filter(q => q.id !== id));
      logActivity('DELETE_QUOTE', `Cotação apagada`, id, 'QUOTE');
  };
  const duplicateQuote = (id: string) => {
    const orig = quotes.find(q => q.id === id);
    if (orig) {
        const newId = generateId();
        const newNumber = `COT-${Date.now()}`;
        addQuote({ ...orig, number: newNumber, status: QuoteStatus.DRAFT, payments: [], amountPaid: 0 });
        logActivity('DUPLICATE_QUOTE', `Cotação duplicada de ${orig.number} para ${newNumber}`, newId, 'QUOTE');
    }
  };

  const addQuotePayment = (quoteId: string, payment: Omit<QuotePayment, 'id'>, accountId: string) => {
    const q = quotes.find(quote => quote.id === quoteId);
    if (!q) return;
    const newPaid = (q.amountPaid || 0) + payment.amount;
    let newStatus = q.status;
    if (newPaid >= q.total - 0.5) newStatus = QuoteStatus.PAID;
    else if (newPaid > 0) newStatus = QuoteStatus.PARTIAL;
    updateQuote({ ...q, amountPaid: newPaid, status: newStatus, payments: [...(q.payments || []), { ...payment, id: generateId() }] });
    addTransaction({ accountId, amount: payment.amount, currency: q.currency, category: 'Vendas', date: payment.date, description: `Pgto Cotação ${q.number}`, type: TransactionType.INCOME });
    logActivity('QUOTE_PAYMENT', `Pagamento recebido para cotação ${q.number} (${payment.amount})`, quoteId, 'QUOTE');
  };

  const addExpense = (expense: Omit<FinancialExpense, 'id'>) => {
      const id = generateId();
      setExpenses([...expenses, { ...expense, id, companyId: getCompanyId(expense.companyId) }]);
      logActivity('CREATE_EXPENSE', `Despesa criada: ${expense.name}`, id, 'EXPENSE');
  };
  const updateExpense = (expense: FinancialExpense) => {
      setExpenses(expenses.map(e => e.id === expense.id ? expense : e));
      logActivity('UPDATE_EXPENSE', `Despesa atualizada: ${expense.name}`, expense.id, 'EXPENSE');
  };
  const deleteExpense = (id: string) => {
      setExpenses(expenses.filter(e => e.id !== id));
      logActivity('DELETE_EXPENSE', `Despesa apagada`, id, 'EXPENSE');
  };
  const payExpense = (id: string, accountId: string) => {
    const exp = expenses.find(e => e.id === id);
    if (!exp || exp.status === ExpenseStatus.PAID) return { success: false, message: 'Inválido' };
    updateExpense({ ...exp, status: ExpenseStatus.PAID, paidDate: new Date().toISOString() });
    addTransaction({ accountId, amount: exp.amount, currency: exp.currency, category: `Despesa: ${exp.category}`, date: new Date().toISOString(), description: `Pgto: ${exp.name}`, type: TransactionType.EXPENSE });
    logActivity('PAY_EXPENSE', `Despesa paga: ${exp.name}`, id, 'EXPENSE');
    return { success: true, message: 'Pago com sucesso' };
  };

  const addMaterial = (m: Omit<Material, 'id' | 'createdAt'>) => {
      const id = generateId();
      setMaterials([{ ...m, id, companyId: getCompanyId(m.companyId), createdAt: new Date().toISOString() }, ...materials]);
      logActivity('CREATE_MATERIAL', `Material criado: ${m.name}`, id, 'MATERIAL');
  };
  const updateMaterial = (m: Material) => {
      setMaterials(materials.map(prev => prev.id === m.id ? m : prev));
      logActivity('UPDATE_MATERIAL', `Material atualizado: ${m.name}`, m.id, 'MATERIAL');
  };
  const deleteMaterial = (id: string) => {
      setMaterials(materials.filter(m => m.id !== id));
      logActivity('DELETE_MATERIAL', `Material apagado`, id, 'MATERIAL');
  };

  const addProduct = (p: Omit<Product, 'id' | 'createdAt'>) => {
      const id = generateId();
      setProducts([{ ...p, id, companyId: getCompanyId(p.companyId), createdAt: new Date().toISOString() }, ...products]);
      logActivity('CREATE_PRODUCT', `Produto criado: ${p.name}`, id, 'PRODUCT');
  };
  const updateProduct = (p: Product) => {
      setProducts(products.map(prev => prev.id === p.id ? p : prev));
      logActivity('UPDATE_PRODUCT', `Produto atualizado: ${p.name}`, p.id, 'PRODUCT');
  };
  const deleteProduct = (id: string) => {
      setProducts(products.filter(p => p.id !== id));
      logActivity('DELETE_PRODUCT', `Produto apagado`, id, 'PRODUCT');
  };

  const getStockValuation = (companyId: string) => {
    if (companyId === 'all') {
      return materials.reduce((acc, m) => acc + (m.stock * m.costPrice), 0);
    }
    return materials.filter(m => (m.companyId || 'default') === companyId).reduce((acc, m) => acc + (m.stock * m.costPrice), 0);
  };

  const getProductionProjection = (productId: string) => {
      const product = products.find(p => p.id === productId);
      if (!product || product.bom.length === 0) return { maxUnits: 0, bottleneck: null };
      let maxUnits = Infinity;
      let bottleneck: string | null = null;
      product.bom.forEach(item => {
          const mat = materials.find(m => m.id === item.materialId);
          if (!mat) { maxUnits = 0; bottleneck = "Material Não Encontrado"; return; }
          const possible = Math.floor(mat.stock / item.quantity);
          if (possible < maxUnits) {
              maxUnits = possible;
              bottleneck = mat.name;
          }
      });
      return { maxUnits, bottleneck };
  };

  const recordProduction = (productId: string, quantity: number, options?: { accountId?: string, notes?: string }) => {
    const product = products.find(p => p.id === productId);
    if (!product) return { success: false, message: 'Produto não encontrado' };
    for (const item of product.bom) {
        const mat = materials.find(m => m.id === item.materialId);
        if (!mat || mat.stock < (item.quantity * quantity)) return { success: false, message: `Stock insuficiente: ${mat?.name || 'Insumo'}` };
    }
    let unitMaterialCost = 0;
    const updatedMaterials = materials.map(m => {
        const item = product.bom.find(bi => bi.materialId === m.id);
        if (item) {
            unitMaterialCost += (item.quantity * m.costPrice);
            return { ...m, stock: m.stock - (item.quantity * quantity) };
        }
        return m;
    });
    setMaterials(updatedMaterials);
    const unitLaborCost = (product.labor.peopleCount * product.labor.hoursWorked * product.labor.hourlyRate);
    const unitOpCost = product.electricityCost + product.packagingCost + product.transportCost + product.maintenanceCost + product.otherCosts;
    const unitTotalCost = unitMaterialCost + unitLaborCost + unitOpCost;
    const totalInvestment = unitTotalCost * quantity;
    const newHistory: ProductionHistory = {
        id: generateId(), companyId: product.companyId, productId, quantity,
        unitMaterialCost, unitLaborCost, unitOpCost, unitTotalCost,
        totalInvestment, date: new Date().toISOString(), notes: options?.notes
    };
    setProductionHistory([newHistory, ...productionHistory]);
    updateProduct({ ...product, currentStock: (product.currentStock || 0) + quantity });
    if (options?.accountId) {
        addTransaction({ accountId: options.accountId, amount: totalInvestment, currency: Currency.MZN, category: 'Produção', date: new Date().toISOString(), description: `Custo Produção: ${quantity}x ${product.name}`, type: TransactionType.EXPENSE });
    }
    logActivity('RECORD_PRODUCTION', `Produção registada: ${quantity}x ${product.name}`, newHistory.id, 'PRODUCTION');
    return { success: true, message: `Lote de ${quantity}x ${product.name} produzido com sucesso.` };
  };

  const addEmployee = (emp: Omit<Employee, 'id'>) => {
      const id = generateId();
      setEmployees([...employees, { ...emp, id, companyId: getCompanyId(emp.companyId) }]);
      logActivity('CREATE_EMPLOYEE', `Funcionário criado: ${emp.name}`, id, 'EMPLOYEE');
  };
  const updateEmployee = (emp: Employee) => {
      setEmployees(employees.map(e => e.id === emp.id ? emp : e));
      logActivity('UPDATE_EMPLOYEE', `Funcionário atualizado: ${emp.name}`, emp.id, 'EMPLOYEE');
  };
  const processPayroll = (payrollData: Omit<Payroll, 'id' | 'status'>, accountId: string) => {
      addExpense({ name: `Salário: ${payrollData.employeeName}`, amount: payrollData.netSalary, category: ExpenseCategory.PERSONNEL, currency: Currency.MZN, dueDate: new Date().toISOString(), status: ExpenseStatus.PAID, paidDate: new Date().toISOString(), origin: 'HR', referenceId: payrollData.employeeId, companyId: getCompanyId(payrollData.companyId) });
      addTransaction({ accountId, amount: payrollData.netSalary, category: 'Salários', currency: Currency.MZN, date: new Date().toISOString(), description: `Salário: ${payrollData.employeeName}`, type: TransactionType.EXPENSE, companyId: getCompanyId(payrollData.companyId) });
      const id = generateId();
      setPayrolls([{ ...payrollData, id, companyId: getCompanyId(payrollData.companyId), status: 'PAID', paymentDate: new Date().toISOString() }, ...payrolls]);
      logActivity('PROCESS_PAYROLL', `Salário processado: ${payrollData.employeeName} (${payrollData.netSalary})`, id, 'PAYROLL');
  };

  const addSale = (saleData: Omit<Sale, 'id'>, accountId: string) => {
      const updatedProducts = products.map(p => {
          const item = saleData.items.find(i => i.productId === p.id);
          return item ? { ...p, currentStock: (p.currentStock || 0) - item.quantity } : p;
      });
      setProducts(updatedProducts);
      addTransaction({ accountId, amount: saleData.total, category: 'Vendas POS', currency: Currency.MZN, date: saleData.date, description: `Venda POS`, type: TransactionType.INCOME, companyId: getCompanyId(saleData.companyId) });
      const id = generateId();
      setSales([{ ...saleData, id, companyId: getCompanyId(saleData.companyId) }, ...sales]);
      logActivity('CREATE_SALE', `Venda POS registada (${saleData.total})`, id, 'SALE');
      return { success: true, message: 'Venda realizada.' };
  };

  // --- ERP METHODS ---
  const addLead = (lead: Omit<Lead, 'id' | 'createdAt'>) => {
      const id = generateId();
      setLeads([{ ...lead, id, createdAt: new Date().toISOString() }, ...leads]);
      logActivity('CREATE_LEAD', `Lead criado: ${lead.name}`, id, 'LEAD');
  };
  const updateLead = (lead: Lead) => {
      setLeads(leads.map(l => l.id === lead.id ? lead : l));
      logActivity('UPDATE_LEAD', `Lead atualizado: ${lead.name}`, lead.id, 'LEAD');
  };
  const deleteLead = (id: string) => {
      setLeads(leads.filter(l => l.id !== id));
      logActivity('DELETE_LEAD', `Lead apagado`, id, 'LEAD');
  };

  const addProject = (project: Omit<Project, 'id'>) => {
      const id = generateId();
      setProjects([{ ...project, id }, ...projects]);
      logActivity('CREATE_PROJECT', `Projeto criado: ${project.name}`, id, 'PROJECT');
  };
  const updateProject = (project: Project) => {
      setProjects(projects.map(p => p.id === project.id ? project : p));
      logActivity('UPDATE_PROJECT', `Projeto atualizado: ${project.name}`, project.id, 'PROJECT');
  };
  const deleteProject = (id: string) => {
      setProjects(projects.filter(p => p.id !== id));
      logActivity('DELETE_PROJECT', `Projeto apagado`, id, 'PROJECT');
  };

  const addFixedAsset = (asset: Omit<FixedAsset, 'id'>) => {
      const id = generateId();
      setFixedAssets([{ ...asset, id }, ...fixedAssets]);
      logActivity('CREATE_ASSET', `Ativo imobilizado registado: ${asset.name}`, id, 'ASSET');
  };
  const updateFixedAsset = (asset: FixedAsset) => {
      setFixedAssets(fixedAssets.map(a => a.id === asset.id ? asset : a));
      logActivity('UPDATE_ASSET', `Ativo atualizado: ${asset.name}`, asset.id, 'ASSET');
  };
  const deleteFixedAsset = (id: string) => {
      setFixedAssets(fixedAssets.filter(a => a.id !== id));
      logActivity('DELETE_ASSET', `Ativo apagado`, id, 'ASSET');
  };

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
      const id = generateId();
      setSuppliers([{ ...supplier, id }, ...suppliers]);
      logActivity('CREATE_SUPPLIER', `Fornecedor registado: ${supplier.name}`, id, 'SUPPLIER');
  };
  const updateSupplier = (supplier: Supplier) => {
      setSuppliers(suppliers.map(s => s.id === supplier.id ? supplier : s));
      logActivity('UPDATE_SUPPLIER', `Fornecedor atualizado: ${supplier.name}`, supplier.id, 'SUPPLIER');
  };
  const deleteSupplier = (id: string) => {
      setSuppliers(suppliers.filter(s => s.id !== id));
      logActivity('DELETE_SUPPLIER', `Fornecedor apagado`, id, 'SUPPLIER');
  };

  const addPurchaseOrder = (po: Omit<PurchaseOrder, 'id'>) => {
      const id = generateId();
      setPurchaseOrders([{ ...po, id }, ...purchaseOrders]);
      logActivity('CREATE_PO', `Nota de encomenda criada`, id, 'PO');
  };
  const updatePurchaseOrder = (po: PurchaseOrder) => {
      setPurchaseOrders(purchaseOrders.map(p => p.id === po.id ? po : p));
      logActivity('UPDATE_PO', `Nota de encomenda atualizada`, po.id, 'PO');
  };
  const deletePurchaseOrder = (id: string) => {
      setPurchaseOrders(purchaseOrders.filter(p => p.id !== id));
      logActivity('DELETE_PO', `Nota de encomenda apagada`, id, 'PO');
  };

  // Fiscal Compliance Methods
  const addFiscalObligation = (obligation: Omit<FiscalObligation, 'id'>) => {
    const id = generateId();
    const newOb: FiscalObligation = {
      ...obligation,
      id,
      companyId: getCompanyId(obligation.companyId)
    };
    setFiscalObligations(prev => [newOb, ...prev]);
    logActivity('CREATE_FISCAL', `Obrigação fiscal registada: ${obligation.title}`, id, 'FISCAL');
  };

  const updateFiscalObligation = (obligation: FiscalObligation) => {
    setFiscalObligations(prev => prev.map(o => o.id === obligation.id ? obligation : o));
    logActivity('UPDATE_FISCAL', `Obrigação fiscal atualizada: ${obligation.title}`, obligation.id, 'FISCAL');
  };

  const deleteFiscalObligation = (id: string) => {
    setFiscalObligations(prev => prev.filter(o => o.id !== id));
    logActivity('DELETE_FISCAL', `Obrigação fiscal removida`, id, 'FISCAL');
  };

  const uploadSubmissionProof = (id: string, proofUrl: string, fileName: string, fileSize?: string, referenceNumber?: string) => {
    setFiscalObligations(prev => prev.map(o => {
      if (o.id !== id) return o;
      return {
        ...o,
        submissionProofUrl: proofUrl,
        submissionProofName: fileName,
        submissionProofSize: fileSize || 'Anexo',
        submissionDate: new Date().toISOString().split('T')[0],
        status: o.status === 'PAID' ? 'PAID' : 'SUBMITTED',
        referenceNumber: referenceNumber || o.referenceNumber
      };
    }));
    logActivity('UPLOAD_FISCAL_PROOF', `Comprovativo anexado para obrigação fiscal`, id, 'FISCAL');
  };

  const markObligationPaid = (id: string, paidDate?: string, receiptNumber?: string, finalAmount?: number) => {
    setFiscalObligations(prev => prev.map(o => {
      if (o.id !== id) return o;
      return {
        ...o,
        status: 'PAID',
        paidDate: paidDate || new Date().toISOString().split('T')[0],
        receiptNumber: receiptNumber || o.receiptNumber,
        finalAmount: finalAmount !== undefined ? finalAmount : o.estimatedAmount
      };
    }));
    logActivity('PAY_FISCAL', `Obrigação fiscal liquidada`, id, 'FISCAL');
  };

  // Categories CRUD
  const addCategory = (category: Omit<FinanceCategory, 'id'>) => {
    const id = generateId();
    const newCat = { ...category, id, companyId: getCompanyId(category.companyId) };
    setCategories(prev => [newCat, ...prev]);
    logActivity('CREATE_CATEGORY', `Categoria criada: ${category.name}`, id, 'CATEGORY');
    queueSyncChange('Categoria', id, 'CREATE', newCat, newCat.companyId);
  };

  const updateCategory = (category: FinanceCategory) => {
    setCategories(prev => prev.map(c => c.id === category.id ? category : c));
    logActivity('UPDATE_CATEGORY', `Categoria atualizada: ${category.name}`, category.id, 'CATEGORY');
    queueSyncChange('Categoria', category.id, 'UPDATE', category, category.companyId);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    logActivity('DELETE_CATEGORY', `Categoria removida`, id, 'CATEGORY');
    queueSyncChange('Categoria', id, 'DELETE', { id });
  };

  // Shared Finances
  const addSharedGroup = (group: Omit<SharedGroup, 'id' | 'createdAt'>) => {
    const id = generateId();
    const newGroup: SharedGroup = {
      ...group,
      id,
      companyId: getCompanyId(group.companyId),
      createdAt: new Date().toISOString()
    };
    setSharedGroups(prev => [newGroup, ...prev]);
    logActivity('CREATE_SHARED_GROUP', `Grupo partilhado criado: ${group.name}`, id, 'SHARED_FINANCE');
    queueSyncChange('Grupo Partilhado', id, 'CREATE', newGroup, newGroup.companyId);
  };

  const updateSharedGroup = (group: SharedGroup) => {
    setSharedGroups(prev => prev.map(g => g.id === group.id ? group : g));
    logActivity('UPDATE_SHARED_GROUP', `Grupo partilhado atualizado: ${group.name}`, group.id, 'SHARED_FINANCE');
    queueSyncChange('Grupo Partilhado', group.id, 'UPDATE', group, group.companyId);
  };

  const deleteSharedGroup = (id: string) => {
    setSharedGroups(prev => prev.filter(g => g.id !== id));
    logActivity('DELETE_SHARED_GROUP', `Grupo partilhado removido`, id, 'SHARED_FINANCE');
    queueSyncChange('Grupo Partilhado', id, 'DELETE', { id });
  };

  const addSharedExpense = (exp: Omit<SharedExpense, 'id'>) => {
    const id = generateId();
    const newExp: SharedExpense = {
      ...exp,
      id,
      companyId: getCompanyId(exp.companyId)
    };
    setSharedExpenses(prev => [newExp, ...prev]);
    logActivity('CREATE_SHARED_EXPENSE', `Despesa partilhada: ${exp.title} (${exp.amount} ${exp.currency})`, id, 'SHARED_FINANCE');
    queueSyncChange('Despesa Partilhada', id, 'CREATE', newExp, newExp.companyId);
  };

  const updateSharedExpense = (exp: SharedExpense) => {
    setSharedExpenses(prev => prev.map(e => e.id === exp.id ? exp : e));
    logActivity('UPDATE_SHARED_EXPENSE', `Despesa partilhada atualizada: ${exp.title}`, exp.id, 'SHARED_FINANCE');
    queueSyncChange('Despesa Partilhada', exp.id, 'UPDATE', exp, exp.companyId);
  };

  const deleteSharedExpense = (id: string) => {
    setSharedExpenses(prev => prev.filter(e => e.id !== id));
    logActivity('DELETE_SHARED_EXPENSE', `Despesa partilhada removida`, id, 'SHARED_FINANCE');
    queueSyncChange('Despesa Partilhada', id, 'DELETE', { id });
  };

  const settleSplitItem = (expenseId: string, memberId: string) => {
    setSharedExpenses(prev => prev.map(exp => {
      if (exp.id !== expenseId) return exp;
      const updatedSplits = exp.splits.map(s => s.memberId === memberId ? { ...s, isSettled: true } : s);
      const allSettled = updatedSplits.every(s => s.isSettled);
      return {
        ...exp,
        splits: updatedSplits,
        status: allSettled ? 'SETTLED' : 'PENDING'
      };
    }));
    logActivity('SETTLE_SHARED_SPLIT', `Liquidação de rateio confirmada`, expenseId, 'SHARED_FINANCE');
    queueSyncChange('Liquidação Rateio', expenseId, 'UPDATE', { expenseId, memberId });
  };

  const getInstitutionName = (id: string) => institutions.find(i => i.id === id)?.name || 'Outro';
  const getAccountName = (id: string) => accounts.find(a => a.id === id)?.name || 'Removida';

  const filterByCompany = <T extends { companyId?: string }>(items: T[]): T[] => {
    if (activeCompanyId === 'all') return items;
    return items.filter(item => {
      const itemCompanyId = item.companyId || 'default';
      return itemCompanyId === activeCompanyId;
    });
  };

  const filteredCategories = filterByCompany<FinanceCategory>(categories);
  const filteredSharedGroups = filterByCompany<SharedGroup>(sharedGroups);
  const filteredSharedExpenses = filterByCompany<SharedExpense>(sharedExpenses);

  const filteredAccounts = filterByCompany<Account>(accounts);
  const filteredTransactions = filterByCompany<Transaction>(transactions);
  const filteredBudgets = filterByCompany<Budget>(budgets);
  const filteredDebts = filterByCompany<Debt>(debts);
  const filteredTasks = filterByCompany<Task>(tasks);
  const filteredNotes = filterByCompany<Note>(notes);
  const filteredEvents = filterByCompany<CalendarEvent>(events);
  const filteredCustomers = filterByCompany<Customer>(customers);
  const filteredQuotes = filterByCompany<Quote>(quotes);
  const filteredExpenses = filterByCompany<FinancialExpense>(expenses);
  const filteredMaterials = filterByCompany<Material>(materials);
  const filteredProducts = filterByCompany<Product>(products);
  const filteredProductionHistory = filterByCompany<ProductionHistory>(productionHistory);
  const filteredInvoices = filterByCompany<Invoice>(invoices);
  const filteredEmployees = filterByCompany<Employee>(employees);
  const filteredPayrolls = filterByCompany<Payroll>(payrolls);
  const filteredSales = filterByCompany<Sale>(sales);
  const filteredLeads = filterByCompany<Lead>(leads);
  const filteredProjects = filterByCompany<Project>(projects);
  const filteredFixedAssets = filterByCompany<FixedAsset>(fixedAssets);
  const filteredSuppliers = filterByCompany<Supplier>(suppliers);
  const filteredPurchaseOrders = filterByCompany<PurchaseOrder>(purchaseOrders);
  const filteredAuditLogs = filterByCompany<AuditLog>(auditLogs);
  const filteredFiscalObligations = filterByCompany<FiscalObligation>(fiscalObligations);

  const totalBalanceMZN = filteredAccounts.reduce((acc, c) => acc + (c.balance * (c.currency === Currency.USD ? EXCHANGE_RATES.USD_TO_MZN : c.currency === Currency.ZAR ? EXCHANGE_RATES.ZAR_TO_MZN : 1)), 0);

  const calculateRunway = () => {
    const expTxs = filteredTransactions.filter(t => t.type === TransactionType.EXPENSE);
    if (expTxs.length === 0) return { months: 12, status: 'HEALTHY' as const };
    const totalExp = expTxs.reduce((acc, t) => acc + t.amount, 0);
    const months = totalBalanceMZN / (totalExp / Math.max(1, (new Set(expTxs.map(t => t.date.substring(0, 7))).size)));
    return { months, status: months < 1.5 ? 'CRITICAL' : months < 4 ? 'WARNING' : 'HEALTHY' };
  };

  const getFinancialSnapshot = () => ({
    totalBalance: totalBalanceMZN,
    pendingExpenses: filteredExpenses.filter(e => e.status === ExpenseStatus.PENDING).reduce((acc, e) => acc + e.amount, 0),
    receivables: filteredDebts.filter(d => d.type === DebtType.LENT && !d.isPaid).reduce((acc, d) => acc + d.amount, 0),
    payables: filteredDebts.filter(d => d.type === DebtType.BORROWED && !d.isPaid).reduce((acc, d) => acc + d.amount, 0),
    approvedQuotes: filteredQuotes.filter(q => q.status === QuoteStatus.APPROVED).reduce((acc, q) => acc + q.total, 0),
    clientConcentration: filteredCustomers.map(c => ({ name: c.name, total: filteredQuotes.filter(q => q.customerId === c.id && q.status === QuoteStatus.PAID).reduce((acc, q) => acc + q.total, 0) })).sort((a,b) => b.total - a.total).slice(0, 3)
  });

  const getCompanyMetrics = (companyId: string) => {
    const compAccounts = accounts.filter(a => (a.companyId || 'default') === companyId);
    const totalBalance = compAccounts.reduce((acc, c) => acc + (c.balance * (c.currency === Currency.USD ? EXCHANGE_RATES.USD_TO_MZN : c.currency === Currency.ZAR ? EXCHANGE_RATES.ZAR_TO_MZN : 1)), 0);
    const compEmployees = employees.filter(e => (e.companyId || 'default') === companyId);
    const compProjects = projects.filter(p => (p.companyId || 'default') === companyId);
    const compDebts = debts.filter(d => (d.companyId || 'default') === companyId && d.type === DebtType.BORROWED && !d.isPaid);
    const compExpenses = expenses.filter(e => (e.companyId || 'default') === companyId && e.status === ExpenseStatus.PENDING);
    const compTxs = transactions.filter(t => (t.companyId || 'default') === companyId);
    const income = compTxs.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
    const expense = compTxs.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance,
      accountsCount: compAccounts.length,
      employeesCount: compEmployees.length,
      projectsCount: compProjects.length,
      unpaidDebts: compDebts.reduce((sum, d) => sum + d.amount, 0),
      pendingExpenses: compExpenses.reduce((sum, e) => sum + e.amount, 0),
      income,
      expense
    };
  };

  return (
    <FinanceContext.Provider value={{
      institutions, 
      accounts: filteredAccounts, 
      transactions: filteredTransactions, 
      budgets: filteredBudgets, 
      debts: filteredDebts, 
      tasks: filteredTasks, 
      notes: filteredNotes, 
      events: filteredEvents, 
      auditLogs: filteredAuditLogs,
      companies, 
      allCompanies: companies,
      allAccounts: accounts,
      allTransactions: transactions,
      allExpenses: expenses,
      allInvoices: invoices,
      allEmployees: employees,
      allMaterials: materials,
      allProducts: products,
      fiscalObligations: filteredFiscalObligations,
      allFiscalObligations: fiscalObligations,
      categories: filteredCategories,
      allCategories: categories,
      addCategory,
      updateCategory,
      deleteCategory,
      sharedGroups: filteredSharedGroups,
      addSharedGroup,
      updateSharedGroup,
      deleteSharedGroup,
      sharedExpenses: filteredSharedExpenses,
      addSharedExpense,
      updateSharedExpense,
      deleteSharedExpense,
      settleSplitItem,
      getCompanyMetrics,
      customers: filteredCustomers, 
      quotes: filteredQuotes, 
      expenses: filteredExpenses, 
      materials: filteredMaterials, 
      products: filteredProducts, 
      productionHistory: filteredProductionHistory,
      invoices: filteredInvoices, 
      employees: filteredEmployees, 
      payrolls: filteredPayrolls, 
      sales: filteredSales,
      leads: filteredLeads,
      projects: filteredProjects,
      fixedAssets: filteredFixedAssets,
      suppliers: filteredSuppliers,
      purchaseOrders: filteredPurchaseOrders,
      addFiscalObligation,
      updateFiscalObligation,
      deleteFiscalObligation,
      uploadSubmissionProof,
      markObligationPaid,
      addAccount, removeAccount, updateInstitution, addInstitution,
      addTransaction, removeTransaction, updateTransaction,
      addBudget, addDebt, payDebt, removeDebt, addTask, updateTask, toggleTaskStatus, removeTask,
      addNote, updateNote, deleteNote, addEvent, updateEvent, deleteEvent, addCompany, updateCompany, deleteCompany,
      addCustomer, updateCustomer, deleteCustomer, addQuote, updateQuote, deleteQuote,
      duplicateQuote, addQuotePayment, addExpense, updateExpense, deleteExpense, payExpense,
      addMaterial, updateMaterial, deleteMaterial, addProduct, updateProduct, deleteProduct,
      recordProduction, getProductionProjection, getStockValuation, addEmployee, updateEmployee,
      processPayroll, addSale,
      addLead, updateLead, deleteLead, addProject, updateProject, deleteProject,
      addFixedAsset, updateFixedAsset, deleteFixedAsset, addSupplier, updateSupplier, deleteSupplier,
      addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder,
      netProfit: filteredTransactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0) - filteredTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0),
      realizedInterest: filteredTransactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0),
      totalExpensesPaid: filteredTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0),
      getInstitutionName, getAccountName, totalBalanceMZN, getFinancialSnapshot, calculateRunway, logActivity,
      activeCompanyId, setActiveCompanyId
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance error');
  return context;
};
