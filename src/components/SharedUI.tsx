import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Instagram, Music, Github, Send, Star } from 'lucide-react';
import { THRAppData, THRMasuk, THRKeluar } from '../lib/store';

export const WelcomeModal = ({ onClose }: { onClose: () => void }) => {
  const [dontShow, setDontShow] = useState(false);
  const handleClose = () => { if (dontShow) onClose(); else onClose(); }; // Logic ditangani di parent

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-whiteSoft rounded-[24px] shadow-3d max-w-md w-full p-8 text-center relative overflow-hidden">
        <h2 className="font-amiri text-4xl text-gold mb-2">اَلسَّلَامُ عَلَيْكُمْ</h2>
        <h1 className="font-playfair text-2xl text-deepGreen font-bold mb-4">SELAMAT DATANG DI THR TRACKER 1446 H</h1>
        <div className="h-px w-full bg-sand mb-4"></div>
        <p className="font-inter text-charcoal text-sm leading-relaxed mb-6">
          Assalamualaikum warahmatullahi wabarakatuh.<br/>Kami dari developer mengucapkan Minal Aidzin Wal Faidzin, mohon maaf lahir dan batin.<br/>Selamat mencatat dan mengelola THR Anda dengan penuh berkah.<br/><span className="font-bold">— R_hmt ofc</span>
        </p>
        
        <div className="grid grid-cols-3 gap-3 mb-3">
          <a href="https://whatsapp.com/channel/0029VbBjyjlJ93wa6hwSWa0p" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-deepGreen hover:text-gold"><MessageCircle className="w-6 h-6"/></a>
          <a href="https://www.instagram.com/rahmt_nhw?igsh=MWQwcnB3bTA2ZnVidg==" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-deepGreen hover:text-gold"><Instagram className="w-6 h-6"/></a>
          <a href="https://www.tiktok.com/@r_hmtofc?_r=1&_t=ZS-94KRfWQjeUu" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-deepGreen hover:text-gold"><Music className="w-6 h-6"/></a>
        </div>
        <div className="flex justify-center gap-8 mb-6">
          <a href="https://github.com/rahmat-369" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-deepGreen hover:text-gold"><Github className="w-6 h-6"/></a>
          <a href="t.me/rAi_engine" target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1 text-deepGreen hover:text-gold"><Send className="w-6 h-6"/></a>
        </div>

        <label className="flex items-center justify-center gap-2 mb-6 cursor-pointer">
          <input type="checkbox" checked={dontShow} onChange={(e) => setDontShow(e.target.checked)} className="w-4 h-4 accent-deepGreen" />
          <span className="text-sm font-inter text-charcoal">Jangan tampilkan lagi</span>
        </label>
        
        <button onClick={() => { if(dontShow) localStorage.setItem('thr-tracker-data', JSON.stringify({...JSON.parse(localStorage.getItem('thr-tracker-data')||'{}'), settings: {welcomeDismissed: true}})); onClose(); }} className="w-full bg-deepGreen text-whiteSoft py-3 rounded-xl font-bold shadow-3d hover:shadow-3d-hover transition-all">MASUK APLIKASI</button>
      </motion.div>
    </motion.div>
  );
};

export const TransactionModal = ({ type, onClose, data, updateData }: { type: 'masuk'|'keluar', onClose: () => void, data: THRAppData, updateData: any }) => {
  const [formData, setFormData] = useState({ nama: '', jumlah: '', kategori: 'Keluarga', catatan: '', rating: 6, hubungan: '', tanggal: new Date().toISOString().split('T')[0] });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { id: Date.now().toString(), jumlah: Number(formData.jumlah), tanggal: formData.tanggal, catatan: formData.catatan };
    
    if (type === 'masuk') {
      const newMasuk: THRMasuk = { ...payload, namaPemberi: formData.nama, rating: formData.rating as any, kategori: formData.kategori as any };
      updateData({ thrMasuk: [newMasuk, ...data.thrMasuk] });
    } else {
      const newKeluar: THRKeluar = { ...payload, namaPenerima: formData.nama, hubungan: formData.hubungan };
      updateData({ thrKeluar: [newKeluar, ...data.thrKeluar] });
    }
    onClose();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-whiteSoft rounded-[24px] shadow-3d max-w-[500px] w-full p-6 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-charcoal hover:text-red-500"><X className="w-6 h-6"/></button>
        <h2 className="font-playfair text-2xl font-bold text-deepGreen mb-6">{type === 'masuk' ? 'Tambah Catatan THR Masuk' : 'Catat Keluar'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 font-inter">
          <div>
            <label className="block text-sm font-bold text-charcoal mb-1">{type === 'masuk' ? 'Nama Pemberi' : 'Nama Penerima'}</label>
            <input required type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full bg-cream border border-sand rounded-xl p-3 outline-none focus:border-deepGreen" />
          </div>
          <div>
            <label className="block text-sm font-bold text-charcoal mb-1">Jumlah (Rp)</label>
            <input required type="number" min="1" value={formData.jumlah} onChange={e => setFormData({...formData, jumlah: e.target.value})} className="w-full bg-cream border border-sand rounded-xl p-3 outline-none focus:border-deepGreen" />
          </div>
          
          {type === 'masuk' ? (
            <>
              <div>
                <label className="block text-sm font-bold text-charcoal mb-1">Kategori</label>
                <select value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full bg-cream border border-sand rounded-xl p-3 outline-none">
                  {['Keluarga', 'Tetangga', 'Teman', 'Kerabat', 'Lainnya'].map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-charcoal mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5,6].map(s => (
                    <Star key={s} onClick={() => setFormData({...formData, rating: s})} className={`w-8 h-8 cursor-pointer transition-transform hover:scale-110 ${s <= formData.rating ? 'text-gold fill-gold' : 'text-sand fill-sand'}`} />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-bold text-charcoal mb-1">Hubungan</label>
              <input required type="text" placeholder="Contoh: Keponakan" value={formData.hubungan} onChange={e => setFormData({...formData, hubungan: e.target.value})} className="w-full bg-cream border border-sand rounded-xl p-3 outline-none focus:border-deepGreen" />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-bold text-charcoal mb-1">Tanggal</label>
            <input required type="date" value={formData.tanggal} onChange={e => setFormData({...formData, tanggal: e.target.value})} className="w-full bg-cream border border-sand rounded-xl p-3 outline-none focus:border-deepGreen" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-charcoal mb-1">Catatan (Opsional)</label>
            <textarea value={formData.catatan} onChange={e => setFormData({...formData, catatan: e.target.value})} className="w-full bg-cream border border-sand rounded-xl p-3 outline-none focus:border-deepGreen h-20"></textarea>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 border-2 border-deepGreen text-deepGreen py-3 rounded-xl font-bold hover:bg-deepGreen/10">Batal</button>
            <button type="submit" className="flex-1 bg-deepGreen text-whiteSoft py-3 rounded-xl font-bold shadow-3d hover:shadow-3d-hover">Simpan</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
