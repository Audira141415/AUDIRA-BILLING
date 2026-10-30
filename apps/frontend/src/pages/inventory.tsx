import { useState, useEffect, useMemo, useRef } from 'react';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import { showAudiraToast } from '@/contexts/ToastContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  User,
  Calendar,
  AlertCircle,
  QrCode,
  Camera,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Wrench,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  HardDrive,
  Wifi,
  Radio,
  Download,
  RefreshCw,
  Barcode,
  Eye,
  FileText,
  Check,
  Layers,
  Phone,
  MapPin,
  ExternalLink,
  Zap,
  Printer,
  ChevronRight,
  Clock,
  Warehouse,
  Copy,
} from 'lucide-react';

interface CustomerInfo {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  internetNumber?: string;
}

interface Equipment {
  id: string;
  type: string;
  serialNumber: string;
  brand: string;
  model: string;
  macAddress?: string;
  status: 'available' | 'assigned' | 'maintenance' | 'damaged';
  customerId?: string | null;
  customer?: CustomerInfo | null;
  purchaseDate?: string;
  warrantyUntil?: string;
  vendor?: string;
  notes?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
  maintenanceLogs?: any[];
}

interface MaintenanceLog {
  id: string;
  equipmentId: string;
  type: string;
  description: string;
  cost?: number;
  status: string;
  scheduledAt: string;
  notes?: string;
  equipment?: {
    id: string;
    type: string;
    serialNumber: string;
    brand: string;
    model: string;
  };
  technician?: {
    id: string;
    name: string;
    email: string;
  };
}

interface ScanAuditItem {
  id: string;
  serialNumber: string;
  scannedAt: Date;
  status: 'MATCH' | 'UNKNOWN' | 'MISPLACED';
  equipment?: Equipment;
}

export default function Inventory() {
  // Navigation & Data States
  const [activeTab, setActiveTab] = useState<'katalog' | 'deployments' | 'maintenance' | 'scanner'>('katalog');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'sn' | 'brand' | 'status'>('newest');
  const [copiedSn, setCopiedSn] = useState<string | null>(null);

  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);
  const [formData, setFormData] = useState({
    type: 'ONT',
    serialNumber: '',
    brand: '',
    model: '',
    macAddress: '',
    vendor: '',
    location: '',
    purchaseDate: '',
    warrantyUntil: '',
    notes: '',
  });

  // Assign Modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState<Equipment | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Unassign Modal
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [unassignTarget, setUnassignTarget] = useState<Equipment | null>(null);
  const [unassignNewStatus, setUnassignNewStatus] = useState<'available' | 'maintenance' | 'damaged'>('available');

  // Maintenance Modal
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceTarget, setMaintenanceTarget] = useState<Equipment | null>(null);
  const [maintenanceForm, setMaintenanceForm] = useState({
    type: 'repair',
    description: '',
    cost: 0,
    scheduledAt: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // QR Modal
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrTarget, setQrTarget] = useState<Equipment | null>(null);

  // Barcode / Scanner Audit State
  const [scanInput, setScanInput] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [auditList, setAuditList] = useState<ScanAuditItem[]>([]);
  const scanInputRef = useRef<HTMLInputElement>(null);

  // Initial Load
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadEquipment(),
        loadStats(),
        loadCustomers(),
        loadMaintenanceLogs(),
      ]);
    } catch (err) {
      console.error('Error fetching inventory data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEquipment = async () => {
    try {
      const res = await api.inventory.getAll();
      if (res && res.equipment) {
        setEquipment(res.equipment);
      }
    } catch (err) {
      console.error('Failed to load equipment:', err);
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.inventory.getStats();
      if (res && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadCustomers = async () => {
    try {
      const res = await api.pelanggan.getAll();
      const list = Array.isArray(res) ? res : res.customers || res.data || [];
      setCustomers(list);
    } catch (err) {
      console.error('Failed to load customers:', err);
    }
  };

  const loadMaintenanceLogs = async () => {
    try {
      const res = await api.inventory.getMaintenanceLogs();
      if (res && res.logs) {
        setMaintenanceLogs(res.logs);
      }
    } catch (err) {
      console.error('Failed to load maintenance logs:', err);
    }
  };

  // Sound generator for barcode scanner
  const playScanBeep = (isSuccess: boolean = true) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      if (isSuccess) {
        osc.frequency.setValueAtTime(1760, audioCtx.currentTime); // High pitch A6
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else {
        osc.frequency.setValueAtTime(350, audioCtx.currentTime); // Low buzz
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.18);
      }
    } catch {
      // AudioContext not allowed without user interaction
    }
  };

  // Copy to clipboard helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSn(text);
    showAudiraToast.info(`Copied to clipboard: ${text}`, 'Tersalin');
    setTimeout(() => setCopiedSn(null), 2500);
  };

  // Auto-generate SN & MAC
  const generateRandomSN = (type: string) => {
    const prefix = type === 'ONT' ? 'ZTEG' : type === 'Router' ? 'MT-' : type === 'Switch' ? 'CS-' : 'AUD-';
    const randHex = Math.random().toString(16).substring(2, 10).toUpperCase();
    return `${prefix}${randHex}`;
  };

  const generateRandomMAC = () => {
    const octets = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0')
        .toUpperCase()
    );
    return octets.join(':');
  };

  // Add / Edit Equipment
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      type: 'ONT',
      serialNumber: generateRandomSN('ONT'),
      brand: 'ZTE',
      model: 'ZXHN F609 V5.3',
      macAddress: generateRandomMAC(),
      vendor: 'PT Fiber Telekomindo',
      location: 'Gudang A - Rak ONT #01',
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'ONT Siap pasang ke pelanggan baru FTTH',
    });
    setShowAddEditModal(true);
  };

  const handleOpenEdit = (item: Equipment) => {
    setEditingItem(item);
    setFormData({
      type: item.type,
      serialNumber: item.serialNumber || '',
      brand: item.brand || '',
      model: item.model || '',
      macAddress: item.macAddress || '',
      vendor: item.vendor || '',
      location: item.location || '',
      purchaseDate: item.purchaseDate ? new Date(item.purchaseDate).toISOString().split('T')[0] : '',
      warrantyUntil: item.warrantyUntil ? new Date(item.warrantyUntil).toISOString().split('T')[0] : '',
      notes: item.notes || '',
    });
    setShowAddEditModal(true);
  };

  const handleSaveEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serialNumber.trim()) {
      showAudiraToast.error('Serial Number wajib diisi!', 'Validasi');
      return;
    }

    setActionLoading(true);
    try {
      if (editingItem) {
        // Update
        await api.inventory.update(editingItem.id, {
          ...formData,
          purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : undefined,
          warrantyUntil: formData.warrantyUntil ? new Date(formData.warrantyUntil) : undefined,
        });
        showAudiraToast.success(`Perangkat ${formData.serialNumber} berhasil diperbarui!`, 'Berhasil');
      } else {
        // Create
        await api.inventory.create({
          ...formData,
          purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : new Date(),
          warrantyUntil: formData.warrantyUntil ? new Date(formData.warrantyUntil) : undefined,
        });
        showAudiraToast.success(`Perangkat baru ${formData.serialNumber} berhasil didaftarkan!`, 'Berhasil');
      }
      setShowAddEditModal(false);
      loadEquipment();
      loadStats();
    } catch (err: any) {
      showAudiraToast.error(err.message || 'Gagal menyimpan perangkat', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Equipment
  const handleDeleteEquipment = async (id: string, sn: string) => {
    if (!confirm(`Hapus permanen perangkat SN ${sn}? Log maintenance terkait juga akan dihapus.`)) return;

    setActionLoading(true);
    try {
      await api.inventory.delete(id);
      showAudiraToast.success(`Perangkat ${sn} berhasil dihapus dari inventory`, 'Dihapus');
      loadEquipment();
      loadStats();
    } catch (err: any) {
      showAudiraToast.error(err.message || 'Gagal menghapus perangkat', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  // Assign to Customer
  const handleOpenAssign = (item: Equipment) => {
    setAssignTarget(item);
    setSelectedCustomerId('');
    setCustomerSearchQuery('');
    setShowAssignModal(true);
  };

  const handleConfirmAssign = async () => {
    if (!assignTarget || !selectedCustomerId) {
      showAudiraToast.error('Pilih pelanggan tujuan terlebih dahulu!', 'Peringatan');
      return;
    }

    setActionLoading(true);
    try {
      await api.inventory.assign(assignTarget.id, selectedCustomerId);
      const cust = customers.find((c) => c.id === selectedCustomerId);
      showAudiraToast.success(
        `Perangkat ${assignTarget.serialNumber} berhasil dialokasikan ke ${cust?.name || 'Pelanggan'}!`,
        'Alokasi Berhasil'
      );
      setShowAssignModal(false);
      loadEquipment();
      loadStats();
    } catch (err: any) {
      showAudiraToast.error(err.message || 'Gagal mengalokasikan perangkat', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  // Unassign Equipment
  const handleOpenUnassign = (item: Equipment) => {
    setUnassignTarget(item);
    setUnassignNewStatus('available');
    setShowUnassignModal(true);
  };

  const handleConfirmUnassign = async () => {
    if (!unassignTarget) return;

    setActionLoading(true);
    try {
      await api.inventory.unassign(unassignTarget.id);
      // If user selected maintenance or damaged, update status
      if (unassignNewStatus !== 'available') {
        await api.inventory.update(unassignTarget.id, { status: unassignNewStatus });
      }

      showAudiraToast.success(
        `Perangkat ${unassignTarget.serialNumber} berhasil ditarik kembali ke inventory (${unassignNewStatus})!`,
        'Penarikan Sukses'
      );
      setShowUnassignModal(false);
      loadEquipment();
      loadStats();
    } catch (err: any) {
      showAudiraToast.error(err.message || 'Gagal menarik perangkat', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  // Maintenance Scheduling
  const handleOpenMaintenance = (item: Equipment) => {
    setMaintenanceTarget(item);
    setMaintenanceForm({
      type: 'repair',
      description: `Perbaikan port/adaptor/kondisi unit ${item.brand} ${item.model}`,
      cost: 50000,
      scheduledAt: new Date().toISOString().split('T')[0],
      notes: 'Pengecekan komponen optik dan daya adaptor',
    });
    setShowMaintenanceModal(true);
  };

  const handleSaveMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintenanceTarget) return;

    setActionLoading(true);
    try {
      await api.inventory.createMaintenanceLog({
        equipmentId: maintenanceTarget.id,
        type: maintenanceForm.type,
        description: maintenanceForm.description,
        cost: Number(maintenanceForm.cost) || 0,
        scheduledAt: new Date(maintenanceForm.scheduledAt).toISOString(),
        notes: maintenanceForm.notes,
      });

      showAudiraToast.success(
        `Jadwal servis untuk ${maintenanceTarget.serialNumber} berhasil dicatat! Status diubah ke Maintenance.`,
        'Tercatat'
      );
      setShowMaintenanceModal(false);
      loadEquipment();
      loadStats();
      loadMaintenanceLogs();
    } catch (err: any) {
      showAudiraToast.error(err.message || 'Gagal menjadwalkan servis', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  // Complete Maintenance
  const handleCompleteMaintenance = async (logId: string) => {
    setActionLoading(true);
    try {
      await api.inventory.completeMaintenance(logId);
      showAudiraToast.success('Servis perangkat telah diselesaikan! Unit kembali ke status Available/Siap Pakai.', 'Selesai');
      loadEquipment();
      loadStats();
      loadMaintenanceLogs();
    } catch (err: any) {
      showAudiraToast.error(err.message || 'Gagal menyelesaikan servis', 'Error');
    } finally {
      setActionLoading(false);
    }
  };

  // QR / Barcode Label Modal
  const handleOpenQr = (item: Equipment) => {
    setQrTarget(item);
    setShowQrModal(true);
  };

  // Barcode / Scanner Audit Logic
  const handleScanSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = scanInput.trim().toUpperCase();
    if (!query) return;

    const matched = equipment.find(
      (eq) =>
        eq.serialNumber.toUpperCase() === query ||
        (eq.macAddress && eq.macAddress.toUpperCase() === query)
    );

    if (matched) {
      playScanBeep(true);
      const auditItem: ScanAuditItem = {
        id: Math.random().toString(36).substring(7),
        serialNumber: matched.serialNumber,
        scannedAt: new Date(),
        status: 'MATCH',
        equipment: matched,
      };
      setAuditList((prev) => [auditItem, ...prev]);
      showAudiraToast.success(`Perangkat Ditemukan: ${matched.brand} ${matched.model} (${matched.status})`, 'Audit Match');
    } else {
      playScanBeep(false);
      const auditItem: ScanAuditItem = {
        id: Math.random().toString(36).substring(7),
        serialNumber: query,
        scannedAt: new Date(),
        status: 'UNKNOWN',
      };
      setAuditList((prev) => [auditItem, ...prev]);
      showAudiraToast.warning(`SN / MAC "${query}" tidak terdaftar di sistem!`, 'Unknown Asset');
    }

    setScanInput('');
    if (scanInputRef.current) {
      scanInputRef.current.focus();
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (equipment.length === 0) {
      showAudiraToast.warning('Tidak ada data perangkat untuk diekspor', 'Info');
      return;
    }

    const headers = [
      'ID',
      'Tipe',
      'Serial Number',
      'Brand',
      'Model',
      'MAC Address',
      'Status',
      'Pelanggan',
      'No. Internet',
      'Lokasi / Rak',
      'Vendor',
      'Tanggal Beli',
      'Garansi Sampai',
      'Catatan',
    ];

    const rows = equipment.map((eq) => [
      `"${eq.id}"`,
      `"${eq.type}"`,
      `"${eq.serialNumber || '-'}"`,
      `"${eq.brand || '-'}"`,
      `"${eq.model || '-'}"`,
      `"${eq.macAddress || '-'}"`,
      `"${eq.status}"`,
      `"${eq.customer?.name || '-'}"`,
      `"${eq.customer?.internetNumber || '-'}"`,
      `"${eq.location || '-'}"`,
      `"${eq.vendor || '-'}"`,
      `"${eq.purchaseDate ? new Date(eq.purchaseDate).toLocaleDateString('id-ID') : '-'}"`,
      `"${eq.warrantyUntil ? new Date(eq.warrantyUntil).toLocaleDateString('id-ID') : '-'}"`,
      `"${(eq.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AUDIRA_ISP_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showAudiraToast.success('Laporan inventaris berhasil diunduh (CSV)!', 'Ekspor Sukses');
  };

  // Export Stock Opname Report
  const handleExportAuditCSV = () => {
    if (auditList.length === 0) {
      showAudiraToast.warning('Tidak ada data hasil scan untuk diekspor. Lakukan pemindaian serial number terlebih dahulu.', 'Info');
      return;
    }

    const headers = ['Waktu Scan', 'Serial Number', 'Status Verifikasi', 'Tipe', 'Brand/Model', 'Status Sistem', 'Lokasi'];
    const rows = auditList.map((a) => [
      `"${a.scannedAt.toLocaleTimeString('id-ID')}"`,
      `"${a.serialNumber}"`,
      `"${a.status}"`,
      `"${a.equipment?.type || '-'}"`,
      `"${a.equipment ? `${a.equipment.brand} ${a.equipment.model}` : '-'}"`,
      `"${a.equipment?.status || '-'}"`,
      `"${a.equipment?.location || '-'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Berita_Acara_Audit_Gudang_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showAudiraToast.success('Berita acara audit berhasil diunduh (CSV)!', 'Audit Downloaded');
  };

  // Filtered Lists
  const filteredEquipment = useMemo(() => {
    return equipment
      .filter((item) => {
        const matchesQuery =
          !searchQuery ||
          item.serialNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.macAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.location?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = !filterType || item.type === filterType;
        const matchesStatus = !filterStatus || item.status === filterStatus;
        const matchesVendor = !filterVendor || item.vendor === filterVendor;

        return matchesQuery && matchesType && matchesStatus && matchesVendor;
      })
      .sort((a, b) => {
        if (sortBy === 'sn') return a.serialNumber.localeCompare(b.serialNumber);
        if (sortBy === 'brand') return a.brand.localeCompare(b.brand);
        if (sortBy === 'status') return a.status.localeCompare(b.status);
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }, [equipment, searchQuery, filterType, filterStatus, filterVendor, sortBy]);

  const assignedEquipment = useMemo(() => {
    return equipment.filter((e) => e.status === 'assigned');
  }, [equipment]);

  const filteredCustomerSelection = useMemo(() => {
    if (!customerSearchQuery) return customers.slice(0, 15);
    const q = customerSearchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q)) ||
        (c.internetNumber && c.internetNumber.toLowerCase().includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q))
    ).slice(0, 25);
  }, [customers, customerSearchQuery]);

  // Helpers
  const formatRp = (num?: number) => {
    if (!num) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Ready Stock
          </span>
        );
      case 'assigned':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <User className="w-3 h-3" />
            Terpasang
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Wrench className="w-3 h-3" />
            Dalam Servis
          </span>
        );
      case 'damaged':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" />
            Rusak / RMA
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
            {status}
          </span>
        );
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ONT':
        return <Wifi className="w-4 h-4 text-cyan-500" />;
      case 'Router':
        return <Cpu className="w-4 h-4 text-indigo-500" />;
      case 'Switch':
        return <Layers className="w-4 h-4 text-purple-500" />;
      case 'SFP+':
        return <Zap className="w-4 h-4 text-emerald-500" />;
      case 'Cable':
        return <Radio className="w-4 h-4 text-amber-500" />;
      case 'Splitter':
        return <Package className="w-4 h-4 text-rose-500" />;
      default:
        return <HardDrive className="w-4 h-4 text-slate-400" />;
    }
  };

  const getWarrantyIndicator = (warrantyUntil?: string) => {
    if (!warrantyUntil) return <span className="text-xs text-[var(--app-muted)]">Tanpa Garansi</span>;
    const now = new Date();
    const until = new Date(warrantyUntil);
    const diffDays = Math.ceil((until.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-rose-500 font-medium">
          <ShieldAlert className="w-3.5 h-3.5" />
          Expired
        </span>
      );
    }
    if (diffDays <= 30) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-amber-500 font-medium">
          <Clock className="w-3.5 h-3.5" />
          {diffDays} Hari Lagi
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-medium">
        <ShieldCheck className="w-3.5 h-3.5" />
        {until.toLocaleDateString('id-ID')}
      </span>
    );
  };

  return (
    <Layout>
      <div className="space-y-6 pb-12">
        {/* Top Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-[var(--app-card)] p-6 rounded-2xl border border-[var(--app-border)] shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 rounded-md">
                AUDIRA ISP LOGISTICS & HARDWARE ASSET
              </span>
              <span className="text-xs text-[var(--app-muted)] flex items-center gap-1 font-mono">
                <Warehouse className="w-3 h-3" />
                NOC Central Warehouse
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-[var(--app-text)] tracking-tight">
              Inventory & Asset Management
            </h1>
            <p className="text-sm text-[var(--app-muted)] mt-1">
              Pantau siklus hidup ONT, Router, OLT SFP+, alokasi ke pelanggan, riwayat servis, serta audit stok fisik barcode.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={fetchInitialData}
              disabled={loading}
              className="px-3.5 py-2.5 text-xs font-semibold text-[var(--app-text)] bg-[var(--app-surface)] hover:bg-[var(--app-border)] border border-[var(--app-border)] rounded-xl transition-all flex items-center gap-2"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sinkronisasi</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 text-xs font-semibold text-[var(--app-text)] bg-[var(--app-surface)] hover:bg-[var(--app-border)] border border-[var(--app-border)] rounded-xl transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-500" />
              <span>Ekspor CSV</span>
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Barcode className="w-4 h-4" />
              <span>Scan Barcode / Audit</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Perangkat</span>
            </button>
          </div>
        </div>

        {/* 6 Real-Time Metric KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Total Equipment */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] relative overflow-hidden group hover:border-cyan-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--app-muted)]">Total Aset</span>
              <Package className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-black text-[var(--app-text)] mt-2 font-mono">
              {stats?.total ?? equipment.length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1 flex items-center gap-1">
              <span className="text-cyan-500 font-medium">100%</span> tercatat di sistem
            </div>
          </div>

          {/* Available / Ready Stock */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Ready Gudang</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
              {stats?.available ?? equipment.filter((e) => e.status === 'available').length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Siap pasang teknisi</div>
          </div>

          {/* Assigned / Terpasang */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] relative overflow-hidden group hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Di Pelanggan</span>
              <User className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2 font-mono">
              {stats?.assigned ?? equipment.filter((e) => e.status === 'assigned').length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Alokasi aktif FTTH</div>
          </div>

          {/* In Maintenance */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] relative overflow-hidden group hover:border-amber-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Dalam Servis</span>
              <Wrench className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2 font-mono">
              {stats?.maintenance ?? equipment.filter((e) => e.status === 'maintenance').length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Perbaikan / Lab NOC</div>
          </div>

          {/* Damaged / RMA */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] relative overflow-hidden group hover:border-rose-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">Rusak / RMA</span>
              <AlertCircle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2 font-mono">
              {stats?.damaged ?? equipment.filter((e) => e.status === 'damaged').length}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">Retur klaim garansi</div>
          </div>

          {/* Warranty Expiring */}
          <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] relative overflow-hidden group hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Garansi Kritis</span>
              <ShieldAlert className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2 font-mono">
              {stats?.expiringWarranty ?? 0}
            </div>
            <div className="text-[11px] text-[var(--app-muted)] mt-1">&lt; 30 hari kedaluwarsa</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-[var(--app-border)] gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('katalog')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'katalog'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-[var(--app-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Package className="w-4 h-4" />
            Katalog Perangkat & Aset
            <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-[var(--app-surface)] text-[var(--app-muted)] border border-[var(--app-border)]">
              {filteredEquipment.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('deployments')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'deployments'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-[var(--app-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <User className="w-4 h-4" />
            Alokasi Pelanggan (Active)
            <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-[var(--app-surface)] text-[var(--app-muted)] border border-[var(--app-border)]">
              {assignedEquipment.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'maintenance'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-[var(--app-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Log Servis & RMA Garansi
            <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-[var(--app-surface)] text-[var(--app-muted)] border border-[var(--app-border)]">
              {maintenanceLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'scanner'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 bg-cyan-500/5'
                : 'border-transparent text-[var(--app-muted)] hover:text-[var(--app-text)]'
            }`}
          >
            <Barcode className="w-4 h-4" />
            Audit Scanner & Stock Opname
            {auditList.length > 0 && (
              <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {auditList.length} scanned
              </span>
            )}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: KATALOG PERANGKAT & ASET                                           */}
        {/* ========================================================================= */}
        {activeTab === 'katalog' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
                <input
                  type="text"
                  placeholder="Cari Serial Number, MAC Address, Model, Brand, atau Lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--app-text)] placeholder-[var(--app-muted)] focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Semua Tipe Perangkat</option>
                  <option value="ONT">ONT (GPON / EPON)</option>
                  <option value="Router">Wireless Router</option>
                  <option value="Switch">Switch Distribusi</option>
                  <option value="SFP+">SFP+ 10G Transceiver</option>
                  <option value="Cable">Drop Core Fiber Optic</option>
                  <option value="Splitter">ODP Splitter Box</option>
                  <option value="Tool">Alat Splicer / OTDR</option>
                </select>

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Semua Status Operasional</option>
                  <option value="available">Ready Stock (Gudang)</option>
                  <option value="assigned">Terpasang di Pelanggan</option>
                  <option value="maintenance">Dalam Servis (NOC)</option>
                  <option value="damaged">Rusak / Klaim RMA</option>
                </select>

                {/* Sort By */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                >
                  <option value="newest">Terbaru Ditambahkan</option>
                  <option value="sn">Serial Number (A-Z)</option>
                  <option value="brand">Brand / Merk (A-Z)</option>
                  <option value="status">Status Operasional</option>
                </select>
              </div>
            </div>

            {/* Equipment Data Table */}
            <div className="bg-[var(--app-card)] rounded-xl border border-[var(--app-border)] shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-[var(--app-muted)] font-mono">Memuat inventaris perangkat...</span>
                </div>
              ) : filteredEquipment.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <Package className="w-12 h-12 text-[var(--app-muted)] stroke-[1.2] mb-3" />
                  <h3 className="text-base font-bold text-[var(--app-text)]">Tidak Ada Perangkat yang Cocok</h3>
                  <p className="text-xs text-[var(--app-muted)] max-w-sm mt-1">
                    Coba sesuaikan kata kunci pencarian atau bersihkan filter tipe dan status perangkat.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterType('');
                      setFilterStatus('');
                    }}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--app-border)] bg-[var(--app-surface)] text-[11px] font-bold text-[var(--app-muted)] uppercase tracking-wider">
                        <th className="px-4 py-3.5">Tipe & Merk</th>
                        <th className="px-4 py-3.5">Serial Number & MAC</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5">Lokasi / Alokasi</th>
                        <th className="px-4 py-3.5">Garansi Vendor</th>
                        <th className="px-4 py-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--app-border)] text-xs">
                      {filteredEquipment.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-[var(--app-surface)]/60 transition-colors group"
                        >
                          {/* Tipe & Merk */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-[var(--app-surface)] border border-[var(--app-border)] flex items-center justify-center shrink-0">
                                {getTypeIcon(item.type)}
                              </div>
                              <div>
                                <div className="font-bold text-[var(--app-text)] flex items-center gap-1.5">
                                  <span>{item.brand}</span>
                                  <span className="font-normal text-[var(--app-muted)]">{item.model}</span>
                                </div>
                                <div className="text-[11px] text-[var(--app-muted)] flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono uppercase px-1.5 py-0.2 rounded bg-[var(--app-surface)] border border-[var(--app-border)] text-[10px]">
                                    {item.type}
                                  </span>
                                  <span>•</span>
                                  <span>{item.vendor || 'Vendor Umum'}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Serial Number & MAC */}
                          <td className="px-4 py-3.5">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[var(--app-text)] tracking-wider">
                                  {item.serialNumber || '-'}
                                </span>
                                <button
                                  onClick={() => handleCopy(item.serialNumber)}
                                  className="text-[var(--app-muted)] hover:text-cyan-500 transition-colors"
                                  title="Copy Serial Number"
                                >
                                  {copiedSn === item.serialNumber ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                              {item.macAddress && (
                                <div className="text-[11px] font-mono text-[var(--app-muted)] flex items-center gap-1">
                                  <span>MAC:</span>
                                  <span>{item.macAddress}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            {getStatusBadge(item.status)}
                          </td>

                          {/* Lokasi / Alokasi */}
                          <td className="px-4 py-3.5">
                            {item.status === 'assigned' && item.customer ? (
                              <div className="space-y-0.5">
                                <div className="font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                                  <User className="w-3.5 h-3.5" />
                                  <span>{item.customer.name}</span>
                                </div>
                                <div className="text-[11px] font-mono text-[var(--app-muted)]">
                                  {item.customer.internetNumber || '-'}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-[var(--app-muted)]">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                <span>{item.location || 'Gudang Utama'}</span>
                              </div>
                            )}
                          </td>

                          {/* Garansi */}
                          <td className="px-4 py-3.5">
                            {getWarrantyIndicator(item.warrantyUntil)}
                          </td>

                          {/* Aksi */}
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* QR Tag Label */}
                              <button
                                onClick={() => handleOpenQr(item)}
                                className="p-1.5 text-[var(--app-muted)] hover:text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-colors"
                                title="Lihat Label Barcode / Cetak QR"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>

                              {/* Action based on status */}
                              {item.status === 'available' && (
                                <button
                                  onClick={() => handleOpenAssign(item)}
                                  className="px-2.5 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-lg transition-colors flex items-center gap-1"
                                  title="Pasang ke Pelanggan"
                                >
                                  <User className="w-3 h-3" />
                                  <span>Pasang</span>
                                </button>
                              )}

                              {item.status === 'assigned' && (
                                <button
                                  onClick={() => handleOpenUnassign(item)}
                                  className="px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg transition-colors flex items-center gap-1"
                                  title="Tarik Perangkat dari Pelanggan"
                                >
                                  <ArrowDownLeft className="w-3 h-3" />
                                  <span>Tarik</span>
                                </button>
                              )}

                              {/* Maintenance Schedule */}
                              <button
                                onClick={() => handleOpenMaintenance(item)}
                                className="p-1.5 text-[var(--app-muted)] hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                                title="Jadwalkan Servis / Catat Kerusakan"
                              >
                                <Wrench className="w-4 h-4" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="p-1.5 text-[var(--app-muted)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                title="Edit Detail Perangkat"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteEquipment(item.id, item.serialNumber)}
                                className="p-1.5 text-[var(--app-muted)] hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                                title="Hapus Perangkat"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ALOKASI PELANGGAN (ACTIVE DEPLOYMENTS)                             */}
        {/* ========================================================================= */}
        {activeTab === 'deployments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--app-text)]">Perangkat Terpasang di Pelanggan</h2>
                <p className="text-xs text-[var(--app-muted)]">
                  Daftar ONT, Optical Terminal, dan Router aktif yang saat ini dideploy di rumah atau kantor pelanggan.
                </p>
              </div>
              <div className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg">
                {assignedEquipment.length} UNIT TERDEPLOY
              </div>
            </div>

            {assignedEquipment.length === 0 ? (
              <div className="bg-[var(--app-card)] p-12 rounded-xl border border-[var(--app-border)] text-center">
                <User className="w-12 h-12 text-[var(--app-muted)] stroke-[1.2] mx-auto mb-3" />
                <h3 className="text-sm font-bold text-[var(--app-text)]">Belum Ada Perangkat yang Dideploy</h3>
                <p className="text-xs text-[var(--app-muted)] max-w-sm mx-auto mt-1">
                  Buka tab Katalog Perangkat, lalu klik tombol &quot;Pasang&quot; pada perangkat yang berstatus Ready Stock.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignedEquipment.map((eq) => (
                  <div
                    key={eq.id}
                    className="bg-[var(--app-card)] rounded-xl border border-[var(--app-border)] p-4 shadow-sm hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Customer Header */}
                      <div className="flex items-start justify-between gap-2 border-b border-[var(--app-border)] pb-3">
                        <div>
                          <div className="font-bold text-[var(--app-text)] text-sm flex items-center gap-1.5">
                            <User className="w-4 h-4 text-cyan-500" />
                            <span>{eq.customer?.name || 'Pelanggan Tanpa Nama'}</span>
                          </div>
                          <div className="text-xs font-mono text-[var(--app-muted)] mt-0.5">
                            ID: {eq.customer?.internetNumber || '-'}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {eq.type}
                        </span>
                      </div>

                      {/* Equipment Spec Body */}
                      <div className="py-3 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--app-muted)]">Model Perangkat:</span>
                          <span className="font-semibold text-[var(--app-text)]">
                            {eq.brand} {eq.model}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--app-muted)]">Serial Number:</span>
                          <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                            {eq.serialNumber}
                          </span>
                        </div>
                        {eq.macAddress && (
                          <div className="flex justify-between items-center">
                            <span className="text-[var(--app-muted)]">MAC Address:</span>
                            <span className="font-mono text-[var(--app-text)]">{eq.macAddress}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-start pt-1">
                          <span className="text-[var(--app-muted)]">Alamat:</span>
                          <span className="text-right text-[var(--app-text)] max-w-[60%] truncate">
                            {eq.customer?.address || eq.location || '-'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="pt-3 border-t border-[var(--app-border)] flex items-center justify-between gap-2">
                      {eq.customer?.phone ? (
                        <a
                          href={`https://wa.me/${eq.customer.phone.replace(/[^0-9]/g, '')}?text=Halo%20Bpk%2FIbu%20${encodeURIComponent(
                            eq.customer.name
                          )}%2C%20konfirmasi%20kondisi%20modem%20ONT%20AUDIRA%20SN%3A%20${eq.serialNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Hubungi WA</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-[var(--app-muted)]">Tanpa No. WA</span>
                      )}

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenQr(eq)}
                          className="p-1.5 text-[var(--app-muted)] hover:text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-colors"
                          title="Cetak Label QR"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenUnassign(eq)}
                          className="px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          <span>Tarik Balik</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: LOG MAINTENANCE & KLAIM RMA                                        */}
        {/* ========================================================================= */}
        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--app-text)]">Riwayat Servis & Klaim Garansi Pabrik</h2>
                <p className="text-xs text-[var(--app-muted)]">
                  Log penanganan unit bermasalah, port LAN rusak, lonjakan petir, re-flash firmware, serta pergantian modul optik.
                </p>
              </div>
            </div>

            <div className="bg-[var(--app-card)] rounded-xl border border-[var(--app-border)] shadow-sm overflow-hidden">
              {maintenanceLogs.length === 0 ? (
                <div className="p-12 text-center">
                  <Wrench className="w-12 h-12 text-[var(--app-muted)] stroke-[1.2] mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-[var(--app-text)]">Belum Ada Log Maintenance</h3>
                  <p className="text-xs text-[var(--app-muted)] max-w-sm mx-auto mt-1">
                    Semua perangkat beroperasi normal tanpa kendala perbaikan terdaftar.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--app-border)] bg-[var(--app-surface)] text-[11px] font-bold text-[var(--app-muted)] uppercase tracking-wider">
                        <th className="px-4 py-3.5">Perangkat</th>
                        <th className="px-4 py-3.5">Tipe Servis</th>
                        <th className="px-4 py-3.5">Deskripsi Masalah</th>
                        <th className="px-4 py-3.5">Biaya (Rp)</th>
                        <th className="px-4 py-3.5">Jadwal / Tanggal</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--app-border)] text-xs">
                      {maintenanceLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-[var(--app-surface)]/60 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-[var(--app-text)] font-mono">
                              {log.equipment?.serialNumber || '-'}
                            </div>
                            <div className="text-[11px] text-[var(--app-muted)]">
                              {log.equipment?.brand} {log.equipment?.model}
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className="font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[var(--app-surface)] border border-[var(--app-border)] text-indigo-500">
                              {log.type}
                            </span>
                          </td>

                          <td className="px-4 py-3.5 max-w-xs">
                            <div className="text-[var(--app-text)] truncate font-medium">
                              {log.description}
                            </div>
                            {log.notes && (
                              <div className="text-[11px] text-[var(--app-muted)] truncate mt-0.5">
                                Catatan: {log.notes}
                              </div>
                            )}
                          </td>

                          <td className="px-4 py-3.5 font-mono text-[var(--app-text)]">
                            {formatRp(log.cost)}
                          </td>

                          <td className="px-4 py-3.5 text-[var(--app-muted)]">
                            {new Date(log.scheduledAt).toLocaleDateString('id-ID')}
                          </td>

                          <td className="px-4 py-3.5">
                            {log.status === 'completed' ? (
                              <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Selesai
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-500 font-semibold text-xs">
                                <Clock className="w-3.5 h-3.5" />
                                Terjadwal
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3.5 text-right">
                            {log.status !== 'completed' && (
                              <button
                                onClick={() => handleCompleteMaintenance(log.id)}
                                disabled={actionLoading}
                                className="px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg transition-colors inline-flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Selesaikan Servis
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: AUDIT SCANNER & BARCODE / QR HUD                                   */}
        {/* ========================================================================= */}
        {activeTab === 'scanner' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Scanner Terminal */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-[var(--app-card)] p-6 rounded-2xl border border-[var(--app-border)] shadow-sm">
                <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-4 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--app-text)] flex items-center gap-2">
                      <Barcode className="w-5 h-5 text-indigo-500" />
                      Scanner Audit Fisik & Stock Opname
                    </h2>
                    <p className="text-xs text-[var(--app-muted)] mt-0.5">
                      Gunakan barcode scanner USB/Bluetooth nirkabel atau ketik langsung Serial Number / MAC Address.
                    </p>
                  </div>
                  <button
                    onClick={() => setCameraActive(!cameraActive)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                      cameraActive
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/30'
                        : 'bg-[var(--app-surface)] text-[var(--app-text)] border-[var(--app-border)] hover:bg-[var(--app-border)]'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>{cameraActive ? 'Tutup HUD Optik' : 'Aktifkan HUD Optik'}</span>
                  </button>
                </div>

                {/* Cyberpunk Optical Scanner HUD */}
                {cameraActive && (
                  <div className="relative w-full h-56 bg-slate-950 rounded-xl overflow-hidden mb-5 border border-cyan-500/40 flex flex-col items-center justify-center">
                    {/* Grid Background */}
                    <div
                      className="absolute inset-0 opacity-15"
                      style={{
                        backgroundImage: `radial-gradient(circle, #38bdf8 1px, transparent 1px)`,
                        backgroundSize: '16px 16px',
                      }}
                    ></div>

                    {/* Laser scanning line animation */}
                    <div className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_12px_#38bdf8] animate-[bounce_2.5s_infinite]"></div>

                    {/* Reticle Target */}
                    <div className="w-44 h-28 border-2 border-dashed border-cyan-400/70 rounded-lg flex flex-col items-center justify-center relative">
                      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400"></div>
                      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400"></div>
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400"></div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400"></div>
                      <Barcode className="w-10 h-10 text-cyan-400/80 mb-1" />
                      <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-widest">
                        POSISIKAN BARCODE
                      </span>
                    </div>

                    <div className="absolute bottom-2 text-[10px] font-mono text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      OPTICAL RETICLE ACTIVE • READY FOR CAPTURE
                    </div>
                  </div>
                )}

                {/* High Speed Fast Input for USB/Bluetooth Gun Scanner */}
                <form onSubmit={handleScanSubmit} className="space-y-3">
                  <label className="block text-xs font-semibold text-[var(--app-text)]">
                    Fast Laser Gun Scanner / Manual Input
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        ref={scanInputRef}
                        type="text"
                        placeholder="Arahkan laser scanner ke barcode atau ketik SN (e.g. ZTEGCA1B2C3D)..."
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        autoFocus
                        className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-4 py-3 text-sm font-mono text-[var(--app-text)] placeholder-[var(--app-muted)] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Verifikasi</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[var(--app-muted)] flex items-center gap-1.5">
                    <span className="font-semibold text-[var(--app-primary)]">Petunjuk:</span>
                    <span>Barcode scanner USB/Bluetooth secara otomatis mengirimkan karakter Enter setelah scan, sehingga input akan langsung terverifikasi seketika.</span>
                  </p>
                </form>
              </div>

              {/* Quick Sample SN Shortcuts for Testing */}
              <div className="bg-[var(--app-card)] p-4 rounded-xl border border-[var(--app-border)]">
                <span className="text-xs font-semibold text-[var(--app-muted)] uppercase tracking-wider block mb-2">
                  Uji Cepat Serial Number Terdaftar:
                </span>
                <div className="flex flex-wrap gap-2">
                  {equipment.slice(0, 6).map((eq) => (
                    <button
                      key={eq.id}
                      onClick={() => {
                        setScanInput(eq.serialNumber);
                        setTimeout(() => handleScanSubmit(), 50);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-[var(--app-surface)] hover:bg-cyan-500/10 text-[var(--app-text)] hover:text-cyan-400 border border-[var(--app-border)] transition-colors"
                    >
                      {eq.serialNumber} ({eq.brand})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Live Audit Log */}
            <div className="bg-[var(--app-card)] p-5 rounded-2xl border border-[var(--app-border)] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3 mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--app-text)]">Hasil Audit Stock Opname</h3>
                    <span className="text-[11px] text-[var(--app-muted)]">
                      Total Terverifikasi: {auditList.length} Unit
                    </span>
                  </div>
                  {auditList.length > 0 && (
                    <button
                      onClick={handleExportAuditCSV}
                      className="p-1.5 text-xs text-emerald-500 hover:bg-emerald-500/10 rounded-lg flex items-center gap-1 border border-emerald-500/20"
                      title="Download Berita Acara Audit"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>CSV</span>
                    </button>
                  )}
                </div>

                {auditList.length === 0 ? (
                  <div className="py-16 text-center text-[var(--app-muted)]">
                    <FileText className="w-10 h-10 mx-auto stroke-[1.2] mb-2 text-slate-400" />
                    <p className="text-xs">Belum ada perangkat yang discan.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                    {auditList.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl border text-xs transition-all ${
                          item.status === 'MATCH'
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-rose-500/5 border-rose-500/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono font-bold text-[var(--app-text)]">
                              {item.serialNumber}
                            </span>
                            <div className="text-[10px] text-[var(--app-muted)] mt-0.5">
                              {item.scannedAt.toLocaleTimeString('id-ID')}
                            </div>
                          </div>
                          {item.status === 'MATCH' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                              MATCH
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                              UNKNOWN
                            </span>
                          )}
                        </div>

                        {item.equipment && (
                          <div className="mt-2 pt-2 border-t border-[var(--app-border)] text-[11px] text-[var(--app-muted)] space-y-0.5">
                            <div>
                              Model: <span className="text-[var(--app-text)] font-semibold">{item.equipment.brand} {item.equipment.model}</span>
                            </div>
                            <div>
                              Lokasi: <span className="text-[var(--app-text)]">{item.equipment.location || '-'}</span>
                            </div>
                            <div>
                              Status: <span className="text-[var(--app-text)] capitalize">{item.equipment.status}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {auditList.length > 0 && (
                <button
                  onClick={() => setAuditList([])}
                  className="mt-4 w-full py-2 text-xs font-semibold text-[var(--app-muted)] hover:text-rose-500 bg-[var(--app-surface)] hover:bg-rose-500/10 border border-[var(--app-border)] rounded-xl transition-colors"
                >
                  Bersihkan Riwayat Audit
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 1: TAMBAH / EDIT PERANGKAT                                          */}
        {/* ========================================================================= */}
        {showAddEditModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-2xl max-w-2xl w-full border border-[var(--app-border)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="px-6 py-4 border-b border-[var(--app-border)] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[var(--app-text)]">
                    {editingItem ? 'Edit Informasi Perangkat' : 'Tambah Perangkat Baru ke Inventory'}
                  </h3>
                  <p className="text-xs text-[var(--app-muted)]">
                    Daftarkan nomor seri, MAC address, vendor, serta garansi perangkat ISP.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddEditModal(false)}
                  className="p-1 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveEquipment} className="p-6 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tipe Perangkat */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                      Tipe Perangkat
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => {
                        const newType = e.target.value;
                        setFormData({
                          ...formData,
                          type: newType,
                          serialNumber: formData.serialNumber || generateRandomSN(newType),
                        });
                      }}
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    >
                      <option value="ONT">ONT (Optical Network Terminal)</option>
                      <option value="Router">Wireless Router / Gateway</option>
                      <option value="Switch">Switch Distribusi / Core</option>
                      <option value="SFP+">SFP+ 10G Transceiver</option>
                      <option value="Cable">Drop Core Fiber Roll</option>
                      <option value="Splitter">ODP Splitter Box</option>
                      <option value="Tool">Alat Ukur / Fusion Splicer</option>
                    </select>
                  </div>

                  {/* Serial Number with Auto Gen */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[var(--app-text)]">
                        Serial Number (SN) *
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, serialNumber: generateRandomSN(formData.type) })}
                        className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                      >
                        Auto-Gen SN
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value.toUpperCase() })}
                      placeholder="e.g. ZTEGCA1B2C3D"
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Brand / Merk */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                      Merk / Brand
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="e.g. ZTE, Huawei, MikroTik, Cisco"
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                      Model / Seri Perangkat
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g. F609 V5.3, HG8245H5, RB750Gr3"
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* MAC Address */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-[var(--app-text)]">
                        MAC Address
                      </label>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, macAddress: generateRandomMAC() })}
                        className="text-[10px] text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
                      >
                        Auto-Gen MAC
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formData.macAddress}
                      onChange={(e) => setFormData({ ...formData, macAddress: e.target.value.toUpperCase() })}
                      placeholder="e.g. E4:F4:C6:11:22:33"
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs font-mono text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Vendor / Distributor */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                      Vendor / Supplier
                    </label>
                    <input
                      type="text"
                      value={formData.vendor}
                      onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                      placeholder="e.g. PT Fiber Telekomindo, Citraweb"
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Lokasi Rak / Gudang */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                      Lokasi Rak / Gudang
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Gudang A - Rak ONT #01"
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Garansi Until */}
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                      Masa Berlaku Garansi
                    </label>
                    <input
                      type="date"
                      value={formData.warrantyUntil}
                      onChange={(e) => setFormData({ ...formData, warrantyUntil: e.target.value })}
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Catatan Teknis */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                      Catatan Spesifikasi / Kondisi Fisik
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Catatan tambahan spesifikasi adaptor, kondisi bodi, atau aksesoris pelengkap..."
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl p-3 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-[var(--app-border)] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddEditModal(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-[var(--app-muted)] hover:text-[var(--app-text)] bg-[var(--app-surface)] rounded-xl border border-[var(--app-border)]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    {actionLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    <span>{editingItem ? 'Simpan Perubahan' : 'Daftarkan Perangkat'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: ASSIGN PERANGKAT KE PELANGGAN                                     */}
        {/* ========================================================================= */}
        {showAssignModal && assignTarget && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-2xl max-w-lg w-full border border-[var(--app-border)] shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--app-border)] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)]">
                    Alokasikan Perangkat ke Pelanggan
                  </h3>
                  <p className="text-xs text-[var(--app-muted)]">
                    Unit: {assignTarget.brand} {assignTarget.model} (SN: {assignTarget.serialNumber})
                  </p>
                </div>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="p-1 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Search Customer Input */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                    Cari Nama / No. Internet Pelanggan
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--app-muted)]" />
                    <input
                      type="text"
                      placeholder="Ketik nama atau nomor internet pelanggan..."
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl pl-9 pr-3 py-2 text-xs text-[var(--app-text)] focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Customer List Selection */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                    Pilih Pelanggan ({filteredCustomerSelection.length} Tersedia)
                  </label>
                  <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 border border-[var(--app-border)] rounded-xl p-2 bg-[var(--app-surface)]">
                    {filteredCustomerSelection.length === 0 ? (
                      <div className="py-6 text-center text-xs text-[var(--app-muted)]">
                        Tidak ada pelanggan yang ditemukan
                      </div>
                    ) : (
                      filteredCustomerSelection.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCustomerId(c.id)}
                          className={`p-2.5 rounded-lg cursor-pointer transition-all flex items-center justify-between border ${
                            selectedCustomerId === c.id
                              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold'
                              : 'border-transparent hover:bg-[var(--app-card)] text-[var(--app-text)]'
                          }`}
                        >
                          <div>
                            <div className="text-xs">{c.name}</div>
                            <div className="text-[10px] text-[var(--app-muted)] font-mono">
                              {c.internetNumber || '-'} • {c.phone || 'No Phone'}
                            </div>
                          </div>
                          {selectedCustomerId === c.id && <Check className="w-4 h-4 text-cyan-500" />}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Notice */}
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-600 dark:text-cyan-300">
                  Status perangkat akan otomatis berubah menjadi <span className="font-bold">Terpasang (Assigned)</span> dan tercatat dalam database pelanggan.
                </div>

                {/* Footer Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-[var(--app-muted)] hover:text-[var(--app-text)]"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmAssign}
                    disabled={!selectedCustomerId || actionLoading}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    {actionLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    <span>Konfirmasi Alokasi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: UNASSIGN / TARIK PERANGKAT                                       */}
        {/* ========================================================================= */}
        {showUnassignModal && unassignTarget && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-2xl max-w-md w-full border border-[var(--app-border)] shadow-2xl overflow-hidden p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)]">
                    Tarik Perangkat dari Pelanggan
                  </h3>
                  <p className="text-xs text-[var(--app-muted)]">
                    SN: {unassignTarget.serialNumber} ({unassignTarget.customer?.name})
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[var(--app-text)]">
                  Kondisi & Status Setelah Ditarik:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setUnassignNewStatus('available')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                      unassignNewStatus === 'available'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                        : 'border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-surface)]'
                    }`}
                  >
                    Ready Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnassignNewStatus('maintenance')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                      unassignNewStatus === 'maintenance'
                        ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                        : 'border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-surface)]'
                    }`}
                  >
                    Butuh Servis
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnassignNewStatus('damaged')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-center ${
                      unassignNewStatus === 'damaged'
                        ? 'bg-rose-500/10 border-rose-500 text-rose-500'
                        : 'border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-surface)]'
                    }`}
                  >
                    Rusak Permanen
                  </button>
                </div>
              </div>

              <p className="text-xs text-[var(--app-muted)]">
                Perangkat ini akan dilepas dari akun pelanggan dan dipindahkan kembali ke stok inventory gudang AUDIRA.
              </p>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowUnassignModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[var(--app-muted)] hover:text-[var(--app-text)]"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmUnassign}
                  disabled={actionLoading}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {actionLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  <span>Konfirmasi Tarik</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 4: JADWALKAN MAINTENANCE / KLAIM RMA                                */}
        {/* ========================================================================= */}
        {showMaintenanceModal && maintenanceTarget && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-2xl max-w-lg w-full border border-[var(--app-border)] shadow-2xl overflow-hidden p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--app-text)]">
                    Jadwalkan Servis / Catat Kerusakan
                  </h3>
                  <p className="text-xs text-[var(--app-muted)]">
                    Perangkat: {maintenanceTarget.brand} {maintenanceTarget.model} ({maintenanceTarget.serialNumber})
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveMaintenance} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                    Kategori Kendala / Tindakan
                  </label>
                  <select
                    value={maintenanceForm.type}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, type: e.target.value })}
                    className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--app-text)] focus:outline-none focus:border-amber-500"
                  >
                    <option value="repair">Perbaikan Hardware / Port LAN Rusak</option>
                    <option value="lightning">Kerusakan Lonjakan Petir / Adaptor Mati</option>
                    <option value="firmware">Re-Flash Firmware Corrupt / Reset Default</option>
                    <option value="rma">Klaim Garansi Pabrik (RMA Distributor)</option>
                    <option value="cleaning">Pembersihan Modul Optik / Kalibrasi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                    Deskripsi Kerusakan / Gejala *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={maintenanceForm.description}
                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, description: e.target.value })}
                    placeholder="Contoh: Port LAN 1 dan 2 tidak mendeteksi kabel setelah hujan lebat..."
                    className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl p-3 text-xs text-[var(--app-text)] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                      Estimasi Biaya (Rp)
                    </label>
                    <input
                      type="number"
                      value={maintenanceForm.cost}
                      onChange={(e) => setMaintenanceForm({ ...maintenanceForm, cost: Number(e.target.value) })}
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--app-text)] focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--app-text)] mb-1.5">
                      Tanggal Target Selesai
                    </label>
                    <input
                      type="date"
                      value={maintenanceForm.scheduledAt}
                      onChange={(e) => setMaintenanceForm({ ...maintenanceForm, scheduledAt: e.target.value })}
                      className="w-full bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--app-text)] focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowMaintenanceModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-[var(--app-muted)] hover:text-[var(--app-text)]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    {actionLoading && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                    <span>Simpan Jadwal Servis</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 5: QR CODE LABEL CETAK ASET                                         */}
        {/* ========================================================================= */}
        {showQrModal && qrTarget && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--app-card)] rounded-2xl max-w-sm w-full border border-[var(--app-border)] shadow-2xl overflow-hidden p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-cyan-500" />
                  <h3 className="text-base font-bold text-[var(--app-text)]">
                    Label Barcode / Aset ISP
                  </h3>
                </div>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="p-1 rounded-lg text-[var(--app-muted)] hover:text-[var(--app-text)]"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Asset Tag Card */}
              <div
                id="asset-label-print"
                className="bg-white dark:bg-white text-slate-900 p-4 rounded-xl border-2 border-slate-900 space-y-3 shadow-inner print:bg-white print:text-slate-900"
              >
                <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                  <span className="font-extrabold text-xs tracking-wider text-blue-900">
                    AUDIRA NETWORKS
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                    PROPERTY ASSET
                  </span>
                </div>

                <div className="flex items-center justify-center py-2">
                  <QRCodeSVG
                    value={`AUDIRA-ASSET:${qrTarget.serialNumber}:${qrTarget.type}`}
                    size={140}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="text-center font-mono space-y-0.5">
                  <div className="text-sm font-black tracking-widest text-slate-900">
                    {qrTarget.serialNumber}
                  </div>
                  <div className="text-[10px] text-slate-600 font-sans">
                    {qrTarget.brand} {qrTarget.model}
                  </div>
                  {qrTarget.macAddress && (
                    <div className="text-[9px] text-slate-500 font-mono">
                      MAC: {qrTarget.macAddress}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-300 pt-1.5 text-[8px] text-center text-slate-500 font-sans">
                  HOTLINE ISP: +62 821-1200-1600 • https://audira.my.id
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md hover:from-blue-500 hover:to-indigo-500 flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Label Stiker</span>
                </button>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-[var(--app-muted)] bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl hover:text-[var(--app-text)]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
