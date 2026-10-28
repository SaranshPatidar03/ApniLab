import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Path,
  Rect,
  Line,
  G,
  Text as SvgText,
} from 'react-native-svg';

export type AppIconName =
  | 'completed'
  | 'lab-hours'
  | 'active-streak'
  | 'avg-score'
  // Subject discipline icons
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'mathematics'
  // Experiment-specific icons (keyed by experiment id)
  | 'ohms-law'
  | 'pendulum'
  | 'reflection-light'
  | 'refraction-light'
  | 'bar-magnet'
  | 'acids-bases'
  | 'chem-changes'
  | 'separation-mixtures'
  | 'plant-cell'
  | 'photosynthesis'
  | 'seed-germination'
  | 'binary-converter'
  | 'fractions-geometry'
  // UI
  | 'bot';

interface AppIconProps {
  name: AppIconName;
  size?: number;
  style?: StyleProp<ViewStyle>;
  /** Optional custom image override if user provides physical PNG in assets/icons/ */
  source?: ImageSourcePropType;
  /** Force dark or light mode palette adjustments if needed */
  isDark?: boolean;
}

/**
 * AppIcon renders the seven specific application icons/illustrations:
 * 1. Completed — green circular icon with a white tick
 * 2. Lab Hours — blue clock/stopwatch illustration
 * 3. Active Streak — orange/yellow flame icon
 * 4. Avg. Score — blue calendar-style icon containing the word SCORE
 * 5. Ohm's Law — black uppercase Greek omega symbol (Ω)
 * 6. SHM & Pendulum — pendulum with swinging bob and curved motion arrow
 * 7. Physics — dark-blue physics illustration with graphs, equations, and a magnet
 *
 * It uses native SVGs for crisp, resolution-independent rendering across all Android screen
 * densities, and supports direct PNG image sources via resizeMode="contain".
 */
export function AppIcon({ name, size = 24, style, source, isDark = false }: AppIconProps) {
  // If a raster image source is supplied, render with Image resizeMode="contain"
  if (source) {
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        <Image
          source={source}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      </View>
    );
  }

  // Otherwise render the pixel-perfect SVG vector illustration matching exact specifications
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {renderIconSvg(name, size, isDark)}
    </View>
  );
}

function renderIconSvg(name: AppIconName, size: number, isDark: boolean) {
  switch (name) {
    /** 1. Completed — green circular icon with a white tick */
    case 'completed':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Green circular base */}
          <Circle cx="24" cy="24" r="22" fill="#10B981" />
          {/* Subtle glossy border */}
          <Circle cx="24" cy="24" r="21" stroke="#059669" strokeWidth="2" opacity={0.6} />
          {/* Crisp white checkmark */}
          <Path
            d="M14 24.5L20.5 31L34 17.5"
            stroke="#FFFFFF"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    /** 2. Lab Hours — blue clock/stopwatch illustration */
    case 'lab-hours':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Stopwatch top button/crown */}
          <Rect x="21" y="2" width="6" height="5" rx="1.5" fill="#2563EB" />
          <Rect x="19" y="5" width="10" height="2" rx="1" fill="#1D4ED8" />
          {/* Side lap buttons */}
          <Line x1="11" y1="9" x2="15" y2="13" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
          <Line x1="37" y1="9" x2="33" y2="13" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
          {/* Outer circular rim */}
          <Circle cx="24" cy="27" r="18" fill="#EFF6FF" stroke="#2563EB" strokeWidth="3.5" />
          {/* Inner dial ring */}
          <Circle cx="24" cy="27" r="14" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1" />
          {/* Clock dial tick marks */}
          <Line x1="24" y1="15" x2="24" y2="17.5" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" />
          <Line x1="36" y1="27" x2="33.5" y2="27" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" />
          <Line x1="24" y1="39" x2="24" y2="36.5" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" />
          <Line x1="12" y1="27" x2="14.5" y2="27" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round" />
          {/* Clock hands pointing at active practice time */}
          <Line x1="24" y1="27" x2="24" y2="18" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" />
          <Line x1="24" y1="27" x2="31" y2="27" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
          <Circle cx="24" cy="27" r="2.5" fill="#1D4ED8" />
        </Svg>
      );

    /** 3. Active Streak — orange/yellow flame icon */
    case 'active-streak':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Outer vibrant orange-red flame body */}
          <Path
            d="M24 2C24 2 29 10 29 16C29 18.2 28.2 20.1 27 21.6C30 20.5 35 23 35 30C35 37.7 29.5 44 23 44C15.8 44 11 38.2 11 31C11 22.8 17.5 15.5 24 2Z"
            fill="#F97316"
          />
          {/* Mid flame layer: deep amber/orange */}
          <Path
            d="M24 12C24 12 28 17 28 22C28 24 27 25.5 25.8 26.5C28.5 26.5 32 29 32 33.5C32 38.5 28 42.5 23.5 42.5C18 42.5 14.5 38 14.5 32.5C14.5 26 19.5 20.5 24 12Z"
            fill="#FB923C"
          />
          {/* Inner warm yellow glowing flame core */}
          <Path
            d="M23.5 23C23.5 23 27 27 27 31C27 34.5 25 38 22 38C19 38 17 35.5 17 32C17 28 21 25.5 23.5 23Z"
            fill="#FDE047"
          />
        </Svg>
      );

    /** 4. Avg. Score — blue calendar-style icon containing the word SCORE */
    case 'avg-score':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Top calendar rings / binder coils */}
          <Rect x="13" y="2" width="4" height="7" rx="2" fill="#1E40AF" />
          <Rect x="31" y="2" width="4" height="7" rx="2" fill="#1E40AF" />
          {/* Calendar main white/pale blue card */}
          <Rect
            x="6"
            y="6"
            width="36"
            height="38"
            rx="6"
            fill="#F8FAFC"
            stroke="#2563EB"
            strokeWidth="3"
          />
          {/* Calendar blue top header banner */}
          <Path
            d="M6 12C6 8.68629 8.68629 6 12 6H36C39.3137 6 42 8.68629 42 12V17H6V12Z"
            fill="#2563EB"
          />
          {/* Decorative calendar grid dots on header */}
          <Circle cx="15" cy="11.5" r="1.5" fill="#93C5FD" />
          <Circle cx="24" cy="11.5" r="1.5" fill="#93C5FD" />
          <Circle cx="33" cy="11.5" r="1.5" fill="#93C5FD" />
          {/* Calendar body inner divider */}
          <Line x1="10" y1="23" x2="38" y2="23" stroke="#DBEAFE" strokeWidth="1.5" strokeDasharray="2 2" />
          {/* Centered bold text: SCORE */}
          <SvgText
            x="24"
            y="35"
            textAnchor="middle"
            fill="#1E40AF"
            fontSize="10"
            fontWeight="bold"
            letterSpacing={0.8}
            fontFamily="System">
            SCORE
          </SvgText>
        </Svg>
      );

    /** 5. Ohm's Law — black uppercase Greek omega symbol (Ω) */
    case 'ohms-law':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Crisp background badge circle */}
          <Circle
            cx="24"
            cy="24"
            r="22"
            fill={isDark ? '#1E293B' : '#F1F5F9'}
            stroke={isDark ? '#475569' : '#CBD5E1'}
            strokeWidth="2"
          />
          {/* Black uppercase Greek Omega (Ω) symbol */}
          <Path
            d="M12 36H18.5C19.8 36 20.8 35 21 33.7L21.3 31.8C18.2 29.7 16.5 25.8 16.5 22C16.5 16.2 20 12 24 12C28 12 31.5 16.2 31.5 22C31.5 25.8 29.8 29.7 26.7 31.8L27 33.7C27.2 35 28.2 36 29.5 36H36"
            stroke={isDark ? '#F8FAFC' : '#0F172A'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    /** 6. SHM & Pendulum — pendulum with swinging bob and curved motion arrow */
    case 'pendulum':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Fixed ceiling support pivot bar */}
          <Line x1="14" y1="6" x2="34" y2="6" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
          <Line x1="16" y1="3" x2="19" y2="6" stroke="#94A3B8" strokeWidth="1.5" />
          <Line x1="22" y1="3" x2="25" y2="6" stroke="#94A3B8" strokeWidth="1.5" />
          <Line x1="28" y1="3" x2="31" y2="6" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Top pivot bearing */}
          <Circle cx="24" cy="6" r="2.5" fill="#0EA5E9" />
          {/* Equilibrium reference dashed vertical line */}
          <Line
            x1="24"
            y1="8"
            x2="24"
            y2="34"
            stroke="#94A3B8"
            strokeWidth="1"
            strokeDasharray="2 2"
            opacity={0.6}
          />
          {/* Inextensible suspension string swung at angle */}
          <Line
            x1="24"
            y1="6"
            x2="32"
            y2="30"
            stroke="#0284C7"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Spherical metallic swinging bob with hook */}
          <Circle cx="32" cy="31" r="6" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" />
          <Circle cx="30" cy="29" r="1.8" fill="#BAE6FD" opacity={0.8} />
          {/* Curved motion arrow indicating swing arc */}
          <Path
            d="M14 38C19 41 29 41 34 38"
            stroke="#F59E0B"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="3 2"
          />
          {/* Arrow heads on trajectory */}
          <Path
            d="M32 35.5L35.5 38L33 41"
            stroke="#F59E0B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M16 35.5L12.5 38L15 41"
            stroke="#F59E0B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    /** 7. Physics — dark-blue physics illustration with graphs, equations, and magnet */
    case 'physics':
      return (
        <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          {/* Dark-blue physics background card */}
          <Rect
            x="2"
            y="2"
            width="60"
            height="60"
            rx="12"
            fill="#1E3A8A"
            stroke="#3B82F6"
            strokeWidth="2"
          />
          {/* Coordinate axes */}
          <Line x1="8" y1="46" x2="56" y2="46" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
          <Line x1="12" y1="12" x2="12" y2="52" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
          {/* Scientific sine wave graph */}
          <Path
            d="M12 40C16 30 20 22 25 32C30 42 35 48 40 36C45 24 50 28 54 34"
            stroke="#38BDF8"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Scientific formula E=mc² text */}
          <SvgText
            x="16"
            y="22"
            fill="#FACC15"
            fontSize="9"
            fontWeight="bold"
            fontFamily="System">
            E = mc²
          </SvgText>
          {/* Horseshoe Magnet on bottom-right */}
          <G transform="translate(38, 22)">
            {/* Magnet U-curve */}
            <Path
              d="M4 16V8C4 3.58 7.58 0 12 0C16.42 0 20 3.58 20 8V16"
              stroke="#EF4444"
              strokeWidth="5"
              strokeLinecap="square"
            />
            {/* North pole tip (red with N) */}
            <Rect x="1.5" y="14" width="5" height="5" fill="#DC2626" />
            <SvgText x="4" y="18" fill="#FFFFFF" fontSize="4.5" fontWeight="bold" textAnchor="middle">
              N
            </SvgText>
            {/* South pole tip (blue with S) */}
            <Rect x="17.5" y="14" width="5" height="5" fill="#2563EB" />
            <SvgText x="20" y="18" fill="#FFFFFF" fontSize="4.5" fontWeight="bold" textAnchor="middle">
              S
            </SvgText>
            {/* Magnetic field flux line between poles */}
            <Path
              d="M5 21C8 24 16 24 19 21"
              stroke="#93C5FD"
              strokeWidth="1"
              strokeDasharray="1.5 1.5"
            />
          </G>
        </Svg>
      );

    /** 8. Chemistry — Erlenmeyer flask with glowing liquid and bubbles */
    case 'chemistry':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Flask neck lip/rim */}
          <Rect x="20" y="6" width="8" height="3" rx="1.5" fill="#E11D48" />
          {/* Flask glass outline */}
          <Path
            d="M21 9V17L11 36C9.5 39 11.5 42 15 42H33C36.5 42 38.5 39 37 36L27 17V9H21Z"
            stroke="#E11D48"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Liquid content fill inside bottom bulb */}
          <Path
            d="M14 34L17 28C19 27 21 29 24 28C27 27 29 29 31 28L34 34C35.5 37 34 40 31.5 40H16.5C14 40 12.5 37 14 34Z"
            fill="#FB7185"
            opacity={0.85}
          />
          {/* Measurement tick marks on flask neck */}
          <Line x1="22" y1="20" x2="25" y2="20" stroke="#FDA4AF" strokeWidth="1.5" strokeLinecap="round" />
          <Line x1="20" y1="24" x2="24" y2="24" stroke="#FDA4AF" strokeWidth="1.5" strokeLinecap="round" />
          {/* Reaction bubbles floating up */}
          <Circle cx="21" cy="33" r="2" fill="#FFFFFF" opacity={0.9} />
          <Circle cx="27" cy="31" r="2.5" fill="#FFFFFF" opacity={0.8} />
          <Circle cx="23" cy="15" r="1.5" fill="#E11D48" opacity={0.6} />
        </Svg>
      );

    /** 9. Biology — vibrant leaf with cellular chloroplasts and life science icon */
    case 'biology':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Leaf body */}
          <Path
            d="M38 10C24 10 12 18 10 32C10 34 11 36 13 36C27 36 38 24 38 10Z"
            fill="#10B981"
          />
          {/* Central stem line */}
          <Path
            d="M10 38C12 34 20 26 38 10"
            stroke="#047857"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Leaf vein branches */}
          <Path
            d="M18 28C22 26 26 27 28 29"
            stroke="#047857"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <Path
            d="M24 22C28 20 32 21 34 23"
            stroke="#047857"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Organic cell bubble / chloroplast circle */}
          <Circle cx="18" cy="16" r="4.5" fill="#34D399" opacity={0.5} />
          <Circle cx="18" cy="16" r="2" fill="#047857" />
        </Svg>
      );

    /** 10. Mathematics — geometric and arithmetic symbols */
    case 'mathematics':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Outer circular badge */}
          <Rect
            x="4"
            y="4"
            width="40"
            height="40"
            rx="10"
            fill={isDark ? '#083344' : '#E0F2FE'}
            stroke="#0284C7"
            strokeWidth="2"
          />
          {/* Plus sign top-left */}
          <Line x1="12" y1="17" x2="20" y2="17" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
          <Line x1="16" y1="13" x2="16" y2="21" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
          {/* Minus sign top-right */}
          <Line x1="28" y1="17" x2="36" y2="17" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
          {/* Division sign bottom-left */}
          <Line x1="12" y1="31" x2="20" y2="31" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
          <Circle cx="16" cy="27" r="1.5" fill="#0284C7" />
          <Circle cx="16" cy="35" r="1.5" fill="#0284C7" />
          {/* Equals sign bottom-right */}
          <Line x1="28" y1="29" x2="36" y2="29" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
          <Line x1="28" y1="34" x2="36" y2="34" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
      );

    /** 11. Bot — friendly educational assistant avatar */
    case 'bot':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Antenna */}
          <Line x1="24" y1="6" x2="24" y2="12" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />
          <Circle cx="24" cy="5" r="3" fill="#6366F1" />
          {/* Bot Head */}
          <Rect
            x="8"
            y="12"
            width="32"
            height="26"
            rx="8"
            fill={isDark ? '#312E81' : '#EEF2FF'}
            stroke="#4F46E5"
            strokeWidth="2.5"
          />
          {/* Ear bolts */}
          <Rect x="4" y="21" width="4" height="8" rx="2" fill="#6366F1" />
          <Rect x="40" y="21" width="4" height="8" rx="2" fill="#6366F1" />
          {/* Screen / Visor */}
          <Rect x="13" y="17" width="22" height="13" rx="4" fill="#1E1B4B" />
          {/* Glowing Eyes */}
          <Circle cx="19" cy="23.5" r="2.5" fill="#38BDF8" />
          <Circle cx="29" cy="23.5" r="2.5" fill="#38BDF8" />
          {/* Cheerful Mouth Line */}
          <Path
            d="M19 33C21.5 35 26.5 35 29 33"
            stroke="#4F46E5"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      );

    /** Reflection of Light — mirror and ray bouncing */
    case 'reflection-light':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <Rect x="10" y="34" width="28" height="4" rx="2" fill="#60A5FA" stroke="#2563EB" strokeWidth="1.5" />
          <Line x1="10" y1="10" x2="24" y2="34" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
          <Line x1="24" y1="34" x2="38" y2="10" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
          <Line x1="24" y1="14" x2="24" y2="34" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 2" strokeLinecap="round" />
          <Path d="M22 14L24 10L26 14" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M36 14L38 10L40 14" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    /** Refraction of Light — prism bending light */
    case 'refraction-light':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <Path d="M24 6L42 38H6L24 6Z" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round" />
          <Line x1="6" y1="20" x2="18" y2="28" stroke="#FACC15" strokeWidth="2.5" strokeLinecap="round" />
          <Line x1="18" y1="28" x2="30" y2="36" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
          <Line x1="30" y1="36" x2="44" y2="30" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
      );

    /** Bar Magnet — N-S bar with field lines */
    case 'bar-magnet':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <Rect x="8" y="20" width="16" height="10" rx="2" fill="#DC2626" />
          <Rect x="24" y="20" width="16" height="10" rx="2" fill="#2563EB" />
          <SvgText x="16" y="28" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="System">N</SvgText>
          <SvgText x="32" y="28" textAnchor="middle" fill="#FFFFFF" fontSize="7" fontWeight="bold" fontFamily="System">S</SvgText>
          <Path d="M16 20C16 12 32 12 32 20" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" fill="none" strokeLinecap="round" />
          <Path d="M12 20C12 8 36 8 36 20" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" fill="none" strokeLinecap="round" />
          <Path d="M16 30C16 38 32 38 32 30" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" fill="none" strokeLinecap="round" />
          <Path d="M12 30C12 42 36 42 36 30" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="2 2" fill="none" strokeLinecap="round" />
        </Svg>
      );

    /** Acids and Bases — two test tubes with indicator colors */
    case 'acids-bases':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <Path d="M14 10V30C14 34 18 36 20 34L22 30V10H14Z" fill="#FCA5A5" stroke="#DC2626" strokeWidth="1.5" strokeLinejoin="round" />
          <Rect x="13" y="8" width="10" height="3" rx="1.5" fill="#DC2626" />
          <Circle cx="18" cy="30" r="3" fill="#EF4444" opacity={0.9} />
          <Path d="M26 10V30C26 34 30 36 32 34L34 30V10H26Z" fill="#BAE6FD" stroke="#2563EB" strokeWidth="1.5" strokeLinejoin="round" />
          <Rect x="25" y="8" width="10" height="3" rx="1.5" fill="#2563EB" />
          <Circle cx="30" cy="30" r="3" fill="#3B82F6" opacity={0.9} />
          <SvgText x="24" y="45" textAnchor="middle" fill="#7C3AED" fontSize="7" fontWeight="bold" fontFamily="System">pH</SvgText>
        </Svg>
      );

    /** Chemical Changes — beaker on flame */
    case 'chem-changes':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <Path d="M14 14H34V34C34 36 32 38 30 38H18C16 38 14 36 14 34V14Z" fill="#FEF9C3" stroke="#F59E0B" strokeWidth="2" strokeLinejoin="round" />
          <Rect x="12" y="11" width="24" height="4" rx="2" fill="#F59E0B" />
          <Path d="M14 30C18 28 22 32 26 30C30 28 34 30 34 30V34C34 36 32 38 30 38H18C16 38 14 36 14 34V30Z" fill="#FDE047" opacity={0.8} />
          <Path d="M20 42C20 42 22 38 24 40C26 42 28 38 28 38C28 38 30 43 24 45C18 43 20 42 20 42Z" fill="#F97316" />
          <Path d="M22 43C22 43 23 40 24 41C25 42 26 40 26 40C26 40 27 44 24 45C21 44 22 43 22 43Z" fill="#FACC15" />
          <Circle cx="20" cy="26" r="2" fill="#FFFFFF" opacity={0.8} />
          <Circle cx="26" cy="24" r="1.5" fill="#FFFFFF" opacity={0.7} />
        </Svg>
      );

    /** Separation of Mixtures — filter funnel */
    case 'separation-mixtures':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <Path d="M8 10H40L28 26V38H20V26L8 10Z" fill="#CCFBF1" stroke="#0D9488" strokeWidth="2" strokeLinejoin="round" />
          <Line x1="14" y1="18" x2="34" y2="18" stroke="#0D9488" strokeWidth="1" strokeDasharray="2 2" />
          <Line x1="18" y1="23" x2="30" y2="23" stroke="#0D9488" strokeWidth="1" strokeDasharray="2 2" />
          <Path d="M24 38C24 38 23 41 24 43C25 41 24 38 24 38Z" fill="#0D9488" />
          <Circle cx="24" cy="45" r="2" fill="#14B8A6" />
        </Svg>
      );

    /** Plant and Animal Cell — rectangular plant cell cross-section */
    case 'plant-cell':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <Rect x="6" y="8" width="36" height="32" rx="4" fill="#D1FAE5" stroke="#059669" strokeWidth="2.5" />
          <Rect x="9" y="11" width="30" height="26" rx="3" fill="none" stroke="#34D399" strokeWidth="1.2" strokeDasharray="3 2" />
          <Circle cx="24" cy="24" r="7" fill="#6EE7B7" stroke="#047857" strokeWidth="2" />
          <Circle cx="24" cy="24" r="3.5" fill="#047857" opacity={0.8} />
          <Rect x="14" y="28" width="8" height="6" rx="2" fill="#A7F3D0" stroke="#059669" strokeWidth="1" />
          <Circle cx="34" cy="16" r="2.5" fill="#16A34A" />
          <Circle cx="38" cy="22" r="2" fill="#16A34A" />
        </Svg>
      );

    /** Photosynthesis — leaf with sun rays */
    case 'photosynthesis':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <Circle cx="36" cy="12" r="5" fill="#FACC15" />
          <Line x1="36" y1="4" x2="36" y2="6" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
          <Line x1="42" y1="6" x2="40.5" y2="7.5" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
          <Line x1="44" y1="12" x2="42" y2="12" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
          <Line x1="42" y1="18" x2="40.5" y2="16.5" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
          <Path d="M36 22C24 16 8 22 8 36C22 36 36 26 36 22Z" fill="#16A34A" />
          <Path d="M8 36C12 30 22 26 36 22" stroke="#14532D" strokeWidth="1.8" strokeLinecap="round" />
          <Path d="M16 34C18 30 22 28 26 30" stroke="#14532D" strokeWidth="1.2" strokeLinecap="round" />
          <Path d="M32 18L26 22" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="round" />
          <Path d="M24 21L26 22L25 24" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      );

    /** Seed Germination — sprouting seedling */
    case 'seed-germination':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <Rect x="4" y="34" width="40" height="8" rx="3" fill="#92400E" opacity={0.5} />
          <Path d="M20 34C20 28 24 26 24 26C24 26 28 28 28 34" fill="#78350F" stroke="#92400E" strokeWidth="1.5" />
          <Line x1="24" y1="26" x2="24" y2="12" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
          <Path d="M24 18C24 18 14 15 12 20C17 22 24 20 24 18Z" fill="#22C55E" />
          <Path d="M24 22C24 22 34 19 36 24C31 26 24 24 24 22Z" fill="#16A34A" />
          <Path d="M24 34C24 34 20 38 22 42" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
          <Path d="M24 34C24 34 28 38 26 42" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
        </Svg>
      );

    /** Binary Converter — digital 0/1 grid */
    case 'binary-converter':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <Rect x="4" y="4" width="40" height="40" rx="10" fill={isDark ? '#083344' : '#E0F2FE'} stroke="#0284C7" strokeWidth="2" />
          <SvgText x="12" y="20" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="bold" fontFamily="System">1</SvgText>
          <SvgText x="24" y="20" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="bold" fontFamily="System">0</SvgText>
          <SvgText x="36" y="20" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="bold" fontFamily="System">1</SvgText>
          <SvgText x="12" y="32" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="bold" fontFamily="System">0</SvgText>
          <SvgText x="24" y="32" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="bold" fontFamily="System">1</SvgText>
          <SvgText x="36" y="32" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="bold" fontFamily="System">0</SvgText>
          <SvgText x="12" y="44" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="bold" fontFamily="System">1</SvgText>
          <SvgText x="24" y="44" textAnchor="middle" fill="#0284C7" fontSize="10" fontWeight="bold" fontFamily="System">1</SvgText>
          <SvgText x="36" y="44" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="bold" fontFamily="System">0</SvgText>
        </Svg>
      );

    /** Fractions & Geometry — divided circle with ruler */
    case 'fractions-geometry':
      return (
        <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          <Circle cx="22" cy="22" r="16" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
          <Path d="M22 22L22 6A16 16 0 0 1 38 22Z" fill="#8B5CF6" opacity={0.85} />
          <Path d="M22 22L38 22A16 16 0 0 1 22 38Z" fill="#A78BFA" opacity={0.6} />
          <Line x1="22" y1="6" x2="22" y2="38" stroke="#7C3AED" strokeWidth="1.5" />
          <Line x1="6" y1="22" x2="38" y2="22" stroke="#7C3AED" strokeWidth="1.5" />
          <SvgText x="32" y="16" textAnchor="middle" fill="#5B21B6" fontSize="7" fontWeight="bold" fontFamily="System">¼</SvgText>
          <Rect x="28" y="36" width="18" height="8" rx="2" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1.5" />
          <Line x1="32" y1="36" x2="32" y2="40" stroke="#7C3AED" strokeWidth="1" />
          <Line x1="36" y1="36" x2="36" y2="42" stroke="#7C3AED" strokeWidth="1" />
          <Line x1="40" y1="36" x2="40" y2="40" stroke="#7C3AED" strokeWidth="1" />
        </Svg>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
