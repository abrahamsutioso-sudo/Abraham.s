import { Transaction } from '../types/finance';

export function generateInitialTransactions(): Transaction[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  const getDateStr = (offsetDays: number) => {
    const d = new Date(year, month, day - offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dt = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dt}`;
  };

  const getStartOfMonth = () => {
    const m = String(month + 1).padStart(2, '0');
    return `${year}-${m}-01`;
  };

  const transactions: Transaction[] = [
    // Pemasukan Awal Bulan (Gaji)
    {
      id: 'tx-init-income-1',
      type: 'income',
      amount: 8500000,
      category: 'Gaji Pokok',
      date: getStartOfMonth(),
      time: '08:00',
      note: 'Gaji Bulanan Kantor',
      paymentMethod: 'BCA',
    },
    {
      id: 'tx-init-income-2',
      type: 'income',
      amount: 1200000,
      category: 'Freelance & Usaha',
      date: getDateStr(5),
      time: '14:30',
      note: 'Honor Desain UI Project',
      paymentMethod: 'Mandiri',
    },

    // Pengeluaran Hari Ini (0 hari lalu)
    {
      id: 'tx-today-1',
      type: 'expense',
      amount: 28000,
      category: 'Makanan & Minuman',
      date: getDateStr(0),
      time: '12:15',
      note: 'Makan Siang Nasi Padang + Es Teh',
      paymentMethod: 'QRIS',
    },
    {
      id: 'tx-today-2',
      type: 'expense',
      amount: 22000,
      category: 'Makanan & Minuman',
      date: getDateStr(0),
      time: '15:40',
      note: 'Es Kopi Susu Gula Aren',
      paymentMethod: 'GoPay',
    },
    {
      id: 'tx-today-3',
      type: 'expense',
      amount: 35000,
      category: 'Transportasi',
      date: getDateStr(0),
      time: '08:10',
      note: 'Bensin Pertalite Motor',
      paymentMethod: 'Tunai',
    },

    // Kemarin (1 hari lalu)
    {
      id: 'tx-yest-1',
      type: 'expense',
      amount: 45000,
      category: 'Makanan & Minuman',
      date: getDateStr(1),
      time: '13:00',
      note: 'Makan Siang Ayam Geprek Mozarella',
      paymentMethod: 'ShopeePay',
    },
    {
      id: 'tx-yest-2',
      type: 'expense',
      amount: 115000,
      category: 'Belanja Harian & Rumah',
      date: getDateStr(1),
      time: '19:20',
      note: 'Belanja Sabun, Minyak Goreng, Snack Indomaret',
      paymentMethod: 'QRIS',
    },

    // 2 hari lalu
    {
      id: 'tx-day2-1',
      type: 'expense',
      amount: 150000,
      category: 'Tagihan & Utilitas',
      date: getDateStr(2),
      time: '09:00',
      note: 'Token Listrik PLN 150rb',
      paymentMethod: 'BCA',
    },
    {
      id: 'tx-day2-2',
      type: 'expense',
      amount: 32000,
      category: 'Makanan & Minuman',
      date: getDateStr(2),
      time: '12:30',
      note: 'Makan Siang Soto Betawi',
      paymentMethod: 'Tunai',
    },

    // 3 hari lalu
    {
      id: 'tx-day3-1',
      type: 'expense',
      amount: 25000,
      category: 'Transportasi',
      date: getDateStr(3),
      time: '18:15',
      note: 'Ojek Online Stasiun ke Kos',
      paymentMethod: 'GoPay',
    },
    {
      id: 'tx-day3-2',
      type: 'expense',
      amount: 54000,
      category: 'Hiburan & Hobi',
      date: getDateStr(3),
      time: '20:00',
      note: 'Tiket Bioskop XXI Cinema',
      paymentMethod: 'QRIS',
    },

    // 4 hari lalu
    {
      id: 'tx-day4-1',
      type: 'expense',
      amount: 65000,
      category: 'Kesehatan & Medis',
      date: getDateStr(4),
      time: '16:00',
      note: 'Vitamin C & Madu Apotek Kimia Farma',
      paymentMethod: 'Dana',
    },
    {
      id: 'tx-day4-2',
      type: 'expense',
      amount: 38000,
      category: 'Makanan & Minuman',
      date: getDateStr(4),
      time: '12:45',
      note: 'Makan Siang Warteg Lengkap',
      paymentMethod: 'QRIS',
    },

    // 6 hari lalu
    {
      id: 'tx-day6-1',
      type: 'expense',
      amount: 210000,
      category: 'Belanja Harian & Rumah',
      date: getDateStr(6),
      time: '11:10',
      note: 'Belanja Sayur, Buah, Daging di Supermarket',
      paymentMethod: 'BCA',
    },
    {
      id: 'tx-day6-2',
      type: 'expense',
      amount: 50000,
      category: 'Sosial & Sedekah',
      date: getDateStr(6),
      time: '13:00',
      note: 'Sedekah Jumat & Kotak Amal',
      paymentMethod: 'Tunai',
    },

    // 8 hari lalu
    {
      id: 'tx-day8-1',
      type: 'expense',
      amount: 100000,
      category: 'Tagihan & Utilitas',
      date: getDateStr(8),
      time: '10:00',
      note: 'Paket Data Internet Bulanan 50GB',
      paymentMethod: 'GoPay',
    },
    {
      id: 'tx-day8-2',
      type: 'expense',
      amount: 1500000,
      category: 'Tempat Tinggal / Kos',
      date: getDateStr(12),
      time: '08:30',
      note: 'Bayar Iuran Sewa Kos Bulanan',
      paymentMethod: 'BCA',
    },
    {
      id: 'tx-day10-1',
      type: 'expense',
      amount: 150000,
      category: 'Pendidikan & Belajar',
      date: getDateStr(10),
      time: '15:20',
      note: 'Beli Buku Finansial & Investasi',
      paymentMethod: 'ShopeePay',
    },
  ];

  return transactions.sort((a, b) => {
    const dateComp = b.date.localeCompare(a.date);
    if (dateComp !== 0) return dateComp;
    return b.time.localeCompare(a.time);
  });
}
