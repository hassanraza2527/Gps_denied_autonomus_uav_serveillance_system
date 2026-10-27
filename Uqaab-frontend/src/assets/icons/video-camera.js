import React from 'react';
import Svg, { Rect, Polygon } from 'react-native-svg';
const VideoCameraIcon = ({ width = 24, height = 24, color = "#A0A0A0" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="2" y="7" width="14" height="10" rx="2" ry="2" />
    <Polygon points="16 12 22 8 22 16 16 12" />
  </Svg>
);
export default VideoCameraIcon;