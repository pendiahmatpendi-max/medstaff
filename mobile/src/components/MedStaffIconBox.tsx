import React from 'react'
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import MedStaffIcon, { MedStaffIconName } from './MedStaffIcon'
import { colors } from '../theme/colors'

/**
 * MedStaff Icon Box — Rounded container + icon as a unified component.
 *
 * Usage:
 *   <MedStaffIconBox name="home" colorScheme="teal" />
 *   <MedStaffIconBox name="calendar" colorScheme="orange" size={40} />
 */

export type IconColorScheme = keyof typeof colors.iconColors

export interface MedStaffIconBoxProps {
  /** Icon name from MedStaffIcon family */
  name: MedStaffIconName
  /** Color scheme from iconColors palette */
  colorScheme: IconColorScheme
  /** Container size in px (default: 40) */
  size?: number
  /** Icon size in px (default: auto ~55% of container) */
  iconSize?: number
  /** Border radius (default: 13 = rounded square) */
  borderRadius?: number
  /** Override background color */
  bgColor?: string
  /** Override icon color */
  iconColor?: string
  /** MedStaffIcon variant */
  variant?: 'outline' | 'filled'
  /** Additional container style */
  style?: StyleProp<ViewStyle>
}

export default function MedStaffIconBox({
  name,
  colorScheme,
  size = 40,
  iconSize,
  borderRadius = 13,
  bgColor,
  iconColor,
  variant = 'filled',
  style,
}: MedStaffIconBoxProps) {
  const scheme = colors.iconColors[colorScheme]
  const resolvedBg = bgColor || scheme.bg
  const resolvedIcon = iconColor || scheme.icon
  const resolvedIconSize = iconSize || Math.round(size * 0.55)

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: resolvedBg,
        },
        style,
      ]}
    >
      <MedStaffIcon
        name={name}
        variant={variant}
        size={resolvedIconSize}
        color={resolvedIcon}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
