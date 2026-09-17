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
import { LoginFormData, ValidationErrors } from '../../types/auth';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { validateLoginForm } from '../../utils/validation';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Header } from '../../components/common/Header';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { colors } = useThemeStore();
  const { login, isLoading } = useAuthStore();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const updateField = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleLogin = async () => {
    const validationErrors = validateLoginForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await login(formData);
    if (!result.success) {
      Alert.alert('Authentication Error', result.error || 'Invalid credentials.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Welcome Back" subtitle="Log in to explore image gallery" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Logo Hero Card */}
          <View style={styles.heroContainer}>
            <View style={[styles.logoBadge, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="images" size={42} color={colors.primary} />
            </View>
            <Text style={[styles.heroTitle, { color: colors.textPrimary }]}>Foto Owl Gallery</Text>
            <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
              Your centralized React Native showcase app
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Input
              label="Email Address"
              placeholder="Enter your registered email"
              value={formData.email}
              onChangeText={(val) => updateField('email', val)}
              iconName="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(val) => updateField('password', val)}
              iconName="lock-closed-outline"
              isPassword
              error={errors.password}
            />

            <Button
              title="Log In"
              onPress={handleLogin}
              loading={isLoading}
              size="large"
              style={{ marginTop: Spacing.sm }}
            />
          </View>

          {/* Register Prompt */}
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don't have an account yet?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.registerLink, { color: colors.primary }]}>Register Now</Text>
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
    justifyContent: 'center',
    flexGrow: 1,
  },
  heroContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    ...Typography.h1,
    fontSize: 26,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...Typography.body2,
    textAlign: 'center',
    marginTop: 4,
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
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    ...Typography.body1,
  },
  registerLink: {
    ...Typography.body1,
    fontWeight: '700',
  },
});
