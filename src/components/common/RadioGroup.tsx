import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gender } from '../../types/auth';
import { useThemeStore } from '../../store/useThemeStore';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';

interface RadioGroupProps {
  label: string;
  options: Gender[];
  selectedValue: Gender | '';
  onSelect: (value: Gender) => void;
  error?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  error,
}) => {
  const { colors } = useThemeStore();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label} <Text style={{ color: colors.error }}>*</Text>
      </Text>
      <View style={styles.optionsRow}>
        {options.map((option) => {
          const isSelected = option === selectedValue;
          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionCard,
                {
                  backgroundColor: isSelected ? colors.primaryLight : colors.inputBg,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
              onPress={() => onSelect(option)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.radioCircle,
                  {
                    borderColor: isSelected ? colors.primary : colors.textMuted,
                  },
                ]}
              >
                {isSelected && (
                  <View style={[styles.radioDot, { backgroundColor: colors.primary }]} />
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected ? colors.primary : colors.textPrimary,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {!!error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.caption,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  optionCard: {
    flex: 1,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  optionText: {
    ...Typography.body2,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  errorText: {
    ...Typography.caption,
    marginLeft: 4,
  },
});
