import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

const VideoIcon = ({ width = 24, height = 24, color = "#333" }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 7l-7 5 7 5V7z" />
    <Rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </Svg>
);
export default VideoIcon;