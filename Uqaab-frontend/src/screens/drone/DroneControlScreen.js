import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { normalize } from '../../utils/responsive';
import { 
  ArrowDownIcon, 
  ArrowUpIcon,
  ChevronLeftIcon,
  // Make sure you have these icons, or replace with text/other icons if needed
  LinkIcon, 
  LockIcon, 
  SettingsIcon,
  CloseIcon // For the KILL button
} from '../../assets/icons/index';

// Custom toggle switch to match the image design
const CustomToggle = ({ isOn, onToggle }) => (
  <TouchableOpacity 
    style={[styles.toggleTrack, isOn ? styles.toggleTrackOn : styles.toggleTrackOff]} 
    onPress={onToggle}
    activeOpacity={0.8}
  >
    <View style={[styles.toggleThumb, isOn ? styles.toggleThumbOn : styles.toggleThumbOff]} />
  </TouchableOpacity>
);

const DroneControlScreen = ({ navigation, route }) => {
  const [dronePosition, setDronePosition] = useState({ x: 0, y: 0 });
  const [isLinked, setIsLinked] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  const handleMove = (direction) => {
    setDronePosition(prev => {
      let newX = prev.x;
      let newY = prev.y;
      if (direction === 'up') newY += 1;
      if (direction === 'down') newY -= 1;
      if (direction === 'left') newX -= 1;
      if (direction === 'right') newX += 1;
      return { x: newX, y: newY };
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* HEADER: Toggles and Settings */}
      <View style={styles.header}>
        <View style={styles.toggleGroup}>
          <LinkIcon width={normalize(20)} height={normalize(20)} color="#1A1A1A" style={styles.headerIcon} />
          <CustomToggle isOn={isLinked} onToggle={() => setIsLinked(!isLinked)} />
        </View>

        <View style={styles.toggleGroup}>
          <LockIcon width={normalize(20)} height={normalize(20)} color="#1A1A1A" style={styles.headerIcon} />
          <CustomToggle isOn={isLocked} onToggle={() => setIsLocked(!isLocked)} />
        </View>

        <TouchableOpacity style={styles.settingsButton}>
          <SettingsIcon width={normalize(24)} height={normalize(24)} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* VIDEO AREA: Flex 1 takes up all remaining middle space */}
      <View style={styles.videoArea}>
        {/* The video stream will go here. Keeping it empty for now to match the mockup. */}
      </View>

      {/* CONTROLS SECTION */}
      <View style={styles.controlsContainer}>
        
        {/* ROW 1: Takeoff & Land */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.takeoffButton}>
            <Text style={styles.takeoffText}>TAKEOFF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.landButton}>
            <Text style={styles.landText}>LAND</Text>
          </TouchableOpacity>
        </View>

        {/* ROW 2: Pitch */}
        <TouchableOpacity style={styles.pitchButton}>
          <Text style={styles.pitchText}>HOLD TO PITCH FORWARD</Text>
        </TouchableOpacity>

        {/* ROW 3: Complex Joysticks */}
        <View style={styles.joystickRow}>
          
          {/* Left: Yaw Controls */}
          <View style={styles.yawColumn}>
            <TouchableOpacity style={styles.yawButton}>
              <Text style={styles.yawText}>YAW L</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.yawButton}>
              <Text style={styles.yawText}>YAW R</Text>
            </TouchableOpacity>
          </View>

          {/* Center: D-Pad */}
          <View style={styles.dpadColumn}>
            <TouchableOpacity style={styles.dpadButton} onPress={() => handleMove('up')}>
              <ArrowUpIcon width={normalize(20)} height={normalize(20)} color="#1A1A1A" />
            </TouchableOpacity>
            
            <View style={styles.dpadMiddleRow}>
              <TouchableOpacity style={styles.dpadButton} onPress={() => handleMove('left')}>
                <View style={{ transform: [{ rotate: '-90deg' }] }}>
                  <ArrowUpIcon width={normalize(20)} height={normalize(20)} color="#1A1A1A" />
                </View>
              </TouchableOpacity>
              
              <View style={styles.dpadCenter}>
                <Text style={styles.dpadCenterText}>{dronePosition.x},{dronePosition.y}</Text>
              </View>
              
              <TouchableOpacity style={styles.dpadButton} onPress={() => handleMove('right')}>
                <View style={{ transform: [{ rotate: '90deg' }] }}>
                  <ArrowUpIcon width={normalize(20)} height={normalize(20)} color="#1A1A1A" />
                </View>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.dpadButton} onPress={() => handleMove('down')}>
              <ArrowDownIcon width={normalize(20)} height={normalize(20)} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* Right: Kill Switch */}
          <TouchableOpacity style={styles.killButton}>
            <View style={styles.killIconWrapper}>
              {/* Replace with CloseIcon if available */}
              <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 12}}>X</Text> 
            </View>
            <Text style={styles.killText}>KILL</Text>
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FCFAF8' 
  },
  
  // Header & Toggles
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: normalize(20), 
    paddingTop: normalize(15), 
    paddingBottom: normalize(10) 
  },
  toggleGroup: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  headerIcon: { 
    marginRight: normalize(8) 
  },
  settingsButton: { 
    padding: normalize(5) 
  },
  toggleTrack: { 
    width: normalize(50), 
    height: normalize(28), 
    borderRadius: normalize(14), 
    justifyContent: 'center', 
    paddingHorizontal: normalize(3),
    borderWidth: 2,
  },
  toggleTrackOn: { 
    borderColor: '#1A1A1A', 
    backgroundColor: 'transparent' 
  },
  toggleTrackOff: { 
    borderColor: '#D0C4B4', 
    backgroundColor: '#EAE1D5' 
  },
  toggleThumb: { 
    width: normalize(20), 
    height: normalize(20), 
    borderRadius: normalize(10) 
  },
  toggleThumbOn: { 
    backgroundColor: '#A0A0A0', 
    alignSelf: 'flex-start' 
  },
  toggleThumbOff: { 
    backgroundColor: '#A0A0A0', 
    alignSelf: 'flex-end' 
  },

  // Video Area
  videoArea: { 
    flex: 1 
  },

  // Controls Container
  controlsContainer: { 
    paddingHorizontal: normalize(20), 
    paddingBottom: normalize(30) 
  },

  // Shared Button Styles
  beigeButton: {
    backgroundColor: '#F7EFE6',
    borderWidth: 1,
    borderColor: '#E2D3C1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  beigeText: {
    color: '#B5956A',
    fontWeight: 'bold',
    fontSize: normalize(16),
    letterSpacing: 1,
  },

  // Row 1
  actionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: normalize(15) 
  },
  takeoffButton: { 
    flex: 0.48, 
    backgroundColor: '#F7EFE6', 
    borderWidth: 1, 
    borderColor: '#E2D3C1', 
    borderRadius: normalize(12), 
    height: normalize(55), 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  takeoffText: { 
    color: '#B5956A', 
    fontWeight: 'bold', 
    fontSize: normalize(16), 
    letterSpacing: 1 
  },
  landButton: { 
    flex: 0.48, 
    backgroundColor: '#FCFAF8', 
    borderWidth: 1, 
    borderColor: '#C64E4E', 
    borderRadius: normalize(12), 
    height: normalize(55), 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  landText: { 
    color: '#C64E4E', 
    fontWeight: 'bold', 
    fontSize: normalize(16), 
    letterSpacing: 1 
  },

  // Row 2
  pitchButton: { 
    backgroundColor: '#F7EFE6', 
    borderWidth: 1, 
    borderColor: '#E2D3C1', 
    borderRadius: normalize(12), 
    height: normalize(55), 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: normalize(20) 
  },
  pitchText: { 
    color: '#B5956A', 
    fontWeight: 'bold', 
    fontSize: normalize(16), 
    letterSpacing: 1 
  },

  // Row 3
  joystickRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  
  // Yaw
  yawColumn: { 
    justifyContent: 'space-between', 
    height: normalize(130) 
  },
  yawButton: { 
    width: normalize(60), 
    height: normalize(60), 
    borderRadius: normalize(30), 
    backgroundColor: '#F7EFE6', 
    borderWidth: 1, 
    borderColor: '#E2D3C1', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  yawText: { 
    color: '#1A1A1A', 
    fontWeight: 'bold', 
    fontSize: normalize(12) 
  },

  // D-Pad
  dpadColumn: { 
    alignItems: 'center' 
  },
  dpadMiddleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: normalize(5) 
  },
  dpadButton: { 
    width: normalize(55), 
    height: normalize(55), 
    borderRadius: normalize(12), 
    backgroundColor: '#F7EFE6', 
    borderWidth: 1, 
    borderColor: '#E2D3C1', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginHorizontal: normalize(5) 
  },
  dpadCenter: { 
    width: normalize(55), 
    height: normalize(55), 
    borderRadius: normalize(12), 
    backgroundColor: '#F7EFE6', 
    borderWidth: 1, 
    borderColor: '#E2D3C1', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginHorizontal: normalize(5) 
  },
  dpadCenterText: { 
    color: '#B5956A', 
    fontWeight: 'bold', 
    fontSize: normalize(14) 
  },

  // Kill Switch
  killButton: { 
    width: normalize(75), 
    height: normalize(140), 
    borderRadius: normalize(15), 
    backgroundColor: '#F4D6D6', 
    borderWidth: 1, 
    borderColor: '#C64E4E', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  killIconWrapper: { 
    width: normalize(24), 
    height: normalize(24), 
    borderRadius: normalize(12), 
    backgroundColor: '#C64E4E', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: normalize(10) 
  },
  killText: { 
    color: '#C64E4E', 
    fontWeight: 'bold', 
    fontSize: normalize(14), 
    letterSpacing: 1 
  },
});

export default DroneControlScreen;