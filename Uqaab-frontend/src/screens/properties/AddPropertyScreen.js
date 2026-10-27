import React from 'react';
import PropertyForm from '../../components/common/PropertyForm';
import { useCreatePropertyMutation } from '../../store/apiSlice';
import { Alert } from 'react-native';

const AddPropertyScreen = ({ navigation }) => {
  const [createProperty, { isLoading }] = useCreatePropertyMutation();
 
  const handleAddSubmit = async (formData) => {
    // formData comes from PropertyForm:
    // { propertyName, address, xLasers, yLasers, boxWidth, boxLength, gridHeight, coordinates }
    const body = {
      name: formData.propertyName,
      address: formData.address,
      latitude: formData.coordinates.latitude,
      longitude: formData.coordinates.longitude,
      laser_grid: {
        x_lasers: parseInt(formData.xLasers) || 3,
        y_lasers: parseInt(formData.yLasers) || 8,
        box_width: parseFloat(formData.boxWidth) || 2.0,
        box_length: parseFloat(formData.boxLength) || 0.6,
        grid_height: parseFloat(formData.gridHeight) || 2.4,
      },
    };
 
    try {
      await createProperty(body).unwrap();
      Alert.alert('Success', 'Property created!');
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Error', err?.data?.detail || 'Failed to create property.');
    }
  };
 
  return (
    <PropertyForm
      title="Add Property"
      submitButtonText={isLoading ? 'SAVING...' : 'ADD PROPERTY'}
      onBack={() => navigation.goBack()}
      onSubmit={handleAddSubmit}
      initialValues={{}}
    />
  );
};

export default AddPropertyScreen;