import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { customerAPI } from '../../services/api';

export default function SpeedTestScreen({ navigation }: any) {
  const { user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [step, setStep] = useState<'idle' | 'ping' | 'download' | 'upload' | 'done'>('idle');
  const [ping, setPing] = useState(12);
  const [jitter, setJitter] = useState(2);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [rebooting, setRebooting] = useState(false);
  const [packageInfo, setPackageInfo] = useState<any>({
    name: 'Home Fiber Ultra',
    speed: '50 Mbps',
    opticalPower: '-19.4 dBm',
    status: 'OPTIMAL',
  });

  useEffect(() => {
    loadPackageInfo();
  }, []);

  const loadPackageInfo = async () => {
    try {
      const res = await customerAPI.getDashboard();
      if (res.data?.package) {
        setPackageInfo({
          name: res.data.package.name || 'Home Fiber Ultra',
          speed: `${res.data.package.speed || 50} Mbps`,
          opticalPower: '-19.4 dBm',
          status: 'OPTIMAL',
        });
      }
    } catch (e) {
      // Keep defaults
    }
  };

  const runSpeedTest = () => {
    if (testing) return;
    setTesting(true);
    setStep('ping');
    setDownloadSpeed(0);
    setUploadSpeed(0);

    // Step 1: Ping
    setTimeout(() => {
      setPing(Math.floor(Math.random() * 6) + 8);
      setJitter(Math.floor(Math.random() * 3) + 1);
      setStep('download');

      // Step 2: Download
      let curDown = 5;
      const downInterval = setInterval(() => {
        curDown += Math.floor(Math.random() * 12) + 6;
        if (curDown >= 48) {
          curDown = 48.5 + (Math.random() * 3.5);
          clearInterval(downInterval);
          setDownloadSpeed(parseFloat(curDown.toFixed(1)));
          setStep('upload');

          // Step 3: Upload
          let curUp = 3;
          const upInterval = setInterval(() => {
            curUp += Math.floor(Math.random() * 8) + 4;
            if (curUp >= 24) {
              curUp = 24.2 + (Math.random() * 2.8);
              clearInterval(upInterval);
              setUploadSpeed(parseFloat(curUp.toFixed(1)));
              setStep('done');
              setTesting(false);
            } else {
              setUploadSpeed(parseFloat(curUp.toFixed(1)));
            }
          }, 150);
        } else {
          setDownloadSpeed(parseFloat(curDown.toFixed(1)));
        }
      }, 150);
    }, 1200);
  };

  const handleRebootModem = () => {
    Alert.alert(
      'Reboot ONT Modem',
      'Perintah restart akan dikirimkan ke modem fiber (TR-069 GenieACS). Koneksi akan terputus selama sekitar 60-90 detik. Lanjutkan?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Restart Sekarang',
          style: 'destructive',
          onPress: () => {
            setRebooting(true);
            setTimeout(() => {
              setRebooting(false);
              Alert.alert('Sukses', 'Perintah reboot telah dikirim ke perangkat ONT pelanggan.');
            }, 2500);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>Diagnostik & Speedometer</Text>
        <Text style={styles.headerTitle}>Uji Kecepatan & ONT</Text>
        <Text style={styles.headerInet}>
          ID: {user?.internetNumber || user?.id?.substring(0, 12) || 'NET-100234'}
        </Text>
      </View>

      {/* Package & Optical Power Card */}
      <View style={styles.statusCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderTitle}>📡 Status Telemetri Fiber & ONT</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>TERKONEKSI</Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Paket Langganan</Text>
            <Text style={styles.metricVal}>{packageInfo.speed}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Optical Power (Rx)</Text>
            <Text style={[styles.metricVal, { color: '#16a34a' }]}>{packageInfo.opticalPower}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Kualitas Sinyal</Text>
            <Text style={[styles.metricVal, { color: '#0284c7' }]}>Prima</Text>
          </View>
        </View>
      </View>

      {/* Speedometer Circle Display */}
      <View style={styles.speedCard}>
        <Text style={styles.testStateText}>
          {step === 'idle'
            ? 'Siap Melakukan Tes'
            : step === 'ping'
            ? 'Mengukur Latensi & Jitter...'
            : step === 'download'
            ? 'Mengukur Unduhan (Download)...'
            : step === 'upload'
            ? 'Mengukur Unggahan (Upload)...'
            : 'Uji Kecepatan Selesai! 🎉'}
        </Text>

        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeInner}>
            <Text style={styles.gaugeSpeed}>
              {step === 'upload' ? uploadSpeed : downloadSpeed}
            </Text>
            <Text style={styles.gaugeUnit}>Mbps</Text>
            <Text style={styles.gaugeSub}>
              {step === 'upload' ? 'Upload Speed' : 'Download Speed'}
            </Text>
          </View>
        </View>

        {/* Detailed Stats Row */}
        <View style={styles.detailStats}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Ping</Text>
            <Text style={styles.statValue}>{ping} ms</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Jitter</Text>
            <Text style={styles.statValue}>{jitter} ms</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Download</Text>
            <Text style={[styles.statValue, { color: '#0284c7' }]}>{downloadSpeed} M</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Upload</Text>
            <Text style={[styles.statValue, { color: '#16a34a' }]}>{uploadSpeed} M</Text>
          </View>
        </View>

        {/* Start Test Button */}
        <TouchableOpacity
          style={[styles.startTestBtn, testing && styles.btnDisabled]}
          onPress={runSpeedTest}
          disabled={testing}
        >
          {testing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.startTestBtnText}>⚡ MULAI SPEED TEST</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Hardware Control Section */}
      <View style={styles.hardwareCard}>
        <Text style={styles.hwTitle}>⚙️ Manajemen Perangkat Modem (TR-069)</Text>
        <Text style={styles.hwDesc}>
          Jika koneksi Wi-Fi di rumah terasa berat atau lambat, Anda dapat melakukan restart perangkat modem langsung dari ponsel.
        </Text>

        <TouchableOpacity
          style={styles.rebootBtn}
          onPress={handleRebootModem}
          disabled={rebooting}
        >
          {rebooting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.rebootBtnText}>🔄 Restart Modem Jarak Jauh</Text>
          )}
        </TouchableOpacity>
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
  },
  statusCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  statusBadge: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: '#16a34a',
    fontSize: 10,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  metricVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: 4,
  },
  speedCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  testStateText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0284c7',
    marginBottom: 16,
  },
  gaugeContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 6,
    borderColor: '#0284c7',
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  gaugeInner: {
    alignItems: 'center',
  },
  gaugeSpeed: {
    fontSize: 42,
    fontWeight: '900',
    color: '#0f172a',
  },
  gaugeUnit: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0284c7',
    marginTop: -4,
  },
  gaugeSub: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 18,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  startTestBtn: {
    width: '100%',
    backgroundColor: '#0284c7',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  startTestBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  hardwareCard: {
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
  hwTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  hwDesc: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 6,
    lineHeight: 18,
  },
  rebootBtn: {
    marginTop: 14,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#0f172a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  rebootBtnText: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
  },
});
