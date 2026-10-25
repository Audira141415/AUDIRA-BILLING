import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '@/components/CustomerLayout';
import { Send, Paperclip, MessageCircle, Clock, CheckCheck, Wifi, ShieldCheck, User } from 'lucide-react';

interface Message {
  id: string;
  sender: 'customer' | 'agent';
  message: string;
  timestamp: Date;
}

export default function LiveChat() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      router.push('/login');
      return;
    }

    const parsed = JSON.parse(customerData);
    setCustomer(parsed);
    
    // Initial welcome message
    setMessages([
      {
        id: '1',
        sender: 'agent',
        message: `Halo Kak ${parsed.name || 'Pelanggan'}! Selamat datang di Live Chat Resmi AudiraNET NOC. Ada kendala teknis atau pertanyaan yang bisa kami bantu?`,
        timestamp: new Date(Date.now() - 120000),
      },
    ]);

    const inet = parsed.internetNumber || parsed.id || 'NET-100234';
    if (!router.asPath.startsWith('/c/')) {
      router.replace(`/c/${inet}/chat`);
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'customer',
      message: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setNewMessage('');

    // Simulate NOC agent response
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'agent',
            message: 'Pesan Anda telah diterima oleh Tim NOC Standby. Kami sedang memverifikasi telemetri OLT dan konektivitas ONT router Anda.',
            timestamp: new Date(),
          },
        ]);
      }, 1500);
    }, 1000);
  };

  const inetIdentifier = customer?.internetNumber || customer?.id || 'NET-100234';

  return (
    <CustomerLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl p-6 sm:p-7 shadow-[4px_4px_0px_#000] flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                NOC Helpdesk 24/7 Siaga
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 dark:text-white">
              Live Chat & Konsultasi
            </h1>
            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1 max-w-xl">
              Saluran komunikasi langsung dengan operator Network Operations Center untuk panduan konfigurasi dan informasi kendala.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-[#070b14] border border-slate-200 dark:border-gray-800 rounded-xl shrink-0 font-mono text-xs">
            <span className="text-slate-500 dark:text-gray-400">ID Sesi:</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400">{inetIdentifier}</span>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white dark:bg-[#0c1322] border-2 border-black dark:border-gray-800 rounded-2xl shadow-[4px_4px_0px_#000] overflow-hidden flex flex-col h-[550px]">
          {/* Chat Top bar */}
          <div className="p-4 border-b border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-[#070b14] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-400 border border-black flex items-center justify-center text-black font-black">
                <Wifi className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <p className="font-black text-xs uppercase text-slate-950 dark:text-white">
                  Tim NOC AudiraNET
                </p>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Online (Respon Rata-rata &lt; 2 menit)
                </span>
              </div>
            </div>

            <a
              href={`https://wa.me/6282112001600?text=Halo%20NOC%20AudiraNET,%20saya%20pelanggan%20${inetIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg border border-black bg-emerald-400 hover:bg-emerald-300 text-black font-mono text-xs font-bold shadow-[2px_2px_0px_#000] transition-all"
            >
              Buka WhatsApp Resmi
            </a>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/50 dark:bg-[#060911]">
            {messages.map((msg) => {
              const isMe = msg.sender === 'customer';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md p-4 rounded-xl border-2 text-xs font-mono shadow-[2px_2px_0px_#000] ${
                      isMe
                        ? 'bg-cyan-400 text-black border-black'
                        : 'bg-white dark:bg-[#0d1627] text-slate-900 dark:text-white border-black dark:border-gray-700'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-70">
                      <span>{new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="p-3 rounded-xl border-2 border-black dark:border-gray-700 bg-white dark:bg-[#0d1627] text-slate-500 dark:text-gray-400 text-xs font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>Petugas NOC sedang mengetik balasan...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-[#0c1322] flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Tulis pesan atau pertanyaan ke Tim NOC..."
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-black dark:border-gray-700 bg-slate-50 dark:bg-[#070b14] text-xs font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="px-5 py-2.5 rounded-xl border-2 border-black bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-black font-mono text-xs font-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Kirim</span>
            </button>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
