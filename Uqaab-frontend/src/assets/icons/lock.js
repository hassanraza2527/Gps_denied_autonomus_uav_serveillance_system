import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const LockIcon = ({ width = 24, height = 24, color = "#A0A0A0" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
);

export default LockIcon;