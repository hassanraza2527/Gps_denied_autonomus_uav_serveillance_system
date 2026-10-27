import React from 'react';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';
const CameraPlusIcon = ({ width = 24, height = 24, color = "#A0A0A0" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
    <Line x1="12" y1="8" x2="12" y2="12" />
    <Line x1="10" y1="10" x2="14" y2="10" />
  </Svg>
);
export default CameraPlusIcon;