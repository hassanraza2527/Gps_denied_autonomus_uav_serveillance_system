import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Svg, { Polygon, Circle } from 'react-native-svg'; 
import { normalize } from '../../utils/responsive';
import { useGetFenceConfigQuery } from '../../store/apiSlice';
import { ChevronLeftIcon, UndoIcon, InfoOutlineIcon } from '../../assets/icons/index';

const { width: screenWidth } = Dimensions.get('window');
// Force a perfect 16:9 Horizontal Camera Ratio
const videoWidth = screenWidth;
const videoHeight = screenWidth * (9 / 16);

const WallCalibrationScreen = ({ navigation, route }) => {
  const { propertyId, cameraId, cameraName, streamUrl, cameraType,wall_type, xLasers, yLasers, isEditing } = route.params || {};
  const [points, setPoints] = useState([]);

  const { data: fetchedConfig, isLoading } = useGetFenceConfigQuery(cameraId, { 
    skip: !isEditing || !cameraId 
  });

  useEffect(() => {
    if (isEditing && fetchedConfig?.polygon_points) {
      // The API returns normalized fractions (0.0 to 1.0). Convert to screen pixels.
      setPoints(fetchedConfig.polygon_points.map(p => ({
        x: p.x * videoWidth,
        y: p.y * videoHeight
      })));
    }
  }, [fetchedConfig, isEditing]);

  const handleTouch = (evt) => {
    if (points.length >= 4) return;
    const { locationX, locationY } = evt.nativeEvent;
    setPoints([...points, { x: locationX, y: locationY }]);
  };

  const handleUndo = () => {
    if (points.length > 0) setPoints(points.slice(0, -1));
  };

  const handleReset = () => setPoints([]);

  const handleNextStep = () => {
    navigation.navigate('DefineCameraCells', { 
      propertyId, cameraId, cameraName, streamUrl, cameraType,wall_type,  xLasers, yLasers, isEditing,
      polygonPoints: points // Pass the pixel coordinates to the next screen
    });
  };

  // FIX: object-fit: contain prevents the camera from getting cut off!
  const htmlContent = `
    <html>
      <body style="margin:0;padding:0;background-color:#000;display:flex;justify-content:center;align-items:center;height:100vh;overflow:hidden;">
        <img src="${streamUrl}" style="width:100%;height:100%;object-fit:contain;" onerror="this.style.display='none';" />
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ChevronLeftIcon width={28} height={28} color="#FFF" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{isEditing ? 'Edit Wall Calibration' : 'Wall Calibration'}</Text>
            <Text style={styles.headerSubtitle}>{cameraName}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleReset} style={styles.iconButton}>
             <UndoIcon width={24} height={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <InfoOutlineIcon width={24} height={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.stepperContainer}>
        <View style={styles.stepActive}>
          <View style={styles.stepCircleActive}><Text style={styles.stepTextActive}>1</Text></View>
          <Text style={styles.stepLabelActive}>Draw Polygon</Text>
        </View>
        <View style={styles.stepperLine} />
        <View style={styles.stepInactive}>
          <View style={styles.stepCircleInactive}><Text style={styles.stepTextInactive}>2</Text></View>
          <Text style={styles.stepLabelInactive}>Define Cells</Text>
        </View>
      </View>

      {/* FIX: Centered 16:9 Container */}
      <View style={styles.videoAreaContainer}>
        <View style={styles.videoArea}>
          {isLoading && isEditing ? (
            <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', zIndex: 30 }]}>
              <ActivityIndicator size="large" color="#D4A35B" />
            </View>
          ) : null}

          <View style={styles.streamWrapper}>
            <WebView source={{ html: htmlContent }} style={styles.webView} scrollEnabled={false} />
          </View>

          <TouchableOpacity style={styles.overlayContainer} activeOpacity={1} onPress={handleTouch}>
            <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
              {points.length > 0 && (
                <Polygon 
                  points={points.map(p => `${p.x},${p.y}`).join(' ')} 
                  fill={points.length === 4 ? "rgba(212, 163, 91, 0.3)" : "rgba(255, 255, 255, 0.2)"} 
                  stroke={points.length === 4 ? "#D4A35B" : "#FFF"} 
                  strokeWidth="2" 
                  strokeDasharray={points.length === 4 ? "0" : "5, 5"}
                />
              )}
              {points.map((p, i) => (
                <Circle key={i} cx={p.x} cy={p.y} r="6" fill={points.length === 4 ? "#D4A35B" : "#FFF"} />
              ))}
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.dragHandle} />
        <View style={styles.pointsStatusRow}>
          <Text style={styles.instructionText}>
            {points.length === 4 ? "Polygon complete" : "Tap to place corners"}
          </Text>
          <View style={styles.pointsBadge}>
            <View style={styles.pointsDot} />
            <Text style={styles.pointsText}>{points.length}/4 • {
              points.length === 0 ? "Top-Left" : 
              points.length === 1 ? "Top-Right" : 
              points.length === 2 ? "Bottom-Right" : 
              points.length === 3 ? "Bottom-Left" : "Done"
            }</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.outlineButton} onPress={handleUndo} disabled={points.length === 0}>
          <Text style={[styles.outlineButtonText, points.length === 0 && {color: '#CCC'}]}>Undo Last Point</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.saveButton, points.length < 4 && styles.saveButtonDisabled]} disabled={points.length < 4} onPress={handleNextStep}>
          <Text style={styles.saveButtonText}>{isEditing ? 'Save & Edit Cells' : 'Save & Define Cells'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#111' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: normalize(15), paddingTop: normalize(15), paddingBottom: normalize(15) },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  backButton: { padding: normalize(5), marginRight: normalize(10) },
  iconButton: { padding: normalize(5), marginLeft: normalize(10) },
  headerTitle: { fontSize: normalize(20), fontWeight: 'bold', color: '#FFF' },
  headerSubtitle: { fontSize: normalize(14), color: '#888' },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: normalize(20), paddingVertical: normalize(15), backgroundColor: '#1A1A1A' },
  stepActive: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#D4A35B', paddingHorizontal: normalize(12), paddingVertical: normalize(6), borderRadius: normalize(20) },
  stepCircleActive: { width: normalize(20), height: normalize(20), borderRadius: normalize(10), backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', marginRight: normalize(8) },
  stepTextActive: { color: '#D4A35B', fontSize: normalize(10), fontWeight: 'bold' },
  stepLabelActive: { color: '#111', fontSize: normalize(12), fontWeight: 'bold' },
  stepperLine: { flex: 1, height: 2, backgroundColor: '#333', marginHorizontal: normalize(10) },
  stepInactive: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: normalize(12), paddingVertical: normalize(6) },
  stepCircleInactive: { width: normalize(20), height: normalize(20), borderRadius: normalize(10), backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginRight: normalize(8) },
  stepTextInactive: { color: '#888', fontSize: normalize(10), fontWeight: 'bold' },
  stepLabelInactive: { color: '#888', fontSize: normalize(12), fontWeight: '600' },
  
  // FIX: Video container styles
  videoAreaContainer: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center' },
  videoArea: { width: videoWidth, height: videoHeight, position: 'relative', alignSelf: 'center' },
  
  streamWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  webView: { flex: 1, backgroundColor: 'transparent' },
  overlayContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 },
  bottomSheet: { backgroundColor: '#FFF', borderTopLeftRadius: normalize(25), borderTopRightRadius: normalize(25), paddingHorizontal: normalize(20), paddingBottom: normalize(30), paddingTop: normalize(10) },
  dragHandle: { width: normalize(40), height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: normalize(15) },
  pointsStatusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: normalize(20) },
  instructionText: { fontSize: normalize(16), color: '#333', fontWeight: '500' },
  pointsBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', paddingHorizontal: normalize(10), paddingVertical: normalize(5), borderRadius: normalize(12) },
  pointsDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D4A35B', marginRight: 6 },
  pointsText: { color: '#FFF', fontSize: normalize(12), fontWeight: 'bold' },
  outlineButton: { borderWidth: 1, borderColor: '#D0C9C0', borderRadius: normalize(12), paddingVertical: normalize(15), alignItems: 'center', marginBottom: normalize(10) },
  outlineButtonText: { color: '#333', fontSize: normalize(16), fontWeight: '500' },
  saveButton: { backgroundColor: '#D4A35B', paddingVertical: normalize(15), borderRadius: normalize(12), alignItems: 'center' },
  saveButtonDisabled: { backgroundColor: '#E8E1D3' },
  saveButtonText: { color: '#FFF', fontSize: normalize(16), fontWeight: 'bold' },
});

export default WallCalibrationScreen;