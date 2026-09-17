import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../store/useThemeStore';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';

interface SelectDropdownProps {
  label: string;
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  placeholder?: string;
  error?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  label,
  options,
  selectedOption,
  onSelect,
  placeholder = 'Select an option',
  error,
}) => {
  const { colors } = useThemeStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const handleSelect = (item: string) => {
    onSelect(item);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label} <Text style={{ color: colors.error }}>*</Text>
      </Text>

      <TouchableOpacity
        style={[
          styles.selector,
          {
            backgroundColor: colors.inputBg,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="location-outline" size={20} color={colors.textMuted} style={styles.icon} />
        <Text
          style={[
            styles.selectedText,
            { color: selectedOption ? colors.textPrimary : colors.textMuted },
          ]}
        >
          {selectedOption || placeholder}
        </Text>
        <Ionicons name="chevron-down-outline" size={20} color={colors.textMuted} />
      </TouchableOpacity>

      {!!error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Select {label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Search Input inside modal */}
            <View style={[styles.searchWrapper, { backgroundColor: colors.surfaceLight }]}>
              <Ionicons name="search-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Search..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {!!searchQuery && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const isSelected = item === selectedOption;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      {
                        backgroundColor: isSelected ? colors.primaryLight : 'transparent',
                        borderBottomColor: colors.border,
                      },
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        {
                          color: isSelected ? colors.primary : colors.textPrimary,
                          fontWeight: isSelected ? '700' : '400',
                        },
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    No options match "{searchQuery}"
                  </Text>
                </View>
              }
            />
          </SafeAreaView>
        </View>
      </Modal>
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
  selector: {
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
  },
  icon: {
    marginRight: Spacing.xs,
  },
  selectedText: {
    flex: 1,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '75%',
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    ...Typography.h3,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    height: 40,
    marginVertical: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.xs,
    ...Typography.body2,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 0.5,
  },
  optionText: {
    ...Typography.body1,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body2,
  },
});
