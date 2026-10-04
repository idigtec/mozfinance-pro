
export enum Currency {
  MZN = 'MZN',
  USD = 'USD',
  ZAR = 'ZAR'
}

export enum InstitutionType {
  BANK = 'Banco Comercial',
  MICRO_BANK = 'Microbanco/Cooperativa',
  MOBILE_MONEY = 'Carteira Móvel',
  CASH = 'Caixa Físico'
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  type: InstitutionType;
  isActive: boolean;
  logoColor?: string;
}

export enum AccountType {
  CHECKING = 'Conta Corrente',
  SAVINGS = 'Conta Poupança',
  MOBILE_WALLET = 'Carteira Digital',
  CASH_HAND = 'Numerário'
}

export interface Account {
  id: string;
  companyId?: string;
  name: string;
  institutionId: string;
  type: AccountType;
  currency: Currency;
  balance: number;
}

export enum TransactionType {
  INCOME = 'Receita',
  EXPENSE = 'Despesa',
  TRANSFER = 'Transferência'
}

export interface Transaction {
  id: string;
  companyId?: string;
  accountId: string;
  toAccountId?: string;
  amount: number;
  currency: Currency;
  category: string;
  date: string;
  description: string;
  type: TransactionType;
  reference?: string;
  isRecurring?: boolean;
}

export interface Budget {
  id: string;
  companyId?: string;
  category: string;
  limit: number;
  currency: Currency;
  period: string;
}

export enum DebtType {
  LENT = 'Empréstimo Concedido (A Receber)',
  BORROWED = 'Empréstimo Tomado (A Pagar)'
}

export interface Debt {
  id: string;
  companyId?: string;
  entity: string;
  amount: number;
  currency: Currency;
  dueDate: string;
  type: DebtType;
  isPaid: boolean;
  notes?: string;
}

export enum TaskPriority {
  HIGH = 'Alta',
  MEDIUM = 'Média',
  LOW = 'Baixa'
}

export interface Task {
  id: string;
  companyId?: string;
  title: string;
  description?: string;
  dueDate?: string;
  reminderDate?: string;
  isCompleted: boolean;
  priority: TaskPriority;
  tags?: string[];
  subtasks?: { id: string; title: string; isCompleted: boolean }[];
}

export type NoteColor = 'white' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'darkblue' | 'purple' | 'pink' | 'brown' | 'gray';

export interface ChecklistItem {
  id: string;
  text: string;
  isChecked: boolean;
}

export interface Note {
  id: string;
  companyId?: string;
  title: string;
  type: 'TEXT' | 'CHECKLIST';
  content?: string; 
  items?: ChecklistItem[]; 
  color: NoteColor;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  reminder?: string; 
}

export interface AuditLog {
  id: string;
  companyId?: string;
  action: string;
  entity?: string; 
  details: string;
  timestamp: string;
  userId: string;
  relatedId?: string;
  relatedType?: string;
}

export type CalendarEventType = 'TRANSACTION' | 'DEBT' | 'TASK' | 'NOTE' | 'PERSONAL' | 'REMINDER' | 'MEETING' | 'ANNIVERSARY' | 'ENCOUNTER' | 'POTENTIAL';

export interface CalendarEvent {
  id: string;
  companyId?: string;
  date: string;
  time?: string;
  title: string;
  type: CalendarEventType;
  amount?: number;
  status: 'PENDING' | 'COMPLETED' | 'MISSED';
  color?: string;
  description?: string;
  notifyEmail?: boolean;
  notifySMS?: boolean;
  notifyWhatsApp?: boolean;
}

export interface CompanyProfile {
  id: string;
  name: string;
  tradeName?: string;
  nuit: string;
  legalForm?: string;
  registrationNumber?: string;
  gazetteNotice?: string; // Boletim da República
  caeCode?: string;
  startDate?: string;
  shareCapital?: number;
  partners?: string;
  address: string;
  city: string;
  province?: string;
  district?: string;
  municipality?: string;
  phone: string;
  additionalPhones?: string[];
  email: string;
  additionalEmails?: string[];
  website?: string;
  bankDetails?: string; 
  logoUrl?: string; 
  isDefault?: boolean;
  sector?: string;
  sectors?: string[];
  businessType?: 'RESTAURANT' | 'PHARMACY' | 'DELIVERY' | 'CONSTRUCTION' | 'RETAIL' | 'TECH' | 'SERVICES' | 'HOSPITALITY' | 'CUSTOMS' | 'OTHER';
  enabledModules?: string[]; // IDs dos módulos ativados
  customCategories?: string[]; // Categorias de estoque configuradas
  taxRegime?: string;
  inssNumber?: string;
  fiscalYear?: string;
  accountingPlan?: 'PGC-PE' | 'PGC-NIRF' | string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface Customer {
  id: string;
  companyId?: string;
  name: string;
  nuit?: string;
  address?: string;
  email?: string;
  phone?: string;
  contactPerson?: string;
}

export enum QuoteStatus {
  DRAFT = 'Rascunho',
  SENT = 'Enviada',
  APPROVED = 'Aprovada',
  PARTIAL = 'Parcialmente Paga',
  PAID = 'Paga / Concluída',
  REJECTED = 'Rejeitada',
  EXPIRED = 'Expirada'
}

export interface QuotePayment {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference?: string;
  note?: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit?: string;
  customUnit?: string;
  unitPrice: number;
  discount: number; 
  discountType: 'PERCENT' | 'FIXED'; 
  total: number;
}

export interface Quote {
  id: string;
  companyId: string;
  number: string;
  date: string;
  validUntil: string;
  customerId: string;
  status: QuoteStatus;
  items: QuoteItem[];
  
  subtotal: number;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  
  payments: QuotePayment[];
  amountPaid: number;
  
  notes?: string; 
  currency: Currency;
}

export enum ExpenseCategory {
  FIXED = 'Fixa (Aluguel/Contratos)',
  CURRENT = 'Corrente (Variável)',
  PERSONNEL = 'Pessoal & Salários',
  DEBT_SERVICE = 'Pagamento de Dívidas'
}

export enum ExpenseStatus {
  PENDING = 'Pendente (A Pagar)',
  PAID = 'Paga'
}

export interface FinancialExpense {
  id: string;
  companyId?: string;
  name: string; 
  category: ExpenseCategory;
  amount: number;
  currency: Currency;
  dueDate: string;
  status: ExpenseStatus;
  paidDate?: string;
  recurrence?: 'MENSAL' | 'TRIMESTRAL' | 'ANUAL' | 'NENHUMA';
  notes?: string;
  origin?: 'MANUAL' | 'HR' | 'DEBT'; 
  referenceId?: string; 
}

// --- PRODUCTION & STOCK REFINED ---

export interface Material {
  id: string;
  companyId?: string;
  name: string;
  category: string;
  unit: 'KG' | 'L' | 'UN' | 'G' | 'ML' | 'M' | 'CX' | 'SC' | 'BLISTER' | 'FRASCO' | 'DOSE';
  stock: number;
  minStock: number;
  costPrice: number; 
  salePrice: number; 
  supplier?: string;
  batchNumber?: string; // Lote
  expiryDate?: string; // Data de Validade (FEFO)
  location?: string; // Prateleira / Geladeira
  isPerishable?: boolean;
  createdAt: string;
  lastPurchaseDate?: string;
}

export interface BOMItem {
  materialId: string;
  quantity: number;
}

export interface LaborProfile {
  type: 'STAFF' | 'CONTRACTOR';
  peopleCount: number;
  hoursWorked: number;
  hourlyRate: number;
  role?: string;
}

export interface Product {
  id: string;
  companyId?: string; 
  name: string;
  category: string;
  
  // Engineering Components
  bom: BOMItem[];
  labor: LaborProfile;
  
  // Operational Costs
  electricityCost: number; 
  packagingCost: number; 
  transportCost: number; 
  maintenanceCost: number;
  otherCosts: number; 
  
  purchasePrice?: number;
  profitMargin?: number;
  salePrice: number;
  wholesalePrice?: number;
  currentStock: number; 
  
  // Advanced Stock & Quality
  unitsPerPackage?: number;
  minStockLevel?: number;
  stopWholesaleThreshold?: number;
  qualityStatus?: 'Excelente' | 'Bom' | 'Atenção' | 'Crítico';
  batchNumber?: string;
  expiryDate?: string;
  barcode?: string;
  isPerishable?: boolean;
  
  createdAt: string;
}

export interface ProductionHistory {
  id: string;
  companyId?: string;
  productId: string;
  quantity: number;
  
  // Snapshot of costs at production time
  unitMaterialCost: number;
  unitLaborCost: number;
  unitOpCost: number;
  unitTotalCost: number;
  
  totalInvestment: number;
  date: string;
  notes?: string;
}

// --- SALES & POS ---

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  companyId: string;
  date: string;
  customerName?: string;
  items: SaleItem[];
  total: number;
  paymentMethod: string; 
  status: 'COMPLETED' | 'REFUNDED';
}

// --- HR & PAYROLL ---

export interface Employee {
  id: string;
  companyId: string;
  name: string;
  position: string;
  baseSalary: number;
  nuit?: string;
  inssNumber?: string;
  dependents: number;
  bankDetails?: string;
  status: 'ACTIVE' | 'INACTIVE';
  admissionDate: string;
}

export interface Payroll {
  id: string;
  companyId?: string;
  employeeId: string;
  employeeName: string;
  month: string; 
  baseSalary: number;
  bonus: number;
  overtime: number;
  inssEmployee: number; 
  irps: number; 
  advances: number; 
  netSalary: number; 
  inssEmployer: number; 
  totalCompanyCost: number;
  status: 'DRAFT' | 'PAID';
  paymentDate?: string;
}

export interface InvoiceItem {
  materialId?: string;
  productId?: string;
  quantity: number;
  unitPrice: number;
  costPrice: number; 
  total: number;
}

export interface Invoice {
  id: string;
  companyId?: string;
  number: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  totalCost: number; 
  profit: number; 
  paymentMethod: string;
  status: 'PAID' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}

// --- CRM ---
export enum LeadStatus {
  NEW = 'Novo',
  CONTACTED = 'Contactado',
  QUALIFIED = 'Qualificado',
  PROPOSAL = 'Proposta Enviada',
  WON = 'Ganhos',
  LOST = 'Perdido'
}

export interface Lead {
  id: string;
  companyId: string;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  status: LeadStatus;
  value?: number;
  notes?: string;
  createdAt: string;
}

// --- PROJECTS ---
export interface Project {
  id: string;
  companyId: string;
  name: string;
  customerId: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate?: string;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  tasks: string[]; // IDs of tasks
}

// --- FIXED ASSETS ---
export interface FixedAsset {
  id: string;
  companyId: string;
  name: string;
  category: 'VEHICLE' | 'EQUIPMENT' | 'FURNITURE' | 'REAL_ESTATE' | 'IT';
  purchaseDate: string;
  purchaseValue: number;
  depreciationRate: number; // Annual %
  currentValue: number;
  location?: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'DISPOSED';
}

// --- SUPPLIERS ---
export interface Supplier {
  id: string;
  companyId: string;
  name: string;
  nuit?: string;
  category: string;
  contact: string;
  email?: string;
  rating: number; // 1-5
}

// --- PURCHASE ORDERS ---
export interface PurchaseOrder {
  id: string;
  companyId: string;
  supplierId: string;
  date: string;
  items: { materialId: string; quantity: number; unitPrice: number; total: number }[];
  total: number;
  status: 'DRAFT' | 'SENT' | 'RECEIVED' | 'CANCELLED';
}

// --- RESTAURANT SECTOR ---
export interface RestaurantTableItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
  notes?: string;
  sentToKitchen?: boolean;
}

export interface RestaurantTable {
  id: string;
  companyId: string;
  name: string; // Ex: "Mesa 01", "Esplanada 04", "Balcão VIP"
  zone: 'SALA_PRINCIPAL' | 'ESPLANADA' | 'BAR' | 'VIP';
  capacity: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'BILL_REQUESTED' | 'RESERVED';
  customerName?: string;
  waiterName?: string;
  openedAt?: string;
  items: RestaurantTableItem[];
  total: number;
}

export interface KitchenOrder {
  id: string;
  companyId: string;
  orderNumber: string;
  origin: string; // Ex: "Mesa 02", "Takeaway #104"
  items: { name: string; quantity: number; notes?: string }[];
  status: 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED';
  createdAt: string;
  priority?: 'NORMAL' | 'URGENT';
}

// --- PHARMACY SECTOR ---
export interface PharmacyBatch {
  id: string;
  companyId: string;
  medicationName: string;
  activeIngredient?: string; // Princípio ativo (ex: Paracetamol, Amoxicilina)
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  dosageForm: string; // Comprimidos, Xarope, Cápsulas, Pomada
  category: 'MSRM' | 'MNSRM' | 'ANTIBIOTIC' | 'CONTROLLED' | 'SUPPLEMENT';
  stock: number;
  minStock: number;
  costPrice: number;
  salePrice: number;
  storageCondition?: 'AMBIENT' | 'COLD_CHAIN' | 'CONTROLLED_ROOM'; // Cadeia de frio 2-8°C
  anarmeCode?: string;
  requiresPrescription: boolean;
}

// --- DELIVERY SECTOR ---
export interface DeliveryOrder {
  id: string;
  companyId: string;
  orderCode: string;
  customerName: string;
  phone: string;
  deliveryAddress: string;
  zoneName: string;
  itemsDescription: string;
  itemsAmount: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: 'M-PESA' | 'E-MOLA' | 'POS' | 'CASH';
  courierName?: string;
  courierPhone?: string;
  courierVehicle?: string; // Ex: "Mota TVS 125 - MM-44-89"
  status: 'PENDING' | 'ASSIGNED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  deliveredAt?: string;
  notes?: string;
}

export interface DeliveryCourier {
  id: string;
  companyId: string;
  name: string;
  phone: string;
  vehicleType: 'MOTA' | 'BICICLETA' | 'CARRO';
  licensePlate?: string;
  status: 'AVAILABLE' | 'ON_DELIVERY' | 'OFFLINE';
  completedDeliveries: number;
}

// --- TAX & FISCAL COMPLIANCE (MOÇAMBIQUE) ---
export type TaxObligationType = 'IVA' | 'INSS' | 'IRPS' | 'IRPC' | 'ISPC' | 'ALVARA' | 'SECTORIAL' | 'SELO' | 'OUTRO';
export type ObligationStatus = 'PENDING' | 'SUBMITTED' | 'PAID' | 'OVERDUE';

export interface FiscalObligation {
  id: string;
  companyId: string;
  title: string; // Ex: "IVA Mensal - Modelo A (Período 08/2026)"
  taxType: TaxObligationType;
  sector?: string;
  period: string; // Ex: "Agosto 2026"
  dueDate: string; // YYYY-MM-DD (ex: 2026-09-20)
  estimatedAmount: number;
  finalAmount?: number;
  status: ObligationStatus;
  referenceNumber?: string; // Número da Guia DGI ou Notificação
  submissionProofUrl?: string; // Base64 data URL ou link do ficheiro
  submissionProofName?: string; // Nome do ficheiro anexado
  submissionProofSize?: string;
  submissionDate?: string;
  paidDate?: string;
  receiptNumber?: string;
  notes?: string;
  legalBasis?: string; // Base Legal (ex: "Art. 25 CIVA", "Decreto 51/2017 INSS")
  fineAmount?: number; // Juros de mora ou multa estimada
}

// --- UTILIZADORES & SESSÃO (AUTH & RBAC) ---
export type UserRole = 'ADMIN' | 'FINANCIAL_MANAGER' | 'OPERATOR' | 'AUDITOR';

export interface UserPermission {
  id: string;
  code: string;
  name: string;
  module: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: string;
  avatarUrl?: string;
  isActive: boolean;
  companyIds: string[]; // Companies the user can access ('all' or specific IDs)
  createdAt: string;
  lastLogin?: string;
  pinCode?: string;
}

// --- CATEGORIAS PERSONALIZADAS (RECEITAS & DESPESAS) ---
export type CategoryKind = 'INCOME' | 'EXPENSE';

export interface FinanceCategory {
  id: string;
  name: string;
  type: CategoryKind;
  iconName: string;
  color: string;
  description?: string;
  budgetMonthly?: number;
  companyId?: string;
  isSystem?: boolean;
}

// --- FINANÇAS COMPARTILHADAS (SHARED FINANCES / RATEIO) ---
export interface SharedMember {
  id: string;
  userId?: string;
  name: string;
  email?: string;
  avatar?: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  shareRatio: number; // Percentage or weight
}

export interface SharedSplitItem {
  memberId: string;
  memberName: string;
  amount: number;
  isSettled: boolean;
}

export interface SharedExpense {
  id: string;
  groupId: string;
  companyId?: string;
  title: string;
  amount: number;
  currency: Currency;
  paidByMemberId: string;
  paidByMemberName: string;
  date: string;
  category: string;
  splitType: 'EQUAL' | 'PERCENTAGE' | 'EXACT';
  splits: SharedSplitItem[];
  receiptUrl?: string;
  notes?: string;
  status: 'PENDING' | 'SETTLED';
}

export interface SharedGroup {
  id: string;
  companyId?: string;
  name: string;
  description?: string;
  currency: Currency;
  members: SharedMember[];
  createdAt: string;
  color?: string;
}

// --- FILA DE SINCRONIZAÇÃO & OFFLINE-FIRST ENGINE ---
export type SyncStatus = 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED' | 'CONFLICT';
export type SyncOperation = 'CREATE' | 'UPDATE' | 'DELETE';

export interface SyncQueueItem {
  id: string;
  entity: string; // Ex: 'transactions', 'accounts', 'expenses', 'categories', 'debts'
  entityId: string;
  operation: SyncOperation;
  payload: any;
  timestamp: string;
  status: SyncStatus;
  retryCount: number;
  errorMessage?: string;
  companyId?: string;
}

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  type: 'AUTO' | 'MANUAL' | 'NETWORK_RECONNECTED';
  itemsProcessed: number;
  successCount: number;
  failedCount: number;
  durationMs: number;
  status: 'SUCCESS' | 'PARTIAL' | 'ERROR';
  details?: string;
}

