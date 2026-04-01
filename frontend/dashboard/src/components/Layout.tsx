import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const roleNavItems: Record<string, { path: string; label: string; icon: string }[]> = {
  CITIZEN: [
    { path: '/citizen', label: 'Mes Signalements', icon: '📋' },
    { path: '/citizen/new', label: 'Nouvelle Fraude', icon: '🚨' },
  ],
  POLICE: [
    { path: '/police', label: 'En Attente', icon: '⏳' },
  ],
  BANK: [
    { path: '/bank', label: 'À Traiter', icon: '🏦' },
  ],
  ADMIN: [
    { path: '/admin', label: 'Vue d\'ensemble', icon: '📊' },
    { path: '/admin/users', label: 'Utilisateurs', icon: '👥' },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = roleNavItems[user?.role || 'CITIZEN'] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>🛡️ SenPolBank</h1>
          <span>Plateforme Anti-Fraude</span>
        </div>

        <nav className="sidebar-nav">
          {items.map((item) => (
            <NavLink key={item.path} to={item.path} end className={({ isActive }) => isActive ? 'active' : ''}>
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="user-info">
              <div className="name">{user?.firstName} {user?.lastName}</div>
              <div className="role">{user?.role}</div>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleLogout} style={{ width: '100%', marginTop: '0.75rem' }}>
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
