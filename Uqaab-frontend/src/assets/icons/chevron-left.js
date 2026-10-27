import React from 'react';
import Svg, { Path } from 'react-native-svg';

const ChevronLeftIcon = ({ width = 24, height = 24, color = "#1A1A1A" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

export default ChevronLeftIcon;