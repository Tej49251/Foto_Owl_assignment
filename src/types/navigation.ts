import { PicsumImage } from './gallery';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  AuthStack: undefined;
  MainApp: undefined;
  ImageDetail: { image: PicsumImage };
};
