import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  USERS: '@foto_owl_users',
  CURRENT_USER: '@foto_owl_current_user',
  FAVORITES: '@foto_owl_favorites',
  THEME_MODE: '@foto_owl_theme',
};

export const setItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(`Error writing key ${key} to storage`, e);
  }
};

export const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(`Error reading key ${key} from storage`, e);
    return null;
  }
};

export const removeItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(`Error removing key ${key} from storage`, e);
  }
};
