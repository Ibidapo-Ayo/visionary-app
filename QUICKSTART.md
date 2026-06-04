# Visionary App - Quick Start Guide

## 🚀 Run the App

### Prerequisites
- Node.js 18+
- pnpm (comes with latest Node)
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Start Development Server
```bash
cd /vercel/share/v0-project
pnpm install  # If not already done
pnpm dev
```

The dev server will start with HMR (hot module reloading).

### Run on Your Device

**iOS Simulator** (macOS):
```bash
Press 'i' in the terminal
# Or: pnpm exec expo start --ios
```

**Android Emulator**:
```bash
Press 'a' in the terminal
# Or: pnpm exec expo start --android
```

**Web Browser**:
```bash
Press 'w' in the terminal
# Access at http://localhost:19000
```

**Physical Device**:
```bash
Install Expo Go app from App Store / Play Store
Scan QR code from terminal
```

---

## 🔑 Test Credentials

### Login with Mock Data
- **Member Account**
  - Email: `member@tvn.com`
  - Password: `password` (any password works in mock mode)

- **Leader Account**
  - Email: `leader@tvn.com`
  - Password: `password`

- **Admin Account**
  - Email: `admin@tvn.com`
  - Password: `password`

---

## 📱 App Navigation

### Splash Screen (3 seconds)
- Animated opening with lion emoji + glow effect
- Auto-navigates based on auth state

### Auth Flow
1. **Splash** → Auto-navigate
2. **Onboarding** (if first time) → 6 slides with swipe nav
3. **Login** → Email + password
4. **Sign Up** → Full registration form

### Main App (Post-Auth)
5-tab bottom navigation:
1. **Home** - Dashboard with digest, events, quick actions
2. **Scan** - QR check-in camera (placeholder)
3. **AI** - Chat with scripture references
4. **Members** - Filterable member list
5. **Profile** - User info and settings

---

## 🎯 Key Features

### ✅ Fully Implemented
- Complete navigation structure (Expo Router)
- Authentication flow with Zustand stores
- Home dashboard with all sections
- Dark theme color system
- Mock API layer
- Form validation (Zod)
- Component library (Button, Card, Input, Badge)
- Safe area handling across all screens
- Pull-to-refresh on home screen

### 🚧 Placeholder (Needs Implementation)
- QR Scanner camera (expo-camera ready)
- Lottie animations (library installed, add JSON)
- ImageUpload for avatars
- Real API endpoints (replace mockData)
- Push notifications (Expo Notifications ready)

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `/app/_layout.tsx` | Root navigation setup |
| `/app/(auth)/splash.tsx` | 3s animated splash |
| `/app/(auth)/login.tsx` | Login form |
| `/app/(auth)/onboarding.tsx` | 6-slide onboarding |
| `/app/(app)/home.tsx` | Main dashboard |
| `/store/auth.store.ts` | Auth state (Zustand) |
| `/utils/colors.ts` | Color system |
| `/services/api/mockData.ts` | Test data |
| `/components/common/` | UI components |

---

## 🔧 Customization

### Change Splash Screen Animation
Edit `/components/features/SplashScreen.tsx`:
```typescript
// Change text, logo, timing, colors
```

### Add Mock API Data
Edit `/services/api/mockData.ts`:
```typescript
mockAuthData.users = [...]
mockMembers = [...]
mockDailyDigest = {...}
```

### Update Color Scheme
Edit `/utils/colors.ts`:
```typescript
const colors = {
  background: '#111226',  // Change dark background
  primary: '#FED00C',     // Change amber accent
  // ... more colors
}
```

### Add New Screen
1. Create file in `/app/(app)/newscreen.tsx`
2. Add route to bottom tab navigation
3. Export React component as default

---

## 🐛 Troubleshooting

### "Module not found" errors
```bash
pnpm install
pnpm exec expo prebuild
```

### Port 19000 already in use
```bash
# Kill the process or use a different port
pnpm dev --port 19001
```

### Simulator shows blank screen
```bash
# Clear cache and rebuild
pnpm exec expo start -c
```

### TypeScript errors in editor
```bash
# Restart TypeScript server in your IDE
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## 📈 Next Steps

1. **Connect Real API**
   - Replace mockData.ts with actual fetch calls
   - Update API base URL in `services/api/client.ts`
   - Add error handling for network failures

2. **Add QR Scanner**
   - Implement camera in `/app/(app)/scan.tsx`
   - Use expo-camera permission handling
   - Add barcode scanning logic

3. **Implement Lottie Animations**
   - Add .json animation files to `/assets/lottie/`
   - Use in SplashScreen and onboarding
   - See react-native-lottie docs

4. **Setup Push Notifications**
   - Enable in Expo console
   - Implement handler in App store
   - Send from backend

5. **Add Analytics**
   - Connect to PostHog or Segment
   - Track user actions and screen views
   - Monitor app performance

---

## 📞 Support

For detailed architecture documentation, see `/IMPLEMENTATION.md`

For component patterns, check component files in `/components/common/`

For API integration patterns, see `/services/api/authService.ts`

---

**Ready to build? Start with `pnpm dev` and choose your device!** 🚀
