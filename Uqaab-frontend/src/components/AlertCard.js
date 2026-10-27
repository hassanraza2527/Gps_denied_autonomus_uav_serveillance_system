import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ActivityIndicator } from 'react-native';
import Video from 'react-native-video';
import { normalize } from '../utils/responsive';
import { PlaySolidIcon, ArrowRightCircleSolidIcon } from '../assets/icons/index';
import {BASE_URL} from '../store/apiSlice';

// Build full URL if backend returned a relative path like /uploads/clips/xxx.mp4
const buildMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

const AlertCard = ({ alert, onPress }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [loading, setLoading] = useState(true);

  const videoUri = buildMediaUrl(alert.clipUrl);
  const thumbUri = buildMediaUrl(alert.thumbnailUrl) || 'https://placehold.jp/150x150.png';
  

  const handlePlayPress = (e) => {
    e.stopPropagation();             // don't trigger card onPress
    if (videoUri) setShowVideo(true);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: thumbUri }} style={styles.thumbnail} />

        {/* Tap play button to open video modal */}
        <TouchableOpacity style={styles.playOverlay} onPress={handlePlayPress} activeOpacity={0.7}>
          <PlaySolidIcon width={normalize(18)} height={normalize(18)} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          {alert.isNew && <View style={styles.redDot} />}
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {alert.title}
          </Text>
        </View>
        <Text style={styles.cameraText}>Camera: {alert.camera}</Text>
        <Text style={styles.dateText}>{alert.date}</Text>
      </View>

      <View style={styles.rightContainer}>
        <ArrowRightCircleSolidIcon width={normalize(24)} height={normalize(24)} color="#C8AD84" />
        <View style={styles.percentageBadge}>
          <Text style={styles.percentageText}>{alert.percentage}%</Text>
        </View>
      </View>

      {/* Fullscreen video modal */}
      <Modal
        visible={showVideo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowVideo(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity style={styles.closeArea} onPress={() => setShowVideo(false)} />
          <View style={styles.videoBox}>
            {videoUri ? (
              <>
                <Video
                  source={{ uri: videoUri }}
                  style={styles.video}
                  controls
                  resizeMode="contain"
                  paused={false}
                  onLoadStart={() => setLoading(true)}
                  onLoad={() => setLoading(false)}
                  onError={(e) => {
                    console.log('VIDEO ERROR:', e);
                    setLoading(false);
                  }}
                />
                {loading && (
                  <ActivityIndicator
                    size="large"
                    color="#C8AD84"
                    style={StyleSheet.absoluteFill}
                  />
                )}
              </>
            ) : (
              <Text style={{ color: '#fff', textAlign: 'center' }}>No video available</Text>
            )}

            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowVideo(false)}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9F7F2',
    borderRadius: normalize(15),
    padding: normalize(12),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(15),
    borderWidth: 1,
    borderColor: '#E8E1D3',
  },
  thumbnailContainer: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(10),
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  thumbnail: { width: '100%', height: '100%', opacity: 0.7 },
  playOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: normalize(8),
    borderRadius: normalize(20),
  },
  contentContainer: { flex: 1, marginLeft: normalize(12), justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(4) },
  redDot: {
    width: normalize(8), height: normalize(8), borderRadius: normalize(4),
    backgroundColor: '#C64E4E', marginRight: normalize(6),
  },
  title: { fontSize: normalize(15), fontWeight: 'bold', color: '#1A1A1A', flex: 1 },
  cameraText: { fontSize: normalize(13), color: '#555', marginBottom: normalize(4), fontWeight: '500' },
  dateText: { fontSize: normalize(12), color: '#888' },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: normalize(65),
    marginLeft: normalize(10),
  },
  percentageBadge: {
    backgroundColor: '#E8E1D3',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(2),
    borderRadius: normalize(10),
  },
  percentageText: { fontSize: normalize(12), fontWeight: 'bold', color: '#C8AD84' },

  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeArea: { ...StyleSheet.absoluteFillObject },
  videoBox: {
    width: '92%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    borderRadius: normalize(12),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  video: { width: '100%', height: '100%' },
  closeBtn: {
    position: 'absolute',
    top: normalize(8),
    right: normalize(8),
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontSize: normalize(16), fontWeight: 'bold' },
});

export default AlertCard;