import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const EmailIcon = ({ width = 24, height = 24, color = "#A0A0A0" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
    <Path d="M3 7l9 6 9-6" />
  </Svg>
);

export default EmailIcon;