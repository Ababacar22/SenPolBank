import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import StatusBadge from '../../components/StatusBadge';

interface Fraud {
  id: string; title: string; description: string;
  bankName: string; bankAccount: string; amount: number;
  status: string; createdAt: string;
}

export default function CitizenDashboard() {
  const [frauds, setFrauds] = useState<Fraud[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Fraud[]>('/frauds/me').then(setFrauds).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = {
    total: frauds.length,
    pending: frauds.filter(f => f.status === 'PENDING_POLICE' || f.status === 'PENDING_BANK').length,
    resolved: frauds.filter(f => f.status === 'RESOLVED').length,
  };

  return (
    <>
      <div className="page-header">
        <h2>📋 Mes Signalements</h2>
        <p>Suivez l'avancement de vos déclarations de fraude</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{stats.total}</div><div className="stat-label">Total</div></div>
        <div className="stat-card"><div className="stat-value">{stats.pending}</div><div className="stat-label">En cours</div></div>
        <div className="stat-card"><div className="stat-value">{stats.resolved}</div><div className="stat-label">Résolus</div></div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/citizen/new" className="btn btn-primary">🚨 Signaler une fraude</Link>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : frauds.length === 0 ? (
        <div className="empty-state"><div className="icon">📭</div><p>Aucun signalement pour le moment</p></div>
      ) : (
        <div className="card-grid">
          {frauds.map((f) => (
            <div className="card" key={f.id}>
              <div className="card-header">
                <span className="card-title">{f.title}</span>
                <StatusBadge status={f.status} />
              </div>
              <div className="card-body"><p>{f.description}</p></div>
              <div className="card-detail">
                <span className="detail-item">🏦 {f.bankName}</span>
                <span className="detail-item">💳 {f.bankAccount}</span>
                {f.amount && <span className="detail-item">💰 {f.amount.toLocaleString()} FCFA</span>}
              </div>
              <div className="card-meta" style={{ marginTop: '0.75rem' }}>
                {new Date(f.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
