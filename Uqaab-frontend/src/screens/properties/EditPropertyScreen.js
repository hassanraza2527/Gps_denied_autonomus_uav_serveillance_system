import React from 'react';
import { Alert, ActivityIndicator, View } from 'react-native';
import PropertyForm from '../../components/common/PropertyForm';
import {
  useGetPropertyQuery,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
} from '../../store/apiSlice';
 

const EditPropertyScreen = ({ navigation,route }) => {
   const propertyId = route.params?.propertyId;
 
  const { data, isLoading } = useGetPropertyQuery(propertyId);
  const [updateProperty] = useUpdatePropertyMutation();
  const [deleteProperty] = useDeletePropertyMutation();
 
  const property = data?.property;
 
  const initialValues = property
    ? {
        propertyName: property.name,
        address: property.address,
        xLasers: String(property.laser_grid.x_lasers),
        yLasers: String(property.laser_grid.y_lasers),
        boxWidth: String(property.laser_grid.box_width),
        boxLength: String(property.laser_grid.box_length),
        gridHeight: String(property.laser_grid.grid_height),
        coordinates: { latitude: property.latitude, longitude: property.longitude },
      }
    : {};
 
  const handleEditSubmit = async (formData) => {
    try {
      await updateProperty({
        propertyId,
        name: formData.propertyName,
        address: formData.address,
        latitude: formData.coordinates.latitude,
        longitude: formData.coordinates.longitude,
        laser_grid: {
          x_lasers: parseInt(formData.xLasers),
          y_lasers: parseInt(formData.yLasers),
          box_width: parseFloat(formData.boxWidth),
          box_length: parseFloat(formData.boxLength),
          grid_height: parseFloat(formData.gridHeight),
        },
      }).unwrap();
      Alert.alert('Success', 'Property updated!');
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Error', err?.data?.detail || 'Failed to update property.');
    }
  };
 
  const handleDelete = () => {
    Alert.alert('Delete Property', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProperty(propertyId).unwrap();
            navigation.navigate('Home');
          } catch (err) {
            Alert.alert('Error', err?.data?.detail || 'Failed to delete property.');
          }
        },
      },
    ]);
  };
 
  if (isLoading) return <ActivityIndicator size="large" color="#C8AD84" style={{ flex: 1 }} />;
  return (
    <PropertyForm
      title="Edit Property"
      submitButtonText="SAVE CHANGES"
      onBack={() => navigation.goBack()}
      onSubmit={handleEditSubmit}
      initialValues={initialValues}
      onDelete={handleDelete}
    />
  );
};

export default EditPropertyScreen;