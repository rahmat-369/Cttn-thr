import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Sparkles, RefreshCw, ChevronLeft, ChevronRight, Shuffle, Plus, Search, Star, Calendar, Users, MoreVertical, FileText, MessageCircle, Filter, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThrData } from '../lib/store';
import { generateQuote } from '../lib/api';

export default function Dashboard({ openModal }: { openModal: (t: 'masuk'|'keluar') => void }) {
  const { data, updateData } = useThrData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(false);

  const hitungHMin = () => {
    const target = new Date('2025-04-10T00:00:00');
    const diff = Math.ceil((target.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? `H-${diff} menuju Lebaran` : "Hari Raya Idul Fitri";
  };

  const handleRefreshQuote = async () => {
    setQuoteLoading(true);
    const newQuote = await generateQuote(data);
    updateData({ aiQuotes: { ...data.aiQuotes, lastQuote: newQuote } });
    setQuoteLoading(false);
  };

  const formatRp = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-8 font-inter">
      {/* Header */}
      <div>
        <h1 className="font-playfair text-3xl font-bold text-deepGreen">THR Tracker</h1>
        <p className="text-charcoal font-medium">Selamat Hari Raya Idul Fitri 1446 H</p>
        <span className="inline-block mt-2 px-4 py-1.5 bg-sand text-deepGreen rounded-full text-sm font-bold border border-gold/30">{hitungHMin()}</span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} className="bg-sand p-6 rounded-[16px] shadow-3d border border-white/50 relative overflow-hidden">
          <div className="flex items-center gap-2 text-charcoal mb-2"><Wallet className="w-6 h-6"/> <span className="font-bold">TOTAL THR DITERIMA</span></div>
          <h2 className="text-[32px] font-bold text-deepGreen mb-6">{formatRp(data.stats.totalDiterima)}</h2>
          <div className="flex gap-4 relative z-10">
            <button onClick={() => openModal('masuk')} className="flex-1 bg-deepGreen text-whiteSoft py-3 rounded-xl flex justify-center items-center gap-2 font-bold shadow-3d"><ArrowDownCircle className="w-5 h-5"/> Catat Masuk</button>
            <button onClick={() => openModal('keluar')} className="flex-1 bg-whiteSoft text-deepGreen py-3 rounded-xl flex justify-center items-center gap-2 font-bold shadow-md"><ArrowUpCircle className="w-5 h-5"/> Catat Keluar</button>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="bg-sand p-6 rounded-[16px] shadow-3d border border-white/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-charcoal mb-4"><Sparkles className="w-6 h-6 text-gold"/> <span className="font-bold">AI INSIGHT</span></div>
            <div className="bg-cream p-5 rounded-[18px] shadow-inner relative">
              <p className="text-charcoal font-medium leading-relaxed">{quoteLoading ? 'Memuat...' : data.aiQuotes.lastQuote}</p>
            </div>
          </div>
          <button onClick={handleRefreshQuote} className="mt-4 flex items-center gap-2 text-deepGreen font-bold w-fit hover:text-gold"><RefreshCw className={`w-4 h-4 ${quoteLoading?'animate-spin':''}`}/> Refresh Quote</button>
        </motion.div>
      </div>

      {/* Quote of the day */}
      <div className="bg-whiteSoft p-6 rounded-[16px] shadow-sm border border-sand">
        <span className="font-bold text-charcoal border-b-2 border-gold pb-1 text-sm tracking-wider">KATA MUTIARA LEBARAN</span>
        <h3 className="font-amiri text-2xl text-deepGreen mt-4 mb-2">Taqabbalallahu minna wa minkum, shiyamana wa shiyamakum</h3>
        <p className="text-charcoal text-sm mb-4">Semoga Allah menerima amal kami dan amal kalian, puasa kami dan puasa kalian.</p>
        <div className="flex gap-2">
          <button className="p-2 bg-sand rounded-lg text-deepGreen"><ChevronLeft className="w-5 h-5"/></button>
          <button className="p-2 bg-sand rounded-lg text-deepGreen"><ChevronRight className="w-5 h-5"/></button>
          <button className="p-2 bg-sand rounded-lg text-deepGreen"><Shuffle className="w-5 h-5"/></button>
        </div>
      </div>

      {/* Stats & Chart Vertikal */}
      <div className="bg-sand p-6 rounded-[16px] shadow-3d">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-2">
            <p className="font-bold">Total Diterima: <span className="text-deepGreen">{formatRp(data.stats.totalDiterima)}</span></p>
            <p className="font-bold">Total Diberikan: <span className="text-red-700">{formatRp(data.stats.totalDiberikan)}</span></p>
            <div className="h-px bg-charcoal/20 w-full my-2"></div>
            <p className="font-bold text-lg">THR Bersih: <span className="text-gold">{formatRp(data.stats.totalDiterima - data.stats.totalDiberikan)}</span></p>
            <div className="mt-4 text-sm font-medium">
              <p>Rata-rata per pemberi: {formatRp(data.stats.rataRataPemberian)}</p>
              <p>Pemberi terbanyak: {data.stats.kategoriTerbanyak}</p>
            </div>
          </div>
          <div className="flex-[2]">
            <p className="font-medium text-charcoal mb-4">TREN THR PER HARI</p>
            <div className="h-[200px] w-full flex items-end justify-between border-b-2 border-charcoal/20 pb-2 relative">
              {/* Sumbu Y Manual Hint */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-charcoal/50 pb-6">
                <span>Max</span><span>Mid</span>
              </div>
              {/* Chart Bars */}
              {['H-3','H-2','H-1','H0','H+1'].map((lbl, i) => (
                <div key={i} className="flex flex-col items-center flex-1 z-10">
                  <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1, delay: i*0.1 }} style={{ height: `${Math.random() * 80 + 20}%`, transformOrigin: 'bottom' }} className="w-8 md:w-16 bg-deepGreen rounded-t-md shadow-lg" />
                  <span className="text-xs font-bold mt-2">{lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        <button className="bg-sand p-4 rounded-[16px] flex flex-col items-center gap-2 shadow-md text-deepGreen"><FileText/><span className="text-xs font-bold">Laporan</span></button>
        <button onClick={() => navigate('/chat')} className="bg-sand p-4 rounded-[16px] flex flex-col items-center gap-2 shadow-md text-deepGreen"><MessageCircle/><span className="text-xs font-bold">AI Chat</span></button>
        <button className="bg-sand p-4 rounded-[16px] flex flex-col items-center gap-2 shadow-md text-deepGreen"><Filter/><span className="text-xs font-bold">Filter</span></button>
        <button onClick={() => navigate('/about')} className="bg-sand p-4 rounded-[16px] flex flex-col items-center gap-2 shadow-md text-deepGreen opacity-80"><Info/><span className="text-xs font-bold">About</span></button>
      </div>

      {/* List THR */}
      <div className="bg-whiteSoft rounded-[16px] shadow-sm p-6 border border-sand">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-charcoal">DAFTAR THR MASUK</h3>
          <button onClick={() => openModal('masuk')} className="text-deepGreen font-bold flex items-center gap-1"><Plus className="w-4 h-4"/> Tambah</button>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-charcoal/50" />
          <input type="text" placeholder="Cari catatan THR..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-cream border border-sand rounded-[12px] py-3 pl-12 pr-4 outline-none" />
        </div>
        
        <div className="space-y-2">
          {data.thrMasuk.filter(t => t.namaPemberi.toLowerCase().includes(searchTerm.toLowerCase())).map((item, i) => (
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={item.id} className="border-b border-sand py-4 relative group">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-charcoal">{item.namaPemberi}</span>
                <span className="font-bold text-deepGreen">{formatRp(item.jumlah)}</span>
              </div>
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5,6].map(s => <Star key={s} className={`w-4 h-4 ${s <= item.rating ? 'text-gold fill-gold' : 'text-sand fill-sand'}`}/>)}
              </div>
              <div className="flex items-center gap-4 text-xs text-charcoal/70 font-medium">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5"/> {item.tanggal}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5"/> {item.kategori}</span>
              </div>
              <MoreVertical className="absolute right-0 top-4 w-5 h-5 text-charcoal/50 cursor-pointer" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
