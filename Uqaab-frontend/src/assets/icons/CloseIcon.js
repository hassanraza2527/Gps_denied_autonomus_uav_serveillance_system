import React from 'react';
import Svg, { Path } from 'react-native-svg';

const CloseIcon = ({ width = 24, height = 24, color = '#1A1A1A', ...props }) => {
  return (
    <Svg 
      width={width} 
      height={height} 
      viewBox="0 0 24 24" 
      fill="none" 
      {...props}
    >
      <Path
        d="M18 6L6 18M6 6L18 18"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default CloseIcon;