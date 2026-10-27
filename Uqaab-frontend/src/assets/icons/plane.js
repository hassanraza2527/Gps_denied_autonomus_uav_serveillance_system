import React from 'react';
import Svg, { Path } from 'react-native-svg';

const PlaneIcon = ({ width = 24, height = 24, color = "#333" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2 .5-3.5 2L14.5 9.5 6.3 7.7 5 9l6 4-3 3-3.5-1-2 1.5 4.5 1.5 1.5 4.5 1.5-2-1-3.5 3-3 4 6 1.3-1.3z" />
  </Svg>
);
export default PlaneIcon;