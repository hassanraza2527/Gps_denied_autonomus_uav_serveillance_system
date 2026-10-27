import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { normalize } from '../../utils/responsive';
import PropertyCard from '../../components/common/PropertyCard';
import { useGetPropertiesQuery } from '../../store/apiSlice';

const HomeScreen = ({ navigation }) => {
  const { data, isLoading, isError, refetch } = useGetPropertiesQuery();

  // Backend: { success, message, properties: [...] }
  const properties = data?.properties ?? [];

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#C8AD84" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#C64E4E', fontSize: normalize(16) }}>
          Failed to load properties.
        </Text>
        <TouchableOpacity onPress={refetch} style={{ marginTop: normalize(15) }}>
          <Text style={{ color: '#C8AD84', fontWeight: 'bold' }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Your Properties</Text>
      </View>

      <FlatList
        data={properties}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <PropertyCard
            // Map backend shape → PropertyCard props
            property={{
              id: item.id,
              name: item.name,
              address: item.address,
              camerasOnline: item.cameras_online,
              camerasTotal: item.cameras_total,
              isDroneOnline: item.drone_status !== 'Offline',
            }}
            onPress={() =>
              // ✅ Pass BOTH propertyId (number) and propertyName
              navigation.navigate('PropertyTabs', {
                propertyId: item.id,
                propertyName: item.name,
              })
            }
          />
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddProperty')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFAF8',
  },
  headerContainer: {
    paddingHorizontal: normalize(20),
    paddingTop: normalize(20),
    paddingBottom: normalize(10),
  },
  headerTitle: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  listContent: {
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(100),
    paddingTop: normalize(10),
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
    marginTop: normalize(-2),
  },
});

export default HomeScreen;