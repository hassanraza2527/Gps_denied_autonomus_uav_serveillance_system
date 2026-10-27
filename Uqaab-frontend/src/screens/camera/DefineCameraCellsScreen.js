import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Svg, { Polygon, Circle } from 'react-native-svg'; 
import { normalize } from '../../utils/responsive';

import { 
  useCreateCameraMutation, 
  useSaveFenceConfigMutation, 
  useSaveFenceCellsMutation,
  useGetFenceCellsQuery,    
  useGetFenceConfigQuery,
  useStartDetectionMutation
} from '../../store/apiSlice';

import { ChevronLeftIcon, InfoOutlineIcon, CheckCircleSolidIcon, UndoIcon } from '../../assets/icons/index';

const { width: screenWidth } = Dimensions.get('window');
// Force a perfect 16:9 Horizontal Camera Ratio
const videoWidth = screenWidth;
const videoHeight = screenWidth * (9 / 16);
const CELL_COLORS = ['#C64E4E', '#4CAF50', '#D4A35B', '#5C6BC0'];

const DefineCameraCellsScreen = ({ navigation, route }) => {
  const { propertyId, cameraId, cameraName, streamUrl, cameraType,wall_type, polygonPoints, xLasers, yLasers, isEditing } = route.params || {};
  // =====================================================================
  // 🚨 RULE OF HOOKS: ALL HOOKS MUST STAY AT THE TOP LEVEL! 🚨
  // Never put these inside `if` statements or after an early `return`.
  // =====================================================================
  
  const [createCamera, { isLoading: isCreatingCamera }] = useCreateCameraMutation();
  const [saveFenceConfig, { isLoading: isSavingConfig }] = useSaveFenceConfigMutation();
  const [saveFenceCells, { isLoading: isSavingCells }] = useSaveFenceCellsMutation();
  const [startDetection, { isLoading: isStarting }] = useStartDetectionMutation(); 

  const [cells, setCells] = useState([]);
  const [currentPoints, setCurrentPoints] = useState([]);

  // Correct way to conditionally fetch: use the `skip` property!
  const { data: fetchedCells } = useGetFenceCellsQuery(cameraId, { skip: !isEditing || !cameraId });
  const { data: fetchedConfig } = useGetFenceConfigQuery(cameraId, { skip: !isEditing || !cameraId });
  
  // =====================================================================

  const isProcessing = isCreatingCamera || isSavingConfig || isSavingCells || isStarting;

  // Gather boundary points: either from the previous screen (already pixels) OR from DB (must multiply by video dimensions)
  const fetchedPolygon = fetchedConfig?.polygon_points || [];
  const finalPolygonPoints = polygonPoints || fetchedPolygon.map(p => ({
    x: p.x * videoWidth,
    y: p.y * videoHeight
  }));

  useEffect(() => {
    if (isEditing && fetchedCells?.cells) {
      const mappedCells = fetchedCells.cells.map((c, index) => ({
        id: c.cell_name,
        points: c.polygon_points.map(p => ({ x: p.x * videoWidth, y: p.y * videoHeight })),
        colorIndex: index % CELL_COLORS.length
      }));
      setCells(mappedCells);
    }
  }, [fetchedCells, isEditing]);

  const handleTouch = (evt) => {
    if (currentPoints.length >= 4) return;
    const { locationX, locationY } = evt.nativeEvent;
    setCurrentPoints([...currentPoints, { x: locationX, y: locationY }]);
  };

  const handleUndo = () => {
    if (currentPoints.length > 0) {
      setCurrentPoints(currentPoints.slice(0, -1));
    } else if (cells.length > 0) {
      setCells(cells.slice(0, -1));
    }
  };

  const handleAddCell = () => {
    if (currentPoints.length < 3) {
      Alert.alert("Incomplete Cell", "Please draw at least 3 points to define a cell.");
      return;
    }
    setCells([...cells, { id: `A${cells.length + 1}`, points: currentPoints, colorIndex: cells.length % CELL_COLORS.length }]);
    setCurrentPoints([]);
  };

  const getCentroid = (pts) => {
    if (!pts || pts.length === 0) return { x: 0, y: 0 };
    let minX = Math.min(...pts.map(p => p.x)), maxX = Math.max(...pts.map(p => p.x));
    let minY = Math.min(...pts.map(p => p.y)), maxY = Math.max(...pts.map(p => p.y));
    return { x: minX + (maxX - minX) / 2, y: minY + (maxY - minY) / 2 };
  };

  const handleFinalSave = async () => {
    if (cells.length === 0 && currentPoints.length > 0) {
       Alert.alert("Unsaved Cell", "Please click '+ Add Cell' before saving.");
       return;
    }

    try {
      let finalCameraId = cameraId;

      if (!isEditing) {
        const cameraResponse = await createCamera({
          propertyId, name: cameraName, rtsp_url: streamUrl, camera_type: cameraType, wall_type:wall_type, 
        }).unwrap();
        finalCameraId = cameraResponse?.camera_id || cameraResponse?.id || cameraResponse?.camera?.id;
      }
      
      if (!finalCameraId) throw new Error("Missing camera ID");

      // Translate Screen Pixels into Normalized Fractions (0.0 - 1.0) for the Python AI
      const normalizedPolygon = finalPolygonPoints.map(p => ({
        x: Number((p.x / videoWidth).toFixed(4)),
        y: Number((p.y / videoHeight).toFixed(4))
      }));

      const normalizedCells = cells.map((c, index) => ({
        cell_name: c.id,
        row: 0, col: index,
        polygon_points: c.points.map(p => ({
          x: Number((p.x / videoWidth).toFixed(4)),
          y: Number((p.y / videoHeight).toFixed(4))
        }))
      }));

      // SAVE POLYGON
      if (cameraType?.toLowerCase() === 'fence' && normalizedPolygon.length > 0) {
        await saveFenceConfig({ cameraId: finalCameraId, points: normalizedPolygon }).unwrap();
      }

      // SAVE CELLS
      if (cameraType?.toLowerCase() === 'fence' && normalizedCells.length > 0) {
        await saveFenceCells({ cameraId: finalCameraId, cells: normalizedCells }).unwrap();
      }

      // AUTO-START AI
      // if (!isEditing && cameraType?.toLowerCase() === 'fence') {
      //   try { await startDetection(finalCameraId).unwrap(); } 
      //   catch (startError) { console.error("AI failed to start:", startError); }
      // }

      Alert.alert('Success', isEditing ? `Camera updated successfully!` : `Camera "${cameraName}" added & Detection Started!`);
      isEditing ? navigation.goBack() : navigation.navigate('ManageCameras', { propertyId }); 

    } catch (error) {
      console.error("CAMERA SETUP ERROR:", error);
      Alert.alert('Backend Error', "Failed to save camera settings.");
    }
  };

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
            <Text style={styles.headerTitle}>{isEditing ? 'Edit Camera Cells' : 'Define Camera Cells'}</Text>
            <Text style={styles.headerSubtitle}>{cameraName}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconButton}><InfoOutlineIcon width={24} height={24} color="#FFF" /></TouchableOpacity>
      </View>

      {(!isEditing && cameraType?.toLowerCase() === 'fence') && (
        <View style={styles.stepperContainer}>
          <View style={styles.stepCompleted}>
            <CheckCircleSolidIcon width={normalize(24)} height={normalize(24)} color="#4CAF50" />
            <Text style={styles.stepLabelCompleted}>Draw Polygon</Text>
          </View>
          <View style={styles.stepperLineActive} />
          <View style={styles.stepActive}>
            <View style={styles.stepCircleActive}><Text style={styles.stepTextActive}>2</Text></View>
            <Text style={styles.stepLabelActive}>Define Cells</Text>
          </View>
        </View>
      )}

      {/* Centered 16:9 Container */}
      <View style={styles.videoAreaContainer}>
        <View style={styles.videoArea}>
          <View style={styles.cellCountBadge}>
            <Text style={styles.cellCountText}>{cells.length} cells</Text>
          </View>

          <View style={styles.streamWrapper}>
            <WebView source={{ html: htmlContent }} style={styles.webView} scrollEnabled={false} />
          </View>

          <TouchableOpacity style={styles.overlayContainer} activeOpacity={1} onPress={handleTouch}>
            <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
              {finalPolygonPoints.length > 0 && (
                <Polygon points={finalPolygonPoints.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#FFF" strokeWidth="2" strokeDasharray="4, 4" opacity={0.5} />
              )}
              {cells.map((cell, index) => {
                const color = CELL_COLORS[cell.colorIndex];
                return <Polygon key={`cell-${index}`} points={cell.points.map(p => `${p.x},${p.y}`).join(' ')} fill={color + 'B3'} stroke={color} strokeWidth="2" />;
              })}
              {currentPoints.length > 0 && (
                <Polygon points={currentPoints.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(255, 255, 255, 0.3)" stroke="#FFF" strokeWidth="2" strokeDasharray="5, 5" />
              )}
              {currentPoints.map((p, i) => <Circle key={`pt-${i}`} cx={p.x} cy={p.y} r="6" fill="#FFF" />)}
            </Svg>

            {cells.map((cell, index) => {
              const centroid = getCentroid(cell.points);
              return (
                <View key={`label-${index}`} style={[styles.polygonTextWrapper, { left: centroid.x - 20, top: centroid.y - 20 }]} pointerEvents="none">
                  <Text style={styles.polygonText}>{cell.id}</Text>
                </View>
              );
            })}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.dragHandle} />
        <View style={styles.badgesRow}>
          {cells.map((cell, index) => (
            <View key={`badge-${index}`} style={styles.activeCellBadge}>
              <View style={[styles.activeCellDot, { backgroundColor: CELL_COLORS[cell.colorIndex] }]} />
              <Text style={styles.activeCellText}>{cell.id}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.instructionText}>
          {currentPoints.length === 0 ? "Click Top-Left corner to start a new cell" : `Tap to add point ${currentPoints.length + 1}/4`}
        </Text>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.undoButton} onPress={handleUndo}><UndoIcon width={20} height={20} color="#555" /></TouchableOpacity>
          <TouchableOpacity style={[styles.addCellButton, currentPoints.length < 3 && styles.disabledButton]} onPress={handleAddCell} disabled={currentPoints.length < 3}>
            <Text style={styles.addCellButtonText}>+  Add Cell</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.saveButton, (cells.length === 0 && currentPoints.length === 0) && styles.disabledSave]} onPress={handleFinalSave} disabled={isProcessing || (cells.length === 0 && currentPoints.length === 0)}>
          {isProcessing ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>{isEditing ? 'UPDATE CELLS' : `SAVE ${cells.length} CELL${cells.length !== 1 ? 'S' : ''}`}</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#111' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: normalize(15), paddingTop: normalize(15), paddingBottom: normalize(15) },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backButton: { padding: normalize(5), marginRight: normalize(10) },
  headerTitle: { fontSize: normalize(20), fontWeight: 'bold', color: '#FFF' },
  headerSubtitle: { fontSize: normalize(14), color: '#888' },
  iconButton: { padding: normalize(5) },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: normalize(20), paddingVertical: normalize(15), backgroundColor: '#1A1A1A' },
  stepCompleted: { flexDirection: 'column', alignItems: 'center' },
  stepLabelCompleted: { color: '#4CAF50', fontSize: normalize(12), fontWeight: '600', marginTop: normalize(4) },
  stepperLineActive: { flex: 1, height: 2, backgroundColor: '#D4A35B', marginHorizontal: normalize(15), marginBottom: normalize(15) },
  stepActive: { flexDirection: 'column', alignItems: 'center' },
  stepCircleActive: { width: normalize(24), height: normalize(24), borderRadius: normalize(12), backgroundColor: '#D4A35B', justifyContent: 'center', alignItems: 'center' },
  stepTextActive: { color: '#111', fontSize: normalize(12), fontWeight: 'bold' },
  stepLabelActive: { color: '#FFF', fontSize: normalize(12), fontWeight: '600', marginTop: normalize(4) },
  
  videoAreaContainer: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center' },
  videoArea: { width: videoWidth, height: videoHeight, position: 'relative', alignSelf: 'center' },
  
  cellCountBadge: { position: 'absolute', top: normalize(15), right: normalize(15), zIndex: 20 },
  cellCountText: { color: '#FFF', fontSize: normalize(14), fontWeight: 'bold' },
  streamWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  webView: { flex: 1, backgroundColor: 'transparent' },
  overlayContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 },
  polygonTextWrapper: { position: 'absolute', width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  polygonText: { color: '#FFF', fontSize: normalize(16), fontWeight: 'bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  bottomSheet: { backgroundColor: '#FFF', borderTopLeftRadius: normalize(25), borderTopRightRadius: normalize(25), paddingHorizontal: normalize(20), paddingBottom: normalize(30), paddingTop: normalize(10) },
  dragHandle: { width: normalize(40), height: 4, backgroundColor: '#E0E0E0', borderRadius: 2, alignSelf: 'center', marginBottom: normalize(15) },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: normalize(10) },
  activeCellBadge: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E8E1D3', paddingHorizontal: normalize(12), paddingVertical: normalize(6), borderRadius: normalize(15), marginRight: normalize(10), marginBottom: normalize(10) },
  activeCellDot: { width: normalize(8), height: normalize(8), borderRadius: normalize(4), marginRight: normalize(6) },
  activeCellText: { fontSize: normalize(14), fontWeight: 'bold', color: '#1A1A1A' },
  instructionText: { fontSize: normalize(14), color: '#666', marginBottom: normalize(20) },
  actionRow: { flexDirection: 'row', marginBottom: normalize(15) },
  undoButton: { width: normalize(55), height: normalize(55), borderRadius: normalize(27.5), borderWidth: 1, borderColor: '#D0C9C0', justifyContent: 'center', alignItems: 'center', marginRight: normalize(15) },
  addCellButton: { flex: 1, height: normalize(55), borderRadius: normalize(12), borderWidth: 1, borderColor: '#D0C9C0', justifyContent: 'center', alignItems: 'center' },
  addCellButtonText: { fontSize: normalize(16), color: '#333', fontWeight: '500' },
  disabledButton: { opacity: 0.4 },
  saveButton: { backgroundColor: '#D4A35B', height: normalize(55), borderRadius: normalize(12), justifyContent: 'center', alignItems: 'center' },
  disabledSave: { backgroundColor: '#E0E0E0' },
  saveButtonText: { color: '#FFF', fontSize: normalize(16), fontWeight: 'bold', letterSpacing: 1 },
});

export default DefineCameraCellsScreen;