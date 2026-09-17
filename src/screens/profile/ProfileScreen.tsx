import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { EditProfileModal } from '../../components/profile/EditProfileModal';
import { AvatarPickerModal } from '../../components/profile/AvatarPickerModal';
import { DEFAULT_AVATAR } from '../../constants/avatars';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';

export const ProfileScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useThemeStore();
  const { currentUser, logout, updateAvatar } = useAuthStore();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  if (!currentUser) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="My Profile" subtitle="Account Settings & Information" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Hero Avatar Card */}
        <Card style={styles.avatarCard}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setAvatarModalVisible(true)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: currentUser.avatarUrl || DEFAULT_AVATAR }}
              style={styles.avatarImage}
            />
            <View style={[styles.cameraBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <Text style={[styles.userName, { color: colors.textPrimary }]}>
            {currentUser.fullName}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {currentUser.email}
          </Text>

          <Button
            title="Edit Profile"
            onPress={() => setEditModalVisible(true)}
            variant="outline"
            size="small"
            icon={<Ionicons name="create-outline" size={16} color={colors.primary} />}
            style={styles.editBtn}
          />
        </Card>

        {/* Detailed User Info Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Personal Details
          </Text>
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Mobile Number</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {currentUser.mobileNumber}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Gender</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {currentUser.gender}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>City</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {currentUser.city}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <Ionicons name="home-outline" size={20} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Address</Text>
              <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
                {currentUser.address}
              </Text>
            </View>
          </View>
        </Card>

        {/* Preferences Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>App Preferences</Text>
        </View>

        <Card style={styles.infoCard}>
          <TouchableOpacity style={styles.settingRow} onPress={toggleTheme} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Ionicons
                name={isDark ? 'moon' : 'sunny-outline'}
                size={22}
                color={isDark ? '#FBBF24' : colors.primary}
              />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>
                Dark Mode ({isDark ? 'Enabled' : 'Disabled'})
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </Card>

        {/* Logout Button */}
        <Button
          title="Log Out of Account"
          onPress={handleLogout}
          variant="danger"
          size="large"
          icon={<Ionicons name="log-out-outline" size={20} color="#FFFFFF" />}
          style={{ marginTop: Spacing.lg, marginBottom: Spacing.xxl }}
        />
      </ScrollView>

      {/* Modals */}
      {currentUser && (
        <EditProfileModal
          visible={editModalVisible}
          user={currentUser}
          onClose={() => setEditModalVisible(false)}
        />
      )}

      <AvatarPickerModal
        visible={avatarModalVisible}
        selectedAvatar={currentUser.avatarUrl}
        onSelectAvatar={(avatarUrl) => updateAvatar(avatarUrl)}
        onClose={() => setAvatarModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  avatarCard: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E2E8F0',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    ...Typography.h2,
    textAlign: 'center',
  },
  userEmail: {
    ...Typography.body2,
    textAlign: 'center',
    marginTop: 2,
  },
  editBtn: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    marginBottom: Spacing.xs,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    ...Typography.h3,
    fontSize: 16,
  },
  infoCard: {
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  infoIcon: {
    marginRight: Spacing.md,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    ...Typography.caption,
  },
  infoValue: {
    ...Typography.body1,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    ...Typography.body1,
    marginLeft: Spacing.sm,
    fontWeight: '600',
  },
});
