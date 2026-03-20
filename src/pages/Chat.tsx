import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThrData } from '../lib/store';
import { chatWithAI } from '../lib/api';

export default function Chat() {
  const navigate = useNavigate();
  const { data } = useThrData();
  const [messages, setMessages] = useState<{role: string, content: string}[]>([{ role: 'assistant', content: 'Halo! Saya AI THR Assistant. Ada yang bisa saya bantu terkait pengelolaan THR Anda?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.filter(m => m.role !== 'system');
    const reply = await chatWithAI(text, data, history);
    setMessages(p => [...p, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex flex-col bg-cream font-inter">
      <div className="bg-deepGreen text-whiteSoft p-4 flex items-center gap-4 shadow-md z-10">
        <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => navigate('/')} />
        <h1 className="font-playfair font-bold text-xl tracking-wide">AI THR ASSISTANT</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 max-w-[80%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-deepGreen text-whiteSoft rounded-[18px_18px_4px_18px]' : 'bg-sand text-charcoal rounded-[18px_18px_18px_4px]'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div className="text-charcoal/50 text-sm italic">AI sedang mengetik...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="bg-whiteSoft p-4 border-t border-sand">
        <div className="flex gap-2 mb-3">
          {['THR habis?', 'Tips hemat', 'Investasi'].map(chip => (
            <button key={chip} onClick={() => handleSend(chip)} className="bg-sand text-deepGreen text-xs font-bold px-3 py-1.5 rounded-full">{chip}</button>
          ))}
        </div>
        <div className="relative">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend(input)} placeholder="Tanya seputar keuangan Lebaran..." className="w-full bg-cream border border-sand rounded-[24px] py-3 pl-4 pr-12 outline-none focus:border-deepGreen" />
          <button onClick={() => handleSend(input)} className="absolute right-2 top-2 bg-gold p-1.5 rounded-full text-whiteSoft"><Send className="w-5 h-5"/></button>
        </div>
      </div>
    </motion.div>
  );
                                            } 
