import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

interface UserInfo {
  id: string; firstName: string; lastName: string; email: string;
  role: string; kycStatus: string; isActive: boolean;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<UserInfo[]>('/users').then(setUsers).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: users.length,
    citizens: users.filter(u => u.role === 'CITIZEN').length,
    police: users.filter(u => u.role === 'POLICE').length,
    bank: users.filter(u => u.role === 'BANK').length,
  };

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      CITIZEN: 'badge-pending-police', POLICE: 'badge-pending-bank',
      BANK: 'badge-resolved', ADMIN: 'badge-rejected',
    };
    return <span className={`badge ${colors[role] || ''}`}>{role}</span>;
  };

  return (
    <>
      <div className="page-header">
        <h2>📊 Administration</h2>
        <p>Vue d'ensemble de la plateforme</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{stats.total}</div><div className="stat-label">Utilisateurs</div></div>
        <div className="stat-card"><div className="stat-value">{stats.citizens}</div><div className="stat-label">Citoyens</div></div>
        <div className="stat-card"><div className="stat-value">{stats.police}</div><div className="stat-label">Police</div></div>
        <div className="stat-card"><div className="stat-value">{stats.bank}</div><div className="stat-label">Banque</div></div>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : (
        <div className="card">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Nom</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Rôle</th>
                <th style={{ textAlign: 'left', padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontSize: '0.9rem' }}>{u.firstName} {u.lastName}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem' }}>{roleBadge(u.role)}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge ${u.isActive ? 'badge-resolved' : 'badge-rejected'}`}>
                      {u.isActive ? 'Actif' : 'Suspendu'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
