import React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

export default function PokeballBg({ color = 'rgba(255, 255, 255, 0.15)', ...props }: SvgProps & { color?: string }) {
  return (
    <Svg viewBox="0 0 100 100" width="100%" height="100%" {...props}>
      <Circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="10" />
      <Path d="M 5 50 Q 50 50 95 50" fill="none" stroke={color} strokeWidth="10" />
      <Circle cx="50" cy="50" r="15" fill="none" stroke={color} strokeWidth="10" />
    </Svg>
  );
}
