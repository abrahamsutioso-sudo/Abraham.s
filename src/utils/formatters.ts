export function formatRupiah(amount: number): string {
  if (isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactRupiah(amount: number): string {
  if (isNaN(amount) || amount === 0) return 'Rp 0';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1000000000) {
    const val = (abs / 1000000000).toFixed(1).replace('.0', '');
    return `${sign}Rp ${val} M`;
  }
  if (abs >= 1000000) {
    const val = (abs / 1000000).toFixed(1).replace('.0', '');
    return `${sign}Rp ${val} jt`;
  }
  if (abs >= 1000) {
    const val = (abs / 1000).toFixed(0);
    return `${sign}Rp ${val} rb`;
  }
  return `${sign}Rp ${abs}`;
}

export const INDO_DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const INDO_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function formatDateIndo(dateStr: string, withDay = true): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const dayName = INDO_DAYS[date.getDay()];
  const monthName = INDO_MONTHS[date.getMonth()];
  
  if (withDay) {
    return `${dayName}, ${day} ${monthName} ${year}`;
  }
  return `${day} ${monthName} ${year}`;
}

export function formatMonthYear(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-').map(Number);
  const monthName = INDO_MONTHS[month - 1];
  return `${monthName} ${year}`;
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCurrentTimeString(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function parseRupiahInput(value: string | number): number {
  if (typeof value === 'number') return value;
  const cleaned = value.replace(/[^0-9]/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export function formatNumberWithDots(val: number | string): string {
  const num = typeof val === 'number' ? val : parseRupiahInput(val);
  return new Intl.NumberFormat('id-ID').format(num);
}
