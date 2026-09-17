import { create } from 'zustand';
import { UserAccount, UserProfile, RegisterFormData, LoginFormData } from '../types/auth';
import { getItem, setItem, removeItem, StorageKeys } from '../services/storage';
import { DEFAULT_AVATAR } from '../constants/avatars';

interface AuthState {
  users: UserAccount[];
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (formData: RegisterFormData) => Promise<{ success: boolean; error?: string }>;
  login: (formData: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  loadSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  users: [],
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  clearError: () => set({ error: null }),

  loadSession: async () => {
    set({ isLoading: true });
    try {
      const savedUsers = (await getItem<UserAccount[]>(StorageKeys.USERS)) || [];
      const savedCurrentUser = await getItem<UserProfile>(StorageKeys.CURRENT_USER);

      set({
        users: savedUsers,
        currentUser: savedCurrentUser,
        isAuthenticated: !!savedCurrentUser,
        isLoading: false,
      });
    } catch (e) {
      console.error('Failed to load auth session:', e);
      set({ isLoading: false });
    }
  },

  register: async (formData: RegisterFormData) => {
    set({ isLoading: true, error: null });
    try {
      const savedUsers = (await getItem<UserAccount[]>(StorageKeys.USERS)) || [];
      
      // Check if email already registered
      const existingUser = savedUsers.find(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase().trim()
      );
      if (existingUser) {
        set({ isLoading: false, error: 'User with this email already exists.' });
        return { success: false, error: 'User with this email already exists.' };
      }

      const newUser: UserAccount = {
        id: Date.now().toString(),
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        gender: formData.gender as any,
        mobileNumber: formData.mobileNumber.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        passwordHash: formData.password, // Simulated hash
        avatarUrl: DEFAULT_AVATAR,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...savedUsers, newUser];
      await setItem(StorageKeys.USERS, updatedUsers);

      set({
        users: updatedUsers,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (e: any) {
      set({ isLoading: false, error: e?.message || 'Registration failed.' });
      return { success: false, error: 'Registration failed.' };
    }
  },

  login: async (formData: LoginFormData) => {
    set({ isLoading: true, error: null });
    try {
      const savedUsers = (await getItem<UserAccount[]>(StorageKeys.USERS)) || [];
      
      const user = savedUsers.find(
        (u) =>
          u.email.toLowerCase() === formData.email.toLowerCase().trim() &&
          u.passwordHash === formData.password
      );

      if (!user) {
        set({ isLoading: false, error: 'Invalid email address or password.' });
        return { success: false, error: 'Invalid email address or password.' };
      }

      // Extract user profile excluding password
      const { passwordHash, ...userProfile } = user;
      await setItem(StorageKeys.CURRENT_USER, userProfile);

      set({
        currentUser: userProfile,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true };
    } catch (e: any) {
      set({ isLoading: false, error: e?.message || 'Login failed.' });
      return { success: false, error: 'Login failed.' };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await removeItem(StorageKeys.CURRENT_USER);
      set({
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (e) {
      console.error('Logout error:', e);
      set({ isLoading: false });
    }
  },

  updateProfile: async (updatedData: Partial<UserProfile>) => {
    const { currentUser, users } = get();
    if (!currentUser) return { success: false, error: 'No active session.' };

    set({ isLoading: true });
    try {
      const newProfile: UserProfile = {
        ...currentUser,
        ...updatedData,
      };

      // Update in users array as well
      const updatedUsers = users.map((u) =>
        u.id === currentUser.id
          ? {
              ...u,
              ...updatedData,
            }
          : u
      );

      await setItem(StorageKeys.CURRENT_USER, newProfile);
      await setItem(StorageKeys.USERS, updatedUsers);

      set({
        currentUser: newProfile,
        users: updatedUsers,
        isLoading: false,
      });

      return { success: true };
    } catch (e: any) {
      set({ isLoading: false });
      return { success: false, error: e?.message || 'Failed to update profile.' };
    }
  },

  updateAvatar: async (avatarUrl: string) => {
    const { updateProfile } = get();
    await updateProfile({ avatarUrl });
  },
}));
