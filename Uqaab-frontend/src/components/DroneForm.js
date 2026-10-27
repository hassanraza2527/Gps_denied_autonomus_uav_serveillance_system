import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { normalize } from '../utils/responsive';
import CustomInput from './common/CustomInput';
import { ChevronLeftIcon,PlaneIcon,LinkIcon,ChevronDownIcon } from '../assets/icons/index';


const DroneForm = ({ 
  title, 
  submitButtonText, 
  initialValues, 
  xLasers = 3, 
  yLasers = 8, 
  boxWidth = 2.0, 
  boxLength = 2.0,
  onSubmit, 
  onBack 
}) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [connectionString, setConnectionString] = useState(initialValues?.connectionString || '');
  const [gridCell, setGridCell] = useState(initialValues?.gridCell || 'Cell 0,0 — Position: (0.0m, 0.0m)');
  const [isGridModalVisible, setIsGridModalVisible] = useState(false);

  const gridCells = useMemo(() => {
    const cells = [];
    for (let x = 0; x < xLasers; x++) {
      for (let y = 0; y < yLasers; y++) {
        const posX = (x * boxWidth).toFixed(1);
        const posY = (y * boxLength).toFixed(1);
        cells.push(`Cell ${x},${y} — Position: (${posX}m, ${posY}m)`);
      }
    }
    return cells;
  }, [xLasers, yLasers, boxWidth, boxLength]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeftIcon width={28} height={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.inputLabel}>Drone Name</Text>
        <CustomInput 
          placeholder="Drone name" 
          value={name} 
          onChangeText={setName} 
          Icon={PlaneIcon} 
        />

        <Text style={styles.inputLabel}>MAVLink Connection String</Text>
        <CustomInput 
          placeholder="udp://:14540" 
          value={connectionString} 
          onChangeText={setConnectionString} 
          Icon={LinkIcon} 
        />

        <Text style={styles.inputLabel}>Home Location (Grid Cell) *</Text>
        <TouchableOpacity style={styles.dropdownInput} onPress={() => setIsGridModalVisible(true)}>
          <Text style={styles.dropdownText}>{gridCell}</Text>
          <ChevronDownIcon width={normalize(20)} height={normalize(20)} color="#A0A0A0" />
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={() => onSubmit({ name, connectionString, gridCell })}>
          <Text style={styles.saveButtonText}>{submitButtonText}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isGridModalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsGridModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Grid Cell</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {gridCells.map((g) => (
                <TouchableOpacity key={g} style={styles.modalOption} onPress={() => { setGridCell(g); setIsGridModalVisible(false); }}>
                  <Text style={[styles.modalOptionText, gridCell === g && styles.modalOptionSelected]}>{g}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
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
  dropdownInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9F7F2', borderWidth: 1, borderColor: '#E8E1D3', borderRadius: normalize(15), paddingHorizontal: normalize(15), height: normalize(58), marginBottom: normalize(25) },
  dropdownText: { fontSize: normalize(15), color: '#1A1A1A' },
  footer: { position: 'absolute', bottom: 0, width: '100%', paddingHorizontal: normalize(20), paddingBottom: normalize(30), paddingTop: normalize(15), backgroundColor: '#FCFAF8' },
  saveButton: { backgroundColor: '#C8AD84', height: normalize(55), borderRadius: normalize(15), justifyContent: 'center', alignItems: 'center' },
  saveButtonText: { color: '#FFF', fontSize: normalize(16), fontWeight: 'bold', letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', borderRadius: normalize(20), padding: normalize(25), width: '85%', maxHeight: '70%' },
  modalTitle: { fontSize: normalize(18), fontWeight: 'bold', textAlign: 'center', marginBottom: normalize(15) },
  modalOption: { paddingVertical: normalize(15), borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center' },
  modalOptionText: { fontSize: normalize(16), color: '#333' },
  modalOptionSelected: { color: '#C8AD84', fontWeight: 'bold' },
});

export default DroneForm;