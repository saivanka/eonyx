export const money = (amount: number) =>
  `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

export const shortDate = (ts: number) =>
  new Date(ts).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

export const timeOf = (ts: number) =>
  new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
