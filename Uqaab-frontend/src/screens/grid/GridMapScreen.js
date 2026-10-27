import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { normalize } from '../../utils/responsive';
import { PlaneIcon,VideoSolidIcon } from '../../assets/icons/index';

const GridMapScreen = () => {
  const propertyGrid = { xLasers: 3, yLasers: 8, waypoints: 14 };

  const mockCameras = [
    { id: '1', name: 'inside1', gridCell: 'Cell 0,3' },
    { id: '2', name: 'Entrance', gridCell: 'Cell 0,7' },
  ];

  const mockDrones = [
    { id: '1', name: 'Uqaab 1', gridCell: 'Cell 2,7' },
  ];

  const parseCell = (cellString) => {
    if (!cellString) return null;
    const match = cellString.match(/Cell (\d+),(\d+)/);
    if (match) {
      return { x: parseInt(match[1], 10), y: parseInt(match[2], 10) };
    }
    return null;
  };

  const getCellContent = (x, y) => {
    const camera = mockCameras.find(c => {
      const pos = parseCell(c.gridCell);
      return pos && pos.x === x && pos.y === y;
    });

    const drone = mockDrones.find(d => {
      const pos = parseCell(d.gridCell);
      return pos && pos.x === x && pos.y === y;
    });

    if (camera) {
      return { type: 'camera', element: <VideoSolidIcon width={normalize(20)} height={normalize(20)} color="#4CAF50" /> };
    }
    if (drone) {
      return { type: 'drone', element: <PlaneIcon width={normalize(20)} height={normalize(20)} color="#2196F3" /> };
    }
    
    return { type: 'empty', element: <View style={styles.emptyDot} /> };
  };

  const renderGrid = () => {
    const grid = [];
    
    const headerRow = [
      <View key="header-empty" style={styles.rowLabelContainer} />
    ];
    for (let x = 0; x < propertyGrid.xLasers; x++) {
      headerRow.push(
        <View key={`header-${x}`} style={styles.colLabelContainer}>
          <Text style={styles.axisLabel}>{x}</Text>
        </View>
      );
    }
    grid.push(<View key="header-row" style={styles.gridRow}>{headerRow}</View>);

    for (let y = 0; y < propertyGrid.yLasers; y++) {
      const row = [
        <View key={`row-label-${y}`} style={styles.rowLabelContainer}>
          <Text style={styles.axisLabel}>{y}</Text>
        </View>
      ];

      for (let x = 0; x < propertyGrid.xLasers; x++) {
        const content = getCellContent(x, y);
        let cellStyle = styles.cellEmpty;
        
        if (content.type === 'camera') cellStyle = styles.cellCamera;
        if (content.type === 'drone') cellStyle = styles.cellDrone;

        row.push(
          <View key={`cell-${x}-${y}`} style={[styles.cell, cellStyle]}>
            {content.element}
          </View>
        );
      }
      grid.push(<View key={`row-${y}`} style={styles.gridRow}>{row}</View>);
    }

    return grid;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Grid Map</Text>
        <Text style={styles.headerSubtitle}>
          {propertyGrid.xLasers} × {propertyGrid.yLasers} cells • {propertyGrid.waypoints} waypoints
        </Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.mapContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {renderGrid()}
            </View>
          </ScrollView>
        </View>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <VideoSolidIcon width={normalize(16)} height={normalize(16)} color="#4CAF50" />
            <Text style={styles.legendText}>Camera</Text>
          </View>
          <View style={styles.legendItem}>
            <PlaneIcon width={normalize(16)} height={normalize(16)} color="#2196F3" />
            <Text style={styles.legendText}>Drone</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.legendDotLarge} />
            <Text style={styles.legendText}>Empty</Text>
          </View>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.listTitle}>Drones</Text>
          {mockDrones.map(drone => (
            <View key={drone.id} style={styles.listItem}>
              <Text style={styles.listItemText}>
                {drone.name} — Home: {drone.gridCell.split(' —')[0]}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCFAF8' },
  header: { paddingHorizontal: normalize(20), paddingTop: normalize(15), paddingBottom: normalize(15) },
  headerTitle: { fontSize: normalize(24), fontWeight: 'bold', color: '#1A1A1A' },
  headerSubtitle: { fontSize: normalize(14), color: '#666', marginTop: normalize(4), fontWeight: '500' },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: normalize(20), paddingBottom: normalize(40) },
  mapContainer: { alignItems: 'center', marginBottom: normalize(20) },
  gridRow: { flexDirection: 'row', alignItems: 'center' },
  colLabelContainer: { width: normalize(60), height: normalize(30), justifyContent: 'center', alignItems: 'center', marginHorizontal: normalize(4) },
  rowLabelContainer: { width: normalize(30), height: normalize(60), justifyContent: 'center', alignItems: 'center', marginVertical: normalize(4) },
  axisLabel: { fontSize: normalize(14), color: '#555', fontWeight: '500' },
  cell: { width: normalize(60), height: normalize(60), borderRadius: normalize(8), justifyContent: 'center', alignItems: 'center', marginHorizontal: normalize(4), marginVertical: normalize(4), borderWidth: 1, borderColor: '#E8E1D3' },
  cellEmpty: { backgroundColor: '#EBE7DD' },
  cellCamera: { backgroundColor: '#C8E6C9', borderColor: '#A5D6A7' },
  cellDrone: { backgroundColor: '#BBDEFB', borderColor: '#90CAF9' },
  emptyDot: { width: normalize(4), height: normalize(4), borderRadius: normalize(2), backgroundColor: '#A0A0A0' },
  legendContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: normalize(30) },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: normalize(10) },
  legendText: { fontSize: normalize(14), color: '#555', marginLeft: normalize(6), fontWeight: '500' },
  legendDotLarge: { width: normalize(12), height: normalize(12), borderRadius: normalize(6), backgroundColor: '#A0A0A0' },
  listSection: { marginTop: normalize(10) },
  listTitle: { fontSize: normalize(18), fontWeight: 'bold', color: '#1A1A1A', marginBottom: normalize(10) },
  listItem: { backgroundColor: '#EEF2F6', paddingHorizontal: normalize(15), paddingVertical: normalize(15), borderRadius: normalize(10), marginBottom: normalize(10) },
  listItemText: { fontSize: normalize(15), color: '#333', fontWeight: '500' },
});

export default GridMapScreen;