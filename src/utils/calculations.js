export function calculateDebt(loan) {
  if (loan.status === 'pagado') return 0;
  const start = new Date(loan.startDate);
  const today = new Date();
  const diffTime = today - start;
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const interest = loan.amount * (loan.dailyInterest / 100) * days;
  return loan.amount + interest;
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}