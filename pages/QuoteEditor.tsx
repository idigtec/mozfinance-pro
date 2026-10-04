
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { Quote, QuoteItem, QuoteStatus, Currency, CompanyProfile, InstitutionType } from '../types';
import { Plus, Trash2, Save, Printer, ArrowLeft, Building2, Search, ChevronDown, User, FileDown, Wallet, Check, AlertCircle, Smartphone, Download, FileText, Settings, Factory, X } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const CurrencyInput = ({ value, onChange, disabled, className, placeholder, suffix = ' MT' }: any) => {
    const [isFocused, setIsFocused] = useState(false);
    const safeValue = value || 0;
    
    return (
        <input
            type={isFocused ? "number" : "text"}
            disabled={disabled}
            value={isFocused ? (safeValue === 0 ? '' : safeValue) : (safeValue === 0 ? '' : safeValue.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + suffix)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={e => onChange(parseFloat(e.target.value) || 0)}
            className={className}
            placeholder={placeholder}
        />
    );
};

export const QuoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quotes, customers, companies, accounts, institutions, addQuote, updateQuote, addQuotePayment, products, activeCompanyId } = useFinance();

  // Determine the default company ID for a new quote
  const defaultCompanyId = activeCompanyId === 'all' ? (companies[0]?.id || '') : activeCompanyId;
  const initialCompanyId = id ? (quotes.find(q => q.id === id)?.companyId || defaultCompanyId) : defaultCompanyId;

  // --- Initial State ---
  const initialQuote: Quote = {
    id: '',
    companyId: initialCompanyId,
    number: `COT-${new Date().getFullYear()}/${Math.floor(Math.random() * 10000)}`,
    date: new Date().toISOString().split('T')[0],
    validUntil: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0], // 15 Days Validity Default
    customerId: '',
    status: QuoteStatus.DRAFT,
    items: [],
    subtotal: 0,
    discountType: 'PERCENT',
    discountValue: 0,
    taxRate: 16,
    taxAmount: 0,
    total: 0,
    currency: Currency.MZN,
    notes: 'Válido por 15 dias. Pagamento 50% na adjudicação.',
    payments: [],
    amountPaid: 0
  };

  const [quote, setQuote] = useState<Quote>(initialQuote);
  
  // Fix: Provide a complete CompanyProfile as a fallback to ensure properties like 'id' and 'bankDetails' exist.
  const currentCompany: CompanyProfile = companies.find(c => c.id === quote.companyId) || companies[0] || { id: 'fallback', name: 'Empresa não configurada', nuit: '000', address: '-', city: '-', phone: '-', email: '-', logoUrl: '', bankDetails: '', isDefault: false };

  const [includeTax, setIncludeTax] = useState(true);
  const [totalDiscountSummary, setTotalDiscountSummary] = useState(0);

  // Import Product Modal
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Payment Form State
  const [payAmount, setPayAmount] = useState('');
  const [payAccount, setPayAccount] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [detectedMethod, setDetectedMethod] = useState('');
  const [detectedInst, setDetectedInst] = useState<any>(null);

  // Searchable Customer State
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerList, setShowCustomerList] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isReadOnly = quote.status === QuoteStatus.APPROVED;

  // --- Effects ---

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowCustomerList(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // Load existing quote
  useEffect(() => {
    if (id) {
      const found = quotes.find(q => q.id === id);
      if (found) {
          const itemsWithDiscountType = found.items.map(i => ({
              ...i,
              discountType: i.discountType || 'FIXED'
          }));
          
          setQuote({...found, items: itemsWithDiscountType});
          setIncludeTax(found.taxAmount > 0);
          const c = customers.find(cust => cust.id === found.customerId);
          if (c) setCustomerSearch(c.name);
          
          const remaining = found.total - (found.amountPaid || 0);
          if (remaining > 0) setPayAmount(remaining.toString());
      }
    }
  }, [id, quotes, customers]);

  // Detect Payment Method
  useEffect(() => {
      if (payAccount) {
          const acc = accounts.find(a => a.id === payAccount);
          const inst = institutions.find(i => i.id === acc?.institutionId);
          setDetectedInst(inst);
          if (inst) {
            if (inst.code === 'MPESA') setDetectedMethod('M-Pesa');
            else if (inst.code === 'EMOLA') setDetectedMethod('e-Mola');
            else if (inst.type === InstitutionType.BANK) setDetectedMethod('Banco');
            else setDetectedMethod(inst.name);
          }
      } else {
          setDetectedInst(null);
          setDetectedMethod('');
      }
  }, [payAccount, accounts, institutions]);

  // --- Calculation Logic ---
  useEffect(() => {
    let accumulatedItemDiscount = 0;

    const subtotal = quote.items.reduce((acc, item) => {
        let discountPerUnitAmount = 0;
        if (item.discountType === 'PERCENT') {
            discountPerUnitAmount = item.unitPrice * (item.discount / 100);
        } else {
            // FIXED discount is applied per unit as requested: "for every 100 currency... discounted by that amount"
            discountPerUnitAmount = item.discount;
        }

        accumulatedItemDiscount += (discountPerUnitAmount * item.quantity);
        const effectivePrice = Math.max(0, item.unitPrice - discountPerUnitAmount);
        const lineTotal = item.quantity * effectivePrice;
        return acc + lineTotal;
    }, 0);
    
    let globalDiscountAmount = 0;
    if (quote.discountType === 'PERCENT') {
        globalDiscountAmount = subtotal * (quote.discountValue / 100);
    } else {
        globalDiscountAmount = quote.discountValue;
    }

    const taxable = Math.max(0, subtotal - globalDiscountAmount);
    const tax = includeTax ? taxable * (quote.taxRate / 100) : 0;
    const total = taxable + tax;

    setTotalDiscountSummary(accumulatedItemDiscount + globalDiscountAmount);

    setQuote(prev => ({ ...prev, subtotal, taxAmount: tax, total }));
    
    if (!payAmount && id) {
       setPayAmount((total - (quote.amountPaid || 0)).toString());
    }
  }, [quote.items, quote.discountType, quote.discountValue, quote.taxRate, includeTax]);

  // --- Handlers ---

  const handleItemChange = (index: number, field: keyof QuoteItem, value: any) => {
      const newItems = [...quote.items];
      let item = { ...newItems[index] };
      
      if (field === 'total') {
          const totalVal = parseFloat(value) || 0;
          const qty = item.quantity || 1;
          
          if (item.discountType === 'PERCENT') {
              const factor = 1 - (item.discount / 100);
              if (factor > 0) {
                  item.unitPrice = totalVal / (qty * factor);
              } else {
                  item.unitPrice = totalVal / qty;
                  item.discount = 0; // Reset discount if it was 100% to avoid division by zero
              }
          } else {
              item.unitPrice = (totalVal / qty) + item.discount;
          }
          item.total = totalVal;
      } else {
          item = { ...item, [field]: value };
          let discountAmount = 0;
          if (item.discountType === 'PERCENT') {
              discountAmount = item.unitPrice * (item.discount / 100);
          } else {
              // If FIXED, the discount input IS the discount per unit amount
              discountAmount = item.discount;
          }
          
          const effectivePrice = Math.max(0, item.unitPrice - discountAmount);
          item.total = item.quantity * effectivePrice;
      }

      newItems[index] = item;
      setQuote({ ...quote, items: newItems });
  };

  const addItem = () => {
      setQuote({
          ...quote,
          items: [...quote.items, { 
              id: Date.now().toString(), description: '', quantity: 1, unit: 'un', unitPrice: 0, 
              discount: 0, discountType: 'FIXED', total: 0 
          }]
      });
  };

  const importProduct = (prod: any) => {
      setQuote({
          ...quote,
          items: [...quote.items, { 
              id: Date.now().toString(), 
              description: prod.name, 
              quantity: 1, 
              unit: prod.unit || 'un',
              unitPrice: prod.salePrice, 
              discount: 0, 
              discountType: 'FIXED', 
              total: prod.salePrice 
          }]
      });
      setIsImportModalOpen(false);
  };

  const removeItem = (index: number) => {
      setQuote({ ...quote, items: quote.items.filter((_, i) => i !== index) });
  };

  const handleSave = () => {
      if (!quote.customerId) return alert("Selecione um cliente.");
      if (!quote.companyId) return alert("Selecione a empresa emissora.");
      if (id) updateQuote(quote);
      else addQuote(quote);
      navigate('/quotes');
  };

  const exportWord = () => {
    const element = document.getElementById('quote-print-content');
    if (!element) return;
    
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Remove hidden elements
    const hiddenElements = clone.querySelectorAll('.print\\:hidden');
    hiddenElements.forEach(el => el.parentNode?.removeChild(el));

    // Convert inputs and textareas to text
    const inputs = clone.querySelectorAll('input, textarea, select');
    inputs.forEach((input: any) => {
        let value = input.value;
        if (input.tagName === 'SELECT') {
            value = input.options[input.selectedIndex]?.text || '';
        } else if (input.type === 'checkbox') {
            value = input.checked ? '[X]' : '[ ]';
        }
        const textNode = document.createTextNode(value);
        input.parentNode?.replaceChild(textNode, input);
    });

    const styles = `
      <style>
        body { font-family: Arial, sans-serif; color: #000; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #0f172a; color: #fff; text-align: left; padding: 8px; font-size: 12px; text-transform: uppercase; border: 1px solid #0f172a; }
        td { padding: 8px; border-bottom: 1px solid #ddd; font-size: 14px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .text-red-600 { color: #dc2626; }
        .text-emerald-700 { color: #047857; }
        .bg-slate-900 { background-color: #0f172a; color: #fff; }
        .bg-gray-50 { background-color: #f9fafb; }
      </style>
    `;

    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Cotação</title>${styles}</head><body>`;
    const footer = "</body></html>";
    const sourceHTML = header + clone.innerHTML + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = source;
    link.download = `COTACAO_${quote.number.replace(/\//g, '-')}.doc`;
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const element = document.getElementById('quote-print-content');
    if (!element) return;
    
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Remove hidden elements
    const hiddenElements = clone.querySelectorAll('.print\\:hidden');
    hiddenElements.forEach(el => el.parentNode?.removeChild(el));

    // Convert inputs and textareas to text
    const inputs = clone.querySelectorAll('input, textarea, select');
    inputs.forEach((input: any) => {
        let value = input.value;
        if (input.tagName === 'SELECT') {
            value = input.options[input.selectedIndex]?.text || '';
        } else if (input.type === 'checkbox') {
            value = input.checked ? '[X]' : '[ ]';
        }
        const textNode = document.createTextNode(value);
        input.parentNode?.replaceChild(textNode, input);
    });

    const styles = `
      <style>
        body { font-family: Arial, sans-serif; color: #000; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #0f172a; color: #fff; text-align: left; padding: 8px; font-size: 12px; text-transform: uppercase; border: 1px solid #0f172a; }
        td { padding: 8px; border-bottom: 1px solid #ddd; font-size: 14px; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .text-red-600 { color: #dc2626; }
        .text-emerald-700 { color: #047857; }
        .bg-slate-900 { background-color: #0f172a; color: #fff; }
        .bg-gray-50 { background-color: #f9fafb; }
      </style>
    `;

    const header = `<html xmlns:x='urn:schemas-microsoft-com:office:excel'><head><meta charset='utf-8'><title>Cotação</title>${styles}</head><body>`;
    const footer = "</body></html>";
    const sourceHTML = header + clone.innerHTML + footer;
    
    const source = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = source;
    link.download = `COTACAO_${quote.number.replace(/\//g, '-')}.xls`;
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('quote-print-content');
    if (!element) return;

    // Temporarily remove print:hidden elements for PDF generation
    const hiddenElements = element.querySelectorAll('.print\\:hidden');
    hiddenElements.forEach((el: any) => {
      el.style.display = 'none';
    });

    // Convert inputs to text for PDF
    const inputs = element.querySelectorAll('input, textarea, select');
    const originalValues = new Map();
    
    inputs.forEach((input: any) => {
      originalValues.set(input, {
        parent: input.parentNode,
        nextSibling: input.nextSibling,
        display: input.style.display
      });
      
      let value = input.value;
      if (input.tagName === 'SELECT') {
          value = input.options[input.selectedIndex]?.text || '';
      } else if (input.type === 'checkbox') {
          value = input.checked ? '[X]' : '[ ]';
      }
      
      const textNode = document.createElement('span');
      textNode.className = input.className + ' pdf-text-node inline-block';
      textNode.textContent = value;
      
      input.style.display = 'none';
      input.parentNode?.insertBefore(textNode, input);
    });

    const opt = {
      margin:       0,
      filename:     `COTACAO_${quote.number.replace(/\//g, '-')}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 1024 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Restore original DOM
      hiddenElements.forEach((el: any) => {
        el.style.display = '';
      });
      
      const textNodes = element.querySelectorAll('.pdf-text-node');
      textNodes.forEach(node => node.remove());
      
      inputs.forEach((input: any) => {
        input.style.display = originalValues.get(input).display;
      });
    });
  };

  const handleQuickPayment = () => {
      if (!id || !payAccount) return;
      const amount = parseFloat(payAmount);
      if (amount <= 0) return;
      addQuotePayment(id, { amount, date: new Date(payDate).toISOString(), method: detectedMethod || 'Outro' }, payAccount);
      setPayAmount(''); 
  };

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()));
  const remainingBalance = quote.total - (quote.amountPaid || 0);
  const progressPercent = quote.total > 0 ? ((quote.amountPaid || 0) / quote.total) * 100 : 0;
  const hasPayments = (quote.amountPaid || 0) > 0;

  // Filter products by company
  const availableProducts = products.filter(p => !p.companyId || p.companyId === quote.companyId || p.companyId === 'default');

  const hasItemDiscounts = quote.items.some(item => item.discount > 0);
  const totalGross = quote.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const taxable = quote.total - quote.taxAmount;

  return (
    <div className="pb-20 bg-gray-100 min-h-screen">
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 p-4 mb-6 print:hidden">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                  <button onClick={() => navigate('/quotes')} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><ArrowLeft className="h-5 w-5" /></button>
                  <h1 className="font-bold text-gray-800 text-lg">Editor de Cotação</h1>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                  {activeCompanyId === 'all' && (
                      <div className="flex items-center bg-gray-100 rounded-lg p-1 mr-2">
                          <span className="text-xs font-bold text-gray-500 px-2 uppercase">Empresa:</span>
                          <select disabled={isReadOnly} value={quote.companyId} onChange={e => setQuote({...quote, companyId: e.target.value})} className="bg-transparent border-none text-sm font-bold text-gray-900 focus:ring-0 cursor-pointer py-1 disabled:opacity-50">
                              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                      </div>
                  )}
                  <div className="flex items-center gap-1">
                    <button onClick={exportWord} className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 shadow-sm font-bold text-sm"><FileDown className="h-4 w-4" /> <span className="hidden sm:inline">Word</span></button>
                    <button onClick={exportExcel} className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 shadow-sm font-bold text-sm"><FileDown className="h-4 w-4" /> <span className="hidden sm:inline">Excel</span></button>
                    <button onClick={handleDownloadPDF} className="flex items-center gap-2 px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 shadow-sm font-bold text-sm"><FileText className="h-4 w-4" /> <span className="hidden sm:inline">PDF</span></button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 shadow-sm font-bold text-sm"><Printer className="h-4 w-4" /> <span className="hidden sm:inline">Imprimir</span></button>
                    <button onClick={handleSave} disabled={isReadOnly} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"><Save className="h-4 w-4" /> <span className="hidden sm:inline">Salvar</span></button>
                  </div>
              </div>
          </div>
      </div>

      {isReadOnly && (
          <div className="max-w-5xl mx-auto px-4 md:px-8 mb-6 print:hidden">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                      <h3 className="text-orange-800 font-bold text-sm">Cotação Aprovada - Acesso Restrito</h3>
                      <p className="text-orange-700 text-xs mt-1">Esta cotação já foi aprovada e não pode ser alterada.</p>
                  </div>
              </div>
          </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 justify-center px-4 md:px-8 print:px-0">
          <div id="quote-print-content" className="w-full max-w-[210mm] bg-white shadow-2xl print:shadow-none print:w-full print:m-0 min-h-[297mm] flex flex-col relative sheet-to-print">
             <div className="p-[10mm] md:p-[15mm] h-full flex flex-col flex-1">
                 <header className="flex justify-between items-start mb-8 border-b-2 border-slate-800 pb-4">
                     <div className="flex flex-col w-1/2">
                        {currentCompany.logoUrl ? (
                            <img src={currentCompany.logoUrl} alt="Logo" className="h-16 w-auto object-contain mb-2 self-start" />
                        ) : (
                            <h1 className="text-2xl font-bold text-slate-900 mb-2 uppercase tracking-wider">{currentCompany.name}</h1>
                        )}
                         <div className="text-xs space-y-1 text-gray-900 font-medium">
                             <p>{currentCompany.address}</p>
                             <p>{currentCompany.city}, Moçambique</p>
                             <p>NUIT: {currentCompany.nuit}</p>
                             <p>{currentCompany.phone} | {currentCompany.email}</p>
                         </div>
                     </div>
                     <div className="text-right w-1/2 flex flex-col items-end">
                         <h2 className="text-3xl font-bold text-gray-300 uppercase tracking-widest mb-2">Cotação</h2>
                         <div className="flex items-center justify-end gap-2 mb-1">
                             <span className="text-sm font-bold text-gray-500">Nº:</span>
                             <input disabled={isReadOnly} value={quote.number} onChange={e => setQuote({...quote, number: e.target.value})} className="text-right font-bold text-xl text-black border-none focus:ring-0 w-40 p-0 bg-transparent print:border-none disabled:bg-transparent disabled:opacity-70" />
                         </div>
                         <div className="flex items-center justify-end gap-2">
                             <span className="text-sm text-gray-500 font-medium">Data:</span>
                             <input disabled={isReadOnly} type="date" value={quote.date} onChange={e => setQuote({...quote, date: e.target.value})} className="text-right text-sm font-medium text-black border-none focus:ring-0 p-0 bg-transparent w-auto cursor-pointer disabled:opacity-70" />
                         </div>
                         <div className="flex items-center justify-end gap-2">
                             <span className="text-xs text-red-500 font-bold uppercase">Válido até (15 dias):</span>
                             <input disabled={isReadOnly} type="date" value={quote.validUntil} onChange={e => setQuote({...quote, validUntil: e.target.value})} className="text-right text-xs font-bold text-red-600 border-none focus:ring-0 p-0 bg-transparent w-auto cursor-pointer disabled:opacity-70" />
                         </div>
                     </div>
                 </header>

                 <div className="mb-8 flex flex-col bg-gray-50 p-4 rounded-lg border-l-4 border-slate-800 print:bg-transparent print:p-0 print:border-l-4 print:border-slate-800 print:pl-4">
                     <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">Cliente / Destinatário</span>
                     <div ref={wrapperRef} className="relative w-full">
                         <div className="flex items-center gap-2">
                             <Search className="h-4 w-4 text-gray-400 print:hidden" />
                             <input disabled={isReadOnly} type="text" value={customerSearch} onChange={(e) => { setCustomerSearch(e.target.value); setShowCustomerList(true); if(e.target.value === '') setQuote({...quote, customerId: ''}); }} onFocus={() => setShowCustomerList(true)} placeholder="Clique para selecionar o cliente..." className="w-full bg-transparent border-none text-lg font-bold text-black p-0 focus:ring-0 placeholder-gray-300 disabled:opacity-70" />
                         </div>
                         {showCustomerList && !isReadOnly && (
                             <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded shadow-xl z-50 max-h-48 overflow-y-auto print:hidden">
                                 {filteredCustomers.map(c => (
                                     <div key={c.id} onClick={() => { setQuote({...quote, customerId: c.id}); setCustomerSearch(c.name); setShowCustomerList(false); }} className="p-2 hover:bg-emerald-50 cursor-pointer text-sm font-medium border-b border-gray-50 text-black">
                                         {c.name} <span className="text-xs text-gray-400 ml-2">({c.nuit || 'Sem NUIT'})</span>
                                     </div>
                                 ))}
                                 {filteredCustomers.length === 0 && <div className="p-2 text-xs text-gray-400 cursor-pointer hover:bg-gray-50" onClick={() => navigate('/customers')}>+ Criar novo cliente</div>}
                             </div>
                         )}
                     </div>
                     {quote.customerId && (
                         <div className="text-sm text-black font-medium grid grid-cols-2 gap-x-8 mt-2">
                             <p><span className="text-gray-500 font-normal uppercase text-[10px]">NUIT:</span> {customers.find(c=>c.id===quote.customerId)?.nuit || '-'}</p>
                             <p><span className="text-gray-500 font-normal uppercase text-[10px]">Endereço:</span> {customers.find(c=>c.id===quote.customerId)?.address || '-'}</p>
                         </div>
                     )}
                 </div>

                 <div className="flex-1">
                     <table className="w-full text-sm">
                         <thead>
                             <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-bold">
                                 <th className="py-2 px-2 text-center w-20 rounded-tl-md whitespace-nowrap">Qtd.</th>
                                 <th className="py-2 px-2 text-left w-full">Descrição</th>
                                 <th className="py-2 px-2 text-right w-32 whitespace-nowrap">P. Unitário</th>
                                 <th className="py-2 px-2 text-right w-28 whitespace-nowrap">Desc.</th>
                                 {hasItemDiscounts && <th className="py-2 px-2 text-right w-32 whitespace-nowrap">P. c/ Desc.</th>}
                                 <th className="py-2 px-2 text-right w-32 rounded-tr-md whitespace-nowrap">Total</th>
                                 <th className="w-8 print:hidden"></th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-300">
                             {quote.items.map((item, index) => {
                                 const discountAmount = item.discountType === 'PERCENT' ? item.unitPrice * (item.discount / 100) : item.discount;
                                 const effectivePrice = Math.max(0, item.unitPrice - discountAmount);
                                 const displayEffectivePrice = discountAmount > 0 ? effectivePrice : 0;
                                 return (
                                 <tr key={item.id} className="group hover:bg-gray-50 print:hover:bg-transparent">
                                     <td className="p-1 align-top whitespace-nowrap">
                                          {!isReadOnly ? (
                                              <div className="flex flex-col items-center">
                                                  <input 
                                                      disabled={isReadOnly} 
                                                      type="number" 
                                                      value={item.quantity === 0 ? '' : item.quantity} 
                                                      onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} 
                                                      className="w-full text-center bg-transparent border-none focus:ring-0 p-1 text-black font-medium disabled:opacity-70" 
                                                  />
                                                  <div className="flex items-center justify-center gap-1 print:hidden">
                                                      <select
                                                          disabled={isReadOnly}
                                                          value={item.unit || 'un'}
                                                          onChange={e => handleItemChange(index, 'unit', e.target.value)}
                                                          className="bg-transparent border-none text-[9px] text-gray-500 font-bold p-0 focus:ring-0 cursor-pointer uppercase text-center w-auto"
                                                      >
                                                          <option value="un">un</option>
                                                          <option value="m">metros</option>
                                                          <option value="m²">m²</option>
                                                          <option value="kg">kg</option>
                                                          <option value="l">litros</option>
                                                          <option value="cx">caixa</option>
                                                          <option value="rolo">rolo</option>
                                                          <option value="serviço">serviço</option>
                                                          <option value="custom">Outro...</option>
                                                      </select>
                                                  </div>
                                                  {item.unit === 'custom' && (
                                                      <input
                                                          type="text"
                                                          value={item.customUnit || ''}
                                                          onChange={e => handleItemChange(index, 'customUnit', e.target.value)}
                                                          placeholder="Unid."
                                                          className="w-12 text-center bg-transparent border-b border-gray-300 text-[9px] p-0 focus:ring-0 text-gray-600 font-bold uppercase print:hidden mt-0.5"
                                                      />
                                                  )}
                                                  <span className="hidden print:inline text-[9px] text-gray-500 font-bold uppercase">
                                                      {item.unit === 'custom' ? (item.customUnit || '') : item.unit || 'un'}
                                                  </span>
                                              </div>
                                          ) : (
                                              <div className="text-center p-1">
                                                  <span className="text-black font-medium block">{item.quantity}</span>
                                                  <span className="text-[9px] text-gray-500 font-bold uppercase block">
                                                      {item.unit === 'custom' ? (item.customUnit || '') : item.unit || 'un'}
                                                  </span>
                                              </div>
                                          )}
                                      </td>
                                     <td className="p-1 align-top"><textarea disabled={isReadOnly} rows={1} value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} onInput={(e) => { e.currentTarget.style.height = 'auto'; e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px'; }} ref={(el) => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }} placeholder="Descreva o serviço ou produto..." className="w-full bg-transparent border-none focus:ring-0 p-1 resize-none overflow-hidden print:border-none font-medium text-black disabled:opacity-70 disabled:resize-none" style={{ minHeight: '2rem' }} /></td>
                                     <td className="p-1 align-top whitespace-nowrap"><CurrencyInput disabled={isReadOnly} value={item.unitPrice} onChange={(val: number) => handleItemChange(index, 'unitPrice', val)} className="w-full text-right bg-transparent border-none focus:ring-0 p-1 print:border-none text-black font-medium disabled:opacity-70 whitespace-nowrap" placeholder="0.000 MT" /></td>
                                     <td className="p-1 align-top whitespace-nowrap">
                                         <div className="flex items-center justify-end">
                                             <CurrencyInput disabled={isReadOnly} value={item.discount} onChange={(val: number) => handleItemChange(index, 'discount', val)} className="w-full text-right bg-transparent border-none focus:ring-0 p-1 text-red-600 print:border-none font-medium text-sm disabled:opacity-70 whitespace-nowrap" placeholder={item.discountType === 'PERCENT' ? "0.00 %" : "0.000 MT"} suffix={item.discountType === 'PERCENT' ? ' %' : ' MT'} />
                                             {!isReadOnly && (
                                                 <select
                                                     value={item.discountType}
                                                     onChange={e => handleItemChange(index, 'discountType', e.target.value)}
                                                     className="bg-transparent border-none text-xs text-gray-400 p-0 focus:ring-0 cursor-pointer print:hidden ml-1"
                                                 >
                                                     <option value="FIXED">MT</option>
                                                     <option value="PERCENT">%</option>
                                                 </select>
                                             )}
                                         </div>
                                     </td>
                                     {hasItemDiscounts && <td className="p-2 text-right font-bold align-top text-emerald-700 whitespace-nowrap">{displayEffectivePrice.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</td>}
                                     <td className="p-1 align-top whitespace-nowrap">
                                         <CurrencyInput 
                                             disabled={isReadOnly} 
                                             value={item.total} 
                                             onChange={(val: number) => handleItemChange(index, 'total', val)} 
                                             className="w-full text-right bg-transparent border-none focus:ring-0 p-1 print:border-none text-black font-bold disabled:opacity-70 whitespace-nowrap" 
                                             placeholder="0.00 MT" 
                                         />
                                     </td>
                                     <td className="p-1 text-center align-top print:hidden">{!isReadOnly && <button onClick={() => removeItem(index)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><Trash2 className="h-4 w-4" /></button>}</td>
                                 </tr>
                                 );
                             })}
                         </tbody>
                     </table>
                     {!isReadOnly && (
                         <div className="flex items-center gap-2 mt-4 print:hidden">
                            <button onClick={addItem} className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition"><Plus className="h-4 w-4" /> Adicionar Item Manual</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition"><Factory className="h-4 w-4" /> Importar Produto Acabado</button>
                         </div>
                     )}
                 </div>

                 <div className="flex justify-end mt-6 mb-12 page-break-inside-avoid">
                     <div className="w-64 space-y-2 text-sm">
                         {hasItemDiscounts ? (
                             <div className="flex justify-between text-gray-700 border-b border-gray-200 pb-1 font-medium"><span>Total Bruto</span><span className="text-black font-bold">{totalGross.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</span></div>
                         ) : (
                             <div className="flex justify-between text-gray-700 border-b border-gray-200 pb-1 font-medium"><span>Subtotal</span><span className="text-black font-bold">{quote.subtotal.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</span></div>
                         )}
                         <div className="flex justify-between text-gray-700 border-b border-gray-200 pb-1 items-center">
                             <div className="flex items-center gap-1">
                                 <span className="text-[10px] font-bold uppercase text-gray-400">Desc. Global</span>
                                 {!isReadOnly && (
                                     <select
                                         value={quote.discountType}
                                         onChange={e => setQuote({...quote, discountType: e.target.value as 'FIXED' | 'PERCENT'})}
                                         className="bg-transparent border-none text-[10px] font-bold text-gray-400 p-0 focus:ring-0 cursor-pointer print:hidden"
                                     >
                                         <option value="FIXED">(MT)</option>
                                         <option value="PERCENT">(%)</option>
                                     </select>
                                 )}
                                 <span className="hidden print:inline text-[10px] font-bold text-gray-400">
                                     ({quote.discountType === 'PERCENT' ? '%' : 'MT'})
                                 </span>
                             </div>
                             <CurrencyInput disabled={isReadOnly} value={quote.discountValue} onChange={(val: number) => setQuote({...quote, discountValue: val})} className="w-24 text-right text-sm border-none bg-gray-50 focus:ring-0 p-0 print:bg-transparent text-black font-bold disabled:opacity-70" placeholder={quote.discountType === 'PERCENT' ? "0.00 %" : "0.000 MT"} suffix={quote.discountType === 'PERCENT' ? ' %' : ' MT'} />
                         </div>
                         {hasItemDiscounts && (
                             <>
                                 <div className="flex justify-between text-gray-700 border-b border-gray-200 pb-1 font-medium">
                                     <span className="text-[10px] font-bold uppercase text-gray-400">Desconto Total</span>
                                     <span className="text-red-600 font-bold">-{totalDiscountSummary.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</span>
                                 </div>
                                 <div className="flex justify-between text-gray-700 border-b border-gray-200 pb-1 font-medium"><span>Subtotal</span><span className="text-black font-bold">{taxable.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</span></div>
                             </>
                         )}
                         <div className="flex justify-between text-gray-700 border-b border-gray-200 pb-1 items-center"><span className="flex items-center gap-1 font-medium"><input disabled={isReadOnly} type="checkbox" checked={includeTax} onChange={e => setIncludeTax(e.target.checked)} className="w-3 h-3 rounded text-emerald-600 focus:ring-0 print:hidden disabled:opacity-70" />IVA ({quote.taxRate}%)</span><span className="text-black font-bold">{quote.taxAmount.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</span></div>
                         <div className="flex justify-between font-black text-xl text-slate-900 pt-2 border-t-2 border-slate-800"><span>TOTAL</span><span>{quote.total.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</span></div>
                         {(quote.amountPaid || 0) > 0 && (<><div className="flex justify-between text-green-800 font-bold border-b border-gray-200 py-1 uppercase text-[10px]"><span>Total Pago</span><span>{(quote.amountPaid || 0).toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</span></div><div className="flex justify-between font-black text-xl text-red-700 pt-2"><span>SALDO</span><span>{(quote.total - (quote.amountPaid || 0)).toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</span></div></>)}
                     </div>
                 </div>

                 <div className="mt-auto pt-6 border-t border-gray-300 text-[10px] text-gray-700 grid grid-cols-2 gap-8 page-break-inside-avoid">
                     <div><h4 className="font-bold text-slate-900 mb-1 text-xs uppercase tracking-wider">Termos e Condições</h4><textarea disabled={isReadOnly} rows={4} value={quote.notes} onChange={e => setQuote({...quote, notes: e.target.value})} className="w-full bg-transparent border-none resize-none p-0 focus:ring-0 text-[10px] text-black leading-relaxed disabled:opacity-70" /></div>
                     <div><h4 className="font-bold text-slate-900 mb-1 text-xs uppercase tracking-wider">Dados Bancários</h4><p className="whitespace-pre-wrap font-mono font-medium text-black leading-relaxed">{currentCompany.bankDetails}</p></div>
                 </div>
                 
                 <div className="mt-12 grid grid-cols-2 gap-12 pt-12 page-break-inside-avoid">
                     <div className="border-t border-gray-400 text-center text-[10px] pt-2"><p className="font-bold text-black uppercase">{currentCompany.name}</p><p className="text-gray-500">(Assinatura & Carimbo)</p></div>
                     <div className="border-t border-gray-400 text-center text-[10px] pt-2"><p className="font-bold text-black uppercase">O Cliente</p><p className="text-gray-500">(Confirmação de Aceitação)</p></div>
                 </div>
             </div>
          </div>

          {id && (
              <div className="w-full lg:w-80 space-y-6 print:hidden">
                  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Settings className="h-4 w-4" /> Gestão da Proposta</h3>
                      <div className="mb-4"><label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Estado da Cotação</label>{hasPayments && (<div className="flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 p-1.5 rounded mb-1 font-bold"><AlertCircle className="h-3 w-3" /> Estado gerido por pagamentos</div>)}<select value={quote.status} onChange={e => setQuote({...quote, status: e.target.value as QuoteStatus})} disabled={hasPayments} className={`w-full border-gray-300 rounded-lg text-sm font-bold ${hasPayments ? 'bg-gray-100 cursor-not-allowed opacity-70' : 'bg-white'}`}>{Object.values(QuoteStatus).map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                      <div className="border-t border-gray-200 pt-4"><div className="flex justify-between text-sm mb-1 font-bold"><span className="text-gray-600 uppercase text-[10px]">Progresso de Pagamento</span><span className="text-emerald-700">{progressPercent.toFixed(0)}%</span></div><div className="w-full bg-gray-200 rounded-full h-2 mb-2"><div className={`h-2 rounded-full transition-all duration-500 ${progressPercent >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{width: `${progressPercent}%`}}></div></div><div className="flex justify-between text-xs font-bold mb-4"><span className="text-green-700">Pago: {(quote.amountPaid || 0).toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</span><span className="text-red-600">Saldo: {remainingBalance.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</span></div>{remainingBalance > 1 ? (<div className={`p-4 rounded-xl border transition-all ${detectedInst ? '' : 'bg-emerald-50 border-emerald-100'}`} style={{ backgroundColor: detectedInst?.logoColor ? `${detectedInst.logoColor}10` : undefined, borderColor: detectedInst?.logoColor }}><p className="text-xs font-bold text-emerald-800 mb-3 flex items-center gap-2" style={{ color: detectedInst?.logoColor }}>{detectedInst ? (<>{detectedInst.type === InstitutionType.MOBILE_MONEY ? <Smartphone className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}<span>Receber via {detectedMethod}</span></>) : (<><Wallet className="h-4 w-4" /> <span>Registar Pagamento</span></>)}</p><div className="space-y-3"><div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Valor a Receber</label><input type="number" placeholder="0.00 MT" value={payAmount} onChange={e => setPayAmount(e.target.value)} className="w-full text-sm border-gray-200 rounded-lg p-2 font-bold focus:ring-emerald-500" max={remainingBalance} /></div><div><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Conta de Destino</label><select value={payAccount} onChange={e => setPayAccount(e.target.value)} className="w-full text-xs border-gray-200 rounded-lg p-2 cursor-pointer font-medium"><option value="">Selecione a conta...</option>{accounts.map(acc => { const inst = institutions.find(i => i.id === acc.institutionId); return (<option key={acc.id} value={acc.id}>{inst?.name} - {acc.name}</option>); })}</select></div><button onClick={handleQuickPayment} disabled={!payAccount || !payAmount} className="w-full bg-emerald-600 text-white text-xs font-bold py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95" style={{ backgroundColor: detectedInst?.logoColor }}><Check className="h-4 w-4" /> CONFIRMAR RECEBIMENTO</button></div></div>) : (<div className="mt-4 p-4 bg-green-100 text-green-800 text-sm font-bold rounded-xl text-center border border-green-200 animate-in zoom-in-95"><Check className="h-6 w-6 mx-auto mb-2" />PROPOSTA TOTALMENTE PAGA</div>)}</div>
                  </div>
              </div>
          )}
      </div>

      {/* Modal Importar Produto */}
      {isImportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setIsImportModalOpen(false)}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-gray-900">Importar do Stock ({currentCompany.name})</h3>
                      <button onClick={() => setIsImportModalOpen(false)}><X className="h-5 w-5 text-gray-500" /></button>
                  </div>
                  <div className="p-4 max-h-[60vh] overflow-y-auto">
                      {availableProducts.length === 0 ? (
                          <div className="text-center py-8 text-gray-400">Nenhum produto encontrado para esta empresa.</div>
                      ) : (
                          <div className="space-y-2">
                              {availableProducts.map(p => (
                                  <div key={p.id} onClick={() => importProduct(p)} className="flex justify-between items-center p-3 border rounded-xl hover:bg-blue-50 hover:border-blue-200 cursor-pointer group transition">
                                      <div>
                                          <p className="font-bold text-gray-900">{p.name}</p>
                                          <p className="text-xs text-gray-500">{p.category}</p>
                                      </div>
                                      <div className="text-right">
                                          <p className="font-black text-emerald-600">{p.salePrice.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</p>
                                          <p className="text-[10px] text-blue-600 opacity-0 group-hover:opacity-100 transition font-bold">+ Adicionar</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
                  <div className="p-4 bg-gray-50 border-t text-center">
                      <button onClick={() => navigate('/production')} className="text-sm font-bold text-blue-600 hover:underline">Gerenciar Produtos na Produção</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
