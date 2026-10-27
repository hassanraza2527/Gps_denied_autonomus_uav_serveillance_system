import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';
import { normalize } from '../../utils/responsive';
import { PlaneIcon } from '../../assets/icons/index';

// 1. IMPORT YOUR RTK QUERY HOOK
import { useGetPropertyQuery } from '../../store/apiSlice';

const { width: screenWidth } = Dimensions.get('window');

const LaserGridViewScreen = ({ route }) => {
  // Grab the propertyId passed from the previous screen
  const propertyId = route?.params?.propertyId;

  // 2. FETCH THE EXACT GRID DATA FROM THE DATABASE
  const { data: propertyData, isLoading } = useGetPropertyQuery(propertyId, {
    skip: !propertyId,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#C8AD84" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading Grid Data...</Text>
      </SafeAreaView>
    );
  }

  // 3. EXTRACT THE DYNAMIC VALUES FROM THE API RESPONSE
  const laserGrid = propertyData?.property?.laser_grid || {};
  
  // Use fallback of 0 so it doesn't crash if the grid isn't setup yet
  const xLasers = laserGrid.x_lasers || 0;
  const yLasers = laserGrid.y_lasers || 0;
  const boxWidth = laserGrid.box_width || 0;
  const boxLength = laserGrid.box_length || 0;
  const gridHeight = laserGrid.grid_height || 0;

  const waypoints = xLasers * yLasers;

  // SVG Drawing Math
  const svgWidth = screenWidth - normalize(80);
  const svgHeight = normalize(300);
  const padding = normalize(15);
  
  const usableWidth = svgWidth - padding * 2;
  const usableHeight = svgHeight - padding * 2;
  
  const stepX = xLasers > 1 ? usableWidth / (xLasers - 1) : 0;
  const stepY = yLasers > 1 ? usableHeight / (yLasers - 1) : 0;

  const verticalLines = Array.from({ length: xLasers });
  const horizontalLines = Array.from({ length: yLasers });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.dragHandleContainer}>
        <View style={styles.dragHandle} />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Laser Grid View</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* If the grid hasn't been defined yet, show a warning */}
        {waypoints === 0 ? (
          <View style={styles.gridSection}>
            <Text style={styles.sectionTitle}>No Grid Configured</Text>
            <Text style={styles.flightPathText}>Please configure the laser grid settings for this property first.</Text>
          </View>
        ) : (
          <>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Grid Size</Text>
                <Text style={styles.statValue}>{xLasers} × {yLasers} lasers</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Spacing</Text>
                <Text style={styles.statValue}>{boxWidth.toFixed(1)}×{boxLength.toFixed(1)} m</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Waypoints</Text>
                <Text style={styles.statValue}>{waypoints} points</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Height</Text>
                <Text style={styles.statValue}>{gridHeight.toFixed(1)} m</Text>
              </View>
            </View>

            <View style={styles.gridSection}>
              <Text style={styles.sectionTitle}>Grid Layout</Text>
              
              <View style={styles.svgContainer}>
                <Svg width={svgWidth} height={svgHeight}>
                  {verticalLines.map((_, i) => {
                    const x = padding + i * stepX;
                    return (
                      <Line 
                        key={`v-${i}`} 
                        x1={x} 
                        y1={padding} 
                        x2={x} 
                        y2={svgHeight - padding} 
                        stroke="#E57373" 
                        strokeWidth="1.5" 
                      />
                    );
                  })}

                  {horizontalLines.map((_, i) => {
                    const y = padding + i * stepY;
                    return (
                      <Line 
                        key={`h-${i}`} 
                        x1={padding} 
                        y1={y} 
                        x2={svgWidth - padding} 
                        y2={y} 
                        stroke="#81C784" 
                        strokeWidth="1.5" 
                      />
                    );
                  })}

                  {verticalLines.map((_, i) => {
                    const x = padding + i * stepX;
                    return horizontalLines.map((_, j) => {
                      const y = padding + j * stepY;
                      return (
                        <Circle 
                          key={`wp-${i}-${j}`} 
                          cx={x} 
                          cy={y} 
                          r="4" 
                          fill="#2196F3" 
                        />
                      );
                    });
                  })}
                </Svg>
              </View>

              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#E57373' }]} />
                  <Text style={styles.legendText}>X</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#81C784' }]} />
                  <Text style={styles.legendText}>Y</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: '#2196F3' }]} />
                  <Text style={styles.legendText}>WP</Text>
                </View>
              </View>
            </View>

            <View style={styles.flightPathCard}>
              <View style={styles.flightPathHeader}>
                <PlaneIcon width={normalize(18)} height={normalize(18)} color="#C8AD84" />
                <Text style={styles.flightPathTitle}>Drone Flight Path</Text>
              </View>
              <Text style={styles.flightPathText}>
                Drone flies at {gridHeight.toFixed(1)}m height through {waypoints} waypoints. 
                Grid spacing is {boxWidth.toFixed(1)}m × {boxLength.toFixed(1)}m.
              </Text>
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCFAF8' },
  dragHandleContainer: { alignItems: 'center', paddingTop: normalize(15), paddingBottom: normalize(10) },
  dragHandle: { width: normalize(40), height: normalize(4), backgroundColor: '#D0C9C0', borderRadius: normalize(2) },
  header: { paddingHorizontal: normalize(20), paddingBottom: normalize(20) },
  headerTitle: { fontSize: normalize(24), fontWeight: 'bold', color: '#1A1A1A' },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: normalize(20), paddingBottom: normalize(40) },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: normalize(25) },
  statCard: { width: '48%', backgroundColor: '#F9F7F2', borderRadius: normalize(12), padding: normalize(15), marginBottom: normalize(15), borderWidth: 1, borderColor: '#E8E1D3' },
  statLabel: { fontSize: normalize(13), color: '#666', marginBottom: normalize(5) },
  statValue: { fontSize: normalize(16), fontWeight: 'bold', color: '#1A1A1A' },
  gridSection: { backgroundColor: '#F9F7F2', borderRadius: normalize(15), padding: normalize(20), borderWidth: 1, borderColor: '#E8E1D3', marginBottom: normalize(25) },
  sectionTitle: { fontSize: normalize(18), fontWeight: 'bold', color: '#1A1A1A', marginBottom: normalize(20) },
  svgContainer: { alignItems: 'center', marginBottom: normalize(20) },
  legendRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: normalize(10) },
  legendDot: { width: normalize(10), height: normalize(10), borderRadius: normalize(5), marginRight: normalize(6) },
  legendText: { fontSize: normalize(14), color: '#555', fontWeight: '500' },
  flightPathCard: { backgroundColor: '#F9F7F2', borderRadius: normalize(15), padding: normalize(20), borderWidth: 1, borderColor: '#E8E1D3' },
  flightPathHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(10) },
  flightPathTitle: { fontSize: normalize(16), fontWeight: 'bold', color: '#C8AD84', marginLeft: normalize(8) },
  flightPathText: { fontSize: normalize(14), color: '#555', lineHeight: normalize(22) },
});

export default LaserGridViewScreen;