import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { PicsumImage } from '../../types/gallery';
import { useGallery } from '../../hooks/useGallery';
import { useThemeStore } from '../../store/useThemeStore';
import { ImageCard } from '../../components/gallery/ImageCard';
import { SearchBar } from '../../components/gallery/SearchBar';
import { FilterBar } from '../../components/gallery/FilterBar';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { Spacing, Typography } from '../../constants/theme';

export const HomeScreen: React.FC = () => {
  const { colors } = useThemeStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const {
    filteredImages,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    authorRange,
    handleRefresh,
    handleLoadMore,
    setSearchQuery,
    setAuthorRange,
  } = useGallery();

  const handleImagePress = (image: PicsumImage) => {
    navigation.navigate('ImageDetail', { image });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Image Gallery" subtitle="Browse & search Picsum photos" />

      <View style={styles.content}>
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by author name..."
        />

        {/* Filter Bar */}
        <FilterBar selectedRange={authorRange} onSelectRange={setAuthorRange} />

        {/* API Failure Scenario */}
        {error && filteredImages.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={[styles.errorTitle, { color: colors.error }]}>Failed to load images</Text>
            <Text style={[styles.errorSub, { color: colors.textSecondary }]}>{error}</Text>
            <Button title="Retry Fetch" onPress={handleRefresh} style={{ marginTop: Spacing.md }} />
          </View>
        ) : (
          <FlatList
            data={filteredImages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ImageCard image={item} onPress={handleImagePress} />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            }
            ListFooterComponent={
              isLoading && !isRefreshing ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={[styles.loaderText, { color: colors.textMuted }]}>
                    Loading more images...
                  </Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              !isLoading ? (
                <View style={styles.centerContainer}>
                  <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                    No images found
                  </Text>
                  <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                    Try adjusting your search query or filter selection.
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  listContainer: {
    paddingBottom: Spacing.xl,
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  loaderText: {
    ...Typography.caption,
    marginTop: Spacing.xs,
  },
  centerContainer: {
    padding: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    ...Typography.h3,
  },
  errorSub: {
    ...Typography.body2,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  emptyTitle: {
    ...Typography.h3,
  },
  emptySub: {
    ...Typography.body2,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
