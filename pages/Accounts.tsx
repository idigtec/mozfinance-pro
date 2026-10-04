import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  Plus, 
  Smartphone, 
  Banknote, 
  Trash2, 
  CreditCard, 
  PiggyBank, 
  Wallet, 
  Settings,
  Edit2,
  Check,
  X,
  Building2,
  ArrowLeft,
  Save,
  ArrowRightLeft
} from 'lucide-react';
import { InstitutionType, Currency, AccountType, Institution, TransactionType } from '../types';
import { TransactionModal } from '../components/TransactionModal';
import { Tooltip } from '../components/ui/Tooltip';

export const Accounts = () => {
  const { 
    accounts, 
    institutions, 
    addAccount, 
    removeAccount, 
    updateInstitution,
    addInstitution,
    getInstitutionName 
  } = useFinance();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManageBanksOpen, setIsManageBanksOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  
  // Transaction Modal State for Transfers
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferFromAccount, setTransferFromAccount] = useState<string>('');

  // New Account Form State
  const [newName, setNewName] = useState('');
  const [newInstitutionId, setNewInstitutionId] = useState('');
  const [newType, setNewType] = useState<AccountType>(AccountType.CHECKING);
  const [newCurrency, setNewCurrency] = useState<Currency>(Currency.MZN);
  const [newBalance, setNewBalance] = useState('');

  // Manage Banks State
  const [manageMode, setManageMode] = useState<'LIST' | 'FORM'>('LIST');
  const [editingInstId, setEditingInstId] = useState<string | null>(null);
  
  // Bank Form State
  const [instFormName, setInstFormName] = useState('');
  const [instFormCode, setInstFormCode] = useState('');
  const [instFormType, setInstFormType] = useState<InstitutionType>(InstitutionType.BANK);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount({
      name: newName,
      institutionId: newInstitutionId,
      type: newType,
      currency: newCurrency,
      balance: parseFloat(newBalance) || 0
    });
    setIsAddModalOpen(false);
    setNewName('');
    setNewBalance('');
    setNewInstitutionId('');
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      removeAccount(deleteConfirmation);
      setDeleteConfirmation(null);
    }
  };

  const openTransfer = (accountId: string) => {
      setTransferFromAccount(accountId);
      setIsTransferModalOpen(true);
  };

  // --- Institution Management Logic ---

  const resetInstForm = () => {
    setInstFormName('');
    setInstFormCode('');
    setInstFormType(InstitutionType.BANK);
    setEditingInstId(null);
  };

  const handleOpenAddInstitution = () => {
    resetInstForm();
    setManageMode('FORM');
  };

  const handleEditInstitution = (inst: Institution) => {
    setEditingInstId(inst.id);
    setInstFormName(inst.name);
    setInstFormCode(inst.code);
    setInstFormType(inst.type);
    setManageMode('FORM');
  };

  const generateColor = () => {
    const colors = ['#005f7f', '#9c1f60', '#0033a1', '#be0028', '#f7941d', '#004c8c', '#009597', '#5c3a21'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleSaveInstitution = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingInstId) {
      // Update existing
      const existing = institutions.find(i => i.id === editingInstId);
      if (existing) {
        updateInstitution({
          ...existing,
          name: instFormName,
          code: instFormCode,
          type: instFormType
        });
      }
    } else {
      // Create new
      addInstitution({
        id: `inst_${Date.now()}`,
        name: instFormName,
        code: instFormCode,
        type: instFormType,
        isActive: true,
        logoColor: generateColor()
      });
    }
    
    setManageMode('LIST');
    resetInstForm();
  };

  const toggleBankStatus = (inst: Institution) => {
    updateInstitution({ ...inst, isActive: !inst.isActive });
  };

  // --- Helper Icons ---

  const getAccountIcon = (type: AccountType) => {
    switch(type) {
      case AccountType.MOBILE_WALLET: return <Smartphone className="h-6 w-6" />;
      case AccountType.CASH_HAND: return <Banknote className="h-6 w-6" />;
      case AccountType.SAVINGS: return <PiggyBank className="h-6 w-6" />;
      default: return <CreditCard className="h-6 w-6" />;
    }
  };

  const getCardGradient = (type: AccountType) => {
    switch(type) {
      case AccountType.MOBILE_WALLET: return 'bg-gradient-to-br from-red-600 to-orange-600';
      case AccountType.CASH_HAND: return 'bg-gradient-to-br from-emerald-600 to-teal-700';
      case AccountType.SAVINGS: return 'bg-gradient-to-br from-blue-600 to-indigo-700';
      default: return 'bg-gradient-to-br from-slate-700 to-slate-900';
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Minhas Contas</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Gerencie saldos bancários e carteiras móveis</p>
        </div>
        <div className="flex space-x-2">
          <Tooltip content="Configurar bancos, taxas e carteiras móveis cadastradas">
            <button 
              onClick={() => {
                setManageMode('LIST');
                setIsManageBanksOpen(true);
              }}
              className="flex items-center space-x-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-700 px-4 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition shadow-sm font-bold cursor-pointer"
            >
              <Settings className="h-4 w-4" />
              <span>Gerir Instituições</span>
            </button>
          </Tooltip>
          <Tooltip content="Adicionar nova conta de banco, dinheiro físico ou M-Pesa/e-Mola">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 bg-slate-900 dark:bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-700 transition shadow-lg font-bold cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Conta</span>
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => {
          const inst = institutions.find(i => i.id === acc.institutionId);
          const gradient = getCardGradient(acc.type);
          
          return (
            <div key={acc.id} className={`rounded-2xl shadow-xl overflow-hidden text-white relative group transition-transform hover:-translate-y-1 ${gradient}`}>
              {/* Background Decoration */}
              <div className="absolute right-0 top-0 h-32 w-32 bg-white opacity-10 rounded-full transform translate-x-10 -translate-y-10"></div>
              
              <div className="p-6 relative z-10 h-full flex flex-col justify-between min-h-[180px]">
                <div>
                    <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                        {getAccountIcon(acc.type)}
                        </div>
                        <div>
                        <p className="font-bold text-white/90 text-sm">{inst?.name || 'Desconhecido'}</p>
                        <Tooltip content={`Tipo de conta: ${acc.type}`}>
                          <span className="text-xs text-white/70 font-medium cursor-help inline-block">{acc.type}</span>
                        </Tooltip>
                        </div>
                    </div>
                    <Tooltip content="Remover esta conta do sistema">
                      <button 
                          onClick={() => setDeleteConfirmation(acc.id)}
                          className="p-1.5 bg-white/10 hover:bg-red-500 rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                          aria-label="Apagar conta"
                      >
                          <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </Tooltip>
                    </div>

                    <div className="mt-6">
                    <p className="text-white/80 text-xs uppercase font-bold tracking-wider mb-1">{acc.name}</p>
                    <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold tracking-tight">
                        {acc.balance.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <Tooltip content={`Moeda oficial da conta: ${acc.currency}`}>
                          <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded text-white/90 cursor-help">
                          {acc.currency}
                          </span>
                        </Tooltip>
                    </div>
                    </div>
                </div>

                {/* Card Action */}
                <div className="mt-6 flex justify-end">
                    <Tooltip content="Transferir valores desta conta para outra conta ou carteira">
                      <button 
                          onClick={() => openTransfer(acc.id)}
                          className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-bold transition backdrop-blur-md cursor-pointer"
                      >
                          <ArrowRightLeft className="h-3 w-3" /> Transferir
                      </button>
                    </Tooltip>
                </div>
              </div>
            </div>
          );
        })}
        {accounts.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-gray-300 dark:border-slate-800">
            <Wallet className="h-12 w-12 text-gray-300 dark:text-slate-600 mb-2" />
            <p className="text-gray-600 dark:text-gray-300 font-bold">Nenhuma conta registada</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Adicione uma conta bancária ou M-Pesa para começar</p>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  addAccount({
                    name: 'Conta BIM Principal',
                    institutionId: 'inst_bim',
                    type: AccountType.CHECKING,
                    currency: Currency.MZN,
                    balance: 0
                  });
                }}
                className="bg-pink-50 text-pink-700 hover:bg-pink-100 px-4 py-2 rounded-lg font-bold text-sm transition"
              >
                + Adicionar BIM
              </button>
              <button 
                onClick={() => {
                  addAccount({
                    name: 'Conta Standard Bank',
                    institutionId: 'inst_sb',
                    type: AccountType.CHECKING,
                    currency: Currency.MZN,
                    balance: 0
                  });
                }}
                className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg font-bold text-sm transition"
              >
                + Adicionar Standard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Helper component to inject props into TransactionModal */}
      {isTransferModalOpen && (
          <TransactionModalWrapper 
             isOpen={isTransferModalOpen}
             onClose={() => setIsTransferModalOpen(false)}
             initialAccountId={transferFromAccount}
          />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center">
             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <Trash2 className="h-6 w-6 text-red-600" />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-2">Apagar Conta?</h3>
             <p className="text-gray-600 text-sm mb-6 font-medium">
               Tem a certeza que deseja apagar esta conta? Esta ação não pode ser desfeita e o histórico de saldo será perdido.
             </p>
             <div className="flex space-x-3">
               <button 
                 onClick={() => setDeleteConfirmation(null)}
                 className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-bold text-gray-700"
               >
                 Cancelar
               </button>
               <button 
                 onClick={confirmDelete}
                 className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold"
               >
                 Apagar
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
              <Plus className="h-5 w-5 text-emerald-600" />
              Adicionar Nova Conta
            </h3>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nome da Conta</label>
                <input required type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-emerald-500 shadow-sm font-medium" placeholder="Ex: Conta Salário" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Instituição</label>
                <select required value={newInstitutionId} onChange={e => setNewInstitutionId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-emerald-500 shadow-sm cursor-pointer font-medium">
                  <option value="">Selecione...</option>
                  {institutions.filter(i => i.isActive).map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
                   <select value={newType} onChange={e => setNewType(e.target.value as AccountType)} className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-emerald-500 shadow-sm cursor-pointer font-medium">
                     {Object.values(AccountType).map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">Moeda</label>
                   <select value={newCurrency} onChange={e => setNewCurrency(e.target.value as Currency)} className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-emerald-500 shadow-sm cursor-pointer font-medium">
                     {Object.values(Currency).map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Saldo Inicial</label>
                <input required type="number" step="0.01" value={newBalance} onChange={e => setNewBalance(e.target.value)} className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-emerald-500 shadow-sm font-bold" placeholder="0.00" />
              </div>

              <div className="flex space-x-3 mt-6">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50 font-bold text-gray-700">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm font-bold">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Institutions Modal */}
      {isManageBanksOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <div className="flex items-center space-x-3">
                {manageMode === 'FORM' && (
                  <button onClick={() => setManageMode('LIST')} className="p-1 hover:bg-gray-200 rounded-full">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {manageMode === 'LIST' ? 'Gerir Instituições' : (editingInstId ? 'Editar Instituição' : 'Nova Instituição')}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {manageMode === 'LIST' ? 'Ative, edite ou adicione novos bancos' : 'Preencha os dados da instituição'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsManageBanksOpen(false)} className="p-2 hover:bg-gray-200 rounded-full">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* LIST MODE */}
              {manageMode === 'LIST' && (
                <div className="space-y-4">
                  <button 
                    onClick={handleOpenAddInstitution}
                    className="w-full flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition"
                  >
                    <Plus className="h-5 w-5" />
                    <span className="font-bold">Adicionar Nova Instituição</span>
                  </button>

                  <div className="space-y-2">
                    {institutions.map(inst => (
                      <div key={inst.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="w-2 h-10 rounded-full" style={{ backgroundColor: inst.logoColor }}></div>
                          <div className={!inst.isActive ? 'opacity-50' : ''}>
                            <p className="font-bold text-gray-900">{inst.name}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{inst.code} • {inst.type}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleEditInstitution(inst)} 
                            className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded transition text-sm font-bold"
                            title="Editar Instituição"
                          >
                            <Edit2 className="h-4 w-4" />
                            <span>Editar</span>
                          </button>
                          
                          <button 
                            onClick={() => toggleBankStatus(inst)}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors w-20 text-center ${
                              inst.isActive 
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {inst.isActive ? 'Ativo' : 'Inativo'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FORM MODE */}
              {manageMode === 'FORM' && (
                <form onSubmit={handleSaveInstitution} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Nome da Instituição</label>
                    <input 
                      required 
                      type="text" 
                      value={instFormName} 
                      onChange={(e) => setInstFormName(e.target.value)} 
                      className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-emerald-500 shadow-sm font-medium" 
                      placeholder="Ex: Banco Comercial de Moçambique" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Código (Sigla)</label>
                      <input 
                        required 
                        type="text" 
                        value={instFormCode} 
                        onChange={(e) => setInstFormCode(e.target.value)} 
                        className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-emerald-500 uppercase shadow-sm font-medium" 
                        placeholder="Ex: BCM" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
                      <select 
                        value={instFormType} 
                        onChange={(e) => setInstFormType(e.target.value as InstitutionType)} 
                        className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-900 focus:ring-emerald-500 shadow-sm cursor-pointer font-medium"
                      >
                        {Object.values(InstitutionType).map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex space-x-3">
                    <button 
                      type="button" 
                      onClick={() => setManageMode('LIST')} 
                      className="flex-1 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-bold"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold flex justify-center items-center space-x-2 shadow-sm"
                    >
                      <Save className="h-4 w-4" />
                      <span>Salvar Instituição</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Internal wrapper to pass data to the shared TransactionModal
const TransactionModalWrapper = ({ isOpen, onClose, initialAccountId }: { isOpen: boolean, onClose: () => void, initialAccountId: string }) => {
    // This component renders the shared modal, pre-configured for transfer
    // We actually need to modify the shared component or use a specialized one. 
    // To keep file changes minimal, I'll instantiate the existing Modal but I need to modify TransactionModal to accept initial props.
    // Hack: I will render the existing TransactionModal but controlled by Accounts.tsx state logic?
    // Better: TransactionModal already accepts 'transactionToEdit'. I can't force 'Create New Transfer' easily without props.
    // Recommendation: I will update TransactionModal in a separate file edit if needed, OR just render a custom simple modal here.
    // Let's render the REAL TransactionModal. I need to modify TransactionModal.tsx first to accept `initialType` and `initialAccountId`.
    
    // Since I cannot modify TransactionModal.tsx in this XML block (limit), I will assume I'll modify it in the next block or use a workaround.
    // WORKAROUND: I will render the `TransactionModal` and hope the user selects Transfer manually? No, bad UX.
    // I WILL MODIFY `TransactionModal.tsx` in a separate block. Here I just invoke it.
    
    return <TransactionModal isOpen={isOpen} onClose={onClose} initialType={TransactionType.TRANSFER} initialAccountId={initialAccountId} />;
};