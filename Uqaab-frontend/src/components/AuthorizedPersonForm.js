import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { normalize } from '../utils/responsive';
import CustomInput from '../components/common/CustomInput';
import { ChevronLeftIcon, UserIcon, ChevronDownIcon, CameraPlusIcon, FaceSparkleIcon, XCircleIcon, ImagePlaceholderIcon} from '../assets/icons/index';


const ROLES = ['Guest', 'Guard', 'Authorized Person'];

const PhotoBox = ({ label, imageUri, onPick, onDelete }) => (
  <View style={styles.photoBoxContainer}>
    <Text style={styles.photoBoxLabel}>{label}</Text>
    <View style={styles.photoBoxWrapper}>
      <TouchableOpacity style={styles.photoBox} onPress={onPick}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
        ) : (
          <ImagePlaceholderIcon width={normalize(30)} height={normalize(30)} />
        )}
      </TouchableOpacity>
      {imageUri && (
        <TouchableOpacity style={styles.deleteIconButton} onPress={onDelete}>
          <XCircleIcon width={normalize(22)} height={normalize(22)} />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const AuthorizedPersonForm = ({ title, submitButtonText, initialValues, onSubmit, onBack, onDelete }) => {
  const [fullName, setFullName] = useState(initialValues?.fullName || '');
  const [role, setRole] = useState(initialValues?.role || 'Guest');
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [photos, setPhotos] = useState(initialValues?.photos || { front: null, left: null, right: null });

  const handleImagePick = (side) => {
    Alert.alert("Upload Photo", "Choose a method", [
      { text: "Camera", onPress: () => openPicker('camera', side) },
      { text: "Gallery", onPress: () => openPicker('library', side) },
      { text: "Cancel", style: "cancel" }
    ]);
  };

  const openPicker = async (type, side) => {
    const options = { mediaType: 'photo', quality: 0.8 };
    const result = type === 'camera' ? await launchCamera(options) : await launchImageLibrary(options);
    if (result.assets) setPhotos(prev => ({ ...prev, [side]: result.assets[0].uri }));
  };

  const removePhoto = (side) => setPhotos(prev => ({ ...prev, [side]: null }));

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
        <Text style={styles.inputLabel}>Full Name *</Text>
        <CustomInput placeholder="Full name" value={fullName} onChangeText={setFullName} Icon={UserIcon} />

        <Text style={styles.inputLabel}>Role</Text>
        <TouchableOpacity style={styles.dropdownInput} onPress={() => setIsRoleModalVisible(true)}>
          <Text style={styles.dropdownText}>{role}</Text>
          <ChevronDownIcon width={normalize(20)} height={normalize(20)} color="#A0A0A0" />
        </TouchableOpacity>

        <View style={styles.sectionHeaderRow}>
          <CameraPlusIcon width={normalize(18)} height={normalize(18)} color="#333" />
          <Text style={styles.sectionTitle}>Face Photos</Text>
        </View>
        <Text style={styles.sectionSubtitle}>Update face photos for better recognition</Text>
        
        <View style={styles.photoRow}>
          {['front', 'left', 'right'].map((side) => (
            <PhotoBox 
              key={side}
              label={side.charAt(0).toUpperCase() + side.slice(1)} 
              imageUri={photos[side]} 
              onPick={() => handleImagePick(side)}
              onDelete={() => removePhoto(side)}
            />
          ))}
        </View>

        <View style={styles.enrollmentCard}>
          <View style={styles.enrollmentHeaderRow}>
            <FaceSparkleIcon width={normalize(18)} height={normalize(18)} color="#C8AD84" />
            <Text style={styles.enrollmentTitle}>Face Enrollment</Text>
          </View>
          <Text style={styles.enrollmentSubtitle}>Enroll face so entrance cameras can identify this person.</Text>
          <TouchableOpacity style={styles.enrollButton}>
            <FaceSparkleIcon width={normalize(16)} height={normalize(16)} color="#C8AD84" />
            <Text style={styles.enrollButtonText}>Enroll Face</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={() => onSubmit({ fullName, role, photos })}>
          <Text style={styles.saveButtonText}>{submitButtonText}</Text>
        </TouchableOpacity>
        
        {onDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteButtonText}>DELETE PERSON</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={isRoleModalVisible} transparent={true} animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsRoleModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Role</Text>
            {ROLES.map((r) => (
              <TouchableOpacity key={r} style={styles.roleOptionButton} onPress={() => { setRole(r); setIsRoleModalVisible(false); }}>
                <Text style={[styles.roleOptionText, role === r && styles.roleOptionSelected]}>{r}</Text>
              </TouchableOpacity>
            ))}
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
  scrollContent: { paddingHorizontal: normalize(20), paddingBottom: normalize(150) },
  inputLabel: { fontSize: normalize(14), color: '#333', marginBottom: normalize(8), fontWeight: '500' },
  dropdownInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#F9F7F2', borderWidth: 1, borderColor: '#E8E1D3', borderRadius: normalize(15), paddingHorizontal: normalize(15), height: normalize(58), marginBottom: normalize(25) },
  dropdownText: { fontSize: normalize(15), color: '#1A1A1A' },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(4) },
  sectionTitle: { fontSize: normalize(16), fontWeight: 'bold', color: '#1A1A1A', marginLeft: normalize(8) },
  sectionSubtitle: { fontSize: normalize(13), color: '#666', marginBottom: normalize(15) },
  photoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: normalize(25) },
  photoBoxContainer: { alignItems: 'center', width: '31%' },
  photoBoxLabel: { fontSize: normalize(13), color: '#333', marginBottom: normalize(8) },
  photoBoxWrapper: { width: '100%', position: 'relative' },
  photoBox: { width: '100%', aspectRatio: 0.9, backgroundColor: '#F9F7F2', borderWidth: 1, borderColor: '#E8E1D3', borderRadius: normalize(12), justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  uploadedImage: { width: '100%', height: '100%' },
  deleteIconButton: { position: 'absolute', top: -normalize(8), right: -normalize(8), zIndex: 10 },
  enrollmentCard: { backgroundColor: '#F9F7F2', borderWidth: 1, borderColor: '#E8E1D3', borderRadius: normalize(15), padding: normalize(20) },
  enrollmentHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(8) },
  enrollmentTitle: { fontSize: normalize(16), fontWeight: 'bold', color: '#1A1A1A', marginLeft: normalize(8) },
  enrollmentSubtitle: { fontSize: normalize(13), color: '#666', marginBottom: normalize(20) },
  enrollButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#C8AD84', borderRadius: normalize(12), height: normalize(45) },
  enrollButtonText: { color: '#C8AD84', fontSize: normalize(14), fontWeight: 'bold', marginLeft: normalize(8) },
  footer: { position: 'absolute', bottom: 0, width: '100%', paddingHorizontal: normalize(20), paddingBottom: normalize(25), paddingTop: normalize(15), backgroundColor: '#FCFAF8', borderTopWidth: 1, borderTopColor: '#F0EBE1' },
  saveButton: { backgroundColor: '#C8AD84', height: normalize(55), borderRadius: normalize(15), justifyContent: 'center', alignItems: 'center' },
  saveButtonText: { color: '#FFF', fontSize: normalize(16), fontWeight: 'bold' },
  deleteButton: { marginTop: normalize(15), justifyContent: 'center', alignItems: 'center', height: normalize(30) },
  deleteButtonText: { color: '#C64E4E', fontSize: normalize(14), fontWeight: 'bold', letterSpacing: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: normalize(25), borderTopRightRadius: normalize(25), padding: normalize(25) },
  modalTitle: { fontSize: normalize(18), fontWeight: 'bold', textAlign: 'center', marginBottom: normalize(10) },
  roleOptionButton: { paddingVertical: normalize(15), borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center' },
  roleOptionText: { fontSize: normalize(16), color: '#333' },
  roleOptionSelected: { color: '#C8AD84', fontWeight: 'bold' },
});

export default AuthorizedPersonForm;