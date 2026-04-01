const statusMap: Record<string, { label: string; className: string }> = {
  PENDING_POLICE: { label: '⏳ Attente Police', className: 'badge-pending-police' },
  PENDING_BANK: { label: '🏦 Attente Banque', className: 'badge-pending-bank' },
  RESOLVED: { label: '✅ Résolu', className: 'badge-resolved' },
  REJECTED: { label: '❌ Rejeté', className: 'badge-rejected' },
};

export default function StatusBadge({ status }: { status: string }) {
  const info = statusMap[status] || { label: status, className: '' };
  return <span className={`badge ${info.className}`}>{info.label}</span>;
}
