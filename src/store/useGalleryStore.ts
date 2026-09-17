import { create } from 'zustand';
import { PicsumImage, AuthorFilterRange } from '../types/gallery';
import { fetchPicsumImages } from '../services/api';
import { getItem, setItem, StorageKeys } from '../services/storage';

interface GalleryState {
  images: PicsumImage[];
  favorites: PicsumImage[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  searchQuery: string;
  authorRange: AuthorFilterRange;

  // Actions
  fetchImages: (page?: number, isRefresh?: boolean) => Promise<void>;
  toggleFavorite: (image: PicsumImage) => Promise<void>;
  isFavorite: (imageId: string) => boolean;
  loadFavorites: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setAuthorRange: (range: AuthorFilterRange) => void;
  getFilteredImages: () => PicsumImage[];
  getFilteredFavorites: () => PicsumImage[];
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  images: [],
  favorites: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  isRefreshing: false,
  error: null,
  searchQuery: '',
  authorRange: 'ALL',

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setAuthorRange: (range: AuthorFilterRange) => set({ authorRange: range }),

  loadFavorites: async () => {
    try {
      const savedFavorites = (await getItem<PicsumImage[]>(StorageKeys.FAVORITES)) || [];
      set({ favorites: savedFavorites });
    } catch (e) {
      console.error('Error loading favorites from storage:', e);
    }
  },

  isFavorite: (imageId: string) => {
    const { favorites } = get();
    return favorites.some((img) => img.id === imageId);
  },

  toggleFavorite: async (image: PicsumImage) => {
    const { favorites } = get();
    const exists = favorites.some((img) => img.id === image.id);
    let updatedFavorites: PicsumImage[];

    if (exists) {
      updatedFavorites = favorites.filter((img) => img.id !== image.id);
    } else {
      updatedFavorites = [...favorites, image];
    }

    set({ favorites: updatedFavorites });
    await setItem(StorageKeys.FAVORITES, updatedFavorites);
  },

  fetchImages: async (targetPage = 1, isRefresh = false) => {
    const { isLoading, isRefreshing, images, page } = get();

    // Prevent duplicate fetch operations
    if (isLoading || isRefreshing) return;

    if (isRefresh) {
      set({ isRefreshing: true, error: null });
    } else {
      set({ isLoading: true, error: null });
    }

    try {
      const newImages = await fetchPicsumImages(targetPage, 20);

      // De-duplicate images based on ID
      const existingIds = new Set(isRefresh ? [] : images.map((img) => img.id));
      const filteredNewImages = newImages.filter((img) => !existingIds.has(img.id));

      set({
        images: isRefresh ? newImages : [...images, ...filteredNewImages],
        page: targetPage,
        hasMore: newImages.length > 0,
        isLoading: false,
        isRefreshing: false,
        error: null,
      });
    } catch (e: any) {
      set({
        isLoading: false,
        isRefreshing: false,
        error: e?.message || 'Failed to fetch images from gallery.',
      });
    }
  },

  getFilteredImages: () => {
    const { images, searchQuery, authorRange } = get();
    return filterImageList(images, searchQuery, authorRange);
  },

  getFilteredFavorites: () => {
    const { favorites, searchQuery } = get();
    return filterImageList(favorites, searchQuery, 'ALL');
  },
}));

// Helper function to apply search query & author range filtering
const filterImageList = (
  list: PicsumImage[],
  query: string,
  range: AuthorFilterRange
): PicsumImage[] => {
  let result = [...list];

  // 1. Filter by Search Query (Case-insensitive author name)
  const trimmedQuery = query.trim().toLowerCase();
  if (trimmedQuery) {
    result = result.filter((img) => img.author.toLowerCase().includes(trimmedQuery));
  }

  // 2. Filter by Author Range (A-M vs N-Z)
  if (range === 'A_M') {
    result = result.filter((img) => {
      const firstChar = img.author.trim().toUpperCase().charAt(0);
      return firstChar >= 'A' && firstChar <= 'M';
    });
  } else if (range === 'N_Z') {
    result = result.filter((img) => {
      const firstChar = img.author.trim().toUpperCase().charAt(0);
      return firstChar >= 'N' && firstChar <= 'Z';
    });
  }

  return result;
};
