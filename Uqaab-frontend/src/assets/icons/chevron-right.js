import React from 'react';
import Svg, { Path } from 'react-native-svg';

const ChevronRight = ({ width = 24, height = 24, color = "#333333" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

export default ChevronRight;