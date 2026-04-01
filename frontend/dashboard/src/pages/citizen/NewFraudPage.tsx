import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';

export default function NewFraudPage() {
  const [form, setForm] = useState({ title: '', description: '', bankName: '', bankAccount: '', amount: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiFetch('/frauds', {
        method: 'POST',
        body: JSON.stringify({ ...form, amount: form.amount ? parseFloat(form.amount) : undefined }),
      });
      navigate('/citizen');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h2>🚨 Signaler une Fraude</h2>
        <p>Remplissez le formulaire ci-dessous pour déclarer une fraude bancaire</p>
      </div>

      <div className="card" style={{ maxWidth: 600 }}>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre du signalement</label>
            <input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Ex: Transaction non autorisée" required />
          </div>
          <div className="form-group">
            <label>Description détaillée</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Décrivez la fraude..." required />
          </div>
          <div className="form-group">
            <label>Nom de la banque</label>
            <input value={form.bankName} onChange={(e) => update('bankName', e.target.value)} placeholder="Ex: Ecobank, CBAO..." required />
          </div>
          <div className="form-group">
            <label>Numéro de compte / IBAN</label>
            <input value={form.bankAccount} onChange={(e) => update('bankAccount', e.target.value)} placeholder="Ex: SN012345..." required />
          </div>
          <div className="form-group">
            <label>Montant estimé (FCFA) — optionnel</label>
            <input type="number" value={form.amount} onChange={(e) => update('amount', e.target.value)} placeholder="50000" />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Envoi...' : '📤 Envoyer le signalement'}
            </button>
            <button className="btn btn-outline" type="button" onClick={() => navigate('/citizen')}>Annuler</button>
          </div>
        </form>
      </div>
    </>
  );
}
