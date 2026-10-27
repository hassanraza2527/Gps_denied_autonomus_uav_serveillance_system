import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { normalize } from '../../utils/responsive';
import CameraCard from '../../components/CameraCard';
import { ChevronLeftIcon } from '../../assets/icons/index';
import { useGetCamerasQuery, useDeleteCameraMutation } from '../../store/apiSlice';

const ManageCamerasScreen = ({ navigation, route }) => {
  // ✅ Received from SettingsScreen → navigation.navigate('ManageCameras', { propertyId })
  const propertyId = route?.params?.propertyId;

  const {
    data,
    isLoading,
    refetch,
  } = useGetCamerasQuery(propertyId, { skip: !propertyId });

  const [deleteCamera] = useDeleteCameraMutation();

  // Backend: { success, message, cameras: [...] }
  // Each camera: { id, name, rtsp_url, camera_type, grid_cell: { row, col } }
  const cameras = data?.cameras ?? [];

  const handleDelete = (camera) => {
    // 1. Sanity check: verify the ID actually exists before making the API call!
    console.log("Attempting to delete camera:", camera);

    if (!camera.id) {
      Alert.alert('Error', 'Camera ID is missing from the data object!');
      return;
    }

    Alert.alert(
      'Delete Camera',
      `Are you sure you want to delete "${camera.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log(`Sending DELETE request to /api/v1/settings/cameras/${camera.id}`);
              
              await deleteCamera({ cameraId: camera.id, propertyId }).unwrap();
              
              console.log("Delete successful!");
            } catch (err) {
              // 2. Log the exact error object from RTK Query
              console.error("DELETE CAMERA ERROR:", err);
              
              // 3. Extract the exact error message from FastAPI (err.data.detail)
              const errorMessage = err?.data?.detail || 'Failed to delete camera. Check terminal for details.';
              Alert.alert('Delete Failed', typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
            }
          },
        },
      ]
    );
};

  if (isLoading) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#C8AD84" />
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeftIcon width={28} height={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Cameras</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={cameras}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isLoading}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No cameras yet. Tap + to add one.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <CameraCard
            // Map backend shape → CameraCard props
            camera={{
              id: item.id,
              name: item.name,
              url: item.rtsp_url,
              wall_type:item.wall_type
            }}
            onEdit={() =>
              // ✅ Pass full raw camera + propertyId so EditCameraScreen can update
              navigation.navigate('EditCamera', { camera: item, propertyId })
            }
            onDelete={() => handleDelete(item)}
          />
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        // ✅ Pass propertyId so AddNewCameraScreen can POST to the right property
        onPress={() => navigation.navigate('AddCamera', { propertyId })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea:       { flex: 1, backgroundColor: '#FCFAF8' },
  header:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: normalize(20), paddingTop: normalize(15), paddingBottom: normalize(20) },
  backButton:     { padding: normalize(5), marginLeft: -normalize(5) },
  headerTitle:    { fontSize: normalize(22), fontWeight: 'bold', color: '#1A1A1A' },
  listContent:    { paddingHorizontal: normalize(20), paddingBottom: normalize(100) },
  emptyContainer: { alignItems: 'center', marginTop: normalize(60) },
  emptyText:      { color: '#888', fontSize: normalize(15) },
  fab: {
    position: 'absolute',
    bottom: normalize(30),
    right: normalize(20),
    backgroundColor: '#C8AD84',
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(15),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: { color: '#FFF', fontSize: normalize(30), marginTop: normalize(-2) },
});

export default ManageCamerasScreen;