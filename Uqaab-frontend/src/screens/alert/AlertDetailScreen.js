import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview'; // <-- IMPORT WEBVIEW
import { normalize } from '../../utils/responsive';
import { ChevronLeftIcon, PlaySolidIcon, TriangleAlertIcon, FaceSolidIcon, PlaneIcon, ThumbsDownIcon, CheckCircleOutlineIcon } from '../../assets/icons/index';
import {
  useMarkAlertReadMutation,
  useMarkAlertFalsePositiveMutation,
  useResolveAlertMutation,
} from '../../store/apiSlice';
import {BASE_URL} from '../../store/apiSlice'

// Make sure this exactly matches your apiSlice.js IP address!

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const AlertDetailScreen = ({ route, navigation }) => {
  const alertData = route?.params?.alertData || {};
  const [isPlaying, setIsPlaying] = useState(false);  
  const [markRead] = useMarkAlertReadMutation();
  const [markFalsePositive] = useMarkAlertFalsePositiveMutation();
  const [resolve] = useResolveAlertMutation();

  // Combined URL path validation checking
  const fullVideoUrl = (alertData?.clipUrl && alertData.clipUrl !== "") 
    ? `${BASE_URL}${alertData.clipUrl}` 
    : null;

  // Mark as read when screen opens
  useEffect(() => {
    if (alertData.id) markRead(alertData.id);
  }, [alertData.id]);
  const handleFalsePositive = async () => {
    await markFalsePositive(alertData.id);
    navigation.goBack();
  };
  
  const handleResolve = async () => {
    await resolve(alertData.id);
    navigation.goBack();
  };

  // NEW: Create an HTML5 video player layout shell string to feed into WebView
  const videoHtmlWrapper = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background-color: black;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      </style>
    </head>
    <body>
      <video controls autoplay playsinline>
        <source src="${fullVideoUrl}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </body>
    </html>
  `;
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeftIcon width={28} height={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Alert Detail</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.severityBadge}>
          <TriangleAlertIcon width={normalize(18)} height={normalize(18)} color="#D97757" />
          <Text style={styles.severityText}>HIGH</Text>
        </View>

        <Text style={styles.sectionTitle}>Event Recording (5s)</Text>
        
        {/* CONDITIONAL RENDERING USING THE NEW HTML WRAPPER */}
        {isPlaying && fullVideoUrl ? (
          <View style={styles.videoContainer}>
            <WebView 
              originWhitelist={['*']}
              source={{ html: videoHtmlWrapper }} // <-- Use standard html configuration instead of uri
              style={{ flex: 1, backgroundColor: '#000' }} 
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.videoContainer} 
            activeOpacity={0.8}
            onPress={() => setIsPlaying(true)}
          >
            <Image source={{ uri: alertData.thumbnailUrl }} style={styles.videoThumbnail} />
            <View style={styles.videoOverlay}>
              <View style={styles.playButton}>
                <PlaySolidIcon width={normalize(30)} height={normalize(30)} color="#FFF" />
              </View>
              <View style={styles.videoLabel}>
                <PlaySolidIcon width={normalize(12)} height={normalize(12)} color="#FFF" />
                <Text style={styles.videoLabelText}>
                  {fullVideoUrl ? `Tap to play Alert #${alertData.id || ''}` : 'No video available'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <FaceSolidIcon width={normalize(24)} height={normalize(24)} color="#D97757" />
            <Text style={styles.infoCardTitle}>{alertData.title}</Text>
          </View>
          
          <DetailRow label="Camera:" value={alertData.camera} />
          <DetailRow label="Time:" value={alertData.date} />
          <DetailRow label="Detection In:" value={alertData.detection}/>
          <DetailRow label="Confidence:" value={`${alertData.percentage}%`} />
          <DetailRow label="Severity:" value="HIGH" />
          <DetailRow label="Status:" value="Read" />
          <DetailRow label="wall type" value={alertData.walltype}/>
        </View>

        <TouchableOpacity style={styles.dispatchButton}>
          <PlaneIcon width={normalize(20)} height={normalize(20)} color="#FFF" />
          <Text style={styles.dispatchButtonText}>DISPATCH DRONE</Text>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButtonSecondary} onPress={handleFalsePositive}>
            <ThumbsDownIcon width={normalize(18)} height={normalize(18)} color="#C8AD84" />
            <Text style={styles.actionButtonSecondaryText}>False Positive</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButtonPrimary} onPress={handleResolve}>
            <CheckCircleOutlineIcon width={normalize(18)} height={normalize(18)} color="#4CAF50" />
            <Text style={styles.actionButtonPrimaryText}>Resolve</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCFAF8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: normalize(20), paddingTop: normalize(15), paddingBottom: normalize(20) },
  backButton: { padding: normalize(5), marginLeft: -normalize(5) },
  headerTitle: { fontSize: normalize(22), fontWeight: 'bold', color: '#1A1A1A' },
  scrollContent: { paddingHorizontal: normalize(20), paddingBottom: normalize(40) },
  severityBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FBEFEA', padding: normalize(15), borderRadius: normalize(10), marginBottom: normalize(20), borderWidth: 1, borderColor: '#F5D0C5' },
  severityText: { fontSize: normalize(16), fontWeight: 'bold', color: '#D97757', marginLeft: normalize(10), letterSpacing: 1 },
  sectionTitle: { fontSize: normalize(18), fontWeight: 'bold', color: '#1A1A1A', marginBottom: normalize(15) },
  videoContainer: { height: normalize(200), borderRadius: normalize(15), overflow: 'hidden', marginBottom: normalize(20), backgroundColor: '#000' },
  videoThumbnail: { width: '100%', height: '100%', opacity: 0.7 },
  videoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  playButton: { width: normalize(60), height: normalize(60), borderRadius: normalize(30), backgroundColor: '#C8AD84', justifyContent: 'center', alignItems: 'center', opacity: 0.9 },
  videoLabel: { position: 'absolute', bottom: normalize(15), left: normalize(15), flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: normalize(12), paddingVertical: normalize(6), borderRadius: normalize(20) },
  videoLabelText: { color: '#FFF', fontSize: normalize(12), marginLeft: normalize(6), fontWeight: '500' },
  infoCard: { backgroundColor: '#F9F7F2', borderRadius: normalize(15), padding: normalize(20), borderWidth: 1, borderColor: '#E8E1D3', marginBottom: normalize(20) },
  infoCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(15) },
  infoCardTitle: { fontSize: normalize(18), fontWeight: 'bold', color: '#D97757', marginLeft: normalize(10), flex: 1 },
  detailRow: { flexDirection: 'row', marginBottom: normalize(10) },
  detailLabel: { width: normalize(100), fontSize: normalize(14), color: '#666' },
  detailValue: { flex: 1, fontSize: normalize(14), color: '#1A1A1A', fontWeight: '500' },
  dispatchButton: { flexDirection: 'row', backgroundColor: '#D97757', height: normalize(55), borderRadius: normalize(12), justifyContent: 'center', alignItems: 'center', marginBottom: normalize(15) },
  dispatchButtonText: { color: '#FFF', fontSize: normalize(16), fontWeight: 'bold', letterSpacing: 1, marginLeft: normalize(10) },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButtonSecondary: { flex: 0.48, flexDirection: 'row', height: normalize(50), borderRadius: normalize(12), borderWidth: 1, borderColor: '#C8AD84', justifyContent: 'center', alignItems: 'center' },
  actionButtonSecondaryText: { color: '#C8AD84', fontSize: normalize(14), fontWeight: 'bold', marginLeft: normalize(8) },
  actionButtonPrimary: { flex: 0.48, flexDirection: 'row', height: normalize(50), borderRadius: normalize(12), borderWidth: 1, borderColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  actionButtonPrimaryText: { color: '#4CAF50', fontSize: normalize(14), fontWeight: 'bold', marginLeft: normalize(8) },
});

export default AlertDetailScreen;