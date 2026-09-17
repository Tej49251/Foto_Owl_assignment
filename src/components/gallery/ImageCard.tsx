import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PicsumImage } from '../../types/gallery';
import { useThemeStore } from '../../store/useThemeStore';
import { useGalleryStore } from '../../store/useGalleryStore';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';
import { formatAuthorName } from '../../utils/formatters';

interface ImageCardProps {
  image: PicsumImage;
  onPress: (image: PicsumImage) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onPress }) => {
  const { colors } = useThemeStore();
  const { isFavorite, toggleFavorite } = useGalleryStore();
  const favorited = isFavorite(image.id);

  // Generate thumbnail URL for optimal memory & loading performance
  const thumbnailUrl = `https://picsum.photos/id/${image.id}/500/350`;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBg,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
      onPress={() => onPress(image)}
      activeOpacity={0.85}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Favorite Heart Button */}
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            {
              backgroundColor: favorited ? '#FFFFFF' : 'rgba(15, 23, 42, 0.5)',
            },
          ]}
          onPress={() => toggleFavorite(image)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={20}
            color={favorited ? colors.heartActive : '#FFFFFF'}
          />
        </TouchableOpacity>

        {/* Image ID Badge */}
        <View style={styles.idBadge}>
          <Text style={styles.idText}>#{image.id}</Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={[styles.authorName, { color: colors.textPrimary }]} numberOfLines={1}>
          {formatAuthorName(image.author)}
        </Text>
        <Text style={[styles.dimensionsText, { color: colors.textMuted }]}>
          {image.width} × {image.height} px
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrapper: {
    width: '100%',
    height: 200,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  idBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  idText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  infoContainer: {
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorName: {
    ...Typography.h3,
    fontSize: 16,
    flex: 1,
    marginRight: Spacing.xs,
  },
  dimensionsText: {
    ...Typography.caption,
  },
});
