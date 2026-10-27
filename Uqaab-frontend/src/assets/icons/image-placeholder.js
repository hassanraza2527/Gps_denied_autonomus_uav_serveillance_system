import React from 'react';
import Svg, { Rect, Circle, Path } from 'react-native-svg';
const ImagePlaceholderIcon = ({ width = 30, height = 30, color = "#A0A0A0" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <Circle cx="8.5" cy="8.5" r="1.5" />
    <Path d="M21 15l-5-5L5 21" />
  </Svg>
);
export default ImagePlaceholderIcon;