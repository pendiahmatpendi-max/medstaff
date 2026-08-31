import React from 'react'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleProp, TextStyle } from 'react-native'

/**
 * MedStaff Icon System — Modern rounded icon family.
 *
 * Primary: Ionicons (rounded, modern, iOS/Samsung One UI style)
 * Fallback: MaterialCommunityIcons (for glyphs not in Ionicons)
 */

export type MedStaffIconName =
  | 'home' | 'employee' | 'employee-off' | 'request' | 'notification' | 'profile'
  | 'attendance' | 'history' | 'calendar' | 'swap' | 'overtime'
  | 'personal' | 'job' | 'emergency' | 'education' | 'experience'
  | 'password' | 'pin' | 'language' | 'theme' | 'help' | 'about' | 'logout'
  | 'chevron-right' | 'chevron-left' | 'chevron-down' | 'chevron-up'
  | 'arrow-right' | 'arrow-left' | 'more' | 'settings' | 'search' | 'close'
  | 'check' | 'success' | 'error' | 'camera' | 'refresh' | 'location' | 'map'
  | 'clock-in' | 'clock-out' | 'server' | 'medical' | 'badge'

export interface MedStaffIconProps {
  name: MedStaffIconName
  variant?: 'outline' | 'filled'
  size?: number
  color?: string
  style?: StyleProp<TextStyle>
}

// ── Ionicons glyph pairs: [outline, filled] ──
type IoGlyph = keyof typeof Ionicons.glyphMap
type IoGlyphPair = [IoGlyph, IoGlyph]

const IONICONS_MAP: Partial<Record<MedStaffIconName, IoGlyphPair>> = {
  home:           ['home-outline', 'home'],
  employee:       ['people-outline', 'people'],
  'employee-off': ['person-remove-outline', 'person-remove'],
  request:        ['document-text-outline', 'document-text'],
  notification:   ['notifications-outline', 'notifications'],
  profile:        ['person-circle-outline', 'person-circle'],
  attendance:     ['finger-print-outline', 'finger-print'],
  history:        ['time-outline', 'time'],
  calendar:       ['calendar-outline', 'calendar'],
  swap:           ['swap-horizontal-outline', 'swap-horizontal'],
  overtime:       ['alarm-outline', 'alarm'],
  personal:       ['person-outline', 'person'],
  job:            ['briefcase-outline', 'briefcase'],
  emergency:      ['call-outline', 'call'],
  education:      ['school-outline', 'school'],
  experience:     ['ribbon-outline', 'ribbon'],
  password:       ['lock-closed-outline', 'lock-closed'],
  pin:            ['keypad-outline', 'keypad'],
  language:       ['globe-outline', 'globe'],
  theme:          ['color-palette-outline', 'color-palette'],
  help:           ['help-circle-outline', 'help-circle'],
  about:          ['information-circle-outline', 'information-circle'],
  logout:         ['log-out-outline', 'log-out'],
  settings:       ['settings-outline', 'settings'],
  search:         ['search-outline', 'search'],
  close:          ['close-outline', 'close-circle'],
  check:          ['checkmark-outline', 'checkmark'],
  success:        ['checkmark-circle-outline', 'checkmark-circle'],
  error:          ['alert-circle-outline', 'alert-circle'],
  camera:         ['camera-outline', 'camera'],
  refresh:        ['refresh-outline', 'refresh'],
  location:       ['location-outline', 'location'],
  map:            ['map-outline', 'map'],
  'clock-in':     ['log-in-outline', 'log-in'],
  'clock-out':    ['log-out-outline', 'log-out'],
  medical:        ['medkit-outline', 'medkit'],
  badge:          ['id-card-outline', 'id-card'],
  more:           ['ellipsis-horizontal', 'ellipsis-horizontal'],
  'chevron-right':['chevron-forward-outline', 'chevron-forward'],
  'chevron-left': ['chevron-back-outline', 'chevron-back'],
  'chevron-down': ['chevron-down-outline', 'chevron-down'],
  'chevron-up':   ['chevron-up-outline', 'chevron-up'],
  'arrow-right':  ['arrow-forward-outline', 'arrow-forward'],
  'arrow-left':   ['arrow-back-outline', 'arrow-back'],
}

// ── MaterialCommunityIcons fallback (for icons not in Ionicons) ──
type MCGlyph = keyof typeof MaterialCommunityIcons.glyphMap
type MCGlyphPair = [MCGlyph, MCGlyph]

const MCI_FALLBACK: Partial<Record<MedStaffIconName, MCGlyphPair>> = {
  server: ['server-outline', 'server'],
}

export default function MedStaffIcon({
  name,
  variant = 'filled',
  size = 24,
  color = '#0B8FAC',
  style,
}: MedStaffIconProps) {
  const idx = variant === 'outline' ? 0 : 1

  // Try Ionicons first
  const ioPair = IONICONS_MAP[name]
  if (ioPair) {
    return <Ionicons name={ioPair[idx]} size={size} color={color} style={style} />
  }

  // Fallback to MaterialCommunityIcons
  const mciPair = MCI_FALLBACK[name]
  if (mciPair) {
    return <MaterialCommunityIcons name={mciPair[idx]} size={size} color={color} style={style} />
  }

  // Ultimate fallback — generic circle
  return <Ionicons name="ellipse" size={size} color={color} style={style} />
}
