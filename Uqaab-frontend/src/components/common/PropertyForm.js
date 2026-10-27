import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { normalize } from '../../utils/responsive';
import CustomInput from './CustomInput';
import { ChevronLeftIcon,MapPinIcon,BuildingIcon} from '../../assets/icons/index';

const PropertyForm = ({ 
  title, 
  submitButtonText, 
  initialValues, 
  onSubmit, 
  onBack,
  onDelete // NEW PROP ADDED
}) => {
  const [formData, setFormData] = useState({
    propertyName: initialValues?.propertyName || '', 
    address: initialValues?.address || '',
    xLasers: initialValues?.xLasers || '',
    yLasers: initialValues?.yLasers || '',
    boxWidth: initialValues?.boxWidth || '',
    boxLength: initialValues?.boxLength || '',
    gridHeight: initialValues?.gridHeight || '',
    coordinates: initialValues?.coordinates || {
      latitude: 33.6358, 
      longitude: 73.0725,
    }
  });

  const handleUpdate = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ChevronLeftIcon width={28} height={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CustomInput 
          placeholder="Property Name (e.g., BIIT)"
          value={formData.propertyName}
          onChangeText={(val) => handleUpdate('propertyName', val)}
          Icon={BuildingIcon}
        />

        <CustomInput 
          placeholder="Address"
          value={formData.address}
          onChangeText={(val) => handleUpdate('address', val)}
          Icon={MapPinIcon}
        />
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Laser Grid Setup</Text>
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>X (Lasers)</Text>
              <TextInput 
                style={styles.gridInput} 
                value={formData.xLasers}
                onChangeText={(val) => handleUpdate('xLasers', val)}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#A0A0A0"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Y (Lasers)</Text>
              <TextInput 
                style={styles.gridInput} 
                value={formData.yLasers}
                onChangeText={(val) => handleUpdate('yLasers', val)}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#A0A0A0"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Box Width (meters)</Text>
              <TextInput 
                style={styles.gridInput} 
                value={formData.boxWidth}
                onChangeText={(val) => handleUpdate('boxWidth', val)}
                keyboardType="numeric"
                placeholder="0.0"
                placeholderTextColor="#A0A0A0"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Box Length (meters)</Text>
              <TextInput 
                style={styles.gridInput} 
                value={formData.boxLength}
                onChangeText={(val) => handleUpdate('boxLength', val)}
                keyboardType="numeric"
                placeholder="0.0"
                placeholderTextColor="#A0A0A0"
              />
            </View>
          </View>

          <View style={styles.fullWidthInputGroup}>
            <Text style={styles.label}>Grid Height from Floor (meters)</Text>
            <TextInput 
              style={styles.gridInput} 
              value={formData.gridHeight}
              onChangeText={(val) => handleUpdate('gridHeight', val)}
              keyboardType="numeric"
              placeholder="0.0"
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: formData.coordinates.latitude,
              longitude: formData.coordinates.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
            <Marker coordinate={formData.coordinates} />
          </MapView>
          
          <TouchableOpacity style={styles.targetButton}>
            <MapPinIcon width={20} height={20} color="#333" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={() => onSubmit(formData)}
        >
          <Text style={styles.saveButtonText}>{submitButtonText}</Text>
        </TouchableOpacity>

        {/* NEW CONDITIONAL DELETE BUTTON */}
        {onDelete && (
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={onDelete}
          >
            <Text style={styles.deleteButtonText}>DELETE PROPERTY</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(20),
    paddingTop: normalize(15),
    paddingBottom: normalize(10),
  },
  backButton: { padding: normalize(5), marginLeft: -normalize(5) },
  headerTitle: { fontSize: normalize(20), fontWeight: 'bold', color: '#1A1A1A' },
  scrollContainer: { flex: 1 },
  // Increased bottom padding to accommodate both buttons safely
  scrollContent: { paddingHorizontal: normalize(20), paddingBottom: normalize(150) },
  card: {
    backgroundColor: '#F9F7F2',
    borderRadius: normalize(15),
    padding: normalize(20),
    borderWidth: 1,
    borderColor: '#E8E1D3',
    marginTop: normalize(10),
    marginBottom: normalize(20),
  },
  cardTitle: { fontSize: normalize(18), fontWeight: 'bold', color: '#1A1A1A', marginBottom: normalize(15) },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: normalize(15) },
  inputGroup: { flex: 0.48 },
  fullWidthInputGroup: { width: '100%' },
  label: { fontSize: normalize(13), color: '#555', marginBottom: normalize(8), fontWeight: '500' },
  gridInput: {
    backgroundColor: '#F9F7F2',
    borderWidth: 1,
    borderColor: '#E8E1D3',
    borderRadius: normalize(10),
    height: normalize(50),
    paddingHorizontal: normalize(15),
    fontSize: normalize(16),
    color: '#1A1A1A',
  },
  mapContainer: {
    height: normalize(200),
    borderRadius: normalize(15),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E1D3',
  },
  map: { flex: 1 },
  targetButton: {
    position: 'absolute',
    top: normalize(10),
    right: normalize(10),
    backgroundColor: '#FFF',
    padding: normalize(8),
    borderRadius: normalize(8),
    elevation: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(25), // Adjusted for safe area
    paddingTop: normalize(15),
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0EBE1', // Subtle divider
  },
  saveButton: {
    backgroundColor: '#C8AD84',
    height: normalize(55),
    borderRadius: normalize(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: { color: '#FFF', fontSize: normalize(16), fontWeight: 'bold', letterSpacing: 1 },
  
  // NEW DELETE STYLES
  deleteButton: {
    marginTop: normalize(15),
    justifyContent: 'center',
    alignItems: 'center',
    height: normalize(30),
  },
  deleteButtonText: {
    color: '#C64E4E', // Muted destructive red
    fontSize: normalize(14),
    fontWeight: 'bold',
    letterSpacing: 0.5,
  }
});

export default PropertyForm;