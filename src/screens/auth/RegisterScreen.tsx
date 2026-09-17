import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { RegisterFormData, Gender, ValidationErrors } from '../../types/auth';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { validateRegisterForm } from '../../utils/validation';
import { Input } from '../../components/common/Input';
import { RadioGroup } from '../../components/common/RadioGroup';
import { SelectDropdown } from '../../components/common/SelectDropdown';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import { CITIES_LIST } from '../../constants/cities';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useThemeStore();
  const { register, isLoading } = useAuthStore();

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    gender: '',
    mobileNumber: '',
    address: '',
    city: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const updateField = (field: keyof RegisterFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRegister = async () => {
    const validationErrors = validateRegisterForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await register(formData);
    if (result.success) {
      Alert.alert(
        'Registration Successful!',
        'Your account has been created. Please log in with your credentials.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } else {
      Alert.alert('Registration Failed', result.error || 'Could not complete registration.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Create Account" subtitle="Join Foto Owl Gallery Platform" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Personal Info</Text>

            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              value={formData.fullName}
              onChangeText={(val) => updateField('fullName', val)}
              iconName="person-outline"
              error={errors.fullName}
            />

            <Input
              label="Email Address"
              placeholder="e.g. john@example.com"
              value={formData.email}
              onChangeText={(val) => updateField('email', val)}
              iconName="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <RadioGroup
              label="Gender"
              options={['Male', 'Female', 'Other']}
              selectedValue={formData.gender}
              onSelect={(val) => updateField('gender', val)}
              error={errors.gender}
            />

            <Input
              label="Mobile Number"
              placeholder="10-digit mobile number"
              value={formData.mobileNumber}
              onChangeText={(val) => updateField('mobileNumber', val)}
              iconName="call-outline"
              keyboardType="numeric"
              maxLength={10}
              error={errors.mobileNumber}
            />

            <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: Spacing.sm }]}>
              Location Details
            </Text>

            <Input
              label="Address"
              placeholder="Street address, apartment, etc."
              value={formData.address}
              onChangeText={(val) => updateField('address', val)}
              iconName="home-outline"
              multiline
              numberOfLines={2}
              error={errors.address}
            />

            <SelectDropdown
              label="City"
              options={CITIES_LIST}
              selectedOption={formData.city}
              onSelect={(val) => updateField('city', val)}
              error={errors.city}
            />

            <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginTop: Spacing.sm }]}>
              Security
            </Text>

            <Input
              label="Password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChangeText={(val) => updateField('password', val)}
              iconName="lock-closed-outline"
              isPassword
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChangeText={(val) => updateField('confirmPassword', val)}
              iconName="lock-closed-outline"
              isPassword
              error={errors.confirmPassword}
            />

            <Button
              title="Register Account"
              onPress={handleRegister}
              loading={isLoading}
              size="large"
              style={{ marginTop: Spacing.md }}
            />
          </View>

          {/* Already have account redirect */}
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, { color: colors.primary }]}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    ...Typography.h3,
    fontSize: 16,
    marginBottom: Spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  footerText: {
    ...Typography.body1,
  },
  loginLink: {
    ...Typography.body1,
    fontWeight: '700',
  },
});
