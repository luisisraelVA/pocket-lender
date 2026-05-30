export function calculateDebt(loan) {
  if (loan.status === 'pagado') return 0;
  const totalPaid = (loan.payments || []).reduce((sum, p) => sum + p.amount, 0);
  return loan.capital - totalPaid;
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function getDaysSinceStart(loan) {
  const start = new Date(loan.startDate);
  const today = new Date();
  return Math.floor((today - start) / (1000 * 60 * 60 * 24));
}