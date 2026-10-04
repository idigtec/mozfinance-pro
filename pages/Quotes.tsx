
import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { QuoteStatus, Quote, InstitutionType } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, Copy, Trash2, CheckCircle2, XCircle, Eye, Printer, DollarSign, X, Smartphone, Building2, Wallet, FileDown, Download, AlertTriangle, RotateCcw } from 'lucide-react';

export const Quotes = () => {
  const { quotes, deleteQuote, duplicateQuote, customers, updateQuote, addQuotePayment, accounts, institutions } = useFinance();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedQuoteForPayment, setSelectedQuoteForPayment] = useState<Quote | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentAccount, setPaymentAccount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [detectedInstitution, setDetectedInstitution] = useState<any>(null);

  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || 'Desconhecido';

  const filteredQuotes = quotes.filter(q => {
    const matchesSearch = 
      q.number.toLowerCase().includes(search.toLowerCase()) || 
      getCustomerName(q.customerId).toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || q.status === filterStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Quick Stats
  const totalDraft = quotes.filter(q => q.status === QuoteStatus.DRAFT).length;
  const totalApproved = quotes.filter(q => q.status === QuoteStatus.APPROVED || q.status === QuoteStatus.PARTIAL || q.status === QuoteStatus.PAID).reduce((acc, q) => acc + q.total, 0);

  const statusColors = {
    [QuoteStatus.DRAFT]: 'bg-gray-100 text-gray-600',
    [QuoteStatus.SENT]: 'bg-blue-100 text-blue-600',
    [QuoteStatus.APPROVED]: 'bg-emerald-100 text-emerald-600',
    [QuoteStatus.PARTIAL]: 'bg-purple-100 text-purple-600',
    [QuoteStatus.PAID]: 'bg-green-100 text-green-700',
    [QuoteStatus.REJECTED]: 'bg-red-100 text-red-600',
    [QuoteStatus.EXPIRED]: 'bg-orange-100 text-orange-600',
  };

  // --- Export Functions ---

  const exportQuoteToCSV = (e: React.MouseEvent, quote: Quote) => {
    e.stopPropagation();
    const customer = getCustomerName(quote.customerId);
    const headers = "Descricao,Quantidade,Preco Unitario,Desconto,Tipo Desconto,Total Item\n";
    const rows = quote.items.map(item => {
        return `"${item.description.replace(/"/g, '""')}",${item.quantity},${item.unitPrice},${item.discount},${item.discountType},${item.total}`;
    }).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cotacao_${quote.number.replace(/\//g, '-')}_${customer.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAllToCSV = () => {
    if (filteredQuotes.length === 0) return;
    const headers = "Numero,Data,Cliente,Total,Estado,Valor Pago\n";
    const rows = filteredQuotes.map(q => {
        return `${q.number},${q.date.split('T')[0]},"${getCustomerName(q.customerId)}",${q.total},${q.status},${q.amountPaid || 0}`;
    }).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lista_cotacoes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Auto-detect Method based on Account ---
  useEffect(() => {
    if (paymentAccount) {
        const acc = accounts.find(a => a.id === paymentAccount);
        if (acc) {
            const inst = institutions.find(i => i.id === acc.institutionId);
            setDetectedInstitution(inst);
            
            if (inst) {
                if (inst.code === 'MPESA') setPaymentMethod('M-Pesa (Vodacom)');
                else if (inst.code === 'EMOLA') setPaymentMethod('e-Mola (Movitel)');
                else if (inst.code === 'MKESH') setPaymentMethod('mKesh (Tmcel)');
                else if (inst.type === InstitutionType.BANK) setPaymentMethod('Transferência Bancária');
                else if (inst.type === InstitutionType.CASH) setPaymentMethod('Numerário / Caixa');
                else setPaymentMethod(inst.name);
            }
        }
    } else {
        setDetectedInstitution(null);
        setPaymentMethod('');
    }
  }, [paymentAccount, accounts, institutions]);

  const handleStatusChange = (e: React.MouseEvent, quote: Quote, status: QuoteStatus) => {
      e.stopPropagation();
      
      if (status === QuoteStatus.PAID && (quote.amountPaid || 0) < quote.total) {
          // If manually marking as PAID without full amount, user confirms closure
          if (!confirm("O valor pago é menor que o total. Deseja marcar como Concluída (Paga) mesmo assim?")) {
              openPaymentModal(quote);
              return;
          }
      }

      if ((quote.amountPaid || 0) > 0 && status !== QuoteStatus.PAID && status !== QuoteStatus.PARTIAL) {
          alert("Não é possível alterar o estado manualmente pois já existem pagamentos registados.");
          return;
      }
      
      updateQuote({...quote, status});
  };

  const openPaymentModal = (quote: Quote) => {
      setSelectedQuoteForPayment(quote);
      setPaymentAmount((quote.total - (quote.amountPaid || 0)).toString());
      setPaymentAccount('');
      setDetectedInstitution(null);
      setIsPaymentModalOpen(true);
  };

  const handleRegisterPayment = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedQuoteForPayment || !paymentAmount || !paymentAccount) return;

      addQuotePayment(
          selectedQuoteForPayment.id, 
          {
              date: new Date(paymentDate).toISOString(),
              amount: parseFloat(paymentAmount),
              method: paymentMethod || 'Outro'
          },
          paymentAccount
      );

      setIsPaymentModalOpen(false);
      setSelectedQuoteForPayment(null);
  };

  // Helper to check expiration
  const isExpired = (quote: Quote) => {
      if (quote.status === QuoteStatus.PAID || quote.status === QuoteStatus.APPROVED || quote.status === QuoteStatus.PARTIAL || quote.status === QuoteStatus.REJECTED) return false;
      const validUntil = new Date(quote.validUntil);
      validUntil.setHours(23, 59, 59, 999);
      return new Date() > validUntil;
  };

  const handleReactivateQuote = (e: React.MouseEvent, quote: Quote) => {
      e.stopPropagation();
      const newValidUntil = new Date();
      newValidUntil.setDate(newValidUntil.getDate() + 15); // Add 15 days of validity
      updateQuote({
          ...quote,
          validUntil: newValidUntil.toISOString().split('T')[0]
      });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cotações & Orçamentos</h2>
          <p className="text-gray-500 text-sm">Gerencie propostas comerciais</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={exportAllToCSV}
                className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 font-bold shadow-sm"
            >
                <Download className="h-4 w-4" /> Exportar Lista
            </button>
            <Link to="/quotes/new" className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-sm flex items-center gap-2 font-bold">
            <Plus className="h-4 w-4" /> Nova Cotação
            </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-bold">Rascunhos</p>
              <p className="text-2xl font-bold text-gray-700">{totalDraft}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-bold">Aprovado/Vendido</p>
              <p className="text-2xl font-bold text-emerald-600">{totalApproved.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</p>
          </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
                type="text" 
                placeholder="Pesquisar Nº Cotação ou Cliente..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-gray-50 rounded-lg text-sm focus:ring-emerald-500 font-medium"
            />
        </div>
        <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-300 bg-gray-50 rounded-lg px-4 py-2 text-sm focus:ring-emerald-500 font-bold"
        >
            <option value="ALL">Todos os Estados</option>
            {Object.values(QuoteStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Nº / Data</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Progresso Pagamento</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQuotes.map(quote => {
                  const paidPercent = quote.total > 0 ? ((quote.amountPaid || 0) / quote.total) * 100 : 0;
                  const expired = isExpired(quote);

                  return (
                    <tr key={quote.id} onClick={() => navigate(`/quotes/edit/${quote.id}`)} className={`hover:bg-gray-50 cursor-pointer transition ${expired ? 'bg-red-50/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{quote.number}</div>
                        <div className="text-xs text-gray-500 font-medium">{new Date(quote.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-700">
                        {getCustomerName(quote.customerId)}
                      </td>
                      <td className="px-6 py-4 w-48">
                         <div className="flex justify-between text-[10px] mb-1">
                             <span className="font-bold text-gray-900">{(quote.amountPaid || 0).toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</span>
                             <span className="text-gray-500 font-medium">{quote.total.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</span>
                         </div>
                         <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                             <div className={`h-full ${paidPercent >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{width: `${paidPercent}%`}}></div>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative group/status flex items-center gap-2">
                            {expired ? (
                                <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-100 text-red-600 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" /> Expirada
                                </span>
                            ) : (
                                <span className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${statusColors[quote.status]}`}>
                                    {quote.status}
                                </span>
                            )}
                            
                            <div className="absolute left-0 top-full mt-1 hidden group-hover/status:block bg-white border border-gray-200 shadow-xl rounded-lg z-20 w-40 p-1">
                                {Object.values(QuoteStatus).map(s => (
                                    <div 
                                        key={s} 
                                        onClick={(e) => handleStatusChange(e, quote, s)}
                                        className="px-3 py-2 text-[10px] hover:bg-gray-100 rounded cursor-pointer text-gray-700 font-bold"
                                    >
                                        {s}
                                    </div>
                                ))}
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                            {/* Allow payment registration even for Sent/Draft to trigger auto-approval */}
                            {(quote.status !== QuoteStatus.PAID && quote.status !== QuoteStatus.REJECTED && !expired) && (
                                <button onClick={(e) => { e.stopPropagation(); openPaymentModal(quote); }} className="p-1.5 hover:bg-green-100 text-green-700 rounded border border-green-200" title="Registar Pagamento">
                                    <DollarSign className="h-4 w-4" />
                                </button>
                            )}
                            {expired && (
                                <button onClick={(e) => handleReactivateQuote(e, quote)} className="p-1.5 hover:bg-indigo-100 text-indigo-700 rounded border border-indigo-200 flex items-center justify-center" title="Reativar Cotação Expirada">
                                    <RotateCcw className="h-4 w-4" />
                                </button>
                            )}
                            <button onClick={(e) => exportQuoteToCSV(e, quote)} className="p-1.5 hover:bg-gray-100 text-gray-600 rounded" title="Baixar CSV">
                                <FileDown className="h-4 w-4" />
                            </button>
                             <button onClick={() => navigate(`/quotes/edit/${quote.id}`)} className="p-1.5 hover:bg-slate-800 hover:text-white text-slate-800 rounded border border-slate-200" title="Imprimir PDF">
                                <Printer className="h-4 w-4" />
                            </button>
                            <button onClick={() => { if(confirm('Apagar cotação?')) deleteQuote(quote.id) }} className="p-1.5 hover:bg-red-100 text-red-600 rounded" title="Apagar">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                      </td>
                    </tr>
                  )
              })}
              {filteredQuotes.length === 0 && (
                  <tr><td colSpan={5} className="p-12 text-center text-gray-400 font-medium">Nenhuma cotação encontrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedQuoteForPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setIsPaymentModalOpen(false)}>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                  
                  {/* Modal Header */}
                  <div className={`p-4 border-b flex justify-between items-center ${detectedInstitution ? '' : 'bg-gray-50'}`} 
                       style={{ backgroundColor: detectedInstitution?.logoColor ? `${detectedInstitution.logoColor}15` : undefined }}
                  >
                      <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg text-gray-900">Registar Pagamento</h3>
                          {detectedInstitution && (
                             <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: detectedInstitution.logoColor }}>
                                 {detectedInstitution.name}
                             </span>
                          )}
                      </div>
                      <button onClick={() => setIsPaymentModalOpen(false)}><X className="h-5 w-5 text-gray-500" /></button>
                  </div>

                  <form onSubmit={handleRegisterPayment} className="p-6 space-y-4">
                      
                      {/* Quote Info Summary */}
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-2">
                          <p className="text-sm text-blue-800 font-bold">Cotação: {selectedQuoteForPayment.number}</p>
                          <div className="flex justify-between text-[10px] mt-1">
                              <span className="text-blue-600 font-medium">Total: {selectedQuoteForPayment.total.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</span>
                              <span className="text-blue-600 font-black">Falta: {(selectedQuoteForPayment.total - (selectedQuoteForPayment.amountPaid || 0)).toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</span>
                          </div>
                      </div>

                      {/* Destination Account Selection */}
                      <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Receber em (Conta)</label>
                          <select 
                             required
                             value={paymentAccount}
                             onChange={e => setPaymentAccount(e.target.value)}
                             className="w-full border border-gray-300 rounded-lg p-3 cursor-pointer bg-white text-sm font-medium"
                          >
                              <option value="">Selecione a conta...</option>
                              {accounts.map(acc => {
                                  const inst = institutions.find(i => i.id === acc.institutionId);
                                  return (
                                    <option key={acc.id} value={acc.id}>
                                        {inst?.name} - {acc.name} ({acc.balance.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {acc.currency})
                                    </option>
                                  );
                              })}
                          </select>
                      </div>

                      {/* Auto-detected Method Display */}
                      {paymentAccount && detectedInstitution && (
                         <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50">
                             <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: detectedInstitution.logoColor }}>
                                 {detectedInstitution.type === InstitutionType.MOBILE_MONEY ? <Smartphone className="h-5 w-5" /> : 
                                  detectedInstitution.type === InstitutionType.CASH ? <Wallet className="h-5 w-5" /> : 
                                  <Building2 className="h-5 w-5" />}
                             </div>
                             <div>
                                 <p className="text-[10px] text-gray-500 font-bold uppercase">Método Detetado</p>
                                 <p className="text-sm font-bold text-gray-900">{paymentMethod}</p>
                             </div>
                         </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Valor (MT)</label>
                            <input 
                                type="number" 
                                required
                                step="0.01"
                                value={paymentAmount}
                                onChange={e => setPaymentAmount(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 font-bold text-lg text-emerald-700 focus:ring-emerald-500"
                                max={selectedQuoteForPayment.total - (selectedQuoteForPayment.amountPaid || 0)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Data</label>
                            <input 
                                type="date" 
                                required
                                value={paymentDate}
                                onChange={e => setPaymentDate(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm font-medium"
                            />
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={!paymentAccount}
                        className={`w-full text-white py-3 rounded-lg font-bold shadow-lg mt-2 flex items-center justify-center gap-2 transition-all ${
                            !paymentAccount ? 'bg-gray-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                          <CheckCircle2 className="h-5 w-5" />
                          Confirmar Recebimento
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
