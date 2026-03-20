import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Instagram, Music, Github, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-4 md:p-8 max-w-[800px] mx-auto font-inter space-y-6">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-deepGreen font-bold mb-4"><ArrowLeft/> Kembali ke Dashboard</button>
      
      <div className="border-2 border-sand rounded-[16px] p-8 text-center bg-whiteSoft shadow-sm">
        <h1 className="font-playfair text-4xl font-bold text-deepGreen mb-2">R_hmt ofc</h1>
        <p className="italic text-charcoal">"Code is my language, AI is my companion"</p>
        <div className="font-mono text-gold font-bold mt-4 tracking-[0.5em]">[R][h][m][t]</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <a href="https://whatsapp.com/channel/0029VbBjyjlJ93wa6hwSWa0p" target="_blank" className="bg-sand p-4 rounded-xl flex items-center gap-3 text-deepGreen"><MessageCircle/> <div><p className="text-xs font-bold">WhatsApp</p><p className="text-[10px]">Channel</p></div></a>
        <a href="https://www.instagram.com/rahmt_nhw?igsh=MWQwcnB3bTA2ZnVidg==" target="_blank" className="bg-sand p-4 rounded-xl flex items-center gap-3 text-deepGreen"><Instagram/> <div><p className="text-xs font-bold">Instagram</p><p className="text-[10px]">@rahmt_nhw</p></div></a>
        <a href="https://www.tiktok.com/@r_hmtofc?_r=1&_t=ZS-94KRfWQjeUu" target="_blank" className="bg-sand p-4 rounded-xl flex items-center gap-3 text-deepGreen"><Music/> <div><p className="text-xs font-bold">TikTok</p><p className="text-[10px]">@r_hmtofc</p></div></a>
        <a href="https://github.com/rahmat-369" target="_blank" className="bg-sand p-4 rounded-xl flex items-center gap-3 text-deepGreen"><Github/> <div><p className="text-xs font-bold">GitHub</p><p className="text-[10px]">@rahmat-369</p></div></a>
        <a href="t.me/rAi_engine" target="_blank" className="bg-sand p-4 rounded-xl flex items-center gap-3 text-deepGreen"><Send/> <div><p className="text-xs font-bold">Telegram</p><p className="text-[10px]">@rAi_engine</p></div></a>
      </div>

      <div className="bg-sand rounded-[16px] p-6">
        <h3 className="font-bold text-charcoal mb-4">TECHNOLOGY STACK</h3>
        <ul className="grid grid-cols-2 gap-2 text-sm text-charcoal/80 font-medium list-disc pl-4">
          <li>React 18 + TypeScript</li><li>Vite</li><li>TailwindCSS</li><li>Framer Motion</li>
          <li>Lucide React</li><li>React Router DOM</li><li>localStorage</li><li>OpenAI API</li>
        </ul>
      </div>

      <div className="bg-whiteSoft border-t-4 border-deepGreen p-6 rounded-b-[16px] text-center">
        <h3 className="font-bold text-charcoal mb-4 underline decoration-gold underline-offset-4">UCAPAN KHUSUS</h3>
        <p className="text-sm leading-relaxed text-charcoal">
          Assalamualaikum warahmatullahi wabarakatuh<br/>Selamat Hari Raya Idul Fitri 1446 H<br/>Mohon maaf lahir dan batin<br/>Semoga THR yang tercatat membawa berkah<br/>dan aplikasi ini bermanfaat bagi banyak orang.<br/><br/><span className="font-bold">Wassalam,<br/>R_hmt ofc</span>
        </p>
      </div>
    </motion.div>
  );
}
