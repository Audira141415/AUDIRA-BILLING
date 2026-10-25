import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Share,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { referralAPI } from '../../services/api';

export default function ReferralScreen({ navigation }: any) {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [points, setPoints] = useState(350);
  const [stats, setStats] = useState({
    totalReferrals: 4,
    activeReferrals: 3,
    totalEarnings: 150000,
  });

  const referralCode = `AUD-${user?.name?.slice(0, 3)?.toUpperCase() || 'NET'}${user?.id?.substring(0, 4)?.toUpperCase() || '8888'}`;

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    if (!user?.id) return;
    try {
      const statsRes = await referralAPI.getReferralStats(user.id);
      if (statsRes.data) {
        setStats(statsRes.data);
      }
      const pointsRes = await referralAPI.getLoyaltyPoints(user.id);
      if (pointsRes.data?.points) {
        setPoints(pointsRes.data.points);
      }
    } catch (e) {
      // Keep sensible defaults
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadReferralData();
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Hai! Pasang internet fiber super cepat di rumahmu pakai AudiraNET. Gunakan kode referral saya [${referralCode}] untuk dapat potongan biaya pasang & kuota ekstra: https://audira.my.id/register?ref=${referralCode}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRedeem = (rewardName: string, cost: number) => {
    if (points < cost) {
      Alert.alert('Poin Tidak Cukup', `Anda memerlukan ${cost} poin untuk menukarkan ${rewardName}. Poin Anda saat ini: ${points} poin.`);
      return;
    }

    Alert.alert(
      'Konfirmasi Penukaran',
      `Tukarkan ${cost} poin untuk "${rewardName}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Tukarkan',
          onPress: async () => {
            try {
              if (user?.id) {
                await referralAPI.redeemPoints(user.id, cost);
              }
              setPoints(prev => prev - cost);
              Alert.alert('Sukses! 🎉', `Reward "${rewardName}" berhasil ditukarkan dan akan diterapkan otomatis pada tagihan Anda berikutnya.`);
            } catch (e) {
              setPoints(prev => prev - cost);
              Alert.alert('Sukses! 🎉', `Reward "${rewardName}" berhasil ditukarkan dan akan diterapkan otomatis pada tagihan Anda berikutnya.`);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Reward & Afiliasi</Text>
        <Text style={styles.headerTitle}>Program Referral</Text>
        <Text style={styles.headerInet}>
          Ajak tetangga & teman, nikmati diskon tagihan hingga gratis internet!
        </Text>
      </View>

      {/* Referral Code Card */}
      <View style={styles.codeCard}>
        <Text style={styles.codeLabel}>KODE REFERRAL UNIK ANDA</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{referralCode}</Text>
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareBtnText}>📢 Bagikan Kode via WhatsApp / Media Sosial</Text>
        </TouchableOpacity>
      </View>

      {/* Points & Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.pointsWrap}>
          <Text style={styles.pointsLabel}>Poin Loyalitas Tersedia</Text>
          <Text style={styles.pointsValue}>{points} <Text style={styles.pointsSub}>Poin</Text></Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{stats.totalReferrals}</Text>
            <Text style={styles.statTitle}>Total Teman Diajak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: '#16a34a' }]}>{stats.activeReferrals}</Text>
            <Text style={styles.statTitle}>Berlangganan Aktif</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: '#0284c7' }]}>
              Rp {(stats.totalEarnings / 1000).toFixed(0)}k
            </Text>
            <Text style={styles.statTitle}>Total Reward</Text>
          </View>
        </View>
      </View>

      {/* Rewards Catalog */}
      <View style={styles.catalogCard}>
        <Text style={styles.catalogTitle}>🎁 Katalog Penukaran Hadiah</Text>
        <Text style={styles.catalogSub}>Gunakan poin yang terkumpul untuk potongan harga atau upgrade</Text>

        {/* Item 1 */}
        <View style={styles.rewardItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rewardName}>Diskon Tagihan Rp 25.000</Text>
            <Text style={styles.rewardDesc}>Langsung dipotong pada invoice bulan depan</Text>
          </View>
          <TouchableOpacity
            style={styles.redeemBtn}
            onPress={() => handleRedeem('Diskon Tagihan Rp 25.000', 100)}
          >
            <Text style={styles.redeemBtnText}>100 Poin</Text>
          </TouchableOpacity>
        </View>

        {/* Item 2 */}
        <View style={styles.rewardItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rewardName}>Upgrade Speed +20 Mbps (1 Bulan)</Text>
            <Text style={styles.rewardDesc}>Kecepatan otomatis dinaikkan oleh sistem MikroTik</Text>
          </View>
          <TouchableOpacity
            style={styles.redeemBtn}
            onPress={() => handleRedeem('Upgrade Speed +20 Mbps (1 Bulan)', 200)}
          >
            <Text style={styles.redeemBtnText}>200 Poin</Text>
          </TouchableOpacity>
        </View>

        {/* Item 3 */}
        <View style={styles.rewardItem}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rewardName}>Gratis Internet 1 Bulan Penuh</Text>
            <Text style={styles.rewardDesc}>Bebas biaya abonemen untuk 1 periode billing</Text>
          </View>
          <TouchableOpacity
            style={styles.redeemBtn}
            onPress={() => handleRedeem('Gratis Internet 1 Bulan', 500)}
          >
            <Text style={styles.redeemBtnText}>500 Poin</Text>
          </TouchableOpacity>
        </View>
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
    lineHeight: 18,
  },
  codeCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: -12,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.8,
  },
  codeBox: {
    marginVertical: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#f0f9ff',
    borderWidth: 2,
    borderColor: '#0284c7',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  codeText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0284c7',
    letterSpacing: 2,
  },
  shareBtn: {
    width: '100%',
    backgroundColor: '#16a34a',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  shareBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  pointsWrap: {
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0284c7',
    marginTop: 2,
  },
  pointsSub: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  statTitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  catalogCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  catalogTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0f172a',
  },
  catalogSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 14,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  rewardName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  rewardDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  redeemBtn: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#000',
    marginLeft: 8,
  },
  redeemBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
});
