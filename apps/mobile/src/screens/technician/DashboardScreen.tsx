import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '../../contexts/AuthContext';
import { technicianAPI } from '../../services/api';

interface WorkOrder {
  id: string;
  type: string;
  priority: string;
  status: string;
  title: string;
  description: string;
  scheduledAt: string;
  location: string;
  latitude?: number;
  longitude?: number;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
}

export default function TechnicianDashboardScreen({ navigation }: any) {
  const { user } = useAuth();
  const [todayJobs, setTodayJobs] = useState<WorkOrder[]>([]);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    requestLocationPermission();
    loadTodayJobs();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    }
  };

  const loadTodayJobs = async () => {
    try {
      if (user?.id) {
        const response = await technicianAPI.getTodayJobs(user.id);
        setTodayJobs(response.data);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadTodayJobs();
    setIsRefreshing(false);
  };

  const startJob = async (job: WorkOrder) => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      await technicianAPI.startJob(
        job.id,
        location.coords.latitude,
        location.coords.longitude
      );
      Alert.alert('Success', 'Pekerjaan dimulai');
      loadTodayJobs();
    } catch (error) {
      Alert.alert('Error', 'Gagal memulai pekerjaan');
    }
  };

  const openNavigation = (job: WorkOrder) => {
    if (job.latitude && job.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${job.latitude},${job.longitude}`;
      // Use Linking.openURL(url) in real app
      Alert.alert('Navigation', `Navigate to: ${job.location}`);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return '#dc2626';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#eab308';
      default:
        return '#6b7280';
    }
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
        <Text style={styles.headerTitle}>Field Service</Text>
        <Text style={styles.headerSubtitle}>
          {todayJobs.length} pekerjaan hari ini
        </Text>
      </View>

      {/* Map */}
      {currentLocation && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {/* Current Location */}
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Your Location"
              pinColor="blue"
            />

            {/* Job Markers */}
            {todayJobs
              .filter((job) => job.latitude && job.longitude)
              .map((job) => (
                <Marker
                  key={job.id}
                  coordinate={{
                    latitude: job.latitude!,
                    longitude: job.longitude!,
                  }}
                  title={job.customer.name}
                  description={job.title}
                  pinColor={
                    job.status === 'in-progress'
                      ? 'orange'
                      : job.priority === 'urgent'
                      ? 'red'
                      : 'green'
                  }
                />
              ))}
          </MapView>
        </View>
      )}

      {/* Jobs List */}
      <View style={styles.jobsContainer}>
        <Text style={styles.sectionTitle}>Pekerjaan Hari Ini</Text>

        {todayJobs.map((job) => (
          <View
            key={job.id}
            style={[
              styles.jobCard,
              { borderLeftColor: getPriorityColor(job.priority) },
            ]}
          >
            <View style={styles.jobHeader}>
              <View style={styles.jobTitleContainer}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(job.priority) },
                  ]}
                >
                  <Text style={styles.priorityText}>
                    {job.priority.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      job.status === 'in-progress'
                        ? '#dbeafe'
                        : job.status === 'assigned'
                        ? '#f3e8ff'
                        : '#e5e7eb',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    {
                      color:
                        job.status === 'in-progress'
                          ? '#1e40af'
                          : job.status === 'assigned'
                          ? '#7c3aed'
                          : '#374151',
                    },
                  ]}
                >
                  {job.status}
                </Text>
              </View>
            </View>

            <Text style={styles.jobDescription}>{job.description}</Text>

            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>👤 {job.customer.name}</Text>
              <Text style={styles.customerPhone}>📞 {job.customer.phone}</Text>
              <Text style={styles.customerAddress}>📍 {job.location}</Text>
            </View>

            <View style={styles.jobActions}>
              {job.latitude && job.longitude && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.navigateButton]}
                  onPress={() => openNavigation(job)}
                >
                  <Text style={styles.actionButtonText}>🧭 Navigate</Text>
                </TouchableOpacity>
              )}

              {job.status === 'assigned' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.startButton]}
                  onPress={() => startJob(job)}
                >
                  <Text style={styles.actionButtonText}>▶️ Mulai</Text>
                </TouchableOpacity>
              )}

              {job.status === 'in-progress' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.continueButton]}
                  onPress={() =>
                    navigation.navigate('JobDetail', { jobId: job.id })
                  }
                >
                  <Text style={styles.actionButtonText}>➡️ Lanjutkan</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {todayJobs.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Tidak ada pekerjaan untuk hari ini
            </Text>
          </View>
        )}
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#93c5fd',
    marginTop: 4,
  },
  mapContainer: {
    height: 250,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  map: {
    flex: 1,
  },
  jobsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    marginBottom: 12,
  },
  jobTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  jobDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  customerInfo: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    color: '#2563eb',
    marginBottom: 4,
  },
  customerAddress: {
    fontSize: 14,
    color: '#6b7280',
  },
  jobActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  navigateButton: {
    backgroundColor: '#16a34a',
  },
  startButton: {
    backgroundColor: '#2563eb',
  },
  continueButton: {
    backgroundColor: '#f59e0b',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
  },
});
