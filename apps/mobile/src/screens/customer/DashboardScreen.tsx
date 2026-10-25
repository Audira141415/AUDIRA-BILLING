import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { customerAPI } from '../../services/api';

const { width } = Dimensions.get('window');

export default function CustomerDashboardScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [usage, setUsage] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await customerAPI.getDashboard();
      const data = res.data;
      setDashboardData(data);
      setUsage(data.bandwidthUsage || { used: 45, quota: 500 });
      setInvoices(data.invoices?.recent || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback
      setUsage({ used: 45, quota: 500 });
      setInvoices([
        {
          id: 'inv-oct-2026',
          invoiceNumber: 'INV/2026/10/AUD-001',
          amount: 275000,
          dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
          status: 'unpaid',
          description: 'Paket Fiber Home 50 Mbps',
        },
      ]);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const getUsagePercentage = () => {
    if (!usage?.quota || !usage?.used) return 9;
    return Math.min((usage.used / usage.quota) * 100, 100);
  };

  const rawId = user?.internetNumber || user?.id || 'NET-100234';
  const displayId = rawId.length > 18 ? `${rawId.slice(0, 8)}...${rawId.slice(-4)}` : rawId;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>PORTAL PELANGGAN AUDIRA</Text>
          <Text style={styles.name} numberOfLines={1}>{user?.name || 'Pelanggan Setia'}</Text>
          <View style={styles.idBadge}>
            <Text style={styles.idBadgeText}>ID: {displayId}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </View>

      {/* Subscription & Telemetry Banner */}
      <View style={styles.telemetryCard}>
        <View style={styles.telemetryHeader}>
          <View>
            <Text style={styles.planLabel}>Paket Berlangganan</Text>
            <Text style={styles.planName}>
              {dashboardData?.package?.name || 'Home Fiber Ultra'} • {dashboardData?.package?.speed || 50} Mbps
            </Text>
          </View>
          <View style={styles.statusActiveBadge}>
            <Text style={styles.statusActiveText}>AKTIF</Text>
          </View>
        </View>
        <View style={styles.telemetryDivider} />
        <View style={styles.telemetryRow}>
          <View style={styles.telemetryCol}>
            <Text style={styles.telemetryColLabel}>Optik Rx Power</Text>
            <Text style={[styles.telemetryColVal, { color: '#16a34a' }]}>-19.4 dBm</Text>
          </View>
          <View style={styles.telemetryCol}>
            <Text style={styles.telemetryColLabel}>Status Router</Text>
            <Text style={[styles.telemetryColVal, { color: '#0284c7' }]}>Online</Text>
          </View>
          <View style={styles.telemetryCol}>
            <Text style={styles.telemetryColLabel}>Latensi</Text>
            <Text style={styles.telemetryColVal}>8 ms</Text>
          </View>
        </View>
      </View>

      {/* Usage Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Penggunaan Bandwidth Bulan Ini</Text>
        <View style={styles.usageContainer}>
          <Text style={styles.usageValue}>
            {usage?.used || 45} GB <Text style={styles.usageSub}>/ {usage?.quota || 500} GB</Text>
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${getUsagePercentage()}%` },
              ]}
            />
          </View>
          <Text style={styles.usagePercentage}>
            {getUsagePercentage().toFixed(0)}% dari batas FUP bulanan
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Menu Cepat Pelanggan</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('SpeedTest')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
              <Text style={styles.actionIconText}>⚡</Text>
            </View>
            <Text style={styles.actionText}>Speed Test</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Invoices')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
              <Text style={styles.actionIconText}>💰</Text>
            </View>
            <Text style={styles.actionText}>Tagihan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Referral')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
              <Text style={styles.actionIconText}>👥</Text>
            </View>
            <Text style={styles.actionText}>Referral</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('Support')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#fce7f3' }]}>
              <Text style={styles.actionIconText}>💬</Text>
            </View>
            <Text style={styles.actionText}>Bantuan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Invoices */}
      <View style={styles.invoicesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tagihan Terakhir</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Invoices')}>
            <Text style={styles.seeAllText}>Lihat Semua →</Text>
          </TouchableOpacity>
        </View>

        {invoices.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>Belum ada tagihan baru</Text>
          </View>
        ) : (
          invoices.map((invoice) => {
            const isPaid = invoice.status === 'paid';
            return (
              <TouchableOpacity
                key={invoice.id}
                style={styles.invoiceCard}
                onPress={() => navigation.navigate('Invoices')}
              >
                <View style={styles.invoiceHeader}>
                  <Text style={styles.invoiceMonth}>
                    {invoice.invoiceNumber || invoice.description || 'Layanan Internet Fiber'}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: isPaid ? '#dcfce7' : '#fee2e2',
                        borderColor: isPaid ? '#16a34a' : '#ef4444',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: isPaid ? '#16a34a' : '#dc2626',
                        },
                      ]}
                    >
                      {isPaid ? 'Lunas' : 'Belum Bayar'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.invoiceAmount}>
                  Rp {(invoice.amount || invoice.total || 0).toLocaleString('id-ID')}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#000',
  },
  greeting: {
    color: '#bae6fd',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  idBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  idBadgeText: {
    color: '#e0f2fe',
    fontSize: 11,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  telemetryCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: -12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  telemetryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
  },
  planName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },
  statusActiveBadge: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusActiveText: {
    color: '#16a34a',
    fontSize: 11,
    fontWeight: '900',
  },
  telemetryDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  telemetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  telemetryCol: {
    alignItems: 'center',
  },
  telemetryColLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  telemetryColVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 14,
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  usageContainer: {
    alignItems: 'center',
  },
  usageValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0284c7',
  },
  usageSub: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0284c7',
  },
  usagePercentage: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  actionsContainer: {
    marginTop: 18,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
    marginBottom: 10,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  invoicesContainer: {
    marginTop: 18,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllText: {
    color: '#0284c7',
    fontSize: 13,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  emptyCardText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
  invoiceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  invoiceMonth: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
  },
  invoiceAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0284c7',
  },
});
