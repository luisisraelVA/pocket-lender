import { getLoans } from './storage';

export function checkDueToday() {
  const today = new Date().toISOString().split('T')[0];
  return [];
}

export function showDueNotification() {
  const activeLoans = getLoans().filter(l => l.status === 'activo');
  if (activeLoans.length === 0) return;

  if (Notification.permission === 'granted') {
    const names = activeLoans.map(l => l.clientName).join(', ');
    new Notification('Préstamos activos', {
      body: `Tienes ${activeLoans.length} préstamos activos: ${names}`,
      icon: '/icons/icon-192.png',
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') showDueNotification();
    });
  }
}

export function checkDailyReminder() {
  const lastReminder = localStorage.getItem('lastReminderDate');
  const today = new Date().toDateString();
  if (lastReminder !== today) {
    if (Notification.permission === 'granted') {
      new Notification('Pocket Lender', {
        body: '¿Ya enviaste los recordatorios de pago de hoy?',
        icon: '/icons/icon-192.png',
      });
    }
    localStorage.setItem('lastReminderDate', today);
  }
}