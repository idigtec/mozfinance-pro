
import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Employee, Payroll } from '../types';
import { Plus, User, FileText, DollarSign, Wallet, Calendar, CheckCircle2, X, ArrowRight, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HR = () => {
  const { employees, payrolls, addEmployee, updateEmployee, processPayroll, accounts } = useFinance();
  const [activeTab, setActiveTab] = useState<'EMPLOYEES' | 'PAYROLL'>('EMPLOYEES');
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  
  // Payroll State
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [payAccount, setPayAccount] = useState('');

  // --- Employee Form ---
  const [empForm, setEmpForm] = useState<Partial<Employee>>({
      name: '', position: '', baseSalary: 0, dependents: 0, status: 'ACTIVE', companyId: 'default'
  });

  // --- Payroll Logic (Mozambique Simplified) ---
  const calculatePayroll = (emp: Employee) => {
      const gross = emp.baseSalary;
      const inssEmp = gross * 0.03; // 3% Employee
      const inssComp = gross * 0.04; // 4% Employer
      
      // IRPS Simplified (Demo - Real needs huge table)
      let irps = 0;
      const taxable = gross - inssEmp;
      if (taxable > 20000) irps = (taxable - 20000) * 0.10; 
      if (taxable > 60000) irps = (taxable - 60000) * 0.20 + 4000;

      const net = gross - inssEmp - irps;
      
      return {
          gross,
          inssEmp,
          inssComp,
          irps,
          net,
          totalCompany: gross + inssComp
      };
  };

  const handleSaveEmployee = (e: React.FormEvent) => {
      e.preventDefault();
      if(editingEmp) {
          updateEmployee({ ...editingEmp, ...empForm } as Employee);
      } else {
          addEmployee({ ...empForm, admissionDate: new Date().toISOString() } as any);
      }
      setIsEmpModalOpen(false);
  };

  const handleProcessPayroll = (emp: Employee) => {
      if(!payAccount) {
          alert("Selecione uma conta para pagamento.");
          return;
      }
      const calc = calculatePayroll(emp);
      
      processPayroll({
          employeeId: emp.id,
          employeeName: emp.name,
          month: selectedMonth,
          baseSalary: emp.baseSalary,
          bonus: 0,
          overtime: 0,
          inssEmployee: calc.inssEmp,
          irps: calc.irps,
          advances: 0,
          netSalary: calc.net,
          inssEmployer: calc.inssComp,
          totalCompanyCost: calc.totalCompany
      }, payAccount);
  };

  const isPaid = (empId: string) => payrolls.some(p => p.employeeId === empId && p.month === selectedMonth);

  return (
    <div className="space-y-6 pb-20">
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-200 gap-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><User className="h-6 w-6 text-blue-600"/> Gestão de Pessoal & Salários</h2>
                <p className="text-sm text-gray-500">Módulo financeiro de capital humano (INSS / IRPS)</p>
            </div>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl border border-gray-200">
                <button onClick={()=>setActiveTab('EMPLOYEES')} className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${activeTab==='EMPLOYEES'?'bg-white text-blue-700 shadow-sm':'text-gray-500 hover:text-blue-600'}`}>Colaboradores</button>
                <button onClick={()=>setActiveTab('PAYROLL')} className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${activeTab==='PAYROLL'?'bg-white text-blue-700 shadow-sm':'text-gray-500 hover:text-blue-600'}`}>Processar Folha</button>
            </div>
        </div>

        {activeTab === 'EMPLOYEES' && (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <button onClick={()=>{setEditingEmp(null);setEmpForm({});setIsEmpModalOpen(true)}} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-100"><Plus className="h-4 w-4"/> Admitir Colaborador</button>
                    <Link to="/financial-expenses" className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 font-bold">Ver despesas de pessoal <ArrowRight className="h-3 w-3" /></Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {employees.map(emp => (
                        <div key={emp.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black">{emp.name.charAt(0)}</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{emp.name}</h3>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">{emp.position}</p>
                                    </div>
                                </div>
                                <button onClick={()=>{setEditingEmp(emp);setEmpForm(emp);setIsEmpModalOpen(true)}} className="text-blue-600 p-1.5 hover:bg-blue-50 rounded-lg"><Edit2Icon className="h-4 w-4" /></button>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-50 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[9px] text-gray-400 font-black uppercase mb-1">Salário Base</p>
                                    <p className="font-black text-gray-900 text-sm">{emp.baseSalary.toLocaleString()} MT</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] text-gray-400 font-black uppercase mb-1">Adm. em</p>
                                    <p className="font-bold text-gray-600 text-xs">{new Date(emp.admissionDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'PAYROLL' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50/50 flex flex-col md:flex-row gap-6 justify-between items-center">
                    <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <input type="month" value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} className="border-none p-0 text-sm font-black focus:ring-0 cursor-pointer" />
                    </div>
                    
                    <div className="flex-1 max-w-xs">
                        <label className="block text-[9px] font-black text-gray-400 uppercase ml-1 mb-1">Conta para Pagamento</label>
                        <select value={payAccount} onChange={e=>setPayAccount(e.target.value)} className="w-full border border-gray-200 rounded-xl p-2 text-xs font-bold bg-white focus:ring-blue-500">
                            <option value="">Selecione Conta...</option>
                            {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({a.balance.toLocaleString()} MT)</option>)}
                        </select>
                    </div>

                    <div className="text-right">
                        <p className="text-[9px] text-gray-500 font-black uppercase">Custo Total em Pessoal (Mês)</p>
                        <p className="text-2xl font-black text-slate-900">{payrolls.filter(p=>p.month===selectedMonth).reduce((acc, p)=>acc+p.totalCompanyCost, 0).toLocaleString()} MT</p>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100/50 text-gray-600 uppercase text-[10px] font-black tracking-widest border-b">
                            <tr>
                                <th className="p-4">Colaborador</th>
                                <th className="p-4 text-right">Salário Bruto</th>
                                <th className="p-4 text-right text-red-500">Dedução INSS (3%)</th>
                                <th className="p-4 text-right text-red-500">IRPS</th>
                                <th className="p-4 text-right font-black text-emerald-600">V. Líquido</th>
                                <th className="p-4 text-center">Ação Financeira</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {employees.map(emp => {
                                const paid = isPaid(emp.id);
                                const calc = calculatePayroll(emp);
                                return (
                                    <tr key={emp.id} className="hover:bg-gray-50/50 transition">
                                        <td className="p-4">
                                            <p className="font-bold text-gray-900">{emp.name}</p>
                                            <p className="text-[10px] text-gray-400 font-bold">{emp.position}</p>
                                        </td>
                                        <td className="p-4 text-right font-bold">{emp.baseSalary.toLocaleString()}</td>
                                        <td className="p-4 text-right text-red-500 font-medium">-{calc.inssEmp.toLocaleString()}</td>
                                        <td className="p-4 text-right text-red-500 font-medium">-{calc.irps.toLocaleString()}</td>
                                        <td className="p-4 text-right font-black text-emerald-600">{calc.net.toLocaleString()} MT</td>
                                        <td className="p-4 text-center">
                                            {paid ? (
                                                <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center justify-center gap-1"><CheckCircle2 className="h-3 w-3"/> Liquivado</span>
                                            ) : (
                                                <button onClick={()=>handleProcessPayroll(emp)} className="bg-slate-900 text-white px-5 py-1.5 rounded-xl text-[10px] font-black uppercase hover:bg-slate-800 shadow-md transition-all active:scale-95">Pagar Agora</button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {isEmpModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
                    <div className="flex justify-between mb-6 pb-4 border-b border-gray-100">
                        <h3 className="font-black text-gray-900 uppercase text-sm tracking-tighter">Ficha de Admissão</h3>
                        <button onClick={()=>setIsEmpModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X/></button>
                    </div>
                    <form onSubmit={handleSaveEmployee} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Nome Completo</label>
                            <input required value={empForm.name} onChange={e=>setEmpForm({...empForm, name:e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold bg-gray-50 focus:border-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Cargo / Função</label>
                            <input required value={empForm.position} onChange={e=>setEmpForm({...empForm, position:e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold bg-gray-50 focus:border-blue-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-blue-600 uppercase mb-1">Salário Base (MT)</label>
                                <input required type="number" value={empForm.baseSalary} onChange={e=>setEmpForm({...empForm, baseSalary:parseFloat(e.target.value)})} className="w-full border-2 border-blue-50 p-3 rounded-xl font-black bg-blue-50/30 text-blue-700" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Dependentes</label>
                                <input type="number" value={empForm.dependents} onChange={e=>setEmpForm({...empForm, dependents:parseInt(e.target.value)})} className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold bg-gray-50" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">NUIT</label>
                            <input value={empForm.nuit} onChange={e=>setEmpForm({...empForm, nuit:e.target.value})} className="w-full border-2 border-gray-100 p-3 rounded-xl font-bold bg-gray-50" />
                        </div>
                        <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-2xl hover:bg-slate-800 mt-4 transition-all">Registar Colaborador</button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
};

function Edit2Icon({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/></svg>;
}
