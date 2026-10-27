import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { normalize } from '../../utils/responsive';
import { ChevronLeftIcon } from '../../assets/icons/index';

const CameraStreamScreen = ({ route, navigation }) => {
  const { name, streamUrl } = route.params || {};

  // Log it to the Metro console to verify it isn't undefined
  console.log("FULL SCREEN STREAM URL:", streamUrl);

  // CACHE BUSTER: We append a random timestamp to the end of the URL.
  // This forces the WebView and the camera server to treat it as a fresh 
  // connection, which often bypasses concurrent MJPEG limits!
  const separator = streamUrl?.includes('?') ? '&' : '?';
  const bustUrl = streamUrl ? `${streamUrl}${separator}cb=${Date.now()}` : '';

  const htmlContent = `
    <html>
      <body style="margin:0;padding:0;background-color:#000;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;">
        <img 
          src="${streamUrl}" 
          style="width:100%;height:100%;object-fit:contain;" 
        />
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeftIcon width={28} height={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>LIVE</Text>
        </View>
      </View>

      <View style={styles.streamContainer}>
        <WebView
          source={{ html: htmlContent }}
          style={styles.webView}
          scrollEnabled={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: normalize(20), paddingTop: normalize(15), paddingBottom: normalize(15), backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0EBE1' },
  backButton: { padding: normalize(5), marginLeft: -normalize(5) },
  headerTitle: { fontSize: normalize(20), fontWeight: 'bold', color: '#1A1A1A' },
  liveBadge: { backgroundColor: '#C64E4E', paddingHorizontal: normalize(10), paddingVertical: normalize(5), borderRadius: normalize(5) },
  liveBadgeText: { color: '#FFF', fontSize: normalize(12), fontWeight: 'bold', letterSpacing: 1 },
  streamContainer: { flex: 1, backgroundColor: '#000' },
  webView: { flex: 1, backgroundColor: 'transparent' },
});

export default CameraStreamScreen;