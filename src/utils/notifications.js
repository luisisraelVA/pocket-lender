import { getLoans } from './storage';

export function checkDueToday() {
  const today = new Date().toISOString().split('T')[0];
  // Préstamos activos con fecha de inicio igual a hoy? O no aplica. Como ahora no hay fecha de vencimiento, podemos omitir.
  return [];
}

export function showDueNotification() {
  // Sin fecha de vencimiento, podemos recordar préstamos activos con deuda >0
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