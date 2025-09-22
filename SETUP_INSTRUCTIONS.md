# SightReadPro - React Native App Setup Instructions

## 🎵 Overview
SightReadPro is a Duolingo-style React Native app that helps musicians improve their sight-reading skills through daily practice exercises, gamification, and progress tracking.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Install Dependencies**
   ```bash
   cd SightReadPro
   npm install
   ```

2. **Install Additional Dependencies**
   ```bash
   npm install expo-document-picker expo-file-system expo-font expo-linear-gradient expo-status-bar react-native-reanimated
   ```

3. **iOS Setup (macOS only)**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Run the App**

   **Android:**
   ```bash
   npm run android
   ```

   **iOS:**
   ```bash
   npm run ios
   ```

   **Start Metro Bundler:**
   ```bash
   npm start
   ```

## 📱 App Features

### Screens
- **Welcome Screen**: App branding and start button
- **Login Screen**: Email/password authentication with Firebase
- **Dashboard**: Daily exercises, XP progress, and streak tracking
- **Upload Screen**: File picker for PDF/JPG/MusicXML files
- **Exercise Screen**: Interactive practice session with piano keys
- **Results Screen**: Performance feedback and XP rewards

### Key Features
- ✅ Professional, fun UI (Duolingo/Simply Piano style)
- ✅ Bright accent colors (blue, purple, green)
- ✅ Rounded buttons and smooth animations
- ✅ React Native Reanimated for animations
- ✅ Firebase authentication
- ✅ Mock data for exercises
- ✅ XP and streak tracking
- ✅ File upload functionality
- ✅ Interactive practice sessions

## 🔧 Backend Integration TODOs

The app is ready for backend integration with the following endpoints:

### Required Endpoints
- `GET /get_daily_exercises/{user_id}` - Fetch daily exercises
- `POST /upload_score` - Upload and process music files
- `POST /submit_performance` - Submit practice results

### Integration Points
1. **Dashboard Screen**: Replace mock data with real API calls
2. **Upload Screen**: Connect file upload to backend processing
3. **Exercise Screen**: Add real audio recording and MusicXML rendering
4. **Results Screen**: Submit performance data to backend

## 🎨 Design System

### Colors
- Primary: #667eea (Blue)
- Secondary: #764ba2 (Purple)
- Accent: #4CAF50 (Green)
- Success: #4CAF50
- Warning: #FF9800
- Error: #F44336

### Typography
- Headlines: Bold, large fonts
- Body: Friendly, readable text
- Icons: Material Icons

### Components
- Rounded buttons with gradients
- Card-based layouts
- Smooth animations
- Progress bars and badges

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React Context providers
├── data/              # Mock data and interfaces
├── screens/           # App screens
│   ├── WelcomeScreen.tsx
│   ├── LoginScreen.tsx
│   ├── DashboardScreen.tsx
│   ├── UploadScreen.tsx
│   ├── ExerciseScreen.tsx
│   └── ResultsScreen.tsx
├── config/            # Configuration files
└── App.tsx           # Main app component
```

## 🎯 Next Steps

1. **Backend Integration**
   - Connect to FastAPI backend
   - Implement real file processing
   - Add MusicXML rendering

2. **Enhanced Features**
   - Real audio recording
   - Metronome functionality
   - Social features
   - Offline mode

3. **Testing**
   - Unit tests for components
   - Integration tests
   - E2E testing

## 🐛 Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
npx react-native start --reset-cache
```

**iOS build errors:**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

**Android build errors:**
```bash
cd android
./gradlew clean
cd ..
```

**Dependency issues:**
```bash
rm -rf node_modules
npm install
```

## 📄 License

This project is licensed under the MIT License.

---

**Happy practicing! 🎼✨**
