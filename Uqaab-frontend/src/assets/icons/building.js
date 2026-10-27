import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const BuildingIcon = ({ width = 24, height = 24, color = "#A0A0A0" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <Path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01M8 18h.01M16 18h.01" />
  </Svg>
);

export default BuildingIcon;