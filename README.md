# Foto Owl React Native Mobile Application

A cross-platform React Native & TypeScript application simulating a User Authentication flow, Profile Management system, and Image Gallery Dashboard powered by the Picsum Photos API.

Built following industry-standard mobile architecture, centralized state management with **Zustand**, persistent local storage with **AsyncStorage**, dark mode support, debounced search, filtering, full-screen image viewer with device gallery download, and automated unit testing.

---

## Table of Contents
- [Features](#features)
- [Technology Stack & Libraries](#technology-stack--libraries)
- [Folder Structure](#folder-structure)
- [Assumptions Made](#assumptions-made)
- [Project Setup & Running Instructions](#project-setup--running-instructions)
- [Unit Testing](#unit-testing)
- [APK Generation Guide (Without Android Studio / Java)](#apk-generation-guide-without-android-studio--java)

---

## Features

### 1. Authentication & Session Persistence
- **User Registration**:
  - Required fields: Full Name, Email Address, Gender (Radio buttons), Mobile Number (10 digits), Address, City (Dropdown modal picker), Password (min 6 chars), Confirm Password.
  - Strict validation on all 8 fields with real-time error messages.
  - User credentials saved persistently in `@react-native-async-storage/async-storage`.
- **User Login**:
  - Validates user input against registered accounts stored in local persistent storage.
- **Session Persistence**:
  - Maintains user authentication state across app restarts and reloads.

### 2. Image Gallery Dashboard (Picsum API)
- Fetches images from `https://picsum.photos/v2/list`.
- **FlatList Rendering**: Optimally rendered image cards showing thumbnail, author name, image ID, and heart favorite toggle.
- **Infinite Scroll Pagination**: Automatically loads subsequent pages as the user scrolls (`onEndReached`).
- **Pull-to-Refresh**: Refresh gallery with pull gesture without triggering duplicate API requests.
- **Debounced Search**: 300ms debounced search filtering images by Author Name in real-time.
- **Category Filter Chips**: Integrated filter system (`All Images`, `Author A-M`, `Author N-Z`) working seamlessly in unison with search and pagination.
- **Error Handling**: Graceful API error alerts with interactive Retry buttons.

### 3. Dedicated Favorites Screen
- Displays all favorited photos saved persistently in `AsyncStorage`.
- Dedicated search bar to filter favorited photos by author.
- Instant unfavorite toggle.
- Custom empty state UI.

### 4. Image Details & Full Screen Viewer
- Modal/Screen with high-resolution view, author name, image ID, dimensions, and photo metadata.
- **Full Screen Image Viewer**: Pinch/tap full-screen image viewer modal.
- **Image Download**: Downloads high-res image directly to user's device photo gallery (on Mobile via `expo-file-system` and `expo-media-library`) or browser downloads folder (on Web).
- **Native Link Sharing**: Native share dialog (`Share.share`) to share photo links.

### 5. Profile Management
- Displays logged-in user profile details (Full Name, Email, Mobile Number, Gender, Address, City, Avatar).
- **Edit Profile**: Inline modal allowing modification of profile details with immediate app-wide reflection and storage update.
- **Predefined Avatar Picker**: Selection grid of avatar illustrations.
- **Dark Mode Support**: Seamless Light Mode and Dark Mode theme toggle.
- **Logout Action**: Clears user session state and redirects to Login.

---

## Technology Stack & Libraries

| Technology / Library | Purpose |
| :--- | :--- |
| **React Native (Expo SDK 57)** | Cross-platform mobile framework (Android, iOS, Web) |
| **TypeScript** | Strict static type checking and interface safety |
| **Zustand** | Centralized, zero-boilerplate state management |
| **AsyncStorage** | Local persistent key-value data storage |
| **React Navigation** | Native Stack & Bottom Tabs navigation |
| **Axios** | HTTP API client for Picsum Photos API |
| **Expo FileSystem & MediaLibrary** | Saving downloaded images to device photo library |
| **Expo Vector Icons** | UI icons (Ionicons) |
| **Jest & ts-jest** | Automated unit testing framework |

---

## Folder Structure

```text
Foto_Owl_assignment/
├── App.tsx                        # Main App root component with Navigation & Theme Providers
├── app.json                       # Expo configuration
├── package.json                   # App dependencies & npm scripts
├── tsconfig.json                  # TypeScript configuration
├── jest.config.js                 # Jest unit testing configuration
├── __tests__/                     # Automated unit test suites
│   ├── validation.test.ts         # Validation rules tests
│   └── formatters.test.ts         # Formatting utilities tests
├── src/
│   ├── components/                # Reusable UI Components
│   │   ├── common/                # Header, Button, Input, SelectDropdown, RadioGroup, Card, Badge
│   │   ├── gallery/               # ImageCard, SearchBar, FilterBar
│   │   └── profile/               # AvatarPickerModal, EditProfileModal
│   ├── constants/                 # Theme tokens, Cities list, Avatars list
│   ├── hooks/                     # Custom React Hooks (useDebounce, useGallery, useDownloadImage)
│   ├── navigation/                # AuthNavigator, MainTabNavigator, AppNavigator
│   ├── screens/                   # Registration, Login, Home, Favorites, ImageDetail, Profile
│   ├── services/                  # Picsum API client & AsyncStorage helpers
│   ├── store/                     # Zustand stores (useAuthStore, useGalleryStore, useThemeStore)
│   ├── types/                     # TypeScript types (auth, gallery, navigation)
│   └── utils/                     # Form validators & string formatters
```

---

## Assumptions Made

1. **User Authentication**: Simulates local multi-user registration & authentication. User credentials (with password hashing simulation) are stored locally using `AsyncStorage`.
2. **Device Media Permissions**: Downloading images to the native device photo gallery requests read/write media library permissions on mobile devices, with a fallback web blob download on browser environments.
3. **Pagination & Filtering**: Picsum Photos API provides page-based listing. Client-side debounced search and A-M / N-Z filter ranges operate smoothly on paginated dataset feeds.

---

## Project Setup & Running Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/Foto_Owl_assignment.git
cd Foto_Owl_assignment
npm install
```

### 2. Running on Web (Browser Preview)
Launch the application instantly in your browser:
```bash
npm run web
```
This starts the local Metro dev server and opens the application at `http://localhost:8081`.

### 3. Running on Mobile (Expo Go)
Start the Expo development server:
```bash
npx expo start
```
Scan the displayed QR code using the **Expo Go** app on your Android or iOS device.

---

## Unit Testing

Run the automated Jest unit test suite:
```bash
npm test
```

Run TypeScript strict type checking:
```bash
npx tsc --noEmit
```

---

## APK Generation Guide (Without Android Studio / Java)

You do **NOT** need Android Studio or local Java installed on your computer to build an Android APK for this application. You can use **Expo Application Services (EAS Build)** cloud servers:

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Log in to Expo Account
```bash
eas login
```
*(Create a free account at [expo.dev](https://expo.dev) if you don't have one).*

### Step 3: Configure EAS Build
```bash
eas build:configure
```

### Step 4: Generate Standalone Android APK
Run the cloud build command for Android preview APK:
```bash
eas build -p android --profile preview
```

EAS Cloud will compile the Android APK on Expo's build servers and provide a direct download link for the `.apk` file once complete!
