import React from 'react';
import Svg, { Path } from 'react-native-svg';

const BellSolidIcon = ({ width = 24, height = 24, color = "#C8AD84" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);
export default BellSolidIcon;