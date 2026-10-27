import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { normalize } from '../../utils/responsive';
import AuthorizedPersonCard from '../../components/AuthorizedPersonCard';
import { ChevronLeftIcon } from '../../assets/icons/index';
import { useGetPeopleQuery } from '../../store/apiSlice';

const ManageAuthorizedPeopleScreen = ({ navigation,route }) => {
  const {propertyId} = route.params;
  const { data, isLoading, refetch } = useGetPeopleQuery(propertyId, { skip: !propertyId });
 
  // Backend: { success, message, people: [...] }
  // Each person: { id, name, role, photo_urls: [...] }
  const people = data?.people ?? [];
 
  const mapPerson = (p) => ({
    id: p.id,
    name: p.name,
    role: p.role,
    hasFace: p.photo_urls && p.photo_urls.length > 0,
    _raw: p,
  });
 
  if (isLoading) return <ActivityIndicator size="large" color="#C8AD84" style={{ flex: 1 }} />;

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeftIcon width={28} height={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Authorized People</Text>
        <View style={{ width: 28 }} />
      </View>

       <FlatList
        data={people.map(mapPerson)}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isLoading}
        renderItem={({ item }) => (
          <AuthorizedPersonCard
            person={item}
            onOptionsPress={() =>
              navigation.navigate('EditAuthorizedPerson', { person: item._raw, propertyId })
            }
          />
        )}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddAuthorizedPerson', { propertyId })}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCFAF8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(20),
    paddingTop: normalize(15),
    paddingBottom: normalize(20),
  },
  backButton: { padding: normalize(5), marginLeft: -normalize(5) },
  headerTitle: { fontSize: normalize(22), fontWeight: 'bold', color: '#1A1A1A' },
  listContent: { paddingHorizontal: normalize(20), paddingBottom: normalize(100) },
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

export default ManageAuthorizedPeopleScreen;