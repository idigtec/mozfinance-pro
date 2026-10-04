
import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Product } from '../types';
import { Search, ShoppingBag, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, CheckCircle2 } from 'lucide-react';

export const POS = () => {
  const { products, addSale, accounts } = useFinance();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<{product: Product, qty: number}[]>([]);
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]?.id || '');
  const [showReceipt, setShowReceipt] = useState(false);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const addToCart = (product: Product) => {
      if((product.currentStock || 0) <= 0) return alert("Produto sem stock!");
      setCart(prev => {
          const existing = prev.find(i => i.product.id === product.id);
          if(existing) {
              if(existing.qty >= (product.currentStock || 0)) return prev;
              return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
          }
          return [...prev, { product, qty: 1 }];
      });
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.product.id !== id));
  
  const updateQty = (id: string, delta: number) => {
      setCart(prev => prev.map(i => {
          if(i.product.id === id) {
              const newQty = i.qty + delta;
              if(newQty > (i.product.currentStock || 0)) return i; 
              if(newQty < 1) return i;
              return { ...i, qty: newQty };
          }
          return i;
      }));
  };

  const total = cart.reduce((acc, item) => acc + (item.product.salePrice * item.qty), 0);

  const handleCheckout = () => {
      if(cart.length === 0) return;
      if(!selectedAccount) return alert("Selecione uma conta para receber o valor.");

      const result = addSale({
          companyId: cart[0].product.companyId || 'default',
          customerName: 'Cliente Balcão',
          date: new Date().toISOString(),
          paymentMethod: 'POS', 
          status: 'COMPLETED',
          total: total,
          items: cart.map(i => ({
              productId: i.product.id,
              productName: i.product.name,
              quantity: i.qty,
              unitPrice: i.product.salePrice,
              total: i.product.salePrice * i.qty
          }))
      }, selectedAccount);

      if(result.success) {
          setShowReceipt(true);
          setCart([]);
      } else {
          alert(result.message);
      }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-4 pb-20">
        {/* Product Grid */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col">
            <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                        placeholder="Buscar produto..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto pr-2">
                {filteredProducts.map(p => (
                    <div 
                        key={p.id} 
                        onClick={() => addToCart(p)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md flex flex-col justify-between h-32 ${
                            (p.currentStock||0) > 0 ? 'bg-white border-gray-200 hover:border-emerald-400' : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                        }`}
                    >
                        <div>
                            <h4 className="font-bold text-gray-900 text-sm line-clamp-2">{p.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">Stock: {p.currentStock || 0}</p>
                        </div>
                        <p className="font-black text-emerald-600 text-lg">{p.salePrice.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Cart */}
        <div className="w-full lg:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                <h3 className="font-bold flex items-center gap-2"><ShoppingBag className="h-5 w-5"/> Carrinho</h3>
                <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold">{cart.length} itens</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <div className="flex-1">
                            <p className="font-bold text-sm text-gray-900 line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-gray-500">{item.product.salePrice.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} x {item.qty}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={()=>updateQty(item.product.id, -1)} className="p-1 bg-white border rounded"><Minus className="h-3 w-3"/></button>
                            <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                            <button onClick={()=>updateQty(item.product.id, 1)} className="p-1 bg-white border rounded"><Plus className="h-3 w-3"/></button>
                        </div>
                        <p className="font-bold text-sm">{(item.product.salePrice * item.qty).toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <button onClick={()=>removeFromCart(item.product.id)} className="text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4"/></button>
                    </div>
                ))}
                {cart.length === 0 && <div className="text-center text-gray-400 mt-10">Carrinho vazio</div>}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
                <div className="flex justify-between text-lg font-black text-gray-900">
                    <span>TOTAL</span>
                    <span>{total.toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MT</span>
                </div>
                
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Receber em:</label>
                    <select value={selectedAccount} onChange={e=>setSelectedAccount(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm font-bold">
                        {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                </div>

                <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black shadow-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    FINALIZAR VENDA
                </button>
            </div>
        </div>

        {/* Receipt Modal (Simulated) */}
        {showReceipt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={()=>setShowReceipt(false)}>
                <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full animate-in zoom-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Venda Sucesso!</h3>
                    <p className="text-gray-500 mb-6">A transação foi registada e o stock atualizado.</p>
                    <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold">Imprimir Recibo</button>
                </div>
            </div>
        )}
    </div>
  );
};
