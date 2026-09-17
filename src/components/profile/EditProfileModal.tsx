import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../../types/auth';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Input } from '../common/Input';
import { SelectDropdown } from '../common/SelectDropdown';
import { Button } from '../common/Button';
import { CITIES_LIST } from '../../constants/cities';
import { isValidMobile } from '../../utils/validation';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';

interface EditProfileModalProps {
  visible: boolean;
  user: UserProfile;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, user, onClose }) => {
  const { colors } = useThemeStore();
  const { updateProfile, isLoading } = useAuthStore();

  const [fullName, setFullName] = useState(user.fullName);
  const [mobileNumber, setMobileNumber] = useState(user.mobileNumber);
  const [address, setAddress] = useState(user.address);
  const [city, setCity] = useState(user.city);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setMobileNumber(user.mobileNumber);
      setAddress(user.address);
      setCity(user.city);
      setErrors({});
    }
  }, [user, visible]);

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (!fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!mobileNumber.trim()) {
      errs.mobileNumber = 'Mobile Number is required.';
    } else if (!isValidMobile(mobileNumber)) {
      errs.mobileNumber = 'Mobile Number must be exactly 10 digits.';
    }

    if (!address.trim()) errs.address = 'Address is required.';
    if (!city.trim()) errs.city = 'City selection is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const res = await updateProfile({
      fullName: fullName.trim(),
      mobileNumber: mobileNumber.trim(),
      address: address.trim(),
      city: city.trim(),
    });

    if (res.success) {
      Alert.alert('Success', 'Profile updated successfully!');
      onClose();
    } else {
      Alert.alert('Error', res.error || 'Failed to update profile.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.overlay, { backgroundColor: colors.modalOverlay }]}>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Edit Profile Information</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            <Input
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              iconName="person-outline"
              error={errors.fullName}
            />

            <Input
              label="Mobile Number"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              iconName="call-outline"
              keyboardType="phone-pad"
              maxLength={10}
              error={errors.mobileNumber}
            />

            <Input
              label="Address"
              value={address}
              onChangeText={setAddress}
              iconName="home-outline"
              multiline
              numberOfLines={3}
              error={errors.address}
            />

            <SelectDropdown
              label="City"
              options={CITIES_LIST}
              selectedOption={city}
              onSelect={setCity}
              error={errors.city}
            />

            <View style={styles.buttonRow}>
              <Button
                title="Cancel"
                onPress={onClose}
                variant="outline"
                style={styles.cancelBtn}
              />
              <Button
                title="Save Changes"
                onPress={handleSave}
                loading={isLoading}
                style={styles.saveBtn}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    maxHeight: '85%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  title: {
    ...Typography.h3,
  },
  formScroll: {
    paddingVertical: Spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1,
  },
});
