import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import { Clock, MapPin, Camera as CameraIcon, CheckCircle, LogOut } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface AttendanceStatus {
  checkInTime?: string;
  checkOutTime?: string;
  status: 'not_checked_in' | 'checked_in' | 'checked_out';
  workDuration?: string;
  checkInLocation?: { lat: number; lng: number };
  checkOutLocation?: { lat: number; lng: number };
}

export default function AttendanceScreen() {
  const [loading, setLoading] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus>({
    status: 'not_checked_in',
  });
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    requestPermissions();
    loadUserData();
    checkTodayAttendance();
  }, []);

  const requestPermissions = async () => {
    try {
      // Request location permission
      const locationStatus = await Location.requestForegroundPermissionsAsync();
      
      // Request camera permission
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      
      if (locationStatus.status !== 'granted' || cameraStatus.status !== 'granted') {
        Alert.alert(
          'Izin Diperlukan',
          'Aplikasi memerlukan akses ke lokasi dan kamera untuk fitur absensi',
          [{ text: 'OK' }]
        );
        setHasPermission(false);
        return;
      }

      setHasPermission(true);
      
      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setCurrentLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Gagal mendapatkan izin akses');
    }
  };

  const loadUserData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.name || user.email);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const checkTodayAttendance = async () => {
    try {
      setLoading(true);
      const response = await api.get('/attendance/my-today');
      
      if (response.data) {
        const data = response.data;
        setAttendanceStatus({
          checkInTime: data.checkInTime,
          checkOutTime: data.checkOutTime,
          status: data.checkOutTime ? 'checked_out' : 'checked_in',
          workDuration: data.workDuration,
          checkInLocation: data.checkInLocation,
          checkOutLocation: data.checkOutLocation,
        });
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        console.error('Error checking attendance:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!hasPermission) {
      Alert.alert('Error', 'Izin lokasi dan kamera diperlukan');
      return;
    }

    if (!currentLocation) {
      Alert.alert('Error', 'Lokasi belum tersedia. Tunggu sebentar...');
      return;
    }

    try {
      setLoading(true);

      // Get fresh location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const requestData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        photo: photoUri || null,
      };

      const response = await api.post('/attendance/check-in', requestData);

      Alert.alert('Berhasil', 'Check-in berhasil!', [
        {
          text: 'OK',
          onPress: () => checkTodayAttendance(),
        },
      ]);

      setPhotoUri(null);
    } catch (error: any) {
      console.error('Error checking in:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Gagal melakukan check-in'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!hasPermission) {
      Alert.alert('Error', 'Izin lokasi dan kamera diperlukan');
      return;
    }

    if (!currentLocation) {
      Alert.alert('Error', 'Lokasi belum tersedia. Tunggu sebentar...');
      return;
    }

    try {
      setLoading(true);

      // Get fresh location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const requestData = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        photo: photoUri || null,
      };

      const response = await api.post('/attendance/check-out', requestData);

      Alert.alert('Berhasil', 'Check-out berhasil!', [
        {
          text: 'OK',
          onPress: () => checkTodayAttendance(),
        },
      ]);

      setPhotoUri(null);
    } catch (error: any) {
      console.error('Error checking out:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Gagal melakukan check-out'
      );
    } finally {
      setLoading(false);
    }
  };

  const openCamera = async () => {
    // Note: For simplicity, using a placeholder
    // In production, implement camera capture
    Alert.alert('Info', 'Fitur kamera akan segera tersedia');
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '-';
    const date = new Date(timeString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (duration?: string) => {
    if (!duration) return '-';
    return duration;
  };

  if (loading && attendanceStatus.status === 'not_checked_in') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Memuat data absensi...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Absensi</Text>
        <Text style={styles.headerSubtitle}>
          {new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* User Info */}
      <View style={styles.userCard}>
        <View style={styles.userAvatar}>
          <Text style={styles.userAvatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userName}</Text>
          <View style={styles.statusBadge}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    attendanceStatus.status === 'checked_out'
                      ? '#dc2626'
                      : attendanceStatus.status === 'checked_in'
                      ? '#16a34a'
                      : '#94a3b8',
                },
              ]}
            />
            <Text style={styles.statusText}>
              {attendanceStatus.status === 'checked_out'
                ? 'Sudah Check-out'
                : attendanceStatus.status === 'checked_in'
                ? 'Sudah Check-in'
                : 'Belum Absen'}
            </Text>
          </View>
        </View>
      </View>

      {/* Location Info */}
      {currentLocation && (
        <View style={styles.locationCard}>
          <MapPin size={20} color="#3b82f6" />
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Lokasi Saat Ini</Text>
            <Text style={styles.locationCoords}>
              {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            </Text>
          </View>
        </View>
      )}

      {/* Attendance Status Cards */}
      <View style={styles.statusContainer}>
        {/* Check-in Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusCardHeader}>
            <Clock size={24} color="#16a34a" />
            <Text style={styles.statusCardTitle}>Check-in</Text>
          </View>
          <Text style={styles.statusCardTime}>
            {formatTime(attendanceStatus.checkInTime)}
          </Text>
          {attendanceStatus.checkInLocation && (
            <Text style={styles.statusCardLocation}>
              📍 {attendanceStatus.checkInLocation.lat.toFixed(4)},{' '}
              {attendanceStatus.checkInLocation.lng.toFixed(4)}
            </Text>
          )}
        </View>

        {/* Check-out Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusCardHeader}>
            <LogOut size={24} color="#dc2626" />
            <Text style={styles.statusCardTitle}>Check-out</Text>
          </View>
          <Text style={styles.statusCardTime}>
            {formatTime(attendanceStatus.checkOutTime)}
          </Text>
          {attendanceStatus.checkOutLocation && (
            <Text style={styles.statusCardLocation}>
              📍 {attendanceStatus.checkOutLocation.lat.toFixed(4)},{' '}
              {attendanceStatus.checkOutLocation.lng.toFixed(4)}
            </Text>
          )}
        </View>
      </View>

      {/* Work Duration */}
      {attendanceStatus.workDuration && (
        <View style={styles.durationCard}>
          <Text style={styles.durationLabel}>Durasi Kerja</Text>
          <Text style={styles.durationValue}>
            {formatDuration(attendanceStatus.workDuration)}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {attendanceStatus.status === 'not_checked_in' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.checkInButton]}
            onPress={handleCheckIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <CheckCircle size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Check-in Sekarang</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {attendanceStatus.status === 'checked_in' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.checkOutButton]}
            onPress={handleCheckOut}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <LogOut size={24} color="#fff" />
                <Text style={styles.actionButtonText}>Check-out Sekarang</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {attendanceStatus.status === 'checked_out' && (
          <View style={styles.completedCard}>
            <CheckCircle size={48} color="#16a34a" />
            <Text style={styles.completedText}>
              Absensi hari ini sudah selesai
            </Text>
            <Text style={styles.completedSubtext}>
              Terima kasih atas kerja keras Anda!
            </Text>
          </View>
        )}
      </View>

      {/* Refresh Button */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={checkTodayAttendance}
        disabled={loading}
      >
        <Text style={styles.refreshButtonText}>
          🔄 Refresh Status
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    backgroundColor: '#2563eb',
    padding: 24,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#bfdbfe',
    marginTop: 4,
  },
  userCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#64748b',
  },
  locationCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  locationCoords: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  statusCardTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statusCardLocation: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  durationCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  durationLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  durationValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2563eb',
    marginTop: 4,
  },
  actionContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  checkInButton: {
    backgroundColor: '#16a34a',
  },
  checkOutButton: {
    backgroundColor: '#dc2626',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  completedCard: {
    backgroundColor: '#f0fdf4',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#86efac',
  },
  completedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
    marginTop: 12,
    textAlign: 'center',
  },
  completedSubtext: {
    fontSize: 14,
    color: '#4ade80',
    marginTop: 4,
    textAlign: 'center',
  },
  refreshButton: {
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
});
