import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { normalize } from '../utils/responsive';
import { EditSolidIcon,TrashSolidIcon } from '../assets/icons/index';

const DroneCard = ({ drone, onEdit, onDelete }) => {
  const isOffline = drone.status.toLowerCase() === 'offline';

  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{drone.name}</Text>
        <Text style={styles.urlText} numberOfLines={1} ellipsizeMode="tail">
          {drone.url}
        </Text>
        <Text style={[styles.statusText, isOffline ? styles.offlineText : styles.onlineText]}>
          Status: {drone.status}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
          <EditSolidIcon width={normalize(20)} height={normalize(20)} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <TrashSolidIcon width={normalize(20)} height={normalize(20)} color="#D9534F" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9F7F2',
    borderRadius: normalize(15),
    padding: normalize(15),
    borderWidth: 1,
    borderColor: '#E8E1D3',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(15),
  },
  infoContainer: {
    flex: 1,
    marginRight: normalize(10),
  },
  name: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: normalize(4),
  },
  urlText: {
    fontSize: normalize(13),
    color: '#666',
    marginBottom: normalize(4),
  },
  statusText: {
    fontSize: normalize(13),
    fontWeight: '500',
  },
  offlineText: {
    color: '#C64E4E',
  },
  onlineText: {
    color: '#4CAF50',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: normalize(8),
    marginLeft: normalize(5),
  },
});

export default DroneCard;