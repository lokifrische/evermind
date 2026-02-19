/**
 * Avatar Component
 * 
 * Accessible avatar with:
 * - Size variants
 * - Fallback initials
 * - Online/offline indicator
 * - High contrast mode support
 */

import { View, Image, StyleSheet } from 'react-native';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { colors, spacing } from '../../constants/theme';
import { Text } from './Text';

export interface AvatarProps {
  source?: string | null;
  name: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  showOnline?: boolean;
  isOnline?: boolean;
  showBadge?: boolean;
  badgeContent?: string | number;
}

const sizeConfig = {
  small: { avatar: 40, initials: 14, badge: 14, online: 10 },
  medium: { avatar: 60, initials: 20, badge: 18, online: 14 },
  large: { avatar: 80, initials: 28, badge: 22, online: 18 },
  xlarge: { avatar: 120, initials: 40, badge: 28, online: 24 },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getColorFromName(name: string): string {
  const avatarColors = [
    colors.memories.main,
    colors.family.main,
    colors.games.main,
    colors.assistant.main,
    colors.primary,
    colors.secondary,
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

export function Avatar({
  source,
  name,
  size = 'medium',
  showOnline = false,
  isOnline = false,
  showBadge = false,
  badgeContent,
}: AvatarProps) {
  const { themeColors } = useAccessibility();
  const sizeValues = sizeConfig[size];
  const initials = getInitials(name);
  const fallbackColor = getColorFromName(name);

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeValues.avatar,
          height: sizeValues.avatar,
        },
      ]}
      accessible
      accessibilityLabel={`${name}'s avatar${showOnline ? (isOnline ? ', online' : ', offline') : ''}`}
    >
      {source ? (
        <Image
          source={{ uri: source }}
          style={[
            styles.image,
            {
              width: sizeValues.avatar,
              height: sizeValues.avatar,
              borderRadius: sizeValues.avatar / 2,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: sizeValues.avatar,
              height: sizeValues.avatar,
              borderRadius: sizeValues.avatar / 2,
              backgroundColor: fallbackColor,
            },
          ]}
        >
          <Text
            style={{
              fontSize: sizeValues.initials,
              color: colors.white,
              fontWeight: '600',
            }}
          >
            {initials}
          </Text>
        </View>
      )}

      {showOnline && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: sizeValues.online,
              height: sizeValues.online,
              borderRadius: sizeValues.online / 2,
              backgroundColor: isOnline ? colors.success : colors.gray[400],
              borderWidth: sizeValues.online / 4,
              borderColor: themeColors.background,
            },
          ]}
        />
      )}

      {showBadge && badgeContent !== undefined && (
        <View
          style={[
            styles.badge,
            {
              minWidth: sizeValues.badge,
              height: sizeValues.badge,
              borderRadius: sizeValues.badge / 2,
              backgroundColor: colors.danger,
              borderWidth: 2,
              borderColor: themeColors.background,
            },
          ]}
        >
          <Text
            style={{
              fontSize: sizeValues.badge * 0.6,
              color: colors.white,
              fontWeight: '700',
            }}
          >
            {typeof badgeContent === 'number' && badgeContent > 99
              ? '99+'
              : badgeContent}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
});

export default Avatar;
