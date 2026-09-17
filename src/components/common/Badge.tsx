import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../../store/useThemeStore';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';

interface BadgeProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
  count?: number;
}

export const Badge: React.FC<BadgeProps> = ({ label, active = false, onPress, count }) => {
  const { colors } = useThemeStore();

  return (
    <TouchableOpacity
      style={[
        styles.badge,
        {
          backgroundColor: active ? colors.primary : colors.surfaceLight,
          borderColor: active ? colors.primary : colors.border,
        },
      ]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.label,
          {
            color: active ? '#FFFFFF' : colors.textSecondary,
            fontWeight: active ? '700' : '500',
          },
        ]}
      >
        {label}
        {count !== undefined && ` (${count})`}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography.body2,
  },
});
