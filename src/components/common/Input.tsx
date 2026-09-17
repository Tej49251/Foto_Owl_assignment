import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  iconName,
  isPassword = false,
  value,
  onChangeText,
  ...props
}) => {
  const { colors } = useThemeStore();
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.borderFocus;
    return colors.border;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label} <Text style={{ color: colors.error }}>*</Text>
      </Text>
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.inputBg,
            borderColor: getBorderColor(),
          },
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={isFocused ? colors.primary : colors.textMuted}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            {
              color: colors.textPrimary,
              paddingLeft: iconName ? 0 : Spacing.md,
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIcon}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
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
  inputWrapper: {
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  leftIcon: {
    marginRight: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  rightIcon: {
    padding: Spacing.xs,
  },
  input: {
    flex: 1,
    height: '100%',
    ...Typography.body1,
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
