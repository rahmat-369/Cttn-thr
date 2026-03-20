import { useState, useEffect } from 'react';

export interface THRMasuk { id: string; namaPemberi: string; jumlah: number; rating: 1|2|3|4|5|6; tanggal: string; kategori: 'Keluarga'|'Tetangga'|'Teman'|'Kerabat'|'Lainnya'; catatan?: string; }
export interface THRKeluar { id: string; namaPenerima: string; jumlah: number; hubungan: string; tanggal: string; catatan?: string; }
export interface THRAppData {
  settings: { welcomeDismissed: boolean; theme: 'light' | 'dark'; lastVisit: string; };
  thrMasuk: THRMasuk[];
  thrKeluar: THRKeluar[];
  stats: { totalDiterima: number; totalDiberikan: number; rataRataPemberian: number; kategoriTerbanyak: string; };
  aiQuotes: { lastQuote: string; lastUpdated: string; quoteHistory: string[]; };
}

const defaultData: THRAppData = {
  settings: { welcomeDismissed: false, theme: 'light', lastVisit: new Date().toISOString() },
  thrMasuk: [], thrKeluar: [],
  stats: { totalDiterima: 0, totalDiberikan: 0, rataRataPemberian: 0, kategoriTerbanyak: '-' },
  aiQuotes: { lastQuote: "Taqabbalallahu minna wa minkum, shiyamana wa shiyamakum", lastUpdated: new Date().toISOString(), quoteHistory: [] }
};

export const useThrData = () => {
  const [data, setData] = useState<THRAppData>(() => {
    const local = localStorage.getItem('thr-tracker-data');
    return local ? JSON.parse(local) : defaultData;
  });

  useEffect(() => {
    const totalDiterima = data.thrMasuk.reduce((acc, curr) => acc + curr.jumlah, 0);
    const totalDiberikan = data.thrKeluar.reduce((acc, curr) => acc + curr.jumlah, 0);
    const rataRata = data.thrMasuk.length ? totalDiterima / data.thrMasuk.length : 0;
    
    const counts: Record<string, number> = {};
    data.thrMasuk.forEach(t => counts[t.kategori] = (counts[t.kategori] || 0) + 1);
    const kategoriTerbanyak = Object.keys(counts).sort((a,b) => counts[b] - counts[a])[0] || '-';

    const newData = { ...data, stats: { totalDiterima, totalDiberikan, rataRataPemberian: rataRata, kategoriTerbanyak } };
    localStorage.setItem('thr-tracker-data', JSON.stringify(newData));
  }, [data.thrMasuk, data.thrKeluar, data.settings, data.aiQuotes]);

  const updateData = (newData: Partial<THRAppData>) => setData(prev => ({ ...prev, ...newData }));
  return { data, updateData };
};
