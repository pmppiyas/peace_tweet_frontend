# 🌟 Islamic Dua Platform - Next.js App Router Frontend

Modern, production-grade Islamic Dua web application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **TanStack React Query v5**, **Zustand**, and **Lucide Icons**.

---

## 📁 Architecture & Feature Structure

```text
peacetweet_frontend/
└── src/
    ├── app/
    │   ├── (public)/
    │   │   ├── page.tsx                  # Home Feed, Hero search & quick category chips
    │   │   ├── duas/
    │   │   │   ├── page.tsx              # All Duas listing
    │   │   │   └── [id]/page.tsx         # Single Dua detailed view
    │   │   ├── categories/
    │   │   │   ├── page.tsx              # Categories directory
    │   │   │   └── [slug]/page.tsx       # Filtered Duas by category
    │   │   └── search/page.tsx           # Global search page
    │   ├── (auth)/
    │   │   ├── login/page.tsx            # Login with email/username
    │   │   └── register/page.tsx         # New account registration
    │   ├── (protected)/
    │   │   ├── saved/page.tsx            # User Bookmarks / Saved Duas
    │   │   ├── profile/page.tsx          # User profile view & logout
    │   │   └── settings/page.tsx         # Theme toggle & Arabic font size controls
    │   ├── admin/page.tsx                # Admin management dashboard
    │   ├── layout.tsx                    # Root layout with Audio, Query & Auth providers
    │   ├── loading.tsx                   # Shimmer loading skeleton
    │   ├── error.tsx                     # Error boundary
    │   └── not-found.tsx                 # 404 page
    │
    ├── features/
    │   ├── feed/                         # Feed component, FeedList, FeedItem, useFeed hook
    │   ├── auth/                         # LoginForm, RegisterForm, useAuthActions
    │   ├── dua/                          # DuaDetail view, useDua hook
    │   ├── category/                     # CategoryList, CategoryCard, useCategories
    │   ├── bookmark/                     # BookmarkList, useBookmarks hook
    │   ├── search/                       # SearchBar, useSearch hook
    │   ├── audio/                        # FloatingAudioBar persistent player
    │   ├── profile/                      # ProfileView component
    │   └── admin/                        # AdminDashboard component
    │
    ├── components/
    │   ├── ui/                           # Button, Input, Card, Badge, Modal, Skeleton, Toast
    │   ├── layout/                       # Container, Header, Footer
    │   ├── navigation/                   # Navbar, MobileNav, Breadcrumbs
    │   └── common/                       # ArabicText, AudioPlayer, BookmarkButton, CopyButton, ShareButton
    │
    ├── lib/
    │   ├── api/client.ts                 # Axios instance with auto JWT Bearer & token refresh
    │   ├── auth/                         # Token & session persistence
    │   ├── query/query-client.ts         # TanStack Query client configuration
    │   ├── storage/local-storage.ts      # Safe browser storage helper
    │   └── utils/                        # cn, toBanglaNumber, formatDate
    │
    ├── hooks/                            # useAuth, useAudioPlayer, useDebounce, useLocalStorage
    ├── providers/                        # QueryProvider, AuthProvider, ThemeProvider, AudioProvider
    ├── stores/                           # authStore, audioStore, uiStore (Zustand)
    ├── types/                            # api, user, dua, category types
    ├── constants/                        # routes, endpoints, config
    └── config/site.ts                    # site metadata & apiUrl
```

---

## 🚀 Running the Frontend

### 1. Navigate to frontend directory
```bash
cd peacetweet_frontend
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Start development server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔌 API Integration
The frontend connects automatically to the NestJS backend at `http://localhost:5000/api/v1` with:
- Bearer JWT token attachment
- Automatic token refresh on 401 Unauthorized
- Optimistic updates for bookmarks
- Real-time search throttling
- Persistent background audio playback across page routes.
