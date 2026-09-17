import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../types/navigation';
import { useGalleryStore } from '../../store/useGalleryStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useDownloadImage } from '../../hooks/useDownloadImage';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { BorderRadius, Spacing, Typography } from '../../constants/theme';
import { formatAuthorName } from '../../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'ImageDetail'>;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const ImageDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { image } = route.params;
  const { colors } = useThemeStore();
  const { isFavorite, toggleFavorite } = useGalleryStore();
  const { downloadImage, isDownloading } = useDownloadImage();

  const [fullScreenVisible, setFullScreenVisible] = useState(false);
  const favorited = isFavorite(image.id);

  // Full-resolution URL
  const highResUrl = `https://picsum.photos/id/${image.id}/1200/800`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this gorgeous photo by ${image.author} on Foto Owl: ${image.url}`,
        url: image.url,
        title: `Photo by ${image.author}`,
      });
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  const handleDownload = () => {
    downloadImage(highResUrl, image.id);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Image Details"
        subtitle={`Photo #${image.id}`}
        showBack
        onBackPress={() => navigation.goBack()}
        rightElement={
          <TouchableOpacity
            style={[styles.headerIconBtn, { backgroundColor: colors.surfaceLight }]}
            onPress={() => toggleFavorite(image)}
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={20}
              color={favorited ? colors.heartActive : colors.textPrimary}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Image Banner with Full Screen Tap Hint */}
        <TouchableOpacity
          style={[styles.imageContainer, { borderColor: colors.border }]}
          onPress={() => setFullScreenVisible(true)}
          activeOpacity={0.9}
        >
          <Image source={{ uri: highResUrl }} style={styles.detailImage} resizeMode="cover" />
          <View style={styles.expandBadge}>
            <Ionicons name="expand-outline" size={16} color="#FFFFFF" />
            <Text style={styles.expandText}>Tap for Full Screen</Text>
          </View>
        </TouchableOpacity>

        {/* Image Metadata Card */}
        <Card style={styles.metaCard}>
          <Text style={[styles.authorName, { color: colors.textPrimary }]}>
            {formatAuthorName(image.author)}
          </Text>
          <Text style={[styles.idText, { color: colors.textMuted }]}>Image ID: {image.id}</Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="resize-outline" size={18} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Resolution</Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {image.width} × {image.height}
              </Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="camera-outline" size={18} color={colors.primary} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Provider</Text>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>Picsum Photos</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="heart" size={18} color={colors.heartActive} />
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Status</Text>
              <Text style={[styles.statValue, { color: favorited ? colors.heartActive : colors.textPrimary }]}>
                {favorited ? 'Favorited' : 'Standard'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsRow}>
          <Button
            title="Download Image"
            onPress={handleDownload}
            loading={isDownloading}
            icon={<Ionicons name="download-outline" size={20} color="#FFFFFF" />}
            style={styles.actionBtn}
          />
          <Button
            title="Share Link"
            onPress={handleShare}
            variant="secondary"
            icon={<Ionicons name="share-social-outline" size={20} color={colors.textPrimary} />}
            style={styles.actionBtn}
          />
        </View>
      </ScrollView>

      {/* Full-Screen Image Viewer Modal */}
      <Modal visible={fullScreenVisible} transparent animationType="fade">
        <View style={styles.fullScreenOverlay}>
          <SafeAreaView style={styles.fullScreenHeader}>
            <Text style={styles.fullScreenTitle}>Full Screen View - #{image.id}</Text>
            <TouchableOpacity
              style={styles.fullScreenCloseBtn}
              onPress={() => setFullScreenVisible(false)}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </SafeAreaView>

          <View style={styles.fullScreenImageWrapper}>
            <Image
              source={{ uri: highResUrl }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>

          <SafeAreaView style={styles.fullScreenFooter}>
            <Text style={styles.fullScreenAuthor}>Photo by {image.author}</Text>
            <Button
              title="Download to Gallery"
              onPress={handleDownload}
              loading={isDownloading}
              icon={<Ionicons name="download-outline" size={20} color="#FFFFFF" />}
              style={{ minWidth: 200 }}
            />
          </SafeAreaView>
        </View>
      </Modal>
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
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.xs,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: Spacing.md,
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  expandBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
  },
  expandText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  metaCard: {
    marginBottom: Spacing.md,
  },
  authorName: {
    ...Typography.h2,
  },
  idText: {
    ...Typography.body2,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    ...Typography.caption,
    marginTop: 4,
  },
  statValue: {
    ...Typography.body2,
    fontWeight: '700',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  actionBtn: {
    flex: 1,
  },
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  fullScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  fullScreenTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fullScreenCloseBtn: {
    padding: Spacing.xs,
  },
  fullScreenImageWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: SCREEN_WIDTH,
    height: '100%',
  },
  fullScreenFooter: {
    padding: Spacing.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  fullScreenAuthor: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
});
