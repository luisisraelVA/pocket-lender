const STORAGE_KEY = 'prestamos';

export function getLoans() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveLoans(loans) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(loans));
}

export function addLoan(loan) {
  const loans = getLoans();
  loans.push(loan);
  saveLoans(loans);
  return loans;
}

export function updateLoan(id, updatedData) {
  const loans = getLoans().map(loan =>
    loan.id === id ? { ...loan, ...updatedData } : loan
  );
  saveLoans(loans);
  return loans;
}

export function markAsPaid(id) {
  const loans = getLoans().map(loan =>
    loan.id === id ? { ...loan, status: 'pagado', paidAt: new Date().toISOString() } : loan
  );
  saveLoans(loans);
  return loans;
}