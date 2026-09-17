import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { AuthorFilterRange } from '../../types/gallery';
import { Badge } from '../common/Badge';
import { Spacing } from '../../constants/theme';

interface FilterBarProps {
  selectedRange: AuthorFilterRange;
  onSelectRange: (range: AuthorFilterRange) => void;
  totalResults?: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ selectedRange, onSelectRange }) => {
  const filterOptions: { label: string; range: AuthorFilterRange }[] = [
    { label: 'All Images', range: 'ALL' },
    { label: 'Author A - M', range: 'A_M' },
    { label: 'Author N - Z', range: 'N_Z' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filterOptions.map((opt) => (
          <Badge
            key={opt.range}
            label={opt.label}
            active={selectedRange === opt.range}
            onPress={() => onSelectRange(opt.range)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  scrollContent: {
    paddingVertical: 2,
  },
});
