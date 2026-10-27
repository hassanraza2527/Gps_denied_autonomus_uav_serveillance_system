import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { normalize } from '../utils/responsive';
import CustomInput from './common/CustomInput';
import { ChevronLeftIcon, VideoCameraIcon, LinkIcon, ChevronDownIcon, DoorIcon, SaveIcon } from '../assets/icons/index';

const ZONE_TYPES = ['Entrance', 'Internal', 'Perimeter'];
const WALL_TYPE =['East','West','North','South']

const CameraForm = ({ 
  title, 
  submitButtonText, 
  showSaveIcon = false,
  showZoneType = false,
  urlLabel = "Camera Stream URL",
  initialValues, 
  onSubmit, 
  onBack,
  isFence,
  isEditing,
  onUpdatePolygon,
  onUpdateCells,
  // 1. ADD THESE PROPS SO WE CAN GENERATE THE GRID dynamically
  xLasers = 3, 
  yLasers = 8 
}) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [url, setUrl] = useState(initialValues?.url || '');
  const [zoneType, setZoneType] = useState(initialValues?.zoneType || 'Perimeter');
  // const [grid_cell, setGridCell] = useState(initialValues?.gridCell || 'Cell 0,0');
  const [wallType,setWallType]=useState(initialValues?.wallType||'East');
  const [isZoneModalVisible, setIsZoneModalVisible] = useState(false);
  // const [isGridModalVisible, setIsGridModalVisible] = useState(false);
  const [isWallTypeVisible,setisWallTypeVisible]=useState(false);

  // 2. DYNAMICALLY GENERATE GRID CELLS BASED ON LASER COUNTS
  // If yLasers = 8 (rows) and xLasers = 3 (cols), this generates Cell 0,0 all the way to Cell 7,2
  const dynamicGridCells = useMemo(() => {
    const cells = [];
    const rows = yLasers > 0 ? yLasers : 1;
    const cols = xLasers > 0 ? xLasers : 1;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push(`Cell ${r},${c}`);
      }
    }
    return cells;
  }, [xLasers, yLasers]);

  return (
    <View style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeftIcon width={28} height={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.inputLabel}>Camera Name</Text>
        <CustomInput placeholder="Camera name" value={name} onChangeText={setName} Icon={VideoCameraIcon} />

        <Text style={styles.inputLabel}>{urlLabel}</Text>
        <CustomInput placeholder="http://192.168.1.5:8080/video" value={url} onChangeText={setUrl} Icon={LinkIcon} />
        
        {showZoneType && (
          <Text style={styles.helperText}>Using IP Webcam? Enter: http://YOUR_PHONE_IP:8080/video</Text>
        )}

        {showZoneType && (
          <View>
            <Text style={styles.inputLabel}>Camera Zone Type *</Text>
            <TouchableOpacity style={styles.zoneDropdown} onPress={() => setIsZoneModalVisible(true)}>
              <View style={styles.zoneDropdownLeft}>
                <DoorIcon width={normalize(18)} height={normalize(18)} color="#C64E4E" />
                <View style={styles.zoneTextContainer}>
                  <Text style={styles.zoneMainText}>{zoneType}</Text>
                </View>
              </View>
              <ChevronDownIcon width={normalize(20)} height={normalize(20)} color="#A0A0A0" />
            </TouchableOpacity>
            <Text style={styles.inputLabel}>Wall Type *</Text>
            <TouchableOpacity style={styles.zoneDropdown} onPress={() => setisWallTypeVisible(true)}>
              <View style={styles.zoneDropdownLeft}>
                <DoorIcon width={normalize(18)} height={normalize(18)} color="#C64E4E" />
                <View style={styles.zoneTextContainer}>
                  <Text style={styles.zoneMainText}>{wallType}</Text>
                </View>
              </View>
              <ChevronDownIcon width={normalize(20)} height={normalize(20)} color="#A0A0A0" />
            </TouchableOpacity>
          </View>

          
        )}
        
        {/* ONLY show these buttons if we are editing an existing camera! */}
        {isEditing && (
          <View style={styles.editButtonsContainer}>
             <View>
            <Text style={styles.inputLabel}>Wall Type *</Text>
            <TouchableOpacity style={styles.zoneDropdown} onPress={() => setisWallTypeVisible(true)}>
              <View style={styles.zoneDropdownLeft}>
                <DoorIcon width={normalize(18)} height={normalize(18)} color="#C64E4E" />
                <View style={styles.zoneTextContainer}>
                  <Text style={styles.zoneMainText}>{wallType}</Text>
                </View>
              </View>
              <ChevronDownIcon width={normalize(20)} height={normalize(20)} color="#A0A0A0" />
            </TouchableOpacity>
          </View>
            {/* 1. Only show Polygon button if it is a fence */}
             
              <TouchableOpacity 
                style={styles.outlineButton} 
                onPress={onUpdatePolygon}
              >
                <Text style={styles.outlineButtonText}>UPDATE POLYGON</Text>
              </TouchableOpacity>
            

            {/* 2. ALWAYS show the Cells button, but ONLY in Edit Mode */}
            <TouchableOpacity 
              style={styles.outlineButton} 
              onPress={onUpdateCells}
            >
              <Text style={styles.outlineButtonText}>UPDATE FENCE CELL</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={() => onSubmit({ name, url, zoneType, wallType })}>
          {showSaveIcon && <SaveIcon width={normalize(20)} height={normalize(20)} color="#FFF" />}
          <Text style={[styles.saveButtonText, showSaveIcon && { marginLeft: normalize(8) }]}>
            {submitButtonText}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isZoneModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsZoneModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Zone Type</Text>
            {ZONE_TYPES.map((z) => (
              <TouchableOpacity key={z} style={styles.modalOption} onPress={() => { setZoneType(z); setIsZoneModalVisible(false); }}>
                <Text style={[styles.modalOptionText, zoneType === z && styles.modalOptionSelected]}>{z}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal visible={isWallTypeVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setisWallTypeVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Zone Type</Text>
            {WALL_TYPE.map((z) => (
              <TouchableOpacity key={z} style={styles.modalOption} onPress={() => { setWallType(z); setisWallTypeVisible(false); }}>
                <Text style={[styles.modalOptionText, zoneType === z && styles.modalOptionSelected]}>{z}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 3. WRAP GRID CELLS IN SCROLLVIEW SO THEY DON'T OVERFLOW */}
      {/* <Modal visible={isGridModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsGridModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Grid Cell</Text>
            <ScrollView style={{ maxHeight: normalize(300) }} showsVerticalScrollIndicator={false}>
              {dynamicGridCells.map((g) => (
                <TouchableOpacity key={g} style={styles.modalOption} onPress={() => { setGridCell(g); setIsGridModalVisible(false); }}>
                  <Text style={[styles.modalOptionText, gridCell === g && styles.modalOptionSelected]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal> */}


    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FCFAF8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: normalize(20), paddingTop: normalize(15), paddingBottom: normalize(20) },
  backButton: { padding: normalize(5), marginLeft: -normalize(5) },
  headerTitle: { fontSize: normalize(20), fontWeight: 'bold', color: '#1A1A1A' },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: normalize(20), paddingBottom: normalize(100) },
  inputLabel: { fontSize: normalize(14), color: '#333', marginBottom: normalize(8), marginTop: normalize(10), fontWeight: '500' },
  helperText: { fontSize: normalize(12), color: '#888', marginTop: -normalize(10), marginBottom: normalize(15), marginLeft: normalize(5) },
  dropdownInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9F7F2', borderWidth: 1, borderColor: '#E8E1D3', borderRadius: normalize(15), paddingHorizontal: normalize(15), height: normalize(58), marginBottom: normalize(25) },
  dropdownText: { fontSize: normalize(15), color: '#1A1A1A' },
  zoneDropdown: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9F7F2', borderWidth: 1, borderColor: '#E8E1D3', borderRadius: normalize(15), paddingHorizontal: normalize(15), paddingVertical: normalize(12), marginBottom: normalize(10) },
  zoneDropdownLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  zoneTextContainer: { marginLeft: normalize(10), flex: 1 },
  zoneMainText: { fontSize: normalize(16), fontWeight: 'bold', color: '#1A1A1A' },
  zoneSubText: { fontSize: normalize(12), color: '#666', marginTop: normalize(2) },
  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FBEFEA', padding: normalize(12), borderRadius: normalize(10), marginBottom: normalize(25) },
  infoBoxText: { fontSize: normalize(13), color: '#D97757', marginLeft: normalize(8), fontWeight: '500' },
  footer: { position: 'absolute', bottom: 0, width: '100%', paddingHorizontal: normalize(20), paddingBottom: normalize(30), paddingTop: normalize(15), backgroundColor: '#FCFAF8' },
  saveButton: { flexDirection: 'row', backgroundColor: '#C8AD84', height: normalize(55), borderRadius: normalize(15), justifyContent: 'center', alignItems: 'center' },
  saveButtonText: { color: '#FFF', fontSize: normalize(16), fontWeight: 'bold', letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', borderRadius: normalize(20), padding: normalize(25), width: '80%' },
  modalTitle: { fontSize: normalize(18), fontWeight: 'bold', textAlign: 'center', marginBottom: normalize(15) },
  modalOption: { paddingVertical: normalize(15), borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center' },
  modalOptionText: { fontSize: normalize(16), color: '#333' },
  modalOptionSelected: { color: '#C8AD84', fontWeight: 'bold' },
  editButtonsContainer: {
    marginBottom: normalize(15),
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#D4A35B',
    borderRadius: normalize(10),
    paddingVertical: normalize(15),
    alignItems: 'center',
    marginBottom: normalize(10),
    backgroundColor: 'transparent',
  },
  outlineButtonText: {
    color: '#D4A35B',
    fontSize: normalize(14),
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default CameraForm;