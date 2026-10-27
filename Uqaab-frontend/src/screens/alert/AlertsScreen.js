import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { normalize } from '../../utils/responsive';
import { RefreshIcon, BellSolidIcon } from '../../assets/icons/index';
import AlertCard from '../../components/AlertCard';
import { useGetAlertsQuery } from '../../store/apiSlice';

const AlertsScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('New');
  const propertyId = Number(route?.params?.propertyId);
  const propertyName = route?.params?.propertyName || '';

  const filterMap = { New: 'new', All: 'all', Active: 'active' };
  const filter = filterMap[activeTab] ?? 'all';

  const { data: alertsData, isLoading, isFetching, error, refetch } = useGetAlertsQuery(
    { propertyId, filter },
    {
      pollingInterval: 5000,
      refetchOnMountOrArgChange: true,
      skip: !propertyId,           // ⬅ don't fire if propertyId missing
    }
  );
  const alerts = alertsData?.alerts ?? [];

  const mapAlert = (a) => ({
  id: a.id,
  title: a.type,
  camera: a.camera_name,
  date: a.timestamp,
  percentage: String(a.confidence ?? ''),
  isNew: !a.is_read,
  thumbnailUrl: a.image_url || 'https://placehold.jp/150x150.png',
  clipUrl: a.clip_url,          // ⬅ NEW
  detection:a.detected_cell,
  walltype:a.wall_type,
  _raw: a,
  
});
console.log(mapAlert)

  const renderContent = () => {
    if (!propertyId) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>No Property Selected</Text>
          <Text style={styles.emptyStateSubtitle}>Open this screen from a property.</Text>
        </View>
      );
    }

    if (isLoading) {
      return <ActivityIndicator size="large" color="#C8AD84" style={{ marginTop: normalize(50) }} />;
    }

    if (error) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>Error loading alerts</Text>
          <Text style={styles.emptyStateSubtitle}>
            {error?.status} {JSON.stringify(error?.data) || error?.error}
          </Text>
          <TouchableOpacity onPress={refetch} style={{ marginTop: 20, padding: 10, backgroundColor: '#C8AD84', borderRadius: 8 }}>
            <Text style={{ color: '#fff' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!alerts.length) {
      return (
        <View style={styles.emptyStateContainer}>
          <BellSolidIcon width={normalize(70)} height={normalize(70)} color="#C8AD84" />
          <Text style={styles.emptyStateTitle}>No Alerts</Text>
          <Text style={styles.emptyStateSubtitle}>All clear — no alerts to show.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={alerts.map(mapAlert)}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AlertCard
        alert={item}
        onPress={() =>
          navigation.navigate('AlertDetail', {
            alertData: {
              id: item.id,
              title: item.title,
              camera: item.camera,
              date: item.date,
              percentage: item.percentage,
              thumbnailUrl: item.thumbnailUrl,
              detection:item.detected_cell,
              walltype:item.wall_type,
              clipUrl: item.clipUrl,     // ⬅ NEW
              type: item._raw?.type,
              detection:item._raw?.detected_cell,
              walltype:item._raw?.wall_type,
      },
    })
  }
/>
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Alerts: {propertyName}
          </Text>
          <TouchableOpacity style={styles.refreshButton} onPress={refetch}>
            {isFetching
              ? <ActivityIndicator size="small" color="#1A1A1A" />
              : <RefreshIcon width={normalize(24)} height={normalize(24)} color="#1A1A1A" />}
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          <View style={styles.tabContainer}>
            {['New', 'All', 'Active'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {alerts.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{alerts.length} alerts</Text>
            </View>
          )}
        </View>

        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCFAF8' },
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: normalize(20), paddingBottom: normalize(15), paddingHorizontal: normalize(20) },
  headerTitle: { fontSize: normalize(26), fontWeight: 'bold', color: '#1A1A1A' },
  refreshButton: { padding: normalize(5) },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: normalize(20), marginBottom: normalize(20) },
  tabContainer: { flexDirection: 'row' },
  tabButton: { paddingVertical: normalize(10), paddingHorizontal: normalize(25), borderRadius: normalize(20), borderWidth: 1, borderColor: '#E8E1D3', marginRight: normalize(10), backgroundColor: 'transparent' },
  activeTabButton: { backgroundColor: '#C8AD84', borderColor: '#C8AD84' },
  tabText: { fontSize: normalize(15), color: '#666', fontWeight: '500' },
  activeTabText: { color: '#FFF', fontWeight: 'bold' },
  countBadge: { backgroundColor: '#FBEFEA', paddingVertical: normalize(6), paddingHorizontal: normalize(12), borderRadius: normalize(15) },
  countText: { color: '#C64E4E', fontSize: normalize(13), fontWeight: 'bold' },
  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: normalize(80) },
  iconWrapper: { marginBottom: normalize(20) },
  emptyStateTitle: { fontSize: normalize(24), fontWeight: 'bold', color: '#1A1A1A', marginBottom: normalize(10) },
  emptyStateSubtitle: { fontSize: normalize(16), color: '#555' },
  listContent: { paddingHorizontal: normalize(20), paddingBottom: normalize(20) },
});

export default AlertsScreen;