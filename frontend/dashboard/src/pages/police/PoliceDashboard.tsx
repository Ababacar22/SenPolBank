import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import StatusBadge from '../../components/StatusBadge';

interface Fraud {
  id: string; title: string; description: string;
  bankName: string; bankAccount: string; amount: number;
  status: string; createdAt: string;
  citizen: { firstName: string; lastName: string; email: string; phoneNumber?: string; nationalId?: string; kycStatus: string };
}

export default function PoliceDashboard() {
  const [frauds, setFrauds] = useState<Fraud[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState<{ id: string; type: 'validate' | 'reject' } | null>(null);
  const [note, setNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchFrauds = () => {
    setLoading(true);
    apiFetch<Fraud[]>('/police/frauds').then(setFrauds).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchFrauds(); }, []);

  const handleAction = async () => {
    if (!actionModal) return;
    setActionLoading(true);
    try {
      const path = `/police/frauds/${actionModal.id}/${actionModal.type === 'validate' ? 'validate' : 'reject'}`;
      const body = actionModal.type === 'validate' ? { note } : { reason: note };
      await apiFetch(path, { method: 'PATCH', body: JSON.stringify(body) });
      setActionModal(null);
      setNote('');
      fetchFrauds();
    } catch {}
    setActionLoading(false);
  };

  return (
    <>
      <div className="page-header">
        <h2>🚔 Signalements en attente</h2>
        <p>Validez ou rejetez les alertes soumises par les citoyens</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><div className="stat-value">{frauds.length}</div><div className="stat-label">En attente</div></div>
      </div>

      {loading ? (
        <div className="loader"><div className="spinner"></div></div>
      ) : frauds.length === 0 ? (
        <div className="empty-state"><div className="icon">✅</div><p>Aucun signalement en attente</p></div>
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
                <span className="detail-item">👤 {f.citizen.firstName} {f.citizen.lastName}</span>
                <span className="detail-item">📧 {f.citizen.email}</span>
                <span className="detail-item">🏦 {f.bankName}</span>
                <span className="detail-item">💳 {f.bankAccount}</span>
                {f.amount && <span className="detail-item">💰 {f.amount.toLocaleString()} FCFA</span>}
              </div>
              <div className="card-footer">
                <button className="btn btn-success btn-sm" onClick={() => { setActionModal({ id: f.id, type: 'validate' }); setNote(''); }}>✅ Valider</button>
                <button className="btn btn-danger btn-sm" onClick={() => { setActionModal({ id: f.id, type: 'reject' }); setNote(''); }}>❌ Rejeter</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {actionModal && (
        <div className="modal-overlay" onClick={() => setActionModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{actionModal.type === 'validate' ? '✅ Valider le signalement' : '❌ Rejeter le signalement'}</h3>
            <div className="form-group">
              <label>{actionModal.type === 'validate' ? 'Note (optionnel)' : 'Motif de rejet (obligatoire)'}</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Votre commentaire..." />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setActionModal(null)}>Annuler</button>
              <button
                className={`btn ${actionModal.type === 'validate' ? 'btn-success' : 'btn-danger'}`}
                onClick={handleAction} disabled={actionLoading || (actionModal.type === 'reject' && !note)}
              >
                {actionLoading ? '...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
