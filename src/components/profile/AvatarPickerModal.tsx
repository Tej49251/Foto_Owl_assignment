import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PREDEFINED_AVATARS } from '../../constants/avatars';
import { useThemeStore } from '../../store/useThemeStore';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';

interface AvatarPickerModalProps {
  visible: boolean;
  selectedAvatar?: string;
  onSelectAvatar: (avatarUrl: string) => void;
  onClose: () => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  visible,
  selectedAvatar,
  onSelectAvatar,
  onClose,
}) => {
  const { colors } = useThemeStore();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.overlay, { backgroundColor: colors.modalOverlay }]}>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Choose Profile Avatar</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={PREDEFINED_AVATARS}
            numColumns={3}
            keyExtractor={(item, index) => `${item}-${index}`}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isSelected = item === selectedAvatar;
              return (
                <TouchableOpacity
                  style={[
                    styles.avatarCard,
                    {
                      backgroundColor: isSelected ? colors.primaryLight : colors.surfaceLight,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => {
                    onSelectAvatar(item);
                    onClose();
                  }}
                >
                  <Image source={{ uri: item }} style={styles.avatarImage} />
                  {isSelected && (
                    <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
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
    maxHeight: '65%',
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
  listContent: {
    paddingVertical: Spacing.md,
  },
  avatarCard: {
    flex: 1,
    aspectRatio: 1,
    margin: Spacing.xs,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: Spacing.xs,
  },
  avatarImage: {
    width: '80%',
    height: '80%',
    borderRadius: BorderRadius.md,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
