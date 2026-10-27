import React from 'react';
import { Alert, ActivityIndicator, View, StyleSheet } from 'react-native';
import CameraForm from '../../components/CameraForm';
import { useUpdateCameraMutation, useGetPropertyQuery } from '../../store/apiSlice';

const EditCameraScreen = ({ navigation, route }) => {
  const { camera, propertyId } = route.params;

  const { data: propertyData, isLoading: isPropertyLoading } = useGetPropertyQuery(propertyId, {
    skip: !propertyId,
  });

  const [updateCamera, { isLoading: isUpdating }] = useUpdateCameraMutation();

  const property = propertyData?.property || {};
  const xLasers = property?.laser_grid?.x_lasers || 3;
  const yLasers = property?.laser_grid?.y_lasers || 8;
  const boxWidth = property?.laser_grid?.box_width || 2.0;
  const boxLength = property?.laser_grid?.box_length || 2.0;

  const initialValues = {
    name:     camera.name,
    url:      camera.rtsp_url,
    wall_type:camera.wall_type
    // gridCell: `Cell ${camera.grid_cell.row},${camera.grid_cell.col}`,
  };

  // Check if it's a fence camera (lowercase check to be safe)
  const isFence = camera?.camera_type?.toLowerCase() === 'fence';

  const handleEditSubmit = async ({ name, url,wall_type }) => {
    
    try {
      await updateCamera({
        cameraId:   camera.id,
        propertyId,
        name,
        rtsp_url:   url,
        wall_type:  wall_type,
      }).unwrap();

      Alert.alert('Success', `Camera "${name}" updated!`);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err?.data?.detail || 'Failed to update camera. Please try again.');
    }
  };

  const handleUpdatePolygon = () => {
    navigation.navigate('WallCalibration', {
      propertyId,
      cameraId: camera.id,
      cameraName: camera.name,
      streamUrl: camera.rtsp_url,
      cameraType: camera.camera_type,
      wall_type:camera.wall_type,
      xLasers,
      yLasers,
      isEditing: true 
    });
  };

  const handleUpdateCells = () => {
    navigation.navigate('DefineCameraCells', {
      propertyId,
      cameraId: camera.id,
      cameraName: camera.name,
      streamUrl: camera.rtsp_url,
      cameraType: camera.camera_type,
      wall_type:camera.wall_type,
      xLasers,
      yLasers,
      isEditing: true
    });
  };

  if (isPropertyLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#C8AD84" />
      </View>
    );
  }

  return (
    <CameraForm
      title="Edit Camera"
      submitButtonText={isUpdating ? 'SAVING…' : 'UPDATE CAMERA'}
      showSaveIcon={false}
      showZoneType={false}
      urlLabel="RTSP Stream URL"
      onBack={() => navigation.goBack()}
      onSubmit={handleEditSubmit}
      initialValues={initialValues}
      xLasers={xLasers}
      yLasers={yLasers}
      boxWidth={boxWidth}
      boxLength={boxLength}
      isEditing={true}
      // Pass the isFence flag down to the form!
      isFence={isFence} 
      onUpdatePolygon={handleUpdatePolygon}
      onUpdateCells={handleUpdateCells}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FCFAF8',
  }
});

export default EditCameraScreen;