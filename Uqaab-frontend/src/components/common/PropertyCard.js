import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { normalize } from '../../utils/responsive';
import { ChevronRight } from '../../assets/icons/index'; 

const PropertyCard = ({ property, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.propertyName}>{property.name}</Text>
          <Text style={styles.address}>{property.address}</Text>
        </View>
        <ChevronRight width={20} height={20} color="#333" />
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.cameraOnline}>
          {property.camerasOnline}/{property.camerasTotal} Cameras Online
        </Text>
        <Text style={[
          styles.droneStatus, 
          { color: property.isDroneOnline ? '#4CAF50' : '#E57373' }
        ]}>
          Drone: {property.isDroneOnline ? 'Online' : 'Offline'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9F7F2',
    borderRadius: normalize(15),
    padding: normalize(20),
    borderWidth: 1,
    borderColor: '#E8E1D3',
    marginBottom: normalize(15),
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  propertyName: { 
    fontSize: normalize(18), 
    fontWeight: 'bold', 
    color: '#1A1A1A' 
  },
  address: { 
    fontSize: normalize(14), 
    color: '#666', 
    marginTop: normalize(4) 
  },
  statusRow: { 
    flexDirection: 'row', 
    marginTop: normalize(15) 
  },
  cameraOnline: { 
    color: '#4CAF50', 
    fontSize: normalize(13), 
    fontWeight: '500', 
    marginRight: normalize(15) 
  },
  droneStatus: { 
    fontSize: normalize(13), 
    fontWeight: '500' 
  },
});

export default PropertyCard;