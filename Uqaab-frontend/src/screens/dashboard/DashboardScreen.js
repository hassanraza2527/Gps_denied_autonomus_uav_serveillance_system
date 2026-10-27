import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { normalize } from '../../utils/responsive';
import { SettingsIcon, PlaneIcon, VideoIcon, BellIcon } from '../../assets/icons/index';
import {
  useGetDashboardQuery,
  useGetCamerasQuery,
  useGetDronesQuery,
  getLiveStreamUrl,
} from '../../store/apiSlice';
import { useIsFocused } from '@react-navigation/native';
import { useAlertWebSocket } from '../../hooks/useAlertWebSocket';


const StatusCard = ({ Icon, title, value1, value2, colorStatus }) => (
  <View style={styles.statusCard}>
    <View style={styles.statusHeader}>
      <Icon width={normalize(16)} height={normalize(16)} color="#555" />
      <Text style={styles.statusTitle}>{title}</Text>
    </View>
    <Text style={[styles.statusValue, { color: colorStatus }]}>{value1}</Text>
    {value2 ? <Text style={[styles.statusValue, { color: colorStatus }]}>{value2}</Text> : null}
  </View>
);


import { WebView } from 'react-native-webview';

const CameraStreamCard = ({ name, streamUrl, onPress }) => {
  // This tells us if the user is currently looking at the dashboard
  const isFocused = useIsFocused();

  const htmlContent = `
    <html>
      <body style="margin:0;padding:0;background-color:#000;display:flex;justify-content:center;align-items:center;height:100vh;">
        <img src="${streamUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none';" />
      </body>
    </html>
  `;

  return (
    <View style={styles.cameraCard}>
      <View style={styles.webViewContainer}>
        {/* FIX: ONLY render the video if the Dashboard is focused! 
            If they click away, this unmounts and frees up the camera connection! */}
        {isFocused ? (
          <WebView 
            source={{ html: htmlContent }} 
            style={styles.webView} 
            scrollEnabled={false} 
          />
        ) : (
          <View style={{ flex: 1, backgroundColor: '#000' }} />
        )}
      </View>

      <TouchableOpacity
        style={styles.clickOverlay}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.cameraHeader}>
          <Text style={styles.cameraLabel}>{name}</Text>
          <View style={styles.badgeContainerRed}>
            <Text style={styles.badgeText}>LIVE</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const NoCamerasPlaceholder = ({ onAdd }) => (
  <View style={styles.noCamerasCard}>
    <VideoIcon width={normalize(36)} height={normalize(36)} color="#C8AD84" />
    <Text style={styles.noCamerasText}>No cameras added yet</Text>
    <TouchableOpacity style={styles.noCamerasBtn} onPress={onAdd}>
      <Text style={styles.noCamerasBtnText}>+ Add Camera</Text>
    </TouchableOpacity>
  </View>
);

const DashboardScreen = ({ navigation, route }) => {
  const propertyId   = route?.params?.propertyId;
  const propertyName = route?.params?.propertyName || '';

  const token = useSelector((state) => state.auth.token);
  useAlertWebSocket(propertyId);

  const { data: dashData, isLoading: dashLoading } = useGetDashboardQuery(propertyId, {
    skip: !propertyId,
    pollingInterval: 30_000,
  });

  const { data: camsData, isLoading: camsLoading } = useGetCamerasQuery(propertyId, {
    skip: !propertyId,
    pollingInterval: 30_000,
  });

  const { data: dronesData, isLoading: dronesLoading } = useGetDronesQuery(propertyId, {
    skip: !propertyId,
    pollingInterval: 30_000,
  });

  if (dashLoading || camsLoading || dronesLoading) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#C8AD84" />
      </View>
    );
  }

  const droneStatus    = dashData?.drone_status    ?? 'Offline';
  const cameras        = camsData?.cameras ?? [];
  const drones         = dronesData?.drones ?? [];
  
  // Force the online count to match the total number of cameras fetched
  const camerasOnline  = cameras.length; 
  
  const newAlertsCount = dashData?.new_alerts_count ?? 0;
  const displayName    = dashData?.property_name   ?? propertyName;

  return (
    <View style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>{displayName}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Settings', { propertyId, propertyName: displayName })
            }
          >
            <SettingsIcon width={normalize(28)} height={normalize(28)} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.statusRow}>
          <StatusCard
            Icon={PlaneIcon}
            title="Drone"
            value1={drones.length > 0 ? droneStatus : 'N/A'}
            colorStatus={droneStatus === 'Offline' || drones.length === 0 ? '#E57373' : '#4CAF50'}
          />
          <StatusCard
            Icon={VideoIcon}
            title="Cameras"
            value1={`${camerasOnline} / ${cameras.length}`}
            value2="Online"
            colorStatus={cameras.length > 0 ? "#4CAF50" : "#E57373"}
          />
          <StatusCard
            Icon={BellIcon}
            title="Alerts"
            value1={`${newAlertsCount} New`}
            colorStatus={newAlertsCount > 0 ? '#E57373' : '#4CAF50'}
          />
        </View>

        {drones.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Drone Live Feed</Text>
            {drones.map((drone) => (
              <View key={drone.id} style={styles.droneFeedCard}>
                <View style={[
                  styles.badgeContainerGreen, 
                  drone.status === 'Offline' && { backgroundColor: '#E57373' }
                ]}>
                  <Text style={styles.badgeText}>{drone.status === 'Offline' ? 'OFFLINE' : 'LIVE'}</Text>
                </View>
                <PlaneIcon width={normalize(40)} height={normalize(40)} color="#FFF" />
                <Text style={styles.droneName}>{drone.name}</Text>
                <Text style={styles.droneSubText}>FPV Feed</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Live Camera Feeds</Text>

        {cameras.length === 0 ? (
          <NoCamerasPlaceholder
            onAdd={() => navigation.navigate('ManageCameras', { propertyId })}
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cameraScroll}
          >
            {cameras.map((camera) => {
          // FIX: Stop using the backend proxy endpoint! 
          // Use the raw stream URL directly from the database just like Define Cells does.
          // Fallback to rtsp_url just in case you are using the getCameras endpoint instead of getDashboard
          const rawStreamUrl = camera.stream_url || camera.rtsp_url;

          return (
            <CameraStreamCard
              key={camera.id}
              name={camera.name}
              streamUrl={rawStreamUrl}
              onPress={() =>
                navigation.navigate('CameraStream', {
                  name: camera.name,
                  streamUrl: rawStreamUrl, // Passing the raw URL to the full-screen view!
                  cameraId: camera.id,
                })
              }
            />
          );
        })}
          </ScrollView>
        )}

        <View style={{ height: normalize(20) }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea:            { flex: 1, backgroundColor: '#FFF' },
  container:           { flex: 1, paddingHorizontal: normalize(20) },
  header:              { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: normalize(20), paddingBottom: normalize(20) },
  headerTitle:         { fontSize: normalize(28), fontWeight: 'bold', color: '#1A1A1A' },
  statusRow:           { flexDirection: 'row', justifyContent: 'space-between', marginBottom: normalize(25) },
  statusCard:          { backgroundColor: '#F9F7F2', borderRadius: normalize(12), padding: normalize(12), width: '31%', borderWidth: 1, borderColor: '#E8E1D3', minHeight: normalize(90) },
  statusHeader:        { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(8) },
  statusTitle:         { fontSize: normalize(12), color: '#555', marginLeft: normalize(5), fontWeight: '500' },
  statusValue:         { fontSize: normalize(15), fontWeight: 'bold' },
  sectionTitle:        { fontSize: normalize(20), fontWeight: 'bold', color: '#1A1A1A', marginBottom: normalize(15) },
  droneFeedCard:       { backgroundColor: '#202A3A', borderRadius: normalize(15), height: normalize(180), justifyContent: 'center', alignItems: 'center', marginBottom: normalize(30), position: 'relative' },
  badgeContainerGreen: { position: 'absolute', top: normalize(15), right: normalize(15), backgroundColor: '#4CAF50', paddingHorizontal: normalize(8), paddingVertical: normalize(4), borderRadius: normalize(4), zIndex: 10 },
  droneName:           { color: '#FFF', fontSize: normalize(18), fontWeight: 'bold', marginTop: normalize(10) },
  droneSubText:        { color: '#A0AABF', fontSize: normalize(14), marginTop: normalize(4) },
  cameraScroll:        { paddingBottom: normalize(10) },
  cameraCard:          { borderRadius: normalize(15), width: normalize(220), height: normalize(150), marginRight: normalize(15), borderWidth: 1, borderColor: '#E8E1D3', overflow: 'hidden', backgroundColor: '#000', position: 'relative' },
  webViewContainer:    { flex: 1, backgroundColor: '#000' },
  cameraHeader:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cameraLabel:         { color: '#FFF', textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3, fontSize: normalize(14), fontWeight: 'bold' },
  badgeContainerRed:   { backgroundColor: '#E57373', paddingHorizontal: normalize(8), paddingVertical: normalize(4), borderRadius: normalize(4) },
  badgeText:           { color: '#FFF', fontSize: normalize(10), fontWeight: 'bold', letterSpacing: 1 },
  clickOverlay:        { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: normalize(10), zIndex: 5 },
  noCamerasCard:       { backgroundColor: '#F9F7F2', borderRadius: normalize(15), padding: normalize(30), alignItems: 'center', borderWidth: 1, borderColor: '#E8E1D3', marginBottom: normalize(20) },
  noCamerasText:       { color: '#888', fontSize: normalize(15), marginTop: normalize(12), marginBottom: normalize(16) },
  noCamerasBtn:        { backgroundColor: '#C8AD84', paddingHorizontal: normalize(20), paddingVertical: normalize(10), borderRadius: normalize(10) },
  noCamerasBtnText:    { color: '#FFF', fontWeight: 'bold', fontSize: normalize(14) },
});

export default DashboardScreen;