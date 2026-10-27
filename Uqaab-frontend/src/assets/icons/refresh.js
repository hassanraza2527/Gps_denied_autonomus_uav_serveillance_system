import React from 'react';
import Svg, { Path } from 'react-native-svg';

const RefreshIcon = ({ width = 24, height = 24, color = "#333" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 4v6h-6" />
    <Path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </Svg>
);
export default RefreshIcon;