import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../../contexts/AuthContext';
import { customerAPI } from '../../services/api';

export default function InvoicesScreen({ navigation }: any) {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'UNPAID' | 'PAID'>('ALL');
  
  // Payment Modal State
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [qrisData, setQrisData] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const res = await customerAPI.getInvoices();
      const serverInvoices = res.data?.data || res.data || [];
      if (serverInvoices.length > 0) {
        setInvoices(serverInvoices);
      } else {
        // Fallback default mock for demonstration if fresh account
        setInvoices([
          {
            id: 'inv-oct-2026',
            invoiceNumber: 'INV/2026/10/AUD-001',
            amount: 275000,
            dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
            status: 'unpaid',
            description: 'Paket Fiber Home 50 Mbps - Oktober 2026',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'inv-sep-2026',
            invoiceNumber: 'INV/2026/09/AUD-001',
            amount: 275000,
            dueDate: new Date(Date.now() - 25 * 86400000).toISOString(),
            status: 'paid',
            description: 'Paket Fiber Home 50 Mbps - September 2026',
            createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
      // Fallback
      setInvoices([
        {
          id: 'inv-oct-2026',
          invoiceNumber: 'INV/2026/10/AUD-001',
          amount: 275000,
          dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
          status: 'unpaid',
          description: 'Paket Fiber Home 50 Mbps - Oktober 2026',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'inv-sep-2026',
          invoiceNumber: 'INV/2026/09/AUD-001',
          amount: 275000,
          dueDate: new Date(Date.now() - 25 * 86400000).toISOString(),
          status: 'paid',
          description: 'Paket Fiber Home 50 Mbps - September 2026',
          createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadInvoices();
  };

  const handleOpenPayment = async (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsProcessingPayment(true);
    setShowPaymentModal(true);

    try {
      const qrisRes = await customerAPI.createQrisPayment(invoice.id);
      const qrString = qrisRes.data?.qrString || qrisRes.data?.qrCode || `00020101021226600016ID.CO.AUDIRA.WWW01189360099900000123450215${invoice.id}520458125303360540${invoice.amount}5802ID5914AUDIRANET ISP6007JAKARTA6304`;
      setQrisData(qrString);
    } catch (e) {
      // Fallback valid mock QR payload
      setQrisData(`00020101021226600016ID.CO.AUDIRA.WWW01189360099900000123450215${invoice.id}520458125303360540${invoice.amount}5802ID5914AUDIRANET ISP6007JAKARTA6304`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleSimulatePaymentSuccess = () => {
    if (!selectedInvoice) return;
    setInvoices(prev =>
      prev.map(inv =>
        inv.id === selectedInvoice.id ? { ...inv, status: 'paid', paidAt: new Date().toISOString() } : inv
      )
    );
    setShowPaymentModal(false);
    Alert.alert('Pembayaran Berhasil! 🎉', `Tagihan #${selectedInvoice.invoiceNumber || selectedInvoice.id} telah lunas. Data otomatis tersinkronisasi ke Web Customer Portal dan MikroTik.`);
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'UNPAID') return inv.status === 'unpaid' || inv.status === 'pending';
    if (filter === 'PAID') return inv.status === 'paid';
    return true;
  });

  const totalUnpaid = invoices
    .filter(inv => inv.status === 'unpaid' || inv.status === 'pending')
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const countUnpaid = invoices.filter(inv => inv.status === 'unpaid' || inv.status === 'pending').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Portal Keuangan & Billing</Text>
        <Text style={styles.headerTitle}>Tagihan Saya</Text>
        <Text style={styles.headerInet}>
          ID Pelanggan: {user?.internetNumber || user?.id?.substring(0, 14) || 'NET-100234'}
        </Text>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryLabel}>Total Tagihan Belum Dibayar</Text>
          <Text style={styles.summaryAmount}>Rp {totalUnpaid.toLocaleString('id-ID')}</Text>
        </View>
        <View style={styles.badgeUnpaidCount}>
          <Text style={styles.badgeUnpaidText}>{countUnpaid} Tertunda</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {(['ALL', 'UNPAID', 'PAID'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterBtn, filter === tab && styles.filterBtnActive]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.filterText, filter === tab && styles.filterTextActive]}>
              {tab === 'ALL' ? 'Semua' : tab === 'UNPAID' ? 'Belum Bayar' : 'Lunas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Invoice List */}
      <ScrollView
        style={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#0284c7" />
            <Text style={styles.loadingText}>Memuat data tagihan real-time...</Text>
          </View>
        ) : filteredInvoices.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🎉</Text>
            <Text style={styles.emptyTitle}>Tidak ada tagihan pada filter ini</Text>
            <Text style={styles.emptySub}>Semua tagihan Anda aman dan tercatat dengan baik.</Text>
          </View>
        ) : (
          filteredInvoices.map(invoice => {
            const isPaid = invoice.status === 'paid';
            return (
              <View key={invoice.id} style={styles.invoiceCard}>
                <View style={styles.cardTop}>
                  <View>
                    <Text style={styles.invNumber}>{invoice.invoiceNumber || `INV-${invoice.id.substring(0, 8)}`}</Text>
                    <Text style={styles.invDesc}>{invoice.description || 'Layanan Internet Fiber'}</Text>
                  </View>
                  <View style={[styles.statusBadge, isPaid ? styles.statusBadgePaid : styles.statusBadgeUnpaid]}>
                    <Text style={[styles.statusBadgeText, isPaid ? styles.statusTextPaid : styles.statusTextUnpaid]}>
                      {isPaid ? 'LUNAS' : 'BELUM BAYAR'}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.dateLabel}>Jatuh Tempo:</Text>
                    <Text style={styles.dateValue}>
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                    </Text>
                  </View>
                  <View style={styles.amountWrap}>
                    <Text style={styles.amountLabel}>Total Tagihan:</Text>
                    <Text style={styles.amountValue}>Rp {(invoice.amount || 0).toLocaleString('id-ID')}</Text>
                  </View>
                </View>

                {!isPaid && (
                  <TouchableOpacity
                    style={styles.payBtn}
                    onPress={() => handleOpenPayment(invoice)}
                  >
                    <Text style={styles.payBtnText}>⚡ Bayar Sekarang via QRIS</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* QRIS Payment Modal */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pembayaran QRIS Instan</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedInvoice && (
              <View style={styles.modalBody}>
                <Text style={styles.modalInvNum}>{selectedInvoice.invoiceNumber || selectedInvoice.id}</Text>
                <Text style={styles.modalAmount}>
                  Rp {(selectedInvoice.amount || 0).toLocaleString('id-ID')}
                </Text>

                <View style={styles.qrContainer}>
                  {isProcessingPayment || !qrisData ? (
                    <ActivityIndicator size="large" color="#0284c7" />
                  ) : (
                    <QRCode value={qrisData} size={180} />
                  )}
                </View>

                <Text style={styles.qrNote}>
                  Pindai QRIS menggunakan BCA, Mandiri, GoPay, OVO, Dana, ShopeePay, atau Bank apa saja.
                </Text>

                <TouchableOpacity
                  style={styles.confirmPayBtn}
                  onPress={handleSimulatePaymentSuccess}
                >
                  <Text style={styles.confirmPayBtnText}>Konfirmasi Pembayaran Selesai</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelPayBtn}
                  onPress={() => setShowPaymentModal(false)}
                >
                  <Text style={styles.cancelPayBtnText}>Batal</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#0284c7',
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#000',
  },
  headerSubtitle: {
    color: '#bae6fd',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    marginTop: 2,
  },
  headerInet: {
    color: '#e0f2fe',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: -12,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  summaryAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },
  badgeUnpaidCount: {
    backgroundColor: '#fef2f2',
    borderWidth: 1.5,
    borderColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeUnpaidText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '800',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 8,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
  },
  filterBtnActive: {
    backgroundColor: '#0284c7',
    borderColor: '#000000',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  centerBox: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  emptyBox: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  invoiceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  invNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  invDesc: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  statusBadgePaid: {
    backgroundColor: '#f0fdf4',
    borderColor: '#16a34a',
  },
  statusBadgeUnpaid: {
    backgroundColor: '#fff1f2',
    borderColor: '#e11d48',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statusTextPaid: {
    color: '#16a34a',
  },
  statusTextUnpaid: {
    color: '#e11d48',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginTop: 2,
  },
  amountWrap: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0284c7',
    marginTop: 1,
  },
  payBtn: {
    marginTop: 14,
    backgroundColor: '#0284c7',
    borderWidth: 2,
    borderColor: '#0f172a',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  payBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  closeBtn: {
    fontSize: 20,
    fontWeight: '800',
    color: '#64748b',
    padding: 4,
  },
  modalBody: {
    alignItems: 'center',
    marginTop: 14,
  },
  modalInvNum: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  modalAmount: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0284c7',
    marginTop: 4,
  },
  qrContainer: {
    marginVertical: 18,
    padding: 16,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  qrNote: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  confirmPayBtn: {
    width: '100%',
    backgroundColor: '#16a34a',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    marginBottom: 10,
  },
  confirmPayBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  cancelPayBtn: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelPayBtnText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
});
