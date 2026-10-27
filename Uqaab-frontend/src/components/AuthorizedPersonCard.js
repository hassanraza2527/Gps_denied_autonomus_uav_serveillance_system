import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { normalize } from '../utils/responsive';
import { MoreVerticalIcon,ShieldCheckIcon } from '../assets/icons/index';

const AuthorizedPersonCard = ({ person, onOptionsPress }) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <ShieldCheckIcon width={normalize(24)} height={normalize(24)} color="#4CAF50" />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{person.name}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{person.role}</Text>
          </View>
          {!person.hasFace && (
            <View style={styles.warningBadge}>
              <Text style={styles.warningText}>⚠ No Face</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.optionsButton} onPress={onOptionsPress}>
        <MoreVerticalIcon width={normalize(20)} height={normalize(20)} color="#333" />
      </TouchableOpacity>
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
  iconContainer: {
    backgroundColor: '#E8F5E9',
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(15),
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: normalize(5),
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(6),
    marginRight: normalize(8),
  },
  roleText: {
    color: '#2E7D32',
    fontSize: normalize(11),
    fontWeight: '600',
  },
  warningBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    borderRadius: normalize(6),
  },
  warningText: {
    color: '#F57C00',
    fontSize: normalize(11),
    fontWeight: '600',
  },
  optionsButton: {
    padding: normalize(5),
  },
});

export default AuthorizedPersonCard;