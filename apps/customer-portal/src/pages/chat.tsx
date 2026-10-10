import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../components/CustomerLayout';
import { Send, Paperclip, Image as ImageIcon, X, MessageCircle, Clock } from 'lucide-react';

interface Message {
  id: string;
  sender: 'customer' | 'agent';
  message: string;
  timestamp: Date;
  attachment?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  };
}

interface Agent {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

export default function LiveChat() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const customerData = localStorage.getItem('customer');
    if (!customerData) {
      router.push('/');
      return;
    }

    const parsed = JSON.parse(customerData);
    setCustomer(parsed);
    
    // Initialize chat
    initializeChat();
  }, [router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = () => {
    // Mock agent assignment
    setAgent({
      id: '1',
      name: 'Customer Service',
      avatar: 'https://ui-avatars.com/api/?name=CS&background=3b82f6&color=fff',
      status: 'online',
    });

    // Mock initial messages
    setMessages([
      {
        id: '1',
        sender: 'agent',
        message: 'Halo! Selamat datang di Live Chat AudiraNET. Ada yang bisa kami bantu?',
        timestamp: new Date(Date.now() - 60000),
      },
    ]);

    // Simulate typing indicator
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: '2',
            sender: 'agent',
            message: 'Kami siap membantu pertanyaan seputar tagihan, teknis, atau informasi layanan.',
            timestamp: new Date(),
          },
        ]);
      }, 2000);
    }, 3000);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachment) return;

    const messageData: Message = {
      id: Date.now().toString(),
      sender: 'customer',
      message: newMessage,
      timestamp: new Date(),
    };

    if (attachment) {
      // In production, upload to server first
      messageData.attachment = {
        type: attachment.type.startsWith('image/') ? 'image' : 'file',
        url: URL.createObjectURL(attachment),
        name: attachment.name,
      };
    }

    setMessages((prev) => [...prev, messageData]);
    setNewMessage('');
    setAttachment(null);

    // Simulate agent response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        'Terima kasih atas pertanyaan Anda. Saya akan cek informasinya terlebih dahulu.',
        'Baik, saya mengerti. Izinkan saya untuk membantu menyelesaikan masalah ini.',
        'Informasi Anda sudah saya terima. Mohon ditunggu sebentar.',
      ];
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          message: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
        },
      ]);
    }, 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      setAttachment(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-200px)]">
        <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={agent?.avatar}
                    alt={agent?.name}
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  {agent?.status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="font-semibold">{agent?.name}</div>
                  <div className="text-sm opacity-90">
                    {agent?.status === 'online' ? 'Online' : 'Offline'}
                  </div>
                </div>
              </div>
              <MessageCircle className="h-6 w-6" />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md ${
                    msg.sender === 'customer'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 shadow'
                  } rounded-lg p-3`}
                >
                  {msg.attachment && (
                    <div className="mb-2">
                      {msg.attachment.type === 'image' ? (
                        <img
                          src={msg.attachment.url}
                          alt={msg.attachment.name}
                          className="rounded max-w-full h-auto"
                        />
                      ) : (
                        <div className="flex items-center gap-2 bg-gray-100 rounded p-2">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm">{msg.attachment.name}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap">{msg.message}</div>
                  <div
                    className={`text-xs mt-1 ${
                      msg.sender === 'customer' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-900 shadow rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t p-4 bg-white rounded-b-lg">
            {attachment && (
              <div className="mb-2 flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                {attachment.type.startsWith('image/') ? (
                  <ImageIcon className="h-4 w-4 text-gray-600" />
                ) : (
                  <Paperclip className="h-4 w-4 text-gray-600" />
                )}
                <span className="text-sm text-gray-700 flex-1">{attachment.name}</span>
                <button
                  onClick={removeAttachment}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2">
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Paperclip className="h-5 w-5" />
              </button>

              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ketik pesan Anda..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={1}
              />

              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() && !attachment}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-2 text-xs text-gray-500">
              Tekan Enter untuk kirim, Shift+Enter untuk baris baru
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            'Cek Tagihan',
            'Lapor Gangguan',
            'Info Paket',
            'Cara Bayar',
          ].map((action) => (
            <button
              key={action}
              onClick={() => setNewMessage(action)}
              className="bg-white hover:bg-gray-50 border text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
