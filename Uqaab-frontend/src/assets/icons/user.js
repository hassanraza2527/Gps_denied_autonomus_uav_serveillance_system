import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const UserIcon = ({ width = 24, height = 24, color = "#A0A0A0" }) => (
  <Svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

export default UserIcon;