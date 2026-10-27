import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { normalize } from '../../utils/responsive';
import DroneCard from '../../components/DroneCard';
import { ChevronLeftIcon } from '../../assets/icons/index';
import { useGetDronesQuery, useDeleteDroneMutation } from '../../store/apiSlice';

const ManageDronesScreen = ({ navigation,route }) => {
   const propertyId = route?.params?.propertyId;
  const { data, isLoading, refetch } = useGetDronesQuery(propertyId, { skip: !propertyId });
  const [deleteDrone] = useDeleteDroneMutation();
 
  // Backend: { success, message, drones: [...] }
  // Each drone: { id, name, connection_string, status, home_cell: { row, col } }
  const drones = data?.drones ?? [];
 
  const mapDrone = (d) => ({
    id: d.id,
    name: d.name,
    url: d.connection_string,
    status: d.status,
    _raw: d,
  });
 
  const handleDelete = (drone) => {
    Alert.alert('Delete Drone', `Delete ${drone.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDrone({ droneId: drone.id, propertyId }).unwrap();
          } catch {
            Alert.alert('Error', 'Failed to delete drone.');
          }
        },
      },
    ]);
  };
 
  if (isLoading) return <ActivityIndicator size="large" color="#C8AD84" style={{ flex: 1 }} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeftIcon width={28} height={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Drones</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={drones.map(mapDrone)}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <DroneCard
            drone={item}
            onEdit={() => navigation.navigate('EditDrone', { drone: item._raw, propertyId })}
            onDelete={() => handleDelete(item)}
          />
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddDrone', { propertyId })}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FCFAF8' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(20),
    paddingTop: normalize(15),
    paddingBottom: normalize(20),
  },
  backButton: { 
    padding: normalize(5), 
    marginLeft: -normalize(5) 
  },
  headerTitle: { 
    fontSize: normalize(22), 
    fontWeight: 'bold', 
    color: '#1A1A1A' 
  },
  listContent: { 
    paddingHorizontal: normalize(20), 
    paddingBottom: normalize(100) 
  },
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
  fabText: { 
    color: '#FFF', 
    fontSize: normalize(30), 
    marginTop: normalize(-2) 
  },
});

export default ManageDronesScreen;