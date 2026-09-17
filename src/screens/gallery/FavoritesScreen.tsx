import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types/navigation';
import { PicsumImage } from '../../types/gallery';
import { useGalleryStore } from '../../store/useGalleryStore';
import { useThemeStore } from '../../store/useThemeStore';
import { ImageCard } from '../../components/gallery/ImageCard';
import { SearchBar } from '../../components/gallery/SearchBar';
import { Header } from '../../components/common/Header';
import { Spacing, Typography } from '../../constants/theme';

export const FavoritesScreen: React.FC = () => {
  const { colors } = useThemeStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { favorites } = useGalleryStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Filter favorites by local search query
  const filteredFavorites = favorites.filter((img) =>
    img.author.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleImagePress = (image: PicsumImage) => {
    navigation.navigate('ImageDetail', { image });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="My Favorites"
        subtitle={`${favorites.length} saved photo${favorites.length === 1 ? '' : 's'}`}
      />

      <View style={styles.content}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search favorited photos..."
        />

        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ImageCard image={item} onPress={handleImagePress} />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconBadge, { backgroundColor: colors.surfaceLight }]}>
                <Ionicons name="heart-dislike-outline" size={48} color={colors.textMuted} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                {searchQuery ? 'No matching favorites' : 'No favorite images yet'}
              </Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                {searchQuery
                  ? `No favorited author matches "${searchQuery}".`
                  : 'Tap the heart icon on any image card in Home to add it to your favorites.'}
              </Text>
            </View>
          }
        />
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
  emptyContainer: {
    padding: Spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  emptyIconBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.h3,
    textAlign: 'center',
  },
  emptySub: {
    ...Typography.body2,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
