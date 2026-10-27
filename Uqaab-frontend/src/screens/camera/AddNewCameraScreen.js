import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import CameraForm from '../../components/CameraForm';
import { useGetPropertyQuery } from '../../store/apiSlice';

const AddNewCameraScreen = ({ navigation, route }) => {
  const propertyId = route?.params?.propertyId;

  // We still fetch property to pass xLasers/yLasers to the form if needed
  const { data: propertyData, isLoading: isPropertyLoading } = useGetPropertyQuery(propertyId, {
    skip: !propertyId,
  });

  const property = propertyData?.property || {};
  const xLasers = property?.laser_grid?.x_lasers || 3;
  const yLasers = property?.laser_grid?.y_lasers || 8;
  const boxWidth = property?.laser_grid?.box_width || 2.0;
  const boxLength = property?.laser_grid?.box_length || 2.0;

  const handleNextStep = ({ name, url, zoneType, wallType }) => {
    const typeMap = {
      Entrance:  'entrance',
      Internal:  'insider',
      Perimeter: 'fence',
    };
    const typeWall={
      East:'east',
      West:'west',
      North:'north',
      South:'south',
    }
    
    const selectedType = typeMap[zoneType] ?? 'entrance';
    const selectdWallType=typeWall[wallType]??'east';
    // Package the data to pass to the next screen
    const cameraPayload = {
      propertyId,
      cameraName: name,
      streamUrl: url,
      cameraType: selectedType,
      wall_type:selectdWallType,
      xLasers,
      yLasers
    };

    // Routing Logic based on your rules
    if (selectedType === 'fence') {
      navigation.navigate('WallCalibration', cameraPayload);
    } else {
      navigation.navigate('DefineCameraCells', cameraPayload);
    }
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
      title="Add New Camera"
      submitButtonText="NEXT STEP"
      showSaveIcon={false}
      showZoneType={true}
      urlLabel="Camera Stream URL"
      onBack={() => navigation.goBack()}
      onSubmit={handleNextStep}
      initialValues={{}}
      xLasers={xLasers}
      yLasers={yLasers}
      boxWidth={boxWidth}
      boxLength={boxLength}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FCFAF8' }
});

export default AddNewCameraScreen;