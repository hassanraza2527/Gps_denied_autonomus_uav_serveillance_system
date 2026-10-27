import React from 'react';
import { Alert, ActivityIndicator, View, StyleSheet } from 'react-native';
import DroneForm from '../../components/DroneForm';
import { 
  useGetPropertyQuery, 
  useCreateDroneMutation 
} from '../../store/apiSlice';

const AddNewDroneScreen = ({ route, navigation }) => {
  const propertyId = route?.params?.propertyId;

  const { data: propertyData, isLoading: isPropertyLoading } = useGetPropertyQuery(propertyId, {
    skip: !propertyId,
  });

  const [createDrone, { isLoading: isCreating }] = useCreateDroneMutation();

  const property = propertyData?.property || {};
  const xLasers = property?.laser_grid?.x_lasers || 3;
  const yLasers = property?.laser_grid?.y_lasers || 8;
  const boxWidth = property?.laser_grid?.box_width || 2.0;
  const boxLength = property?.laser_grid?.box_length || 2.0;

  const parseGridCell = (cellString) => {
    if (!cellString) return { row: 0, col: 0 };
    const match = cellString.match(/Cell\s+(\d+),(\d+)/);
    if (match) {
      return { col: parseInt(match[1], 10), row: parseInt(match[2], 10) };
    }
    return { row: 0, col: 0 };
  };

  const handleAddSubmit = async (data) => {
    if (!data.name || !data.connectionString || !data.gridCell) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    const { row, col } = parseGridCell(data.gridCell);

    try {
      await createDrone({
        propertyId,
        name: data.name,
        connection_string: data.connectionString,
        home_cell: { row, col }
      }).unwrap();

      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error?.data?.detail || "Failed to add drone.");
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
    <DroneForm 
      title="Add New Drone"
      submitButtonText={isCreating ? "SAVING..." : "SAVE DRONE"}
      onBack={() => navigation.goBack()}
      onSubmit={handleAddSubmit}
      initialValues={{}}
      xLasers={xLasers} 
      yLasers={yLasers}
      boxWidth={boxWidth}
      boxLength={boxLength}
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

export default AddNewDroneScreen;