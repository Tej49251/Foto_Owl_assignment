import { useEffect, useCallback } from 'react';
import { useGalleryStore } from '../store/useGalleryStore';
import { useDebounce } from './useDebounce';

export const useGallery = () => {
  const {
    images,
    favorites,
    page,
    hasMore,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    authorRange,
    fetchImages,
    toggleFavorite,
    isFavorite,
    loadFavorites,
    setSearchQuery,
    setAuthorRange,
    getFilteredImages,
    getFilteredFavorites,
  } = useGalleryStore();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    loadFavorites();
    if (images.length === 0) {
      fetchImages(1, false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchImages(1, true);
  }, [fetchImages]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isRefreshing && hasMore) {
      fetchImages(page + 1, false);
    }
  }, [isLoading, isRefreshing, hasMore, page, fetchImages]);

  return {
    images,
    filteredImages: getFilteredImages(),
    favorites,
    filteredFavorites: getFilteredFavorites(),
    page,
    isLoading,
    isRefreshing,
    error,
    searchQuery,
    debouncedSearchQuery,
    authorRange,
    handleRefresh,
    handleLoadMore,
    toggleFavorite,
    isFavorite,
    setSearchQuery,
    setAuthorRange,
  };
};
