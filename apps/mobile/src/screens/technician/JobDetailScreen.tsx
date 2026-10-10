import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { technicianAPI } from '../../services/api';

interface JobDetailScreenProps {
  route: any;
  navigation: any;
}

export default function JobDetailScreen({
  route,
  navigation,
}: JobDetailScreenProps) {
  const { jobId } = route.params;
  const [photos, setPhotos] = useState<string[]>([]);
  const [signature, setSignature] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant camera roll permissions');
      return;
    }

    const result = await ImagePicker.launchImagePickerAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      const newPhotos = result.assets.map((asset) => asset.uri);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant camera permissions');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });

    if (!result.canceled && result.assets) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const uploadPhotos = async () => {
    try {
      // In production, upload photos to server and get URLs
      await technicianAPI.uploadPhotos(jobId, photos);
      Alert.alert('Success', 'Foto berhasil diupload');
    } catch (error) {
      Alert.alert('Error', 'Gagal upload foto');
    }
  };

  const captureSignature = () => {
    // Navigate to signature screen
    navigation.navigate('Signature', {
      jobId,
      onSignatureCapture: (signatureData: string) => {
        setSignature(signatureData);
      },
    });
  };

  const completeJob = async () => {
    if (photos.length === 0) {
      Alert.alert('Warning', 'Harap upload minimal 1 foto');
      return;
    }

    if (!signature) {
      Alert.alert('Warning', 'Harap ambil tanda tangan pelanggan');
      return;
    }

    try {
      await technicianAPI.completeJob(jobId, {
        photos,
        signature,
        notes: 'Job completed successfully',
      });
      Alert.alert('Success', 'Pekerjaan selesai', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Gagal menyelesaikan pekerjaan');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Photos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📸 Upload Foto</Text>
          <Text style={styles.sectionDescription}>
            Ambil foto perangkat dan hasil pekerjaan
          </Text>

          <View style={styles.photoGrid}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => setPhotos(photos.filter((_, i) => i !== index))}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.photoActions}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={takePhoto}
            >
              <Text style={styles.secondaryButtonText}>📷 Ambil Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={pickImage}
            >
              <Text style={styles.secondaryButtonText}>🖼️ Pilih dari Galeri</Text>
            </TouchableOpacity>
          </View>

          {photos.length > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.uploadButton]}
              onPress={uploadPhotos}
            >
              <Text style={styles.buttonText}>
                ⬆️ Upload {photos.length} Foto
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Signature Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✍️ Tanda Tangan Pelanggan</Text>
          <Text style={styles.sectionDescription}>
            Minta pelanggan untuk tanda tangan sebagai bukti pekerjaan selesai
          </Text>

          {signature ? (
            <View style={styles.signatureContainer}>
              <Image
                source={{ uri: signature }}
                style={styles.signatureImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.retakeButton}
                onPress={captureSignature}
              >
                <Text style={styles.retakeText}>🔄 Ambil Ulang</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={captureSignature}
            >
              <Text style={styles.secondaryButtonText}>
                ✍️ Ambil Tanda Tangan
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Complete Job */}
        <TouchableOpacity
          style={[
            styles.button,
            styles.completeButton,
            (photos.length === 0 || !signature) && styles.disabledButton,
          ]}
          onPress={completeJob}
          disabled={photos.length === 0 || !signature}
        >
          <Text style={styles.buttonText}>✓ Selesaikan Pekerjaan</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  photoContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  uploadButton: {
    backgroundColor: '#2563eb',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  signatureContainer: {
    alignItems: 'center',
  },
  signatureImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  retakeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retakeText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#16a34a',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
});
