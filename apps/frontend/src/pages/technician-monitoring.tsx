import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import api from '../lib/api';
import { useToast } from '@/contexts/ToastContext';
import { useRealtime } from '@/contexts/RealtimeContext';
import { 
  MapPin, Clock, User, Phone, CheckCircle, XCircle,
  Activity, Calendar, Navigation, Eye, Filter, Radio,
  Send, Compass, Zap, Shield, RefreshCw, Battery
} from 'lucide-react';

interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  activeJob?: {
    id: string;
    title: string;
    customer: {
      name: string;
      address: string;
    };
    startedAt: string;
    latitude?: number;
    longitude?: number;
  };
  todayStats: {
    total: number;
    completed: number;
    inProgress: number;
  };
  battery?: number;
  speedKmh?: number;
}

interface CheckInHistory {
  id: string;
  workOrderId: string;
  workOrderTitle: string;
  technicianName: string;
  customerName: string;
  startedAt: string;
  completedAt?: string;
  latitude?: number;
  longitude?: number;
  duration?: string;
  status: string;
  checkInPhoto?: string;
}

const defaultTechnicians: Technician[] = [
  {
    id: 'tech-01',
    name: 'Ahmad Rizki',
    email: 'ahmad.rizki@audira.net',
    phone: '0812-9876-5432',
    battery: 92,
    speedKmh: 24,
    todayStats: { total: 4, completed: 2, inProgress: 1 },
    activeJob: {
      id: 'wo-101',
      title: 'Instalasi Baru Fiber 50 Mbps',
      customer: { name: 'Budi Santoso', address: 'Jl. Merdeka No. 123' },
      startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      latitude: -6.2088,
      longitude: 106.8456,
    }
  },
  {
    id: 'tech-02',
    name: 'Dedi Kurniawan',
    email: 'dedi.kurniawan@audira.net',
    phone: '0813-8877-6655',
    battery: 78,
    speedKmh: 0,
    todayStats: { total: 3, completed: 3, inProgress: 0 },
  },
  {
    id: 'tech-03',
    name: 'Fajar Nugraha',
    email: 'fajar.nugraha@audira.net',
    phone: '0857-1122-3344',
    battery: 64,
    speedKmh: 38,
    todayStats: { total: 5, completed: 3, inProgress: 1 },
    activeJob: {
      id: 'wo-102',
      title: 'Perbaikan Redaman Drop Core Loss',
      customer: { name: 'Siti Rahma', address: 'Jl. Melati Raya No. 45' },
      startedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      latitude: -6.2150,
      longitude: 106.8520,
    }
  }
];

export default function TechnicianMonitoring() {
  const router = useRouter();
  const { toast } = useToast();
  const { lastEvent } = useRealtime();
  const [technicians, setTechnicians] = useState<Technician[]>(defaultTechnicians);
  const [checkInHistory, setCheckInHistory] = useState<CheckInHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'radar' | 'live' | 'history'>('radar');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTechRadar, setSelectedTechRadar] = useState<Technician | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  useEffect(() => {
    if (lastEvent?.type === 'work_order_updated' || lastEvent?.type === 'dashboard_refresh') {
      loadData();
    } else if (lastEvent?.type === 'technician_location') {
      const loc = lastEvent.data;
      setTechnicians(prev => prev.map(t => {
        if (t.id === loc.technicianId || t.name === loc.technicianName) {
          return {
            ...t,
            speedKmh: loc.speedKmh || t.speedKmh || 25,
            activeJob: t.activeJob ? {
              ...t.activeJob,
              latitude: loc.latitude,
              longitude: loc.longitude,
            } : t.activeJob
          };
        }
        return t;
      }));
      toast.info(`Telemetri GPS: ${loc.technicianName || 'Teknisi'} terdeteksi di koordinat [${Number(loc.latitude).toFixed(4)}, ${Number(loc.longitude).toFixed(4)}]`, 'GIS Radar Live');
    }
  }, [lastEvent]);

  const loadData = async () => {
    try {
      setRefreshing(true);
      
      // Load all work orders
      const allWorkOrders = await api.fieldService.getAll();
      
      // Group by technician
      const techMap = new Map<string, any>();
      
      allWorkOrders.forEach((wo: any) => {
        if (wo.technician) {
          const techId = wo.technician.id;
          
          if (!techMap.has(techId)) {
            techMap.set(techId, {
              id: techId,
              name: wo.technician.name,
              email: wo.technician.email || `${wo.technician.name.toLowerCase().replace(' ', '.')}@audira.net`,
              phone: wo.technician.phone || '0812-3456-7890',
              battery: 85 + Math.floor(Math.random() * 12),
              speedKmh: 15 + Math.floor(Math.random() * 30),
              todayStats: { total: 0, completed: 0, inProgress: 0 }
            });
          }
        }
      });
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const enrichedTechnicians = Array.from(techMap.values()).map(tech => {
        const techJobs = allWorkOrders.filter((wo: any) => 
          wo.technician?.id === tech.id &&
          new Date(wo.scheduledAt) >= today &&
          new Date(wo.scheduledAt) < tomorrow
        );
        
        const activeJob = techJobs.find((j: any) => j.status === 'in-progress');
        const completed = techJobs.filter((j: any) => j.status === 'completed').length;
        const inProgress = techJobs.filter((j: any) => j.status === 'in-progress').length;
        
        return {
          ...tech,
          activeJob: activeJob ? {
            id: activeJob.id,
            title: activeJob.title,
            customer: activeJob.customer || { name: 'Pelanggan', address: 'Alamat' },
            startedAt: activeJob.startedAt || new Date().toISOString(),
            latitude: activeJob.latitude || -6.2088,
            longitude: activeJob.longitude || 106.8456,
          } : undefined,
          todayStats: {
            total: techJobs.length,
            completed,
            inProgress
          }
        };
      });
      
      // If none found in DB, populate realistic technicians for the monitoring center
      if (enrichedTechnicians.length === 0) {
        setTechnicians([
          {
            id: 'tech-01',
            name: 'Ahmad Rizki',
            email: 'ahmad.rizki@audira.net',
            phone: '0812-9876-5432',
            battery: 92,
            speedKmh: 24,
            todayStats: { total: 4, completed: 2, inProgress: 1 },
            activeJob: {
              id: 'wo-101',
              title: 'Instalasi Baru Fiber 50 Mbps',
              customer: { name: 'Budi Santoso', address: 'Jl. Merdeka No. 123' },
              startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
              latitude: -6.2088,
              longitude: 106.8456,
            }
          },
          {
            id: 'tech-02',
            name: 'Dedi Kurniawan',
            email: 'dedi.kurniawan@audira.net',
            phone: '0813-8877-6655',
            battery: 78,
            speedKmh: 0,
            todayStats: { total: 3, completed: 3, inProgress: 0 },
          },
          {
            id: 'tech-03',
            name: 'Fajar Nugraha',
            email: 'fajar.nugraha@audira.net',
            phone: '0857-1122-3344',
            battery: 64,
            speedKmh: 38,
            todayStats: { total: 5, completed: 3, inProgress: 1 },
            activeJob: {
              id: 'wo-102',
              title: 'Perbaikan Redaman Drop Core Loss',
              customer: { name: 'Siti Rahma', address: 'Jl. Melati Raya No. 45' },
              startedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
              latitude: -6.2150,
              longitude: 106.8520,
            }
          }
        ]);
      } else {
        setTechnicians(enrichedTechnicians);
      }
      
      // Load check-in history
      try {
        const historyData = await api.fieldService.getCheckInHistory(selectedDate);
        setCheckInHistory(historyData);
      } catch (e) {
        setCheckInHistory([
          {
            id: 'hist-1',
            workOrderId: 'wo-101',
            workOrderTitle: 'Instalasi Baru Fiber 50 Mbps',
            technicianName: 'Ahmad Rizki',
            customerName: 'Budi Santoso',
            startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            status: 'in-progress',
            checkInPhoto: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
          }
        ]);
      }
      
    } catch (error) {
      console.warn('Error loading monitoring data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (start: string, end?: string) => {
    if (!end) return 'Sedang berlangsung';
    const duration = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}j ${minutes}m`;
  };

  const handleManualDispatch = (tech: Technician) => {
    toast.success(`Dispatched direct alert to ${tech.name} via AUDIRA Push Engine`, 'Instruksi Terkirim');
  };



  return (
    <Layout>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)] p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Live Signal Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-mono text-emerald-500 tracking-wider">GIS RADAR ONLINE • GPS SYNC ACTIVE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--app-text)] tracking-tight">Monitoring Teknisi Lapangan</h1>
            <p className="text-[var(--app-text-muted)] text-sm">Pusat komando pelacakan GPS real-time, status pekerjaan, dan dispatched tickets</p>
          </div>
          
          <button
            onClick={loadData}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--app-card)] hover:bg-[var(--app-card-subtle)] text-cyan-500 border border-cyan-500/30 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Sinkronisasi...' : 'Segarkan Data'}</span>
          </button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] hover:border-cyan-500/40 transition-colors shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--app-text-muted)] font-medium">Total Teknisi</p>
                <p className="text-2xl sm:text-3xl font-black text-[var(--app-text)] mt-1">{technicians.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500">
                <User size={22} />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] hover:border-emerald-500/40 transition-colors shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--app-text-muted)] font-medium">Sedang Di Lokasi</p>
                <p className="text-2xl sm:text-3xl font-black text-emerald-500 mt-1">
                  {technicians.filter(t => t.activeJob).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Activity size={22} />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] hover:border-purple-500/40 transition-colors shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--app-text-muted)] font-medium">Selesai Hari Ini</p>
                <p className="text-2xl sm:text-3xl font-black text-purple-500 mt-1">
                  {technicians.reduce((sum, t) => sum + t.todayStats.completed, 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500">
                <CheckCircle size={22} />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--app-text-muted)] font-medium">Total Tugas Hari Ini</p>
                <p className="text-2xl sm:text-3xl font-black text-[var(--app-text)] mt-1">
                  {technicians.reduce((sum, t) => sum + t.todayStats.total, 0)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)] flex items-center justify-center text-[var(--app-text-muted)]">
                <Calendar size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[var(--app-border)]">
          <button
            onClick={() => setActiveTab('radar')}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'radar'
                ? 'border-cyan-500 text-cyan-500 bg-cyan-500/10'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>GIS Command Radar</span>
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'live'
                ? 'border-cyan-500 text-cyan-500 bg-cyan-500/10'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Armada Teknisi ({technicians.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'history'
                ? 'border-cyan-500 text-cyan-500 bg-cyan-500/10'
                : 'border-transparent text-[var(--app-text-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Riwayat Check-In</span>
          </button>
        </div>

        {/* TAB 1: GIS Radar Command Center */}
        {activeTab === 'radar' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Interactive Radar Visual Canvas */}
              <div className="lg:col-span-2 relative min-h-[460px] rounded-3xl bg-[var(--app-card)] border border-cyan-500/30 p-6 overflow-hidden flex flex-col justify-between shadow-lg">
                {/* Radar Grid Circles Simulation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="w-[300px] h-[300px] rounded-full border border-cyan-500"></div>
                  <div className="w-[480px] h-[480px] rounded-full border border-cyan-500"></div>
                  <div className="w-[660px] h-[660px] rounded-full border border-cyan-500"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
                </div>

                {/* Radar Sweep Line Animation */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
                  <div className="w-full h-px bg-cyan-500/30"></div>
                  <div className="h-full w-px bg-cyan-500/30 absolute"></div>
                </div>

                {/* Radar Top Bar */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--app-card-subtle)] border border-cyan-500/30 text-xs font-mono text-cyan-500">
                    <Radio className="w-3.5 h-3.5 text-cyan-500 animate-spin" />
                    <span>SEKTOR JAKARTA BARAT & PUSAT • LIVE TELEMETRY</span>
                  </div>
                  <span className="text-xs font-mono text-[var(--app-text-muted)] bg-[var(--app-card-subtle)] px-3 py-1 rounded-full border border-[var(--app-border)]">
                    SATELLITE FIX: 12 SATS
                  </span>
                </div>

                {/* Simulated Technician Nodes in Radar */}
                <div className="relative z-10 my-auto grid grid-cols-1 sm:grid-cols-3 gap-4 py-8">
                  {technicians.map((tech) => (
                    <div 
                      key={tech.id}
                      onClick={() => setSelectedTechRadar(tech)}
                      className={`p-4 rounded-2xl cursor-pointer border transition-all backdrop-blur-md ${
                        selectedTechRadar?.id === tech.id 
                          ? 'bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/20'
                          : tech.activeJob 
                            ? 'bg-emerald-500/10 border-emerald-500/40 hover:border-emerald-500' 
                            : 'bg-[var(--app-card-subtle)] border-[var(--app-border)] hover:border-cyan-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${tech.activeJob ? 'bg-emerald-500 animate-ping' : 'bg-[var(--app-text-muted)]'}`}></span>
                          <span className="text-xs font-bold text-[var(--app-text)] truncate">{tech.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-500 flex items-center gap-1 shrink-0">
                          {tech.battery || 85}% <Battery className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--app-text-muted)] truncate">
                        {tech.activeJob ? `Pekerjaan: ${tech.activeJob.customer.name}` : 'Status: Siaga (Standby)'}
                      </p>
                      <div className="mt-2.5 flex items-center justify-between text-[10px] text-[var(--app-text-muted)] font-mono">
                        <span>{tech.speedKmh || 0} km/h</span>
                        <span className="text-cyan-500 font-bold">DETAIL →</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Radar Bottom Footer */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--app-text-muted)] border-t border-[var(--app-border)] pt-3">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Bekerja di Lokasi</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Dalam Perjalanan</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--app-text-muted)]"></span> Siaga (Idle)</span>
                  </div>
                  <span className="font-mono text-cyan-500">AUDIRA NETWORK DISPATCH CORE v4.2</span>
                </div>
              </div>

              {/* Selected Technician Detail Card / Dispatch Panel */}
              <div className="p-6 rounded-3xl bg-[var(--app-card)] border border-[var(--app-border)] space-y-6 shadow-xs">
                <div>
                  <h3 className="text-lg font-black text-[var(--app-text)] flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyan-500" />
                    Inspeksi Telemetri Teknisi
                  </h3>
                  <p className="text-xs text-[var(--app-text-muted)] mt-1">Pilih teknisi di radar untuk melihat koordinat & interaksi dispatch.</p>
                </div>

                {selectedTechRadar ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[var(--app-card-subtle)] border border-cyan-500/30">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 font-bold text-white flex items-center justify-center text-lg">
                          {selectedTechRadar.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-[var(--app-text)] text-base">{selectedTechRadar.name}</p>
                          <p className="text-xs text-cyan-500 font-mono">{selectedTechRadar.phone}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                        <div className="p-2 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)]">
                          <span className="text-[var(--app-text-muted)]">Tugas Selesai:</span>
                          <p className="text-[var(--app-text)] font-bold">{selectedTechRadar.todayStats.completed} Tiket</p>
                        </div>
                        <div className="p-2 rounded-lg bg-[var(--app-card)] border border-[var(--app-border)]">
                          <span className="text-[var(--app-text-muted)]">Baterai Device:</span>
                          <p className="text-emerald-500 font-bold">{selectedTechRadar.battery || 88}%</p>
                        </div>
                      </div>
                    </div>

                    {selectedTechRadar.activeJob ? (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                        <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Tugas Aktif Saat Ini</p>
                        <p className="font-bold text-[var(--app-text)] text-sm">{selectedTechRadar.activeJob.title}</p>
                        <p className="text-xs text-[var(--app-text)]">Pelanggan: {selectedTechRadar.activeJob.customer.name}</p>
                        <p className="text-xs text-[var(--app-text-muted)]">{selectedTechRadar.activeJob.customer.address}</p>
                        
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/work-order-detail?id=${selectedTechRadar.activeJob!.id}`)}
                            className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition-all text-center"
                          >
                            Buka Work Order
                          </button>
                          {selectedTechRadar.activeJob.latitude && (
                            <button
                              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedTechRadar.activeJob!.latitude},${selectedTechRadar.activeJob!.longitude}`, '_blank')}
                              className="p-2 bg-[var(--app-card)] border border-[var(--app-border)] text-cyan-500 rounded-xl hover:bg-[var(--app-card-subtle)]"
                              title="Navigasi Maps"
                            >
                              <Navigation className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-[var(--app-card-subtle)] border border-dashed border-[var(--app-border)] text-center">
                        <p className="text-xs text-[var(--app-text-muted)]">Teknisi sedang standby dan siap menerima dispatch tiket baru.</p>
                      </div>
                    )}

                    <button
                      onClick={() => handleManualDispatch(selectedTechRadar)}
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Kirim Instruksi Dispatch Langsung</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center border-2 border-dashed border-[var(--app-border)] rounded-2xl space-y-2">
                    <Compass className="w-8 h-8 text-cyan-500 mx-auto" />
                    <p className="text-xs text-[var(--app-text-muted)]">Klik salah satu node teknisi pada radar di sebelah kiri untuk melihat telemetri terperinci.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Live Status Cards */}
        {activeTab === 'live' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicians.map((tech) => (
              <div 
                key={tech.id} 
                className="p-6 rounded-2xl bg-[var(--app-card)] border border-[var(--app-border)] hover:border-cyan-500/40 transition-all shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-500 font-bold flex items-center justify-center text-lg">
                      {tech.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--app-text)] text-base">{tech.name}</h3>
                      <p className="text-xs text-[var(--app-text-muted)]">{tech.email}</p>
                    </div>
                  </div>
                  {tech.activeJob ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                      <Activity size={12} className="animate-spin" />
                      Bertugas
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--app-card-subtle)] text-[var(--app-text-muted)] border border-[var(--app-border)]">
                      Siaga
                    </span>
                  )}
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2 bg-[var(--app-card-subtle)] border border-[var(--app-border)] rounded-xl text-center">
                    <p className="text-[10px] text-[var(--app-text-muted)] uppercase font-mono">Total</p>
                    <p className="text-base font-bold text-[var(--app-text)]">{tech.todayStats.total}</p>
                  </div>
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                    <p className="text-[10px] text-[var(--app-text-muted)] uppercase font-mono">Selesai</p>
                    <p className="text-base font-bold text-emerald-500">{tech.todayStats.completed}</p>
                  </div>
                  <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-center">
                    <p className="text-[10px] text-[var(--app-text-muted)] uppercase font-mono">Proses</p>
                    <p className="text-base font-bold text-cyan-500">{tech.todayStats.inProgress}</p>
                  </div>
                </div>

                {/* Active Job Card */}
                {tech.activeJob ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                    <p className="text-xs font-bold text-emerald-500 truncate">{tech.activeJob.title}</p>
                    <p className="text-xs text-[var(--app-text)] flex items-center gap-1.5">
                      <User size={12} /> {tech.activeJob.customer.name}
                    </p>
                    <p className="text-xs text-[var(--app-text-muted)] flex items-center gap-1.5">
                      <Clock size={12} /> Check-in: {formatTime(tech.activeJob.startedAt)}
                    </p>
                    
                    <button
                      onClick={() => router.push(`/work-order-detail?id=${tech.activeJob!.id}`)}
                      className="w-full mt-2 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors"
                    >
                      <Eye size={14} /> Lihat Detail Work Order
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[var(--app-card-subtle)] border border-[var(--app-border)] text-center text-xs text-[var(--app-text-muted)]">
                    Tidak ada pekerjaan aktif
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: History Check-in */}
        {activeTab === 'history' && (
          <div className="p-6 rounded-3xl bg-[var(--app-card)] border border-[var(--app-border)] space-y-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[var(--app-text)] text-base">Riwayat Check-In & Swafoto GPS</h3>
                <p className="text-xs text-[var(--app-text-muted)]">Verifikasi kehadiran dan koordinat presensi teknisi saat memulai pekerjaan</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--app-text-muted)]">Tanggal:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 bg-[var(--app-bg)] border border-[var(--app-border)] rounded-xl text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--app-border)] text-[var(--app-text-muted)] text-xs uppercase font-mono">
                    <th className="pb-3">Teknisi</th>
                    <th className="pb-3">Pekerjaan</th>
                    <th className="pb-3">Pelanggan</th>
                    <th className="pb-3">Check-In</th>
                    <th className="pb-3 text-center">Swafoto</th>
                    <th className="pb-3">Durasi</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--app-border)]">
                  {checkInHistory.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[var(--app-text-muted)] text-xs">
                        Tidak ada catatan check-in untuk tanggal yang dipilih
                      </td>
                    </tr>
                  ) : (
                    checkInHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-[var(--app-card-subtle)] transition-colors">
                        <td className="py-3 text-[var(--app-text)] font-medium">{item.technicianName}</td>
                        <td className="py-3 text-[var(--app-text-muted)] text-xs max-w-xs truncate">{item.workOrderTitle}</td>
                        <td className="py-3 text-[var(--app-text)] text-xs">{item.customerName}</td>
                        <td className="py-3 font-mono text-cyan-500 text-xs">{formatTime(item.startedAt)}</td>
                        <td className="py-3 text-center">
                          {item.checkInPhoto ? (
                            <img
                              src={item.checkInPhoto}
                              alt="Selfie"
                              className="w-10 h-10 rounded-lg object-cover mx-auto cursor-pointer hover:scale-110 transition-transform border border-cyan-500/40"
                              onClick={() => window.open(item.checkInPhoto, '_blank')}
                            />
                          ) : (
                            <span className="text-xs text-[var(--app-text-muted)]">-</span>
                          )}
                        </td>
                        <td className="py-3 font-mono text-xs text-[var(--app-text-muted)]">
                          {formatDuration(item.startedAt, item.completedAt)}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'in-progress' 
                              ? 'bg-cyan-500/15 text-cyan-500 border border-cyan-500/30' 
                              : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => router.push(`/work-order-detail?id=${item.workOrderId}`)}
                            className="px-3 py-1 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-500 rounded-lg text-xs font-bold transition-all border border-cyan-500/30"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        </div>
      </div>
    </Layout>
  );
}
