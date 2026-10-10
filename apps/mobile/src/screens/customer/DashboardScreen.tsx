import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { customerAPI } from '../services/api';

const { width } = Dimensions.get('window');

export default function CustomerDashboardScreen({ navigation }: any) {
  const { user, logout } = useAuth();
  const [usage, setUsage] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (user?.id) {
        const [usageRes, invoicesRes] = await Promise.all([
          customerAPI.getUsage(user.id),
          customerAPI.getInvoices(user.id),
        ]);

        setUsage(usageRes.data);
        setInvoices(invoicesRes.data.slice(0, 3)); // Last 3 invoices
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const getUsagePercentage = () => {
    if (!usage?.quota || !usage?.used) return 0;
    return Math.min((usage.used / usage.quota) * 100, 100);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo,</Text>
          <Text style={styles.name}>{user?.name}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Usage Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Penggunaan Bulan Ini</Text>
        <View style={styles.usageContainer}>
          <Text style={styles.usageValue}>
            {usage?.used || 0} GB / {usage?.quota || 0} GB
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
            {getUsagePercentage().toFixed(0)}% digunakan
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Menu Cepat</Text>
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
            <Text style={styles.actionText}>Support</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Invoices */}
      <View style={styles.invoicesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tagihan Terbaru</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Invoices')}>
            <Text style={styles.seeAllText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {invoices.map((invoice) => (
          <View key={invoice.id} style={styles.invoiceCard}>
            <View style={styles.invoiceHeader}>
              <Text style={styles.invoiceMonth}>
                {new Date(invoice.dueDate).toLocaleDateString('id-ID', {
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      invoice.status === 'paid'
                        ? '#dcfce7'
                        : invoice.status === 'pending'
                        ? '#fef3c7'
                        : '#fee2e2',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        invoice.status === 'paid'
                          ? '#16a34a'
                          : invoice.status === 'pending'
                          ? '#ca8a04'
                          : '#dc2626',
                    },
                  ]}
                >
                  {invoice.status === 'paid'
                    ? 'Lunas'
                    : invoice.status === 'pending'
                    ? 'Pending'
                    : 'Belum Bayar'}
                </Text>
              </View>
            </View>
            <Text style={styles.invoiceAmount}>
              Rp {invoice.total?.toLocaleString('id-ID')}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 24,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: '#93c5fd',
    fontSize: 16,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  usageContainer: {
    alignItems: 'center',
  },
  usageValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  usagePercentage: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionsContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: (width - 44) / 2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionIconText: {
    fontSize: 28,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  invoicesContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  invoiceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invoiceMonth: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  invoiceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
});
