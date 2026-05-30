import { getLoans } from './storage';

export function checkDueToday() {
  const today = new Date().toISOString().split('T')[0];
  const loans = getLoans().filter(loan => loan.status === 'activo' && loan.dueDate === today);
  return loans;
}

export function showDueNotification() {
  const dueLoans = checkDueToday();
  if (dueLoans.length === 0) return;

  if (Notification.permission === 'granted') {
    const names = dueLoans.map(l => l.clientName).join(', ');
    new Notification('Préstamos que vencen hoy', {
      body: `${names} deben pagar hoy`,
      icon: '/icons/icon-192.png',
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') showDueNotification();
    });
  }
}