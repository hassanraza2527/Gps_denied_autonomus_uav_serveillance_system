import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { normalize } from '../../utils/responsive';
import { ChevronLeftIcon, ListLogsSolidIcon } from '../../assets/icons/index';
import { useGetFlightLogsQuery } from '../../store/apiSlice';

const DroneFlightLogsScreen = ({ navigation,route }) => {
  const propertyId = route?.params?.propertyId;
  const { data, isLoading } = useGetFlightLogsQuery(propertyId, { skip: !propertyId });
 
  // Backend: { success, message, flight_logs: [...] }
  // Each log: { id, drone_name, type, takeoff_time, land_time }
  const logs = data?.flight_logs ?? [];
 
  if (isLoading) return <ActivityIndicator size="large" color="#C8AD84" style={{ flex: 1 }} />;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeftIcon width={28} height={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Drone Flight Logs</Text>
        <View style={{ width: 28 }} />
      </View>
 {logs.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ListLogsSolidIcon width={normalize(80)} height={normalize(80)} color="#C8AD84" />
          <Text style={{ fontSize: normalize(24), fontWeight: 'bold', color: '#1A1A1A', marginTop: normalize(25) }}>
            No flight logs yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: normalize(20), paddingBottom: normalize(40) }}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: '#F9F7F2', borderRadius: normalize(12), padding: normalize(15), marginBottom: normalize(12), borderWidth: 1, borderColor: '#E8E1D3' }}>
              <Text style={{ fontSize: normalize(16), fontWeight: 'bold', color: '#1A1A1A' }}>{item.drone_name}</Text>
              <Text style={{ fontSize: normalize(13), color: '#666', marginTop: 4 }}>Type: {item.type}</Text>
              <Text style={{ fontSize: normalize(13), color: '#666' }}>Takeoff: {item.takeoff_time}</Text>
              <Text style={{ fontSize: normalize(13), color: '#666' }}>Land: {item.land_time}</Text>
            </View>
          )}
        />
      )}
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
    paddingBottom: normalize(20) 
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
  emptyStateContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingBottom: normalize(80) 
  },
  emptyStateTitle: { 
    fontSize: normalize(24), 
    fontWeight: 'bold', 
    color: '#1A1A1A', 
    marginTop: normalize(25) 
  }
});

export default DroneFlightLogsScreen;