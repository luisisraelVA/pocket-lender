import { getLoans } from './storage';
import { calculateDebt } from './calculations';

export function checkAndNotifyDaily() {
  const today = new Date().toDateString();
  const lastNotification = localStorage.getItem('lastDailyNotification');

  if (lastNotification === today) return; // ya se notificó hoy

  const activeLoans = getLoans().filter(l => l.status === 'activo');
  if (activeLoans.length === 0) return;

  if (Notification.permission === 'granted') {
    const lines = activeLoans.map(loan => {
      const debt = calculateDebt(loan).toFixed(2);
      return `${loan.clientName}: Bs. ${debt}`;
    });
    const body = lines.join('\n');
    new Notification('Pagos pendientes hoy', {
      body: `Tienes ${activeLoans.length} préstamos activos:\n${body}`,
      icon: '/icons/icon-192.png',
    });
    localStorage.setItem('lastDailyNotification', today);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        checkAndNotifyDaily(); // reintentar
      }
    });
  }
}

// Esta función se mantiene por si quieres un botón manual adicional (ya no se usa en Dashboard)
export function showDueNotification() {
  checkAndNotifyDaily();
}