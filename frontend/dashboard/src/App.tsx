import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import NewFraudPage from './pages/citizen/NewFraudPage';
import PoliceDashboard from './pages/police/PoliceDashboard';
import BankDashboard from './pages/bank/BankDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  const routes: Record<string, string> = {
    CITIZEN: '/citizen',
    POLICE: '/police',
    BANK: '/bank',
    ADMIN: '/admin',
  };
  return <Navigate to={routes[user.role] || '/citizen'} />;
}

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loader"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Citoyen */}
          <Route path="/citizen" element={<ProtectedRoute roles={['CITIZEN']}><CitizenDashboard /></ProtectedRoute>} />
          <Route path="/citizen/new" element={<ProtectedRoute roles={['CITIZEN']}><NewFraudPage /></ProtectedRoute>} />

          {/* Police */}
          <Route path="/police" element={<ProtectedRoute roles={['POLICE', 'ADMIN']}><PoliceDashboard /></ProtectedRoute>} />

          {/* Banque */}
          <Route path="/bank" element={<ProtectedRoute roles={['BANK', 'ADMIN']}><BankDashboard /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />

          {/* Default */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
