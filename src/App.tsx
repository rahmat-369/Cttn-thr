import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, Wallet, ArrowDownCircle, ArrowUpCircle, Sparkles, 
  RefreshCw, ChevronLeft, ChevronRight, Shuffle, Plus, 
  Search, Star, Calendar, Users, Edit, Trash2, 
  MessageCircle, Info, X, ArrowLeft, Send, 
  Instagram, Music, Github, Home, Download, RotateCcw,
  Code2, Cpu, Database, Zap
} from 'lucide-react';

// ==========================================
// TIPE DATA & CONSTANTS
// ==========================================
interface THRMasuk { id: string; namaPemberi: string; jumlah: number; rating: number; tanggal: string; kategori: string; catatan?: string; }
interface THRKeluar { id: string; namaPenerima: string; jumlah: number; hubungan: string; tanggal: string; catatan?: string; }
interface THRAppData { settings: { welcomeDismissed: boolean }; thrMasuk: THRMasuk[]; thrKeluar: THRKeluar[]; stats: any; }

const LEBARAN_DATE = '2025-03-31';
const IDUL_FITRI_ICON = "https://png.pngtree.com/png-clipart/20210514/ourmid/pngtree-simple-greeting-selamat-hari-raya-idul-fitri-icon-png-image_3295689.png";
const DEV_AVATAR = "https://res.cloudinary.com/dwiozm4vz/image/upload/v1772959730/ootglrvfmykn6xsto7rq.png";

const DEFAULT_DATA: THRAppData = { settings: { welcomeDismissed: false }, thrMasuk: [], thrKeluar: [], stats: { totalDiterima: 0, totalDiberikan: 0, rataRata: 0, kategoriTerbanyak: '-' } };

const QUOTES = [
  "Taqabbalallahu minna wa minkum, shiyamana wa shiyamakum.",
  "Keberkahan THR bukan pada jumlahnya, melainkan pada rasa syukurnya.",
  "Silaturahmi menyambung rezeki. Jadikan momen ini untuk mempererat persaudaraan.",
  "Sisihkan sebagian untuk mereka yang membutuhkan, niscaya rezekimu bertambah."
];

// UTILS
const formatRp = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
const getDaysToLebaran = () => { const diff = Math.ceil((new Date(LEBARAN_DATE).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)); return diff > 0 ? `H-${diff}` : `H+${Math.abs(diff)}`; };
const calculateRelativeDay = (d: string) => { const diff = Math.round((new Date(d).getTime() - new Date(LEBARAN_DATE).getTime()) / (1000 * 60 * 60 * 24)); return diff === 0 ? 'H0' : diff < 0 ? `H${diff}` : `H+${diff}`; };

// ==========================================
// STYLES INJECTION (Glassmorphism & PWA Tweaks)
// ==========================================
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Manrope:wght@400;500;700;800&family=Playfair+Display:ital,wght@0,500;0,700;1,600&display=swap');
  
  :root { --deep-green: #0A4D2E; --gold: #C49A2B; --cream: #F9F1E0; --sand: #E5D5B0; }
  body { 
    background-color: var(--cream); font-family: 'Manrope', sans-serif; 
    overflow-x: hidden; -webkit-tap-highlight-color: transparent; 
    overscroll-behavior-y: none; /* PWA behavior */
  }
  
  .font-heading { font-family: 'Playfair Display', serif; }
  .font-arabic { font-family: 'Amiri', serif; }
  
  /* Modern Glass Utilities */
  .glass-panel { background: rgba(249, 241, 224, 0.65); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.6); }
  .glass-card { background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(249,241,224,0.95) 100%); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 1); box-shadow: 0 12px 40px rgba(10, 77, 46, 0.06); }
  
  /* Patern & Scrollbar */
  .islamic-pattern { background-image: radial-gradient(rgba(196, 154, 43, 0.15) 1px, transparent 1px); background-size: 24px 24px; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 10px; }

  /* Dev Extracted from HTML */
  .glow-avatar-rhmt { box-shadow: 0 0 50px 10px rgba(59, 130, 246, 0.5); }
  .gradient-text { background: linear-gradient(to right, #0A4D2E, #C49A2B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
`;

// ==========================================
// MOCK AI SERVICE
// ==========================================
const aiService = {
  generateQuote: async (d: THRAppData) => new Promise<string>(res => setTimeout(() => res(d.thrMasuk.length === 0 ? "Catat THR pertamamu untuk memulai perjalanan keberkahan tahun ini." : `Dari ${d.thrMasuk.length} pintu rezeki, terkumpul ${formatRp(d.stats.totalDiterima)}. Kelola dengan bijaksana.`), 600)),
  chat: async (msg: string, d: THRAppData) => new Promise<string>(res => setTimeout(() => {
    const s = d.stats.totalDiterima - d.stats.totalDiberikan;
    if (msg.toLowerCase().includes("habis")) res(`Sisa THR Anda adalah ${formatRp(s)}. Segera amankan 20% dari sisa tersebut untuk tabungan darurat sebelum terpakai.`);
    else if (msg.toLowerCase().includes("hemat")) res(`Saran alokasi dari total ${formatRp(d.stats.totalDiterima)}: 40% Kebutuhan Lebaran, 30% Kewajiban/Utang, 20% Tabungan, 10% Sedekah.`);
    else res(`Sistem mendeteksi saldo bersih Anda ${formatRp(s)}. Ada spesifik rencana keuangan yang ingin dianalisis hari ini?`);
  }, 1200))
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [data, setData] = useState<THRAppData>(() => { try { const s = localStorage.getItem('thr-tracker-data'); return s ? JSON.parse(s) : DEFAULT_DATA; } catch { return DEFAULT_DATA; } });
  const [route, setRoute] = useState<'dashboard' | 'chat' | 'about'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalState, setModalState] = useState<{isOpen: boolean, type: 'masuk'|'keluar'|null, editId: string|null}>({ isOpen: false, type: null, editId: null });

  useEffect(() => { const s = document.createElement("style"); s.innerText = STYLES; document.head.appendChild(s); return () => s.remove(); }, []);

  useEffect(() => {
    const totalDiterima = data.thrMasuk.reduce((sum, item) => sum + item.jumlah, 0);
    const totalDiberikan = data.thrKeluar.reduce((sum, item) => sum + item.jumlah, 0);
    const cats = data.thrMasuk.map(i => i.kategori).reduce((acc, cat) => { acc[cat] = (acc[cat] || 0) + 1; return acc; }, {} as Record<string, number>);
    const sortedCats = Object.keys(cats).sort((a, b) => cats[b] - cats[a]);
    localStorage.setItem('thr-tracker-data', JSON.stringify({ ...data, stats: { totalDiterima, totalDiberikan, rataRata: data.thrMasuk.length ? totalDiterima / data.thrMasuk.length : 0, kategoriTerbanyak: sortedCats.length ? sortedCats[0] : '-' } }));
  }, [data.thrMasuk, data.thrKeluar]);

  const handleExport = () => { const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `Backup-THR-${new Date().toISOString().slice(0,10)}.json`; a.click(); setIsSidebarOpen(false); };
  const handleReset = () => { if(window.confirm("Yakin ingin menghapus seluruh data THR?")) { setData(DEFAULT_DATA); localStorage.removeItem('thr-tracker-data'); setIsSidebarOpen(false); } };

  return (
    <div className="min-h-screen islamic-pattern relative flex flex-col text-[#2C3E2F]">
      {/* Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#C49A2B]/10 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-[#0A4D2E]/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Splash Screen */}
      <AnimatePresence>
        {!data.settings.welcomeDismissed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }} transition={{ duration: 0.8 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xl">
            <motion.div initial={{ y: 50, scale: 0.8 }} animate={{ y: 0, scale: 1 }} transition={{ type: "spring", damping: 25, stiffness: 120 }} className="bg-white/90 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 max-w-sm w-full shadow-[0_30px_60px_rgba(0,0,0,0.2)] flex flex-col items-center text-center relative border border-white/50">
              <motion.img animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} src={IDUL_FITRI_ICON} alt="Idul Fitri" className="w-28 h-28 mb-6 drop-shadow-2xl" />
              <h2 className="font-arabic text-3xl text-[#C49A2B] mb-2 drop-shadow-sm">اَلسَّلَامُ عَلَيْكُمْ</h2>
              <h3 className="font-heading text-2xl font-black text-[#0A4D2E] mb-6 tracking-tight leading-tight">SELAMAT DATANG<br/>DI THR TRACKER</h3>
              <p className="text-[#2C3E2F] mb-8 leading-relaxed text-sm font-medium opacity-80">Catat, kelola, dan amankan arus kas hari raya Anda dengan asisten AI cerdas kami.</p>
              <button onClick={() => setData(p => ({ ...p, settings: { ...p.settings, welcomeDismissed: true } }))} className="w-full py-4 px-6 bg-[#0A4D2E] text-white rounded-2xl font-black text-lg transition-all hover:bg-[#C49A2B] hover:shadow-[0_10px_30px_rgba(196,154,43,0.4)] active:scale-95 group overflow-hidden relative">
                <span className="relative z-10 flex items-center justify-center gap-2">MULAI <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" /></span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Navbar PWA Ready */}
      <header className="glass-panel sticky top-0 z-40 px-4 py-4 md:px-8 border-b border-white">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-white/70 hover:bg-white rounded-2xl shadow-sm transition-all text-[#0A4D2E]">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRoute('dashboard')}>
              <Wallet className="text-[#C49A2B] w-8 h-8 drop-shadow-sm" />
              <h1 className="font-heading text-xl md:text-2xl font-black gradient-text tracking-tight hidden sm:block">THR Tracker</h1>
            </div>
          </div>
          <div className="bg-white px-5 py-2 rounded-full shadow-sm flex items-center gap-2 border border-gray-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <span className="text-xs md:text-sm font-black text-[#0A4D2E] tracking-widest">{getDaysToLebaran()}</span>
          </div>
        </div>
      </header>

      {/* Sidebar / Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl z-50 flex flex-col">
              <div className="p-8 bg-[#0A4D2E] text-white flex justify-between items-start rounded-br-[3rem] relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                  <h2 className="font-heading text-3xl font-black mb-1">Menu</h2>
                  <p className="text-xs text-[#E5D5B0] font-bold tracking-widest uppercase">THR Tracker 1446 H</p>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/30 transition-colors relative z-10"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                <SidebarItem icon={<Home/>} label="Beranda" active={route==='dashboard'} onClick={() => { setRoute('dashboard'); setIsSidebarOpen(false); }} />
                <SidebarItem icon={<MessageCircle/>} label="AI Assistant" active={route==='chat'} onClick={() => { setRoute('chat'); setIsSidebarOpen(false); }} />
                <div className="h-px w-full bg-gray-100 my-6" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 px-4">Sistem & Data</p>
                <SidebarItem icon={<Download/>} label="Backup Data (JSON)" onClick={handleExport} />
                <SidebarItem icon={<RotateCcw/>} label="Reset Pabrik" danger onClick={handleReset} />
                <div className="h-px w-full bg-gray-100 my-6" />
                <SidebarItem icon={<Info/>} label="Developer Profile" active={route==='about'} onClick={() => { setRoute('about'); setIsSidebarOpen(false); }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 relative z-10 flex flex-col">
        <AnimatePresence mode="wait">
          {route === 'dashboard' && <Dashboard key="dash" data={data} setData={setData} openModal={(t, id=null) => setModalState({isOpen: true, type: t, editId: id})} navigate={setRoute} />}
          {route === 'chat' && <Chat key="chat" data={data} navigate={setRoute} />}
          {route === 'about' && <About key="about" navigate={setRoute} />}
        </AnimatePresence>
      </main>

      {/* Modals Transaksi */}
      <AnimatePresence>
        {modalState.isOpen && (
          <TransactionModal config={modalState} data={data} onClose={() => setModalState({isOpen: false, type: null, editId: null})} onSave={(newData) => {
              if (modalState.type === 'masuk') {
                if (modalState.editId) setData(p => ({...p, thrMasuk: p.thrMasuk.map(t => t.id === modalState.editId ? newData as THRMasuk : t)}));
                else setData(p => ({...p, thrMasuk: [newData as THRMasuk, ...p.thrMasuk]}));
              } else {
                setData(p => ({...p, thrKeluar: [newData as THRKeluar, ...p.thrKeluar]}));
              }
              setModalState({isOpen: false, type: null, editId: null});
          }}/>
        )}
      </AnimatePresence>
    </div>
  );
}

const SidebarItem = ({ icon, label, onClick, active, danger }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-sm
    ${active ? 'bg-[#0A4D2E] text-white shadow-lg shadow-[#0A4D2E]/20 translate-x-2' : danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-100 hover:translate-x-1'}
  `}>
    {React.cloneElement(icon, { size: 20 })} {label}
  </button>
);
const ArrowRight = ({size, className}:any) => <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/></svg>;

// ==========================================
// DASHBOARD
// ==========================================
const Dashboard = ({ data, setData, openModal, navigate }: any) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [aiQuoteStr, setAiQuoteStr] = useState("Memuat pesan keberkahan...");
  const [searchTerm, setSearchTerm] = useState("");
  
  const refreshAiQuote = async () => { setAiQuoteStr("Menganalisis data..."); setAiQuoteStr(await aiService.generateQuote(data)); };
  useEffect(() => { refreshAiQuote(); }, []);

  const filteredMasuk = data.thrMasuk.filter((item: THRMasuk) => item.namaPemberi.toLowerCase().includes(searchTerm.toLowerCase()) || item.kategori.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 pb-10">
      
      {/* Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.01 }} className="glass-card rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#C49A2B]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-white rounded-2xl shadow-sm"><Wallet className="text-[#0A4D2E]" size={24} /></div>
            <h3 className="font-heading text-sm md:text-base font-black text-gray-500 tracking-widest uppercase">Total THR Diterima</h3>
          </div>
          <p className="text-4xl md:text-6xl font-black text-[#0A4D2E] mb-10 tracking-tighter">{formatRp(data.stats.totalDiterima)}</p>
          <div className="flex flex-col sm:flex-row gap-4 relative z-10">
            <button onClick={() => openModal('masuk')} className="flex-1 bg-[#0A4D2E] text-white py-4 rounded-2xl font-black flex justify-center items-center gap-2 hover:bg-[#C49A2B] hover:shadow-lg transition-all active:scale-95"><ArrowDownCircle size={20}/> Catat Masuk</button>
            <button onClick={() => openModal('keluar')} className="flex-1 bg-white text-[#0A4D2E] border-2 border-gray-100 py-4 rounded-2xl font-black flex justify-center items-center gap-2 hover:bg-gray-50 transition-all active:scale-95"><ArrowUpCircle size={20}/> Catat Keluar</button>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} className="glass-card rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white rounded-2xl shadow-sm"><Sparkles className="text-[#C49A2B]" size={24} /></div>
              <h3 className="font-heading text-sm md:text-base font-black text-gray-500 tracking-widest uppercase">AI Insight</h3>
            </div>
            <div className="bg-white/80 p-6 rounded-3xl rounded-tl-none border border-white shadow-sm">
              <p className="text-[#2C3E2F] leading-relaxed font-bold italic">"{aiQuoteStr}"</p>
            </div>
          </div>
          <button onClick={refreshAiQuote} className="mt-6 self-start bg-white px-5 py-2.5 rounded-full text-[#0A4D2E] font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
            <RefreshCw size={16} /> Refresh Insight
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column (List) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-10 border border-white shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
              <h3 className="font-heading text-2xl font-black text-[#0A4D2E]">Riwayat THR</h3>
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Cari pemberi..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full md:w-64 pl-12 pr-5 py-4 rounded-2xl bg-white border-2 border-gray-100 focus:border-[#C49A2B] outline-none font-bold text-sm transition-colors" />
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {filteredMasuk.length === 0 ? (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-16 text-gray-400 bg-white/50 rounded-[2rem] border-2 border-dashed border-gray-200 font-bold">Belum ada data THR masuk.</motion.div>
                ) : (
                  filteredMasuk.map((item: THRMasuk, i: number) => (
                    <motion.div key={item.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-[2rem] p-6 flex flex-col sm:flex-row justify-between gap-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all group"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-black text-xl text-[#0A4D2E] uppercase tracking-tight">{item.namaPemberi}</span>
                          <span className="px-3 py-1 bg-[#F9F1E0] text-[#C49A2B] text-[10px] font-black rounded-full uppercase tracking-wider">{item.kategori}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-3">
                          {[1,2,3,4,5,6].map(s => <Star key={s} size={16} className={s <= item.rating ? "fill-[#C49A2B] text-[#C49A2B]" : "text-gray-100"} />)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-bold"><Calendar size={14}/> {item.tanggal} ({calculateRelativeDay(item.tanggal)})</div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-end justify-between">
                        <span className="font-black text-2xl text-[#0A4D2E]">{formatRp(item.jumlah)}</span>
                        <div className="flex gap-2">
                          <button onClick={() => openModal('masuk', item.id)} className="p-2 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"><Edit size={16}/></button>
                          <button onClick={() => setData((p:any) => ({...p, thrMasuk: p.thrMasuk.filter((t:any) => t.id !== item.id)}))} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column (Stats) */}
        <div className="space-y-6">
          <div className="glass-card rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="font-heading font-black text-xl text-[#0A4D2E] mb-6">Statistik Finansial</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center bg-white/60 p-4 rounded-2xl border border-white">
                <span className="text-gray-500 text-xs font-black uppercase tracking-wider">Total Diterima</span>
                <span className="text-[#0A4D2E] font-black">{formatRp(data.stats.totalDiterima)}</span>
              </div>
              <div className="flex justify-between items-center bg-white/60 p-4 rounded-2xl border border-white">
                <span className="text-gray-500 text-xs font-black uppercase tracking-wider">Total Diberikan</span>
                <span className="text-red-500 font-black">-{formatRp(data.stats.totalDiberikan)}</span>
              </div>
              <div className="flex justify-between items-center bg-[#0A4D2E] p-5 rounded-2xl text-white shadow-lg shadow-[#0A4D2E]/30">
                <span className="text-sm font-black uppercase tracking-wider">THR Bersih</span>
                <span className="text-2xl font-black text-[#C49A2B]">{formatRp(data.stats.totalDiterima - data.stats.totalDiberikan)}</span>
              </div>
            </div>
            <div className="bg-white/80 p-5 rounded-2xl border border-white text-center">
               <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em] mb-2">Pemberi Terbanyak</p>
               <p className="text-xl font-black text-[#0A4D2E]">{data.stats.kategoriTerbanyak}</p>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white text-center">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Mutiara Lebaran</h4>
            <p className="font-arabic text-2xl text-[#2C3E2F] mb-6 min-h-[80px] flex items-center justify-center leading-relaxed drop-shadow-sm">{QUOTES[quoteIndex]}</p>
            <button onClick={() => setQuoteIndex(Math.floor(Math.random() * QUOTES.length))} className="bg-white p-4 rounded-full hover:bg-[#C49A2B] hover:text-white transition-all text-[#0A4D2E] shadow-sm"><Shuffle size={18} /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// AI CHAT (Futuristik Upgrade)
// ==========================================
const Chat = ({ data, navigate }: any) => {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([{ role: 'ai', content: "Halo! Saya AI Assistant Anda. Mari rencanakan keuangan Lebaran Anda dengan cermat berdasarkan data THR yang telah terkumpul." }]);
  const [input, setInput] = useState(""); const [isLoading, setIsLoading] = useState(false); const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return; setInput(""); setMessages(p => [...p, { role: 'user', content: text }]); setIsLoading(true);
    const response = await aiService.chat(text, data);
    setMessages(p => [...p, { role: 'ai', content: response }]); setIsLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex-1 h-[calc(100vh-140px)] flex flex-col bg-white/90 backdrop-blur-2xl rounded-[3rem] overflow-hidden shadow-2xl border border-white">
      <div className="bg-white px-8 py-5 flex items-center justify-between border-b border-gray-100 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('dashboard')} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={20} className="text-gray-600"/></button>
          <div><h2 className="font-heading font-black text-xl text-[#0A4D2E]">AI THR ASSISTANT</h2><div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">System Online</p></div></div>
        </div>
        <Sparkles className="text-[#C49A2B] opacity-50" size={24}/>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-transparent to-[#F9F1E0]/30">
        {messages.map((m, i) => (
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 text-sm md:text-base leading-relaxed font-bold shadow-sm ${m.role === 'user' ? 'bg-[#0A4D2E] text-white rounded-[24px_24px_4px_24px]' : 'bg-white text-[#2C3E2F] border border-gray-100 rounded-[24px_24px_24px_4px]'}`}>
              {m.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start"><div className="bg-white p-5 rounded-[24px_24px_24px_4px] flex gap-2 border border-gray-100 shadow-sm"><motion.div animate={{scale:[1,1.5,1], opacity:[0.5,1,0.5]}} transition={{repeat:Infinity, duration:1}} className="w-2 h-2 bg-[#C49A2B] rounded-full"/><motion.div animate={{scale:[1,1.5,1], opacity:[0.5,1,0.5]}} transition={{repeat:Infinity, duration:1, delay:0.2}} className="w-2 h-2 bg-[#C49A2B] rounded-full"/><motion.div animate={{scale:[1,1.5,1], opacity:[0.5,1,0.5]}} transition={{repeat:Infinity, duration:1, delay:0.4}} className="w-2 h-2 bg-[#C49A2B] rounded-full"/></div></div>
        )}
        <div ref={endRef} />
      </div>

      <div className="bg-white p-6 border-t border-gray-100">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
          {["Sisa THR?", "Tips hemat", "Alokasi Dana"].map(chip => (
             <button key={chip} onClick={() => handleSend(chip)} className="whitespace-nowrap px-5 py-2.5 bg-gray-50 border border-gray-100 text-[#0A4D2E] text-xs font-black rounded-full hover:bg-gray-100 transition-colors uppercase tracking-wider">{chip}</button>
          ))}
        </div>
        <div className="flex gap-3 relative">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend(input)} placeholder="Tanyakan seputar keuangan..." className="flex-1 bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-6 py-4 focus:border-[#0A4D2E] outline-none font-bold text-gray-700 transition-colors" />
          <button onClick={() => handleSend(input)} disabled={!input.trim()} className="w-16 h-16 bg-[#0A4D2E] text-white rounded-[2rem] flex items-center justify-center hover:bg-[#C49A2B] transition-all shadow-lg shadow-[#0A4D2E]/30 disabled:opacity-50 disabled:shadow-none"><Send size={20} className="ml-1" /></button>
        </div>
      </div>
    </motion.div>
  );
};

// ==========================================
// ABOUT DEVELOPER (HANYA DATA R_hmt)
// ==========================================
const About = ({ navigate }: { navigate: any }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto space-y-8 pb-10">
    <button onClick={() => navigate('dashboard')} className="flex items-center gap-2 bg-white px-6 py-3 rounded-full text-[#0A4D2E] hover:bg-gray-50 transition-all font-black shadow-sm text-sm uppercase tracking-wider w-fit">
      <ArrowLeft size={18}/> Kembali
    </button>

    <div className="glass-card rounded-[3rem] p-8 md:p-16 text-center relative overflow-hidden border-2 border-white shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
      {/* Abstract Backgrounds */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px]" />
      
      {/* Avatar Section - Extracted strictly from HTML (R_hmt only) */}
      <div className="relative mb-8 mt-4">
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
         <img src={DEV_AVATAR} alt="R_hmt" className="relative w-36 h-36 md:w-48 md:h-48 rounded-full object-cover border-[3px] border-blue-400/50 glow-avatar-rhmt mx-auto z-10 hover:scale-105 transition-transform duration-700" />
      </div>

      <h2 className="font-heading text-4xl md:text-6xl font-black text-[#0A4D2E] mb-2 tracking-tight">R_hmt ofc</h2>
      <p className="font-black text-blue-500 text-xs md:text-sm tracking-[0.3em] uppercase mb-8">AI Prompt Engineer</p>
      
      <div className="inline-block bg-[#0A4D2E] text-white px-8 py-3 rounded-full font-mono text-xs md:text-sm tracking-widest shadow-xl shadow-[#0A4D2E]/20 mb-12">
        ✧･ﾟ: [𝙍]𝙝𝙢𝙏 | 𝘾𝙤دة⚙️𝘼𝙄 𝙡 :･ﾟ✧
      </div>

      {/* Tech Stack */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 relative z-10">
        <TechBadge icon={<Code2 size={16}/>} label="React + TS" />
        <TechBadge icon={<Zap size={16}/>} label="Vite PWA" />
        <TechBadge icon={<Database size={16}/>} label="Local Storage" />
        <TechBadge icon={<Cpu size={16}/>} label="AI Logic" />
      </div>

      {/* Social Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 text-left relative z-10">
        <SocialCard icon={<MessageCircle/>} title="WhatsApp" link="https://whatsapp.com/channel/0029VbBjyjlJ93wa6hwSWa0p" />
        <SocialCard icon={<Instagram/>} title="Instagram" link="https://www.instagram.com/rahmt_nhw?igsh=MWQwcnB3bTA2ZnVidg==" />
        <SocialCard icon={<Music/>} title="TikTok" link="https://www.tiktok.com/@r_hmtofc?_r=1&_t=ZS-94KRfWQjeUu" />
        <SocialCard icon={<Github/>} title="GitHub" link="https://github.com/rahmat-369" />
      </div>
    </div>
  </motion.div>
);

const TechBadge = ({icon, label}:any) => (
  <div className="flex items-center gap-2 bg-white/80 border border-white px-4 py-2 rounded-xl text-xs font-black text-[#0A4D2E] shadow-sm uppercase tracking-wider">
    {icon} {label}
  </div>
);

const SocialCard = ({ icon, title, link }: any) => (
  <a href={link} target="_blank" rel="noreferrer" className="bg-white/90 backdrop-blur p-5 rounded-[2rem] border border-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex items-center gap-4">
    <div className="p-4 bg-gray-50 text-[#0A4D2E] rounded-2xl group-hover:bg-[#0A4D2E] group-hover:text-white transition-colors">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h4 className="font-black text-[#0A4D2E] text-sm uppercase tracking-wider">{title}</h4>
  </a>
);

// ==========================================
// FORM MODAL (ADD / EDIT)
// ==========================================
const TransactionModal = ({ config, data, onClose, onSave }: any) => {
  const isM = config.type === 'masuk';
  const existing = config.editId && isM ? data.thrMasuk.find((t:any) => t.id === config.editId) : null;
  const [formData, setFormData] = useState(existing || { id: crypto.randomUUID(), namaPemberi: '', namaPenerima: '', jumlah: '', rating: 6, tanggal: new Date().toISOString().split('T')[0], kategori: 'Keluarga', hubungan: '', catatan: '' });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); const p = { ...formData, jumlah: Number(formData.jumlah) }; if(!p.jumlah || p.jumlah<=0) return alert("Jumlah tidak valid"); onSave(p); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xl">
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#FEF9E7] rounded-[3rem] p-8 w-full max-w-lg shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative border-4 border-white overflow-y-auto max-h-[90vh]"
      >
        <button type="button" onClick={onClose} className="absolute right-6 top-6 p-3 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm transition-colors"><X size={20}/></button>
        <h2 className="font-heading text-2xl md:text-3xl font-black text-[#0A4D2E] mb-8 pr-10">{config.editId ? 'Edit Data THR' : `Catat THR ${isM ? 'Masuk' : 'Keluar'}`}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nama {isM ? 'Pemberi' : 'Penerima'}</label><input required type="text" value={isM ? formData.namaPemberi : formData.namaPenerima} onChange={e => setFormData(p => isM ? {...p, namaPemberi: e.target.value} : {...p, namaPenerima: e.target.value})} className="w-full bg-white border-2 border-white rounded-[2rem] px-6 py-4 focus:border-[#C49A2B] outline-none font-black text-[#0A4D2E] shadow-sm"/></div>
          <div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Jumlah (Rp)</label>
            <div className="relative"><span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-gray-400">Rp</span><input required type="number" min="1" value={formData.jumlah} onChange={e => setFormData(p => ({...p, jumlah: e.target.value}))} className="w-full bg-white border-2 border-white rounded-[2rem] pl-16 pr-6 py-4 focus:border-[#C49A2B] outline-none font-black text-3xl text-[#0A4D2E] shadow-sm"/></div>
          </div>
          {isM && (<div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Rating Keikhlasan</label><div className="flex gap-2 bg-white p-4 rounded-[2rem] shadow-sm w-fit">{[1,2,3,4,5,6].map(star => (<Star key={star} size={32} onClick={() => setFormData(p => ({...p, rating: star as any}))} className={`cursor-pointer transition-all ${star <= formData.rating ? "fill-[#C49A2B] text-[#C49A2B] scale-110 drop-shadow-md" : "text-gray-100 hover:text-[#C49A2B]/40"}`} />))}</div></div>)}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Tanggal</label><input required type="date" value={formData.tanggal} onChange={e => setFormData(p => ({...p, tanggal: e.target.value}))} className="w-full bg-white border-2 border-white rounded-[2rem] px-5 py-4 focus:border-[#C49A2B] outline-none font-bold text-sm shadow-sm text-gray-600"/></div>
            {isM ? (<div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Kategori</label><select value={formData.kategori} onChange={e => setFormData(p => ({...p, kategori: e.target.value}))} className="w-full bg-white border-2 border-white rounded-[2rem] px-5 py-4 focus:border-[#C49A2B] outline-none font-bold text-sm shadow-sm text-gray-600"><option>Keluarga</option><option>Tetangga</option><option>Teman</option><option>Kerabat</option><option>Lainnya</option></select></div>) : (<div><label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Hubungan</label><input required type="text" placeholder="Cth: Keponakan" value={formData.hubungan} onChange={e => setFormData(p => ({...p, hubungan: e.target.value}))} className="w-full bg-white border-2 border-white rounded-[2rem] px-5 py-4 focus:border-[#C49A2B] outline-none font-bold text-sm shadow-sm text-gray-600"/></div>)}
          </div>
          <div className="flex gap-4 pt-6">
            <button type="button" onClick={onClose} className="w-1/3 py-4 rounded-[2rem] bg-gray-100 text-gray-500 font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors">Batal</button>
            <button type="submit" className="w-2/3 py-4 rounded-[2rem] bg-[#0A4D2E] text-white font-black text-sm uppercase tracking-widest hover:bg-[#C49A2B] hover:shadow-lg transition-all active:scale-95">Simpan Data</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}; 
