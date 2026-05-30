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

export function exportToCSV() {
  const loans = getLoans();
  const headers = ['Nombre','Teléfono','Capital (Bs.)','Interés (%)','Interés (Bs.)','Desembolsado','Cuota diaria','Días','Inicio','Vencimiento','Estado','Pagado (Bs.)','Saldo (Bs.)','Métodos','Notas'];
  const rows = loans.map(loan => {
    const totalPaid = (loan.payments || []).reduce((sum, p) => sum + p.amount, 0);
    const methods = [...new Set((loan.payments || []).map(p => p.method || 'sin registro'))].join('/');
    return [
      loan.clientName,
      loan.phone,
      loan.capital.toFixed(2),
      loan.interestRate.toFixed(2),
      loan.interestAmount.toFixed(2),
      loan.disbursedAmount.toFixed(2),
      loan.dailyQuota.toFixed(2),
      loan.days,
      loan.startDate,
      loan.dueDate,
      loan.status,
      totalPaid.toFixed(2),
      (loan.capital - totalPaid).toFixed(2),
      methods,
      loan.notes || ''
    ];
  });
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `prestamos_${new Date().toISOString().split('T')[0]}.csv`);
  link.click();
}