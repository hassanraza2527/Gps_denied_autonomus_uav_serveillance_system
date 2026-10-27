import React from 'react';
import Svg, { Path } from 'react-native-svg';
const ShieldCheckIcon = ({ width = 24, height = 24, color = "#4CAF50" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M9 12l2 2 4-4" />
  </Svg>
);
export default ShieldCheckIcon;