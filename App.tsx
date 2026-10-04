
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SyncProvider } from './context/SyncContext';
import { TooltipProvider } from './components/ui/Tooltip';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SplashScreen } from './components/SplashScreen';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Receitas } from './pages/Receitas';
import { Despesas } from './pages/Despesas';
import { Categorias } from './pages/Categorias';
import { SharedFinances } from './pages/SharedFinances';
import { SyncQueue } from './pages/SyncQueue';
import { Profile } from './pages/Profile';
import { UsersPage } from './pages/Users';
import { SettingsPage } from './pages/Settings';
import { Accounts } from './pages/Accounts';
import { Transactions } from './pages/Transactions';
import { Budget } from './pages/Budget';
import { Debts } from './pages/Debts';
import { Tasks } from './pages/Tasks';
import { Agenda } from './pages/Agenda';
import { Notes } from './pages/Notes';
import { Reports } from './pages/Reports';
import { CommercialReports } from './pages/CommercialReports';
import { Quotes } from './pages/Quotes';
import { QuoteEditor } from './pages/QuoteEditor';
import { Customers } from './pages/Customers';
import { CompanySettings } from './pages/CompanySettings';
import { FinancialExpenses } from './pages/FinancialExpenses';
import { AIInsights } from './pages/AIInsights';
import { Production } from './pages/Production';
import { HR } from './pages/HR';
import { POS } from './pages/POS';
import { Fleet } from './pages/Fleet';
import { Hospitality } from './pages/Hospitality';
import { Religious } from './pages/Religious';
import { Customs } from './pages/Customs';
import { Fiscal } from './pages/Fiscal';
import { ConsolidationDashboard } from './pages/ConsolidationDashboard';
import { ERP } from './pages/ERP';
import { RestaurantOperations } from './pages/RestaurantOperations';
import { PharmacyOperations } from './pages/PharmacyOperations';
import { DeliveryOperations } from './pages/DeliveryOperations';
import { TechOperations } from './pages/TechOperations';
import { ConstructionOperations } from './pages/ConstructionOperations';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('idigtec_splash_dismissed');
  });

  const handleFinishSplash = () => {
    sessionStorage.setItem('idigtec_splash_dismissed', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleFinishSplash} />;
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      
      {/* Protected Routes with Main Layout */}
      <Route
        path="/*"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : (
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/receitas" element={<Receitas />} />
                <Route path="/despesas" element={<Despesas />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/categorias" element={<Categorias />} />
                <Route path="/compartilhadas" element={<SharedFinances />} />
                <Route path="/sincronizacao" element={<SyncQueue />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/usuarios" element={<UsersPage />} />
                <Route path="/configuracoes" element={<SettingsPage />} />

                <Route path="/accounts" element={<Accounts />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/debts" element={<Debts />} />
                <Route path="/financial-expenses" element={<FinancialExpenses />} />
                <Route path="/fiscal" element={<Fiscal />} />
                <Route path="/quotes" element={<Quotes />} />
                <Route path="/quotes/new" element={<QuoteEditor />} />
                <Route path="/quotes/edit/:id" element={<QuoteEditor />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/pos" element={<POS />} />

                {/* Operations & Sectorials */}
                <Route path="/restaurant" element={<RestaurantOperations />} />
                <Route path="/pharmacy" element={<PharmacyOperations />} />
                <Route path="/delivery" element={<DeliveryOperations />} />
                <Route path="/tech" element={<TechOperations />} />
                <Route path="/construction" element={<ConstructionOperations />} />
                <Route path="/hr" element={<HR />} />
                <Route path="/production" element={<Production />} />
                <Route path="/fleet" element={<Fleet />} />
                <Route path="/erp" element={<ERP />} />
                <Route path="/hospitality" element={<Hospitality />} />
                <Route path="/religious" element={<Religious />} />
                <Route path="/customs" element={<Customs />} />

                {/* Personal & Analytics */}
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/commercial-reports" element={<CommercialReports />} />
                <Route path="/consolidation" element={<ConsolidationDashboard />} />
                <Route path="/intelligence" element={<AIInsights />} />
                <Route path="/settings" element={<CompanySettings />} />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          )
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={150}>
        <AuthProvider>
          <SyncProvider>
            <FinanceProvider>
              <Router>
                <AppRoutes />
                <OfflineIndicator />
              </Router>
            </FinanceProvider>
          </SyncProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;
