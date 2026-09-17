import axios from 'axios';
import { PicsumImage } from '../types/gallery';

const BASE_URL = 'https://picsum.photos/v2';

export const fetchPicsumImages = async (page: number = 1, limit: number = 20): Promise<PicsumImage[]> => {
  try {
    const response = await axios.get<PicsumImage[]>(`${BASE_URL}/list`, {
      params: {
        page,
        limit,
      },
      timeout: 10000,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching images from Picsum API:', error?.message || error);
    throw new Error(error?.response?.data?.message || 'Failed to fetch images. Please check your internet connection.');
  }
};
