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
  // Asegurarse de que tenga payments array
  loan.payments = loan.payments || [];
  loans.push(loan);
  saveLoans(loans);
}

export function updateLoan(id, updatedData) {
  const loans = getLoans().map(loan =>
    loan.id === id ? { ...loan, ...updatedData } : loan
  );
  saveLoans(loans);
}

export function markAsPaid(id) {
  const loans = getLoans().map(loan =>
    loan.id === id ? { ...loan, status: 'pagado', paidAt: new Date().toISOString() } : loan
  );
  saveLoans(loans);
}

export function deleteLoan(id) {
  const loans = getLoans().filter(loan => loan.id !== id);
  saveLoans(loans);
}

export function addPayment(loanId, payment) {
  const loans = getLoans().map(loan => {
    if (loan.id === loanId) {
      return {
        ...loan,
        payments: [...(loan.payments || []), payment],
      };
    }
    return loan;
  });
  saveLoans(loans);
}