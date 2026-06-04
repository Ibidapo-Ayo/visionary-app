# Visionary App - File Guide

Quick reference for where to find and edit everything.

## 🎯 Quick Navigation

### Want to change the app's colors?
→ `/utils/colors.ts`

### Want to modify form validation?
→ `/utils/validators.ts`

### Want to add mock data?
→ `/services/api/mockData.ts`

### Want to create a new screen?
→ Create file in `/app/(app)/` or `/app/(auth)/`

### Want to add a new UI component?
→ Create in `/components/common/`

### Want to change authentication logic?
→ `/store/auth.store.ts`

### Want to add routing logic?
→ `/app/_layout.tsx`

---

## 📂 Full File Listing & Purpose

### `/app/` - Screens & Routing

| File | Purpose |
|------|---------|
| `_layout.tsx` | Root navigation setup + auth guard |
| `layout.tsx` | Next.js layout (not used in Expo) |
| `page.tsx` | Next.js page (not used in Expo) |
| `(auth)/_layout.tsx` | Auth stack navigation |
| `(auth)/splash.tsx` | 3s animated splash screen |
| `(auth)/onboarding.tsx` | 6-slide intro carousel |
| `(auth)/login.tsx` | Email + password login |
| `(auth)/register.tsx` | Sign up form with validation |
| `(app)/_layout.tsx` | Tab navigation setup |
| `(app)/home.tsx` | Main dashboard with digest |
| `(app)/scan.tsx` | QR code scanner screen |
| `(app)/ai.tsx` | AI chat interface |
| `(app)/members.tsx` | Member list with filters |
| `(app)/profile.tsx` | User profile + settings |

### `/components/` - UI Components

#### Common Components
| File | Purpose |
|------|---------|
| `common/Button.tsx` | Reusable button (4 variants) |
| `common/Card.tsx` | Content wrapper |
| `common/Input.tsx` | Text input field |
| `common/Badge.tsx` | Status badges |
| `common/Header.tsx` | Screen header |
| `common/BottomNav.tsx` | Tab navigation bar |

#### Feature Components
| File | Purpose |
|------|---------|
| `features/SplashScreen.tsx` | Animated splash with Skia |
| `ui/button.tsx` | shadcn button (not used) |

### `/store/` - State Management (Zustand)

| File | Purpose |
|------|---------|
| `auth.store.ts` | User auth state + methods |
| `app.store.ts` | App readiness + onboarding |
| `member.store.ts` | Members list + follow-ups |

### `/services/` - API & Data

#### API
| File | Purpose |
|------|---------|
| `api/client.ts` | Axios instance + interceptors |
| `api/authService.ts` | Login/signup API calls |
| `api/memberService.ts` | Member API calls |
| `api/mockData.ts` | Test data (3 users, members) |

### `/utils/` - Utilities

| File | Purpose |
|------|---------|
| `colors.ts` | Color tokens + semantic colors |
| `spacing.ts` | Spacing scale + typography |
| `validators.ts` | Zod form schemas |
| `formatting.ts` | Date/text formatting utils |
| `constants.ts` | Role permissions + enums |

### `/types/` - TypeScript Interfaces

| File | Purpose |
|------|---------|
| `auth.types.ts` | Auth-related types |
| `api.types.ts` | API response types |

### `/hooks/` - Custom Hooks

| File | Purpose |
|------|---------|
| `useTheme.ts` | Color & typography access |
| `useNavigation.ts` | Navigation helpers |

### `/lib/` - Libraries

| File | Purpose |
|------|---------|
| `utils.ts` | Helper functions (not used) |

### Root Files

| File | Purpose |
|------|---------|
| `app.json` | Expo app configuration |
| `package.json` | Dependencies & scripts |
| `tsconfig.json` | TypeScript configuration |
| `IMPLEMENTATION.md` | Full architecture doc |
| `QUICKSTART.md` | Setup & run guide |
| `BUILD_SUMMARY.md` | Build completion summary |
| `FILE_GUIDE.md` | This file |

---

## 🔄 Typical Workflows

### Add a New Screen

1. Create `/app/(app)/newscreen.tsx`
2. Add route to BottomNav in `/components/common/BottomNav.tsx`
3. Import new component in `/app/(app)/_layout.tsx`
4. Use `useRouter()` to navigate to it

### Change Colors

1. Edit `/utils/colors.ts`
2. All components using `colors.primary` etc. auto-update

### Add Form Validation

1. Add Zod schema in `/utils/validators.ts`
2. Use in form component: `validator.parse(formData)`
3. Catch ZodError for validation messages

### Add Mock Data

1. Add to `/services/api/mockData.ts`
2. Export from file
3. Import in components: `import { mockMembers } from '../../services/api/mockData'`

### Create New Component

1. Create in `/components/common/ComponentName.tsx`
2. Follow component pattern:
   ```typescript
   interface ComponentProps { ... }
   
   export const Component: React.FC<ComponentProps> = ({ ... }) => {
     return <View>...</View>
   }
   ```
3. Export from component
4. Import and use in screens

### Add State Management

1. Create Zustand store in `/store/feature.store.ts`
2. Define interface with state + methods
3. Import in components: `const state = useFeatureStore()`
4. Use state and methods in component

---

## 🎨 Styling Pattern

All styling uses:
- React Native StyleSheet
- Color tokens from `/utils/colors.ts`
- Spacing tokens from `/utils/spacing.ts`
- No hardcoded hex colors
- No arbitrary values

Example:
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: 12,
  },
});
```

---

## 📦 Dependency Purposes

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based navigation |
| `zustand` | State management |
| `axios` | HTTP client |
| `zod` | Form validation |
| `react-native-reanimated` | Smooth animations |
| `expo-camera` | QR scanner |
| `expo-secure-store` | Token storage |
| `expo-notifications` | Push notifications |
| `lottie-react-native` | Lottie animations |
| `react-native-skia` | 2D graphics |
| `typescript` | Type safety |

---

## 🚀 Common Tasks

### Run Development Server
```bash
pnpm dev
Press 'i' (iOS) / 'a' (Android) / 'w' (web)
```

### Install New Package
```bash
pnpm add package-name
pnpm dev  # Restart dev server
```

### Build for Production
```bash
eas build --platform ios
eas build --platform android
```

### Test Authentication
- Use credentials in `/services/api/mockData.ts`
- Login as: `member@tvn.com` / `password`

### Check TypeScript
- Run `npx tsc --noEmit` to check types
- IDE should show errors in editor

---

## ✅ File Checklist

Core files that must exist:

- [ ] `/app/_layout.tsx` - Root router
- [ ] `/app/(auth)/splash.tsx` - Splash screen
- [ ] `/app/(auth)/login.tsx` - Login screen
- [ ] `/app/(app)/home.tsx` - Home screen
- [ ] `/store/auth.store.ts` - Auth state
- [ ] `/utils/colors.ts` - Colors
- [ ] `/utils/spacing.ts` - Spacing
- [ ] `/services/api/mockData.ts` - Test data
- [ ] `/components/common/Button.tsx` - Button component
- [ ] `/components/common/BottomNav.tsx` - Navigation bar

---

## 📚 Read These First

1. **QUICKSTART.md** - Get the app running
2. **BUILD_SUMMARY.md** - See what's built
3. **IMPLEMENTATION.md** - Understand architecture
4. **FILE_GUIDE.md** - This file

---

**Total Files: 40+**
**Core Screens: 9**
**Components: 20+**
**Stores: 3**
**Services: 4**

Ready to customize? Pick a file above and edit! 🚀
